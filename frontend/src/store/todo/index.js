export default {
    namespaced: true,
    state: {
        todos: null,
        selectedGroup: null
    },
    getters: {
        getTodos: state => (idGroup) => {
            if (!state.todos) {
                return []
            }

            return state.todos.find(element => element._id === idGroup).todos
        },
        getSelectedGroup: state => {
            return state.selectedGroup
        }
    },
    mutations: {
        SET_SELECTED_GROUP(state, payload) {
            state.selectedGroup = payload.selectedGroup
        },
        UPDATE_TODOS(state, payload) {
            state.todos = payload.todos
            console.log(state.todos)
        },
        ADD_TODO_ITEM(state, payload) {
            console.log(state.todos)
            const todos = state.todos.find(element => element._id === payload.todo_group).todos
            
            if (todos) {
                todos.push(payload.todo_item)
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
        }
    }
}
