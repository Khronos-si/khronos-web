import Vue from 'vue'
// people.filter(person => id_filter.includes(person.id))
export default {
    namespaced: true,
    state: {
        calendar: null,
        sharedCalendar: null,
        selectedCalendarGroup: null
    },
    getters: {
        //Mine
        getAllGroups: state => {
            return state.calendar
        },
       
        getEvents: state => (idGroup) => {
            console.log(idGroup)
            if (!state.calendar) {
                return []
            }

            const selectedEvents = []
            
            for (const group of state.calendar) {
                
                if (group.selected) {
                    if (group.events && group.events.length > 0) {
                        for (const event of group.events) {

                            const tmpEvent = {}

                            tmpEvent.customData = event
                            tmpEvent.customData.color = group.color
                            
                            if (event.start === event.end) {
                                tmpEvent.dates = event.start
                            } else {
                                tmpEvent.dates = event.start
                            }
                            selectedEvents.push(tmpEvent)
                        }

                    }
                }
            }

            console.log(selectedEvents)

            return selectedEvents
        },
        getSelectedGroup: state => {

            const selectedGroups = []

            for (const event of state.calendar) {
                if (event.selected) {
                    selectedGroups.push(event._id)
                }
            }

            return state.selectedCalendarGroup
        },
        getGroupById: state => (id) => {
            if (!state.calendar || !id) {
                return null
            }

            return state.calendar.find(element => element._id === id)
        }
    },
    mutations: {
        //Both
        SET_SELECTED_GROUP(state, payload) {
            state.selectedGroup = payload.selectedGroup
        },
        DELETE_TODO(state, payload) {

            if (state.sharedTodos && payload.idGroup) {
                const group = state.sharedTodos.find(element => element._id === payload.idGroup)

                if (group) {
                    const todoIndex = group.todos.findIndex(element => element._id === payload.idTodo)
                    
                    if (todoIndex) Vue.delete(group.todos, todoIndex)
                }
            }

            if (state.todos) {
                const group = state.todos.find(element => element._id === payload.idGroup)

                if (group) {
                    const todoIndex = group.todos.findIndex(element => element._id === payload.idTodo)
                    
                    if (todoIndex >= 0) Vue.delete(group.todos, todoIndex)
                }
            }

            console.log(state.todos)

            return null
        },
        EDIT_TODO(state, payload) {
            if (state.sharedTodos && payload.idGroup) {
                const group = state.sharedTodos.find(element => element._id === payload.idGroup)

                if (group) {
                    const todoIndex = group.todos.findIndex(element => element._id === payload.idTodo)
                    
                    if (todoIndex) {

                    Vue.delete(group.todos, todoIndex)
                    group.todos.splice(todoIndex, 0, payload.todo_new)
                    }
                }
            }

            if (state.todos) {
                const group = state.todos.find(element => element._id === payload.idGroup)

                if (group) {
                    const todoIndex = group.todos.findIndex(element => element._id === payload.idTodo)
                    
                    if (todoIndex >= 0) {
                        Vue.delete(group.todos, todoIndex)
                        group.todos.splice(todoIndex, 0, payload.todo_new)
                    }
                }
            }
            
        },


        //SHARED
        UPDATE_SHARED_TODOS(state, payload) {
            state.todos = payload.todos
        },
        ADD_SHARED_TODO_ITEM(state, payload) {
            const todos = state.sharedTodos.find(element => element._id === payload.todo_group).todos
            
            if (todos) {
                todos.push(payload.todo_item)
            }
        },
        SET_SHARED_GROUP(state, payload) {
            state.sharedTodos = payload.todos
        },

        //Mine
        
        UPDATE_EVENTS(state, payload) {
            state.calendar = payload.events

            // for (const event of state.calendar) {
            //     console.log(event)
            //     event.selected = true
            // }
        },
        ADD_TODO_ITEM(state, payload) {
            if (state.todos) {
                const group = state.todos.find(element => element._id === payload.todo_group)

                if (group) {
                    group.todos.push(payload.todo_item)
                    return
                }
            }

            if (state.sharedTodos) {
                const group = state.sharedTodos.find(element => element._id === payload.todo_group)

                if (group) {
                    group.todos.push(payload.todo_item)
                }
            }
            
            
        },
        ADD_TAG(state, payload) {
            if (!state.calendar) {
                state.calendar = new Array()
            }

            state.calendar.push(payload.new_tag)
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
        update_events({ commit }, payload) {
            commit('UPDATE_EVENTS', payload)
        },
        add_todo_item({ commit }, payload) {
            commit('ADD_TODO_ITEM', payload)
        },
        set_selected_group({ commit }, payload) {
            commit('SET_SELECTED_GROUP', payload)
        },
        add_tag({ commit }, payload) {
            commit('ADD_TAG', payload)
        },
        delete_group({ commit }, payload) {
            commit('DELETE_GROUP', payload)
        },
        edit_group({ commit }, payload) {
            commit('EDIT_GROUP', payload)
        },
        update_shared_todos({ commit }, payload) {
            commit('UPDATE_SHARED_TODOS', payload)
        },
        add_shared_todo_item({ commit }, payload) {
            commit('ADD_SHARED_TODO_ITEM', payload)
        },
        set_shared_group({ commit }, payload) {
            commit('SET_SHARED_GROUP', payload)
        },
        delete_todo({ commit }, payload) {
            commit('DELETE_TODO', payload)
        },
        edit_todo({ commit }, payload) {
            commit('EDIT_TODO', payload)
        }
    }
}
