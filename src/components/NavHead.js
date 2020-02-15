import React from 'react';
import { withRouter, Link } from "react-router-dom";

const getRouteFromLocation = (uri) => {
    let route = "home";
    if(uri.length > 0) {
        const token = uri.split("/");
        if(token.length >= 2) {
            if(token[1].length > 0) route = token[1];
        }
    }
    return route;
}

class NavHead extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: getRouteFromLocation(this.props.location.pathname),
        }
    }

    onClick(route) {
        this.setState({
            selected: route,
        })
    }

    render() {
        return (
            <ul className="topNav">
                <li className={ (this.state.selected === "home")?"selected":"link" }>
                <Link onClick={ () => this.onClick('home') } to="/">Home</Link></li>
                <li className={ (this.state.selected === "shop")?"selected":"link" }>
                <Link onClick={ () => this.onClick('shop') } to="/shop">Shop</Link></li>
                <li className={ (this.state.selected === "cart")?"selected":"link" }>
                <Link onClick={ () => this.onClick('cart') } to="/cart">Cart</Link></li>
            </ul>
        )
    }
}

export default withRouter(NavHead);