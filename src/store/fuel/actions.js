import { LocalStorage as $ls } from 'quasar'
import { uid as uidF } from 'quasar'
import axios from 'axios';

const uid = (function(){
    var uid = $ls.get.item('uid')

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

    if(!tracks) await store.dispatch('getRemote')

};

export const getRemote = async (store) => {
    var response = await axios.get(`${store.state.endpoint}gas-track`)

    if(!response.data.length) return null
    
    store.commit('set', response.data)

    return response.data
};

export const removeRemote = async (store, id) => {
    if(!id) return null

    if(!navigator.connection.type || navigator.connection.type == 'none') return null

    try {
        await axios.get(`${store.state.endpoint}gas-track/${id}/delete`)
        var data = await store.dispatch('getRemote')
    } catch (error) {
        return null
    }

    return data
};

export const saveRemote = async (store, data) => {
    if(!data) return

    if(!navigator.connection.type || navigator.connection.type == 'none') return data
    
    try {
        await axios.post(`${store.state.endpoint}gas-track/save`, data.filter(e => !e.saved))
        
        data.filter(e => !e.saved).forEach(e => {
            e.saved = 'true'
        });
        
        data = await store.dispatch('getRemote')
    } catch (error) {}

    return data
};

export const getToken = async (store) => {
    axios.defaults.headers.common['Authorization'] = uid;
    
    var token = $ls.get.item('api_token')

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
        
        return response.data.api_token
    } catch (error) {
        throw error
    }
};

export const get = async (store) => {
    var a = await $ls.get.item('fuels')

    a = JSON.parse(a)

    store.commit('set', a)

    return a
};

export const save = async (store, form) => {
    var data = JSON.parse($ls.get.item('fuels'))

    if(!data ){
        console.log('negação')
        data = []

    } else if(data.length){
        data[data.length-1].saved = null
        data[data.length-1].wheeled = parseFloat((parseFloat(form.km_actual) - parseFloat(data[data.length-1].km_actual)).toFixed(2))
        data[data.length-1].km_lt = parseFloat((data[data.length-1].wheeled / parseFloat(form.lts_add)).toFixed(2))
    }

    data = [...data, form]

    data = await store.dispatch('saveRemote', data);

    await $ls.set('fuels', JSON.stringify(data))

    var data = await store.dispatch('get');

    store.commit('set', data)

    return data
};

export const update = async (store, data) => {
    var state = store.state.data;

    state[data.index] = data.form

    await store.dispatch('saveRemote', state)

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
        data = JSON.parse(await $ls.get.item('fuels'))
    
        data.splice(obj.index, 1);
    }

    await $ls.set('fuels', JSON.stringify(data))

    store.commit('set', data)

    return data
};
