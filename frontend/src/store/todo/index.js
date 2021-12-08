import Vue from 'vue'

export default {
    namespaced: true,
    state: {
        todos: null,
        selectedGroup: null
    },
    getters: {
        getAllGroups: state => {
            return state.todos
        },
        getTodos: state => (idGroup) => {
            if (!state.todos || !idGroup) {
                return []
            }

            return state.todos.find(element => element._id === idGroup).todos
        },
        getSelectedGroup: state => {
            return state.selectedGroup
        },
        getGroupById: state => (id) => {
            if (!state.todos || !id) {
                return null
            }

            return state.todos.find(element => element._id === id)
        }
    },
    mutations: {
        SET_SELECTED_GROUP(state, payload) {
            state.selectedGroup = payload.selectedGroup
        },
        UPDATE_TODOS(state, payload) {
            state.todos = payload.todos
        },
        ADD_TODO_ITEM(state, payload) {
            const todos = state.todos.find(element => element._id === payload.todo_group).todos
            
            if (todos) {
                todos.push(payload.todo_item)
            }
        },
        ADD_GROUP(state, payload) {
            if (!state.todos) {
                state.todos = new Array()
            }

            if (state.todos.length === 0) {
                state.selectedGroup = payload.new_group._id
            }
            
            state.todos.push(payload.new_group)
        },
        EDIT_GROUP(state, payload) {
            if (!state.todos) {
                state.todos = new Array()
            }

            const index = state.todos.findIndex(element => element._id === payload.group_id)
            
            Vue.delete(state.todos, index)
            state.todos.splice(index, 0, payload.group_new)
        },
        DELETE_GROUP(state, payload) {
            if (!state.todos) {
                state.todos = []
                state.selectedGroup = null
                return
            }
            const index = state.todos.findIndex(element => element._id === payload.group_id)
            Vue.delete(state.todos, index)

            if (state.todos[index] !== undefined) {
                state.selectedGroup = state.todos[index]._id
            } else if (state.todos[index + 1] !== undefined) {
                state.selectedGroup = state.todos[index + 1]._id
            } else if (state.todos[index - 1] !== undefined) {
                state.selectedGroup = state.todos[index - 1]._id
            } else {
                state.selectedGroup = null
            }
        }
    },
    actions: {
        update_todos({ commit }, payload) {
            commit('UPDATE_TODOS', payload)
        },
        add_todo_item({ commit }, payload) {
            commit('ADD_TODO_ITEM', payload)
        },
        set_selected_group({ commit }, payload) {
            commit('SET_SELECTED_GROUP', payload)
        },
        add_group({ commit }, payload) {
            commit('ADD_GROUP', payload)
        },
        delete_group({ commit }, payload) {
            commit('DELETE_GROUP', payload)
        },
        edit_group({ commit }, payload) {
            commit('EDIT_GROUP', payload)
        }
    }
}
