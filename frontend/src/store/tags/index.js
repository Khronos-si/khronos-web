import Vue from 'vue'

export default {
    namespaced: true,
    state: {
        tags: null
    },
    getters: {
        getAllTags: state => {
            return state.tags
        }
    },
    mutations: {
        SET_TAGS(state, payload) {
            state.tags = payload.tags
        },
        ADD_TAG(state, payload) {
            if (state.tags) state.tags.push(payload.new_tag)

            console.log(state.tags)
        },
        DELETE_TAG(state, payload) {
            const index = state.tags.findIndex(element => element._id === payload.tag_id)
            Vue.delete(state.tags, index)
        },
        EDIT_TAG(state, payload) {
            const index = state.tags.findIndex(element => element._id === payload.tag_id)

            Vue.delete(state.tags, index)
            state.tags.splice(index, 0, payload.tag_new)
        }
    },
    actions: {
        set_tags({ commit }, payload) {
            commit('SET_TAGS', payload)
        },
        add_tag({ commit }, payload) {
            commit('ADD_TAG', payload)
        },
        delete_tag({ commit }, payload) {
            commit('DELETE_TAG', payload)
        },
        edit_tag({ commit }, payload) {
            commit('EDIT_TAG', payload)
        }
    }
}
