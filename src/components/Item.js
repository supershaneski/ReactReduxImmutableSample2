import React from 'react';
import { connect }  from 'react-redux';
import ProductList from '../data/products.json';
import { withRouter, Link } from "react-router-dom";

const styles = {
    shop: {
        height: '100%',
    },
    item: {
        padding: '5px',
        margin: '10px 0px 0px 0px',
    },
    detail: {
        margin: '0px',
    },
    back: {
        margin: '0px 5px 5px 15px',
    },
    link: {
        textDecoration: 'none',
        fontSize: '16px',
        color: 'darkorange',
    },
    itemDetail: {
        padding: '5px',
    },
    itemDetailDiv: {
        width: 'calc(100% - 20px)',
        height: '150px',
        margin: '0px 10px',
    },
    itemDetailImage: {
        width: '100px',
        height: '100px',
        border: '1px solid #999',
        boxSizing: 'border-box',
        display: 'inline-block',
        verticalAlign: 'top',
    },
    itemDetailPanel: {
        width: 'calc(100% - 100px)',
        display: 'inline-block',
        verticalAlign: 'top',
    },
    itemDetailName: {
        margin: '0px 0px 0px 15px',
        fontSize: '16px',
    },
    itemDetailDesc: {
        margin: '0px 0px 0px 15px',
        padding: '0px',
        fontSize: '14px',
    }

}

const formatNumber = (num, n, x) => {
    var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
    return num.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,');
}

const getProductItem = (id) => {
    const list = ProductList.products;
    let sitem = null;
    let cat = {};
    let subcat = {};
    const flag = list.some(category => {
        const subcategories = category.subcategory;
        cat = {
            id: category.id,
            name: category.name
        }
        return subcategories.some(subcategory => {
            const items = subcategory.items;
            subcat = {
                id: subcategory.id,
                name: subcategory.name
            }
            return items.some(item => {
                sitem = item;
                return (item.id === id)
            });
        })
    })
    sitem = {
        item: sitem,
        category: cat,
        subcategory: subcat, 
    }
    return sitem = flag?sitem:null;
}

const updateProductItem = (id) => {
    const list = ProductList.products;
    list.some(category => {
        const subcategories = category.subcategory;
        return subcategories.some(subcategory => {
            const items = subcategory.items;
            return items.some(item => {
                if(item.id === id) {
                    item.quantity--;
                }
                return (item.id === id)
            });
        })
    })
}

const LeftPanel = (props) => {
    var list = ProductList.products;
    var selected_route = props.selected||"";
    return (
        <React.Fragment>
            <ul className="left-category">
                {
                    list.map((item, index) => {
                        return (
                            <li key={ index }>
                                { item.name }
                                <ul className="left-subcategory">
                                { item.subcategory.map((subitem, index) => {
                                    const subclass = (subitem.id === selected_route)?"selected":"";
                                    return (
                                        <li className={ subclass } onClick={() => props.onClick( subitem.id ) } 
                                        key={ index }>
                                        <Link to="/shop">{ subitem.name }</Link>
                                        </li>
                                    )
                                })}
                                </ul>
                            </li>
                        )
                    })
                }
            </ul>
        </React.Fragment>
    )
}

const buttonStyles = {
    addcart: {
        padding: '3px 10px',
        margin: '5px 5px 5px 0px',
    },
    disabled: {
        padding: '3px 10px',
        margin: '5px 5px 5px 0px',
        color: '#ccc'
    }
}
class AddCart extends React.Component {
    render() {
        let stext = (this.props.flagAgain)?"+ Add To Cart Again":"+ Add To Cart";
        const sdisabled = (this.props.flagNoItem)?"disabled":"";
        const btnstyle = (this.props.flagNoItem)?buttonStyles.disabled:buttonStyles.addcart;
        stext = (sdisabled === "disabled")?"Sold Out":stext;
        return (
            <button 
            onClick={ this.props.onClick }
            style={ btnstyle }
            disabled={ sdisabled }>
            { stext }
            </button>
        )
    }
}

