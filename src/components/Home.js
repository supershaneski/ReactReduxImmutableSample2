import React from 'react';
import { connect }  from 'react-redux';
import ProductList from '../data/products.json';
import { Link } from "react-router-dom";
import './Home.css';

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: this.props.shop.shop,
        }
    }
    
    render() {
        const list = ProductList.products;
        let sold_out_list = [];
        list.forEach(category => {
            const subs = category.subcategory;
            const catid = category.id;
            subs.forEach(subcategory => {
                const items = subcategory.items;
                const subid = subcategory.id;
                items.forEach(item => {
                    if(parseInt(item.quantity) === 0) {
                        sold_out_list.push({
                            ...item,
                            catid: catid,
                            subid: subid
                        });
                    } 
                });
            });
        });
        
        let last_item_list = [];
        list.forEach(category => {
            const subs = category.subcategory;
            const catid = category.id;
            subs.forEach(subcategory => {
                const items = subcategory.items;
                const subid = subcategory.id;
                items.forEach(item => {
                    if(parseInt(item.quantity) <= 2 && parseInt(item.quantity) > 0) {
                        last_item_list.push({
                            ...item,
                            catid: catid,
                            subid: subid
                        });
                    } 
                });
            });
        });
        
        return (
            <div className="home">
                <div className="home-main">
                    {
                        last_item_list.length > 0 && 
                        <div className="home-panel">
                            <h4>Last Items Sale! Hurry!</h4>
                            <div className="home-panel-items">
                                {
                                    last_item_list.map((item, index) => {
                                        return (
                                            <Link key={index} to={'/shop/' + item.id}>
                                                <div className="product-item">
                                                    <img alt={item.name} title={item.name} src={ require('../data/images/' + item.id + '.jpg') } />
                                                    <p>{ item.name }</p>
                                                </div>
                                            </Link>
                                        )
                                    })
                                }
                            </div>
                        </div>
                        
                    }
                    {
                        sold_out_list.length > 0 && 
                        <div className="home-panel">
                            <h4 className="soldout">Sold Out!</h4>
                            <div className="home-panel-items">
                                {
                                    sold_out_list.map((item, index) => {
                                        return (
                                            <Link key={index} to={'/shop/' + item.id}>
                                                <div className="product-item">
                                                    <img alt={item.name} title={item.name} src={ require('../data/images/' + item.id + '.jpg') } />
                                                    <p>{ item.name }</p>
                                                </div>
                                            </Link>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    }
                    
                </div>
            </div>
        )
    }
}


const getCategoryList = () => {
    return {
        type: 'GET_SHOP',
    }
}

const setItemQuantity3 = (id, num) => {
    return {
        type: 'SET_SHOP_NUM',
        id: id,
        quantity: num
    }
}

const updateMyQuantity = (id, num) => {
    return {
        type: 'UPDATE_QUANTITY',
        id: id,
        quantity: num
    }
}

const updateMyCartTest = (payload) => {
    return {
        type: 'UPDATE_MYCART',
        payload: payload
    }
}

const updateMyReco = (payload) => {
    return {
        type: 'UPDATE_RECO',
        payload: payload
    }
}

const mapStateToProps = (state) => {
    return {
        shop: state.shop,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getCategories: () => {
            dispatch(getCategoryList());
        },
        setItemQuantity2: (id, num) => {
            dispatch(setItemQuantity3(id, num));
        },
        updateQuantity: (id, num) => {
            dispatch(updateMyQuantity(id, num));
        },
        updateCartTest: (payload) => {
            dispatch(updateMyCartTest(payload));
        },
        updateCartReco: (payload) => {
            dispatch(updateMyReco(payload));
        }
    }
}

//export default Home;
export default connect(mapStateToProps, mapDispatchToProps)(Home);