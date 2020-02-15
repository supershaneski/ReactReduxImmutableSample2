import React from 'react';
import { connect }  from 'react-redux';
import ProductList from '../data/products.json';
import { Link } from "react-router-dom";

const styles = {
    shop: {
        height: '100%',
    }
}

class Product extends React.Component {
    render() {
        const linkURI = "/shop/" + this.props.data.id;
        return (
            <div className="item">
                <Link to={ linkURI }>
                    <img alt={ this.props.data.name } title={ this.props.data.name } src={ require('../data/images/' + this.props.data.id + '.jpg') } />
                </Link>
                <p className="desc">{ this.props.data.name }</p>
            </div>
        )
    }
}

class Category extends React.Component {
    render() {
        var category = this.props.data;
        var subcategory = category.subcategory || [];
        var items = category.items || [];
        return (
            <div className="category">
                <React.Fragment>
                {
                    subcategory.map((item, index) => {
                        return (
                            <Category key={ index } data={ item } />
                        )
                    })
                }
                </React.Fragment>
                <React.Fragment>
                    <div>
                    {
                        items.map((item, index) => {
                            return (
                                <Product key={ index } data={ item } />
                            )
                        })
                    }
                    </div>                    
                </React.Fragment>
            </div>
        )
    }
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
                                        key={ index }>{ subitem.name }</li>
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

class Shop extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: "living-sofa",
        }
    }

    componentDidMount() {
        this.setState({
            selected: this.props.site.category,
        })
    }

    selectCategory(id) {
        this.props.setCategory(id);
        this.setState({
            selected: id,
        });
    }
    
    render() {
        const list = ProductList.products;
        const selected_category = list.filter((item)=>this.state.selected.indexOf(item.id)>=0);
        const selected_subcategory = selected_category[0].subcategory.filter((item) => item.id === this.state.selected);
        const category_name = selected_category[0].name;
        const subcategory_name = selected_subcategory[0].name;

        const navlink = category_name + " > " + subcategory_name;

        return (
            <div style={ styles.shop }>
                <div className="left-panel">
                    <LeftPanel 
                    selected={ this.state.selected } 
                    onClick={this.selectCategory.bind(this)} />
                </div>
                <div className="main-panel">
                    <h4 className="main-panel-title">{ navlink }</h4>
                    <React.Fragment>
                        <Category data={ selected_subcategory[0] } />
                    </React.Fragment>
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
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Shop);