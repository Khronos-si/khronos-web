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
            state.tags = payload.tags[0]
        },
        ADD_TAG(state, payload) {
            state.tags.push(payload.new_tag)
        },
        DELETE_TAG(state, payload) {
            console.log(state)
            console.log(payload)
        },
        EDIT_TAG(state, payload) {
            console.log(state)
            console.log(payload)
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
