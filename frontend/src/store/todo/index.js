import Vue from 'vue'

export default {
    namespaced: true,
    state: {
        todos: null,
        sharedTodos: null,
        selectedGroup: null,
        type: 'ALL',
        tags: null

    },
    getters: {

        //Tags
        getAllTags: state => {
            return state.tags
        },

        getTodoTagsFromGroup: state => (idGroup) => {

            let group = null
            const tags = []

            if (!state.tags) return []

            if (state.todos) {
                group = state.todos.find(element => element._id === idGroup)
            }

           if (state.sharedTodos && !group) {
                group = state.sharedTodos.find(element => element._id === idGroup)
           }

            if (group) {
                if (group.todos) {
                    for (const item of group.todos) {
                        if (item.tags) {
                            for (const tagItem of item.tags) {
                                let allredyIn = false

                                for (const key in tags) {
                                    if (tags[key]._id === tagItem._id) allredyIn = true
                                }

                                if (!allredyIn) {
                                    const itemToPush = state.tags.find(element => element._id === tagItem._id)
                                    
                                    if (itemToPush) {
                                        tags.push(itemToPush)
                                    } else {
                                        tags.push(tagItem)
                                        console.log('ERRORRRRRRRRRRRRRRRRRRRRRRRRR!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! V TAGIH')
                                    }
                                }
                            }
                        }
                    }
                
                return tags
                }
           }

           return []
        },

        getGroupName: state => (idGroup) => {
            if (state.todos) {
                const group = state.todos.find(element => element._id === idGroup)
                
                if (group) {
                    return group
                }
            }

            if (state.sharedTodos) {
                const group = state.sharedTodos.find(element => element._id === idGroup)
                
                if (group) {
                    return group
                }
            }
        },

        //Both
        getGroupOwner: state => (idGroup) => {

            if (state.todos && idGroup) {
                const group = state.todos.find(element => element._id === idGroup)

                if (!group) {
                
                    if (state.todos) {
                        const groupShared = state.sharedTodos.find(element => element._id === idGroup)
                        
                        if (groupShared) {
                            return groupShared.owner._id
                        }
                    }

                    return null
                    }
            
                return group.owner._id

            }
                
        },
        getGroupPremissions: state => (idGroup) => {
            if (state.sharedTodos && idGroup) {
                const group = state.sharedTodos.find(element => element._id === idGroup)

                if (group) {
                    return group.permissions
                }
            }
            return null
        },

        //Shared
        getAllSharedGroups: state => {
            return state.sharedTodos
        },
        getSharedTodos: (state, getters) => (idGroup) => {
            if (!state.sharedTodos || !idGroup) {
                return []
            }

            const group = state.sharedTodos.find(element => element._id === idGroup)

            if (!group) return []

            let todos = group.todos

            if (state.type === 'UNFI') { // ONLY UNFINISHED
                todos = group.todos.filter(ele => ele.status === false)
            } else if (state.type === 'FINI') { // ONLY FINISHED
                todos = group.todos.filter(ele => ele.status === true)
            }
            
            const tags = getters.getTodoTagsFromGroup(idGroup)

            const checkForTrueEle = []
            for (const key in tags) {
                
                if (tags[key] && tags[key].status === true) {
                    checkForTrueEle.push(tags[key]._id)
                }
            }

            if (checkForTrueEle.length > 0) {
                const itemsUsefull = []
    
                for (const key in todos) {
                    const item = todos[key]

                    if (item.tags && item.tags.length > 0) {
                        
                        for (const tagKey in item.tags) {
                            const itemTag = item.tags[tagKey]
                            if (checkForTrueEle.includes(itemTag._id)) {

                                let alredyIn = false

                                for (const key in itemsUsefull) {
                                    if (itemsUsefull[key]._id === item._id) alredyIn = true
                                }

                                if (!alredyIn) itemsUsefull.push(item)
                                continue
                            }
                        }

                    }
                }
                return itemsUsefull
            }

            if (group.todos && group.todos.tags && group.todos.tags.length > 0) {
                return todos.tags.filter(element => tags.includes(element._id))
            } else {
                return todos
            }
        },
        getSharedGroupById: state => (id) => {
            if (!state.sharedTodos || !id) {
                return null
            }

            return state.sharedTodos.find(element => element._id === id)
        },

        //Mine
        getAllGroups: state => {
            return state.todos
        },
       
        getTodos: (state, getters) => (idGroup) => {
            if (!state.todos || !idGroup) {
                return []
            }
            let group = null
            group = state.todos.find(element => element._id === idGroup)

            if (!group) return []

            let todos = group.todos

            if (state.type === 'UNFI') { // ONLY UNFINISHED
                todos = group.todos.filter(ele => ele.status === false)
            } else if (state.type === 'FINI') { // ONLY FINISHED
                todos = group.todos.filter(ele => ele.status === true)
            }

            const tags = getters.getTodoTagsFromGroup(idGroup)

            const checkForTrueEle = []
            for (const key in tags) {
                
                if (tags[key] && tags[key].status === true) {
                    checkForTrueEle.push(tags[key]._id)
                }
            }

            if (checkForTrueEle.length > 0) {
                const itemsUsefull = []
    
                for (const key in todos) {
                    const item = todos[key]

                    if (item.tags && item.tags.length > 0) {
                        
                        for (const tagKey in item.tags) {
                            const itemTag = item.tags[tagKey]
                            if (checkForTrueEle.includes(itemTag._id)) {

                                let alredyIn = false

                                for (const key in itemsUsefull) {
                                    if (itemsUsefull[key]._id === item._id) alredyIn = true
                                }

                                if (!alredyIn) itemsUsefull.push(item)
                                continue
                            }
                        }

                    }
                }
                return itemsUsefull
            }

            if (!group) return []
            else if (group.todos && group.todos.tags && group.todos.tags.length > 0) {
                return todos.tags.filter(element => tags.includes(element._id))
            } else {
                return todos
            }
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
        //Tags
        SET_TAGS(state, payload) {
            state.tags = payload.tags
        },
        ADD_TAG(state, payload) {
            if (state.tags) state.tags.push(payload.new_tag)

            console.log(state.tags)
        },

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
        UPDATE_TODOS(state, payload) {
            state.todos = payload.todos
        },
        ADD_TODO_ITEM(state, payload) {

            if (payload.todo_item) {
                payload.todo_item.checbox = payload.todo_item.status
            }

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
        UPDATE_TYPE(state, payload) {
            state.type = payload.type
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
        },
        update_type({ commit }, payload) {
            commit('UPDATE_TYPE', payload)
        },
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