class ViewCart extends React.Component {
    render() {
        return (
            <button onClick={ this.props.onClick } style={ buttonStyles.addcart }>
                View Cart
            </button>
        )
    }
}

const getSimpleId = () => {
    return Math.random().toString(26).slice(2);
}

class ItemDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            item: this.props.data,
        }
    }
    render() {
        const item = this.state.item;
        return (
            <div style={ styles.itemDetail }>
                <div style={ styles.itemDetailDiv }>
                    <img style={ styles.itemDetailImage } alt={ item.name } title={ item.name } src={ require('../data/images/' + item.id + '.jpg') } />
                    <div style={ styles.itemDetailPanel }>
                        <h4 style={ styles.itemDetailName }>{ item.name }</h4>
                        <p style={ styles.itemDetailDesc }>
                            <span>Price: { formatNumber(item.price) }円</span><br />
                            <span>Quantity: { item.quantity }</span><br />
                            <AddCart 
                            flagNoItem={this.props.flagNoItem} 
                            flagAgain={this.props.flagAgain} 
                            onClick={ this.props.onClick } />
                            <ViewCart onClick={ this.props.onClickView } />
                        </p>
                    </div>
                </div>                
            </div>
        )
    }
}

class Item extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: "living-sofa",
            order: this.props.order.orders,
        }
    }

    componentDidMount() {
        const item = getProductItem( this.props.match.params.id );
        this.setState({
            selected: item.subcategory.id,
        });
    }

    selectCategory(id) {
        this.props.setCategory(id);
        this.setState({
            selected: id,
        })
    }

    addCart(item) {
        const orderid = getSimpleId();
        const {id, name, price} = item;
        this.props.addOrder({
            orderid: orderid,
            id: id,
            name: name,
            quantity: 1,
            price: price,
            subprice: price,
        });
        this.setState({
            order: this.props.order.orders,
        });

        // 20200127 test
        updateProductItem( this.props.match.params.id );
        
    }

    viewCart() {
        this.props.history.push("/cart");
    }

    render() {
        const list = ProductList.products;
        const selected_category = list.filter((item)=>this.state.selected.indexOf(item.id)>=0);
        const category_name = selected_category[0].name;
        const objitem = getProductItem( this.props.match.params.id );
        const subcategory_name = objitem.subcategory.name;
        const item = objitem.item;
        const flagAgain = this.state.order.checkItemExist(item.id);
        const flagNoItem = (item.quantity > 0)?false:true;

        const navlink = category_name + " > " + subcategory_name;
        return (
            <div style={ styles.shop }>
                <div className="left-panel">
                    <LeftPanel selected={ this.state.selected } 
                        onClick={this.selectCategory.bind(this)} />
                </div>
                <div className="main-panel">
                    <h4 className="main-panel-title">{ navlink }</h4>
                    <div style={ styles.item }>
                        <ItemDetail 
                        flagAgain={flagAgain} 
                        flagNoItem={flagNoItem} 
                        onClickView={ this.viewCart.bind(this) } 
                        onClick={() => this.addCart(item) } data={ item } />
                    </div>
                    <div style={ styles.back }>
                        <Link style={ styles.link } to="/shop">&lt; Back to { subcategory_name }</Link>
                    </div>
                </div>
            </div>
        )
    }
}

const setRoute = (item) => {
    return {
      type: 'SET-ROUTE',
      payload: item
    }
}
const setItem = (item) => {
    return {
      type: 'SET-ITEM',
      payload: item
    }
}
const setCategory = (item) => {
    return {
      type: 'SET-CATEGORY',
      payload: item
    }
}
const addCart = (item) => {
    return {
      type: 'ADD_ORDER',
      payload: item
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
        setRoute: (item) => {
            dispatch(setRoute(item));
        },
        setItem: (subcode) => {
            dispatch(setItem(subcode));
        },
        setCategory: (subcode) => {
            dispatch(setCategory(subcode));
        },
        addOrder: (order) => {
            dispatch(addCart(order));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Item));