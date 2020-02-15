import Immutable, { Map, Record } from 'immutable';

const getSimpleId = () => {
    return Math.random().toString(26).slice(2);
}

const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

class Shane extends Record({
    id: undefined,
    data: undefined,
    name: {
        firstName: undefined,
        lastName: undefined
    }
}) {
    getFirstName() {
        //console.log(this.get('name'));
        return this.get('name').firstName;
    }
    setFirstName(fname) {
        return this.setIn(['name', 'firstName'], fname);
    }

    getLastName() {
        return this.getIn(['name', 'lastName']);
    }
    setLastName(fname) {
        return this.setIn(['name', 'lastName'], fname);
    }

    getId() {
        return this.id
    }
    /*
    get Data() {
        return this.data
    }
    set Data(newData) {
        return this.set('data', newData)
    }
    */
    getData() {
        return this.data
    }
    setData( newData ) {
        return this.set('data', newData)
    }
    getAll() {
        return {
            id: this.id,
            data: this.data
        }
    }
    
}

export default Shane;