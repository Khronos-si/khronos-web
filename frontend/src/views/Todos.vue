<template>
    <div class="card" style="min-height: 75vh; max-height: 65vh;">
        <div class="d-inline">
            <div class="m-0 p-0" style="float: left" >
                <div class="p-0  m-0 py-2 px-0" style="height: 75vh !important; border-right: 1px solid rgba(110,110,110,0.3);">
                    <div class="px-2 pb-1 d-flex justify-content-center">
                        <b-button class="btn btn-custom btn-block px-3"  v-b-modal.modal-add-todo>Add Task</b-button>
                    </div>
                    <div class="d-flex justify-content-between px-2" style="padding-bottom: 5px;">
                        <div>
                            Groups
                        </div>
                        <div v-on:click="addGroup()" style="cursor: pointer;">
                            <plus-icon size="1.4x" class="custom-class"></plus-icon>
                        </div>
                    </div>
                    <div v-for="(group,id) in todoGroups" :key="'button_todo_group_' + id" v-on:click="setGroup(group._id)" class="pl-2 pr-2" :class="(selectedGroup == group._id)? 'selectedGroup': 'normalGroup'" style="cursor: pointer;">
                        <span class="bullet bullet-sm mr-1 bullet-success" ></span>
                        {{group.name}}
                    </div>
                </div>
            </div>

            <div class="m-0 p-0" style="overflow-y: auto; overflow-x: hidden; max-height: 75vh;">
                <todos :todoGroupId="selectedGroup" />
            </div>
        </div>

        <add-todo></add-todo>
        <add-group></add-group>
    </div>
</template>

<script>
    import { BButton } from 'bootstrap-vue'
    import Todos from './Components/Todos.vue'
    import AddTodo from './Components/AddTodo.vue'
    import AddGroup from './Components/AddGroup.vue'
    import { PlusIcon } from 'vue-feather-icons'


    export default {
        components: {
            // BCard
            // BCardText,
            // Calendar,
            BButton,
            Todos,
            PlusIcon,
            // BModal,
            // BFormInput,
            // BFormGroup,
            AddTodo,
            AddGroup
            // DatePicker
        },
        computed:{
            todoGroups() {
                return this.$store.getters['todo/getAllGroups']
            },
            todos() {
                return this.$store.getters['todo/getTodos'](this.selectedGroup)
            },
            selectedGroup() {
                return this.$store.getters['todo/getSelectedGroup']
            }
        },
        data() {
            const month = new Date().getMonth()
            const year = new Date().getFullYear()
            return {
                masks: {
                    weekdays: 'WWW'
                },
                attributes: [
                    {
                        key: 1,
                        customData: {
                            title: 'Lunch with mom.',
                            class: 'bg-red-600 text-white'
                        },
                        dates: new Date(year, month, 1)
                    },
                    {
                        key: 2,
                        customData: {
                            title: 'Take Noah to basketball practice',
                            class: 'bg-blue-500 text-white'
                        },
                        dates: new Date(year, month, 2)
                    },
                    {
                        key: 3,
                        customData: {
                            title: 'Noah\'s basketball game.',
                            class: 'bg-blue-500 text-white'
                        },
                        dates: new Date(year, month, 5)
                    },
                    {
                        key: 4,
                        customData: {
                            title: 'Take car to the shop',
                            class: 'bg-indigo-500 text-white'
                        },
                        dates: new Date(year, month, 5)
                    },
                    {
                        key: 4,
                        customData: {
                            title: 'Meeting with new client.',
                            class: 'bg-teal-500 text-white'
                        },
                        dates: new Date(year, month, 7)
                    },
                    {
                        key: 5,
                        customData: {
                            title: 'Mia\'s gymnastics practice.',
                            class: 'bg-pink-500 text-white'
                        },
                        dates: new Date(year, month, 11)
                    },
                    {
                        key: 6,
                        customData: {
                            title: 'Cookout with friends.',
                            class: 'bg-orange-500 text-white'
                        },
                        dates: { months: 5, ordinalWeekdays: { 2: 1 } }
                    },
                    {
                        key: 7,
                        customData: {
                            title: 'Mia\'s gymnastics recital.',
                            class: 'bg-pink-500 text-white'
                        },
                        dates: new Date(year, month, 22)
                    },
                    {
                        key: 8,
                        customData: {
                            title: 'Visit great grandma.',
                            class: 'bg-red-600 text-white'
                        },
                        dates: new Date(year, month, 25)
                    }
                ]
            }
        },
        methods: {
            addGroup() {
                this.$bvModal.show('modal-add-group')
            },
            setGroup(selected) {
                this.$store.dispatch('todo/set_selected_group', { 'selectedGroup': selected})
            },
            async getTodoGroups() {
                const todo = this.todoGroupId
                console.log(`/api/todo/group/${{todo}}`)
                const data = await this.$http.get('/api/todo/group')

                // this.todoGroups = data.data
                
                this.$store.dispatch('todo/update_todos', { 'todos': data.data})
                this.$store.dispatch('todo/set_selected_group', { 'selectedGroup': data.data[0]['_id']})

            }
        },
        mounted() {
            this.getTodoGroups()
        }
    }
</script>

<style>
    .selectedGroup {
        border-left: 2px solid #7367f0;
        padding-bottom: 5px;
        padding-top: 5px;
        color: #7367f0;
    }
    .normalGroup {
        border-left: 2px solid transparent;
        padding-bottom: 5px;
        padding-top: 5px;
    }
     .normalGroup:hover {
        color: #7367f0;
    }
   *::-webkit-scrollbar {
        width: 2px;
    }

    /* Track */
    *::-webkit-scrollbar-track {
        background: transparent; 
    }
    
    /* Handle */
    *::-webkit-scrollbar-thumb {
        background: #888; 
    }

    /* Handle on hover */
    *::-webkit-scrollbar-thumb:hover {
        background: #555; 
    }

    .btn-custom{
        border-color: #7367f0 !important;
        background-color: #7367f0 !important;
    }
    .btn-custom:active{
        border-color: #7367f0 !important;
        background-color: #5e50ee !important;
    }
    .btn-custom:focus{
        border-color: #7367f0 !important;
        background-color: #5e50ee !important;
    }
    .btn-custom:hover{
        box-shadow: 0 8px 25px -8px #7367f0 !important;
    }
</style>
