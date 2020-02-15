import { createStore, combineReducers } from 'redux';
import { Map, Record, fromJS } from 'immutable';
import ProductList from '../data/products.json';

class MYSHOP extends Record({
    data: undefined,
}) {
    getCategories() {
        return this.data.getIn(['products']);
    }
    getItem(id) {
        let oitem = {};
        const data = this.data.getIn(['products']);
        data.some((cat)=>{
            const catid = cat.get('id');
            return cat.get('subcategory').some((subcat) => {
                const subid = subcat.get('id');
                return subcat.get('items').some((item) => {
                    if(item.get('id') === id) {
                        oitem = {
                            catid: catid,
                            subid: subid,
                            item: item
                        }
                    }
                    return item.get('id') === id
                })
            })
        })
        return oitem;
    }
    setItemQuantity(id, num) {
        let num1 = -1;
        let num2 = -1;
        let num3 = -1;

        this.data.getIn(['products']).some((cat, index1)=>{
            return cat.get('subcategory').some((subcat, index2) => {
                return subcat.get('items').some((item, index3) => {
                    if (item.get('id') === id) {
                        num1 = index1;
                        num2 = index2;
                        num3 = index3;
                        item = item.set('quantity', num);
                    }
                    return item.get('id') === id;
                });
            });
        });
        
        let item = this.data.getIn(['products', num1, 'subcategory', num2, 'items', num3]);
        item = item.set('quantity', num);
        return this.data.setIn(['products', num1, 'subcategory', num2, 'items', num3], item);
        
    }
    updateNum(id, num) {
        
        const data = this.data;

        let num1 = -1;
        let num2 = -1;
        let num3 = -1;

        data.getIn(['products']).some((cat, index1)=>{
            return cat.get('subcategory').some((subcat, index2) => {
                return subcat.get('items').some((item, index3) => {
                    if (item.get('id') === id) {
                        num1 = index1;
                        num2 = index2;
                        num3 = index3;
                        item = item.set('quantity', num);
                    }
                    return item.get('id') === id;
                });
            });
        });
        
        let item = data.getIn(['products', num1, 'subcategory', num2, 'items', num3]);
        item = item.set('quantity', num);
        data.setIn(['products', num1, 'subcategory', num2, 'items', num3], item);
        
        return this.set('data', data);
    }
}

const updateItemQuantity = (state, action) => {
    return state.shop.updateNum(action.id, action.quantity);
}

const setItemQuantity = (state, action) => {
    const data = state.shop.setItemQuantity(action.id, action.quantity);
    state.shop = new MYSHOP({
        data: data
    });

    return state;
}

const updateMyCart = (state, action) => {
    return {
        ...state,
        cart: Map({
            id: action.payload
        })
    }
}

const initialShopState = (src) => {
    return {
        shop: new MYSHOP({
            data: fromJS(src)
        }),
        cart: Map({
            id: 'xyz1234'
        }),
        reco: new MyRecord({
            id: 'dec0056',
            data: 69
        })
    }
}
class MyRecord extends Record({
    id: undefined,
    data: 0
}) {
    getId() {
        return this.id;
    }
    getData() {
        return this.data;
    }
    setId(id) {
        return this.set('id', id)
    }
    setData(data) {
        return this.set('data', data)
    }
}

const updateMyRecord = (state, action) => {
    return {
        ...state,
        reco: state.reco.setId(action.payload)
    }
}
const shop = (state = initialShopState(ProductList), action) => {
    switch(action.type) {
        case 'UPDATE_RECO':
            return updateMyRecord(state, action);
        case 'UPDATE_MYCART':
            return updateMyCart(state, action);
        case 'GET_SHOP':
           return state.shop.getCategories();
        case 'SET_SHOP_NUM':
            return setItemQuantity(state, action);
        case 'UPDATE_QUANTITY':
            return updateItemQuantity(state, action);
        default:
            return state;
   }
}

class OrderList {
    constructor() {
        this.orders = [];
        this.totalprice = 0;
    }
    updateTotal() {
        this.totalprice = this.orders.reduce((total, order) => {
            return total+=order.subprice;
        }, 0);
    }
    addOrder(neworder) {
        const index = this.orders.findIndex(item => item.id === neworder.id);
        if(index < 0) {
            this.orders.push(neworder);
        } else {
            this.orders[index].quantity++;
            this.orders[index].subprice = this.orders[index].price * this.orders[index].quantity;
        }
        this.totalprice = this.orders.reduce((total, order) => {
            return total+=order.subprice;
        }, 0);
    }
    delOrder(orderid) {
        this.orders = this.orders.filter(order => {
            return order.orderid !== orderid;
        });
        this.totalprice = this.orders.reduce((total, order) => {
            return total+=order.subprice;
        }, 0);
    }
    getOrderList() {
        return this.orders;
    }
    checkItemExist(id) {
        return this.orders.some((item) =>{
            return item.id === id;
        });
    }
}

const selectOrder = (state, action) => {
    
    state.orders.addOrder(action.payload);
    
    return state;
}

const deleteOrder = (state, action) => {
    state.orders.delOrder(action.payload);
    return state;
}

const initOrder = () => {
    return {
        orders: new OrderList(),
    }
}

const order = (state = initOrder(), action) => {
    switch (action.type) {
        case "GET_ORDERS":
            return selectOrder(state, action);
        case "ADD_ORDER":
            return selectOrder(state, action);
        case "EDIT_ORDER":
            return selectOrder(state, action);
        case "DELETE_ORDER":
            return deleteOrder(state, action);
        case "ITEM_EXIST":
            return deleteOrder(state, action);
        default:
            return state;
    }
}

const setRoute = (state, action) => {
    return {
        ...state,
        route: action.payload
    }    
}
const setItem = (state, action) => {
    return {
        ...state,
        item: action.payload
    }    
}
const setCategory = (state, action) => {
    return {
        ...state,
        category: action.payload
    }    
}

const initSite = () => {
    return {
        route: 'home',
        item: '',
        category: 'living-sofa'
    }
}

const site = (state = initSite(), action) => {
    switch (action.type) {
        case "SET-ROUTE":
            return setRoute(state, action);
        case "SET-ITEM":
            return setItem(state, action);
        case "SET-CATEGORY":
            return setCategory(state, action);
        default:
            return state;
    }
}

const rootReducer = combineReducers({
    shop,
    order,
    site
})

export default createStore(rootReducer);