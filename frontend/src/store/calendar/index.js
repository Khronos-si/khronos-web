// import Vue from 'vue'
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
        getEventById: state => (idEvent) => {
            if (!state.calendar) {
                return null
            }

            for (const group of state.calendar) {
                if (group.events) {
                    const event = group.events.filter(ele => ele._id === idEvent)

                    if (event) return event[0]
                }
            }
            
            return null
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
                            
                            tmpEvent._id = event._id
                            tmpEvent.customData = event
                            tmpEvent.customData.color = group.color
                            tmpEvent.dates = event.dates
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
        }
       
    }
}
