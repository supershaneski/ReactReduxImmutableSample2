import React from 'react';
import { connect }  from 'react-redux';
import ProductList from '../data/products.json';
import './Cart.css';

const getItemCount = (id) => {
    const list = ProductList.products;
    let count = 0;
    list.some(category => {
        const subcategories = category.subcategory;
        return subcategories.some(subcategory => {
            const items = subcategory.items;
            return items.some(item => {
                if(item.id === id) {
                    count = item.quantity;
                }
                return (item.id === id)
            });
        })
    })
    return count;
}

const updateItemCount = (id, mode = 0, quantity = 0) => {
    const list = ProductList.products;
    list.some(category => {
        const subcategories = category.subcategory;
        return subcategories.some(subcategory => {
            const items = subcategory.items;
            return items.some(item => {
                if(item.id === id) {
                    if(mode === 1) {
                        item.quantity++;
                    } else if(mode === 2) {
                        //console.log(id, item.quantity, quantity);
                        item.quantity += quantity;
                        //console.log(id, item.quantity, quantity);
                    } else {
                        item.quantity--;
                    }
                }
                return (item.id === id)
            });
        })
    })
}
const updateOrderItemCount = (id, mode = 0, quantity = 0) => {
    const list = ProductList.products;
    list.some(category => {
        const subcategories = category.subcategory;
        return subcategories.some(subcategory => {
            const items = subcategory.items;
            return items.some(item => {
                if(item.id === id) {
                    if(mode === 1) {
                        item.quantity++;
                    } else if(mode === 2) {
                        item.quantity += quantity;
                    } else {
                        item.quantity--;
                    }
                }
                return (item.orderid === id)
            });
        })
    })
}

const formatNumber = (num, n, x) => {
    var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
    return num.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,');
}

class Cart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            order: this.props.order.orders
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }
    
    handleClick(id, e) {
        
        const order = this.state.order;
        const index = order.orders.findIndex((item) => item.orderid === id)
        const quantity = parseInt(order.orders[index].quantity);
        const orderid = order.orders[index].id;
        updateOrderItemCount(orderid, 2, quantity);
        
        this.props.deleteOrder(id);
        
        this.setState({
            order: this.props.order.orders
        })
    }

    handleChange(id, e) {
        
        let x1 = parseInt(e.target.value);
        const x2 = parseInt(e.target.max);
        
        if(x1 > x2) {
            x1 = x2;
        }

        const order = this.state.order;
        const index = order.orders.findIndex((item) => item.id === id)
        
        const prev_quantity = parseInt(order.orders[index].quantity);
        order.orders[index].quantity = parseInt(x1);
        order.orders[index].subprice = order.orders[index].price * order.orders[index].quantity;
        order.updateTotal();

        if(prev_quantity > order.orders[index].quantity) {
            updateItemCount(id, 1);
        } else {
            updateItemCount(id);
        }
        

        this.setState({
            order: order,
        });

    }
    render() {
        //const orders = this.props.order.orders;
        const orders = this.state.order;
        const total_price = formatNumber(orders.totalprice);
        return (
            <div className="cart-panel">
                <div className="cart-main">
                    <div className="order-panel">
                    <table>
                    <thead>
                        <tr>
                            <th colSpan="2">&nbsp;</th>
                            <th>Product No.</th>
                            <th>Name</th>
                            <th>Quantity</th>
                            <th className="price">Unit Price</th>
                            <th className="price">Total Price</th>
                        </tr>
                    </thead>
                    {
                        orders.orders.length === 0 && 
                        <tbody>
                            <tr>
                                <td className="order-empty" colSpan="7">
                                Cart is empty. No item is found.
                                </td>
                            </tr>
                        </tbody>
                    }
                    {   
                        orders.orders.length > 0 &&
                        <tbody>
                        {
                            orders.orders.map((item, index) => {
                                const remaining = getItemCount(item.id);
                                const max = parseInt(item.quantity) + parseInt(remaining);
                                
                                return (
                                    <tr key={ index }>
                                        <td className="action"><span onClick={(event) => this.handleClick(item.orderid, event)}>&times;</span></td>
                                        <td className="quantity">
                                            <img alt={item.id} src={ require('../data/images/' + item.id + '.jpg') } />
                                        </td>
                                        <td className="quantity">{ item.id }</td>
                                        <td>{ item.name }</td>
                                        <td className="quantity">
                                        <input type="number" 
                                        min="1" 
                                        max={ max }
                                        onChange={ (event) => this.handleChange(item.id, event) }
                                        value={ parseInt(item.quantity) } /></td>
                                        <td className="price">{ formatNumber(item.price) }&nbsp;円</td>
                                        <td className="price">{ formatNumber(item.subprice) }&nbsp;円</td>
                                    </tr>
                                )
                            })
                        }
                            <tr>
                                <td className="grand-total-name" colSpan="6">Grand Total</td>
                                <td className="grand-total-price">
                                {
                                    total_price
                                }
                                &nbsp;円
                                </td>
                            </tr>
                        </tbody>

                    }
                    </table>
                    </div>
                </div>
            </div>
        )
    }
}

const getCartList = (item) => {
    return {
      type: 'ADD_ORDER',
      payload: item
    }
}
const deleteOrder = (orderid) => {
    return {
        type: 'DELETE_ORDER',
        payload: orderid
      }
}

const mapStateToProps = (state) => {
    return {
        shop: state.shop,
        order: state.order,
        site: state.site,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getOrderList: (order) => {
            dispatch(getCartList(order));
        },
        deleteOrder: (orderid) => {
            dispatch(deleteOrder(orderid));
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Cart);