import { 
    LocalStorage as $ls,
    uid as uidF,
    Notify as $nt
} from 'quasar'

import axios from 'axios';

var navigator = {connection: {type: 'wi-fi'}}

const uid = (function(){
    var uid = $ls.getItem('uid')

    if(!uid) {
        uid = uidF()
        $ls.set('uid', uid)
    }

    return uid;
})()

export const starting = async (store) => {
    await store.dispatch('getToken')
    
    var tracks = await store.dispatch('get')

    store.dispatch('saveRemote', tracks)

    if(!tracks) store.dispatch('getRemote')

};

export const getRemote = async (store) => {
    var response = await axios.get(`${store.state.endpoint}gas-track`)

    if(!response.data.length) return null

    $ls.set('fuels', JSON.stringify(response.data))
    
    store.commit('set', response.data)

    return response.data
};

export const removeRemote = async (store, id) => {
    if(!id) return null

    if(!navigator.connection.type || navigator.connection.type == 'none') return null

    try {
        await axios.get(`${store.state.endpoint}gas-track/${id}/delete`)
        var data = await store.dispatch('getRemote')
        
        $nt.create('Removed from cloud')
    } catch (error) {
        return null
    }

    return data
};

export const saveRemote = async (store, data) => {
    if(!data) return

    if(!navigator.connection.type || navigator.connection.type == 'none') return data
    
    try {
        await axios.post(`${store.state.endpoint}gas-track/`, data.filter(e => !e.saved))
        
        if (data.filter(e => !e.saved).length) $nt.create('Saved to cloud')

        data.filter(e => !e.saved).forEach(e => {
            e.saved = 'true'
        });
        
        data = await store.dispatch('getRemote')
    } catch (error) {}

    return data
};

export const getToken = async (store) => {
    axios.defaults.headers.common['Authorization'] = uid;
    
    var token = $ls.getItem('api_token')

    if(!token) token = await store.dispatch('generateToken')

    store.commit('api_token', token)

    axios.defaults.params = {}
    axios.defaults.params['api_token'] = token;
    
    return token
};

export const generateToken = async (store) => {
    try {
        var response = await axios.get(`${store.state.endpoint}auto-register`)
        
        $ls.set('api_token', response.data.api_token)

        $nt.create('You got a cloud token, welcome!')
        
        return response.data.api_token
    } catch (error) {
        throw error
    }
};

export const get = async (store) => {
    var a = await $ls.getItem('fuels')

    a = JSON.parse(a)

    store.commit('set', a)

    return a
};

export const save = async (store, form) => {
    var data = JSON.parse($ls.getItem('fuels'))

    if(!data ){
        data = []
    } 

    data = [...data, form]

    await $ls.set('fuels', JSON.stringify(data))
    
    store.commit('set', data)

    store.dispatch('saveRemote', data)

    return data
};

export const update = async (store, data) => {
    var state = store.state.data;

    state[data.index] = data.form

    store.dispatch('saveRemote', state)

    await $ls.set('fuels', JSON.stringify(state))

    store.commit('set', state)

    return state
};

export const clear = async (store, form) => {
    await $ls.set('fuels', null)

    store.commit('set', null)

    return null
};

export const remove = async (store, obj) => {
    var data = store.state.data
    data = await store.dispatch('removeRemote', data[obj.index].id)

    if(!data) {
        data = JSON.parse(await $ls.getItem('fuels'))
    
        data.splice(obj.index, 1);
    }

    await $ls.set('fuels', JSON.stringify(data))

    store.commit('set', data)

    return data
};

export const calcWheeled = (store, obj) => {
    let data = JSON.parse(JSON.stringify(store.state.data))
    let item = data[obj.index]
    let after = obj.after ? data[obj.after] : data[obj.index + 1]

    if(!obj || !data || !item || !after) return

    item.saved = null
    item.wheeled = parseFloat((parseFloat(after.km_actual) - parseFloat(item.km_actual)).toFixed(2))
    item.km_lt = parseFloat((item.wheeled / parseFloat(after.lts_add.replace(',', '.'))).toFixed(2))
    
    $ls.set('fuels', JSON.stringify(data))
    
    store.commit('set', data)

    return item
};
