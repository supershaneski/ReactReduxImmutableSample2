import { Record } from 'immutable';

class SSOrderItem extends Record({
    orderid: undefined,
    id: undefined,
    name: undefined,
    quantity: 0,
    price: 0
}){
    setQuantity(num) {
        return this.set('quantity', num);
    }
}

class SSOrder extends Record({
    orders: [],
    total_price: 0
}) {
    addOrder(neworder) {
        this.orders = this.orders.push(neworder);
        return this.orders;
    }
    delteOrder(orderid) {
        this.orders = this.orders.pop();
        return this.orders;
    }
    getOrders() {
        return this.orders;
    }
    setTotalPrice(price) {
        return this.set('total_price', price);
    }
}

export default SSOrder;