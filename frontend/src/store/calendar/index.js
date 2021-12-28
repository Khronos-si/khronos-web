// import Vue from 'vue'

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
        getAllGroupsEdit: state => {
            if (state.calendar) {
                return state.calendar.filter(ele => ele.name !== 'Default')
            }
            return state.calendar
        },
        getEventById: state => (idEvent) => {
            if (!state.calendar) {
                return null
            }

            for (const group of state.calendar) {
                if (group.events) {
                    const event = group.events.filter(ele => ele._id === idEvent)

                    if (event && event.length > 0) return event[0]
                }
            }
            
            return null
        },
        getEvents: state => {
            if (!state.calendar) {
                return []
            }
            const selectedEvents = []
            
            for (const group of state.calendar) {
                
                if (group.selected) {
                    if (group.events && group.events.length > 0) {
                        for (const event of group.events) {

                            const tmpEvent = {}
                            
                            tmpEvent._id = event._id
                            tmpEvent.customData = event
                            tmpEvent.customData.color = group.color
                            tmpEvent.dates = event.dates
                            // tmpEvent.content = 'red'
                            selectedEvents.push(tmpEvent)
                        }

                    }
                }
            }

            return selectedEvents
        },
        getEventsHome: state => {
            if (!state.calendar) {
                return []
            }
            const selectedEvents = []
            
            for (const group of state.calendar) {
                
                if (group.selected) {
                    if (group.events && group.events.length > 0) {
                        for (const event of group.events) {

                            const tmpEvent = {}
                            
                            tmpEvent._id = event._id
                            tmpEvent.customData = event
                            tmpEvent.customData.color = group.color
                            tmpEvent.dates = event.dates
                            tmpEvent.dot = {
                                style: {
                                    'background-color': group.color
                                }
                            }
                            tmpEvent.popover = {
                                label: event.description
                            }
                            // tmpEvent.content = 'red'
                            selectedEvents.push(tmpEvent)
                        }

                    }
                }
            }

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
       

        //Mine
        
        UPDATE_EVENTS(state, payload) {
            state.calendar = payload.events

            // for (const event of state.calendar) {
            //     console.log(event)
            //     event.selected = true
            // }
        },
        ADD_EVENT(state, payload) {
            if (!state.calendar) {
                state.calendar = new Array()
                state.calendar.push(payload.new_tag)

            } else if (state.calendar) {
                const group = state.calendar.find(element => element._id === payload.tag_id)

                if (group) {
                    group.events.push(payload.event)
                }
            }

        },
        ADD_TAG(state, payload) {
            if (!state.calendar) {
                state.calendar = new Array()
            } 
            state.calendar.push(payload.new_tag)
        },
        EDIT_TAG(state, payload) {
            if (!state.calendar) return

            const group =  state.calendar.findIndex(element => element._id === payload.calendar_id)

            if (group) {
                Vue.delete(state.calendar, group)
                state.calendar.splice(group, 0, payload.calendar_new)
            }

        }  
    },
    actions: {
        update_events({ commit }, payload) {
            commit('UPDATE_EVENTS', payload)
        },
        add_event({ commit }, payload) {
            commit('ADD_EVENT', payload)
        },
        add_tag({ commit }, payload) {
            commit('ADD_TAG', payload)
        },
        edit_tag({ commit }, payload) {
            commit('EDIT_TAG', payload)
        }
       
    }
}
