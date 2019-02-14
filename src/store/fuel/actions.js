import { LocalStorage as $ls } from 'quasar'

export const get = async (store) => {
    var a = await $ls.get.item('fuels')

    a = JSON.parse(a)

    store.commit('set', a)

    return a
};

export const save = async (store, form) => {
    var data = await store.dispatch('get');

    if(!data){
        data = []

    } else {
        data[data.length-1].wheeled = parseFloat((parseFloat(form.km_actual) - parseFloat(data[data.length-1].km_actual)).toFixed(2))
        data[data.length-1].km_lt = parseFloat((data[data.length-1].wheeled / parseFloat(form.lts_add)).toFixed(2))
    }

    data = [...data, form]

    await $ls.set('fuels', JSON.stringify(data))
    var data = await store.dispatch('get');

    store.commit('set', data)

    return data
};

export const update = async (store, data) => {
    var state = await store.dispatch('get');
    
    state[data.index] = data.form

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
    var data = JSON.parse(await $ls.get.item('fuels'))

    data.splice(obj.index, 1);

    await $ls.set('fuels', JSON.stringify(data))

    store.commit('set', data)

    return data
};