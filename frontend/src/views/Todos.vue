<template>
    <div class="card" style="height: 75vh !important;" ref="card-div">
        <div class="d-inline">
            <div class="m-0 p-0" style="float: left" >
                
                <div class="p-0  m-0 py-2 px-0" style="height: 75vh !important; overflow-y: auto; border-right: 1px solid rgba(110,110,110,0.3);">
                    <div class="px-2 pb-1 d-flex justify-content-center" v-if="groupPermissions == null || groupPermissions > 0">
                        <b-button class="btn btn-primary btn-custom btn-block px-3"  v-b-modal.modal-add-todo >Add Task</b-button>
                    </div>
                    <div class="d-flex justify-content-between pr-1 pl-2" style="padding-bottom: 5px;">
                        <div class="d-flex">
                            <!-- ZBRISI V IF CE ZELIS COLLAPSE -->
                            <div v-on:click="colapseMyGruopy()" class="" v-if="0 == 1" style="cursor: pointer; margin-right: 5px;">
                                <chevron-up-icon v-if="!colapseMyGroups" size="1.5x" class="custom-class"></chevron-up-icon>
                                <chevron-down-icon v-if="colapseMyGroups" size="1.5x" class="custom-class"></chevron-down-icon>
                            </div>
                            <div>
                                My Groups
                            </div>
                        </div>
                        <div class="d-flex">
                            <div v-on:click="addGroup()" style="cursor: pointer;" >
                                <plus-icon size="1.4x" class="custom-class"></plus-icon>
                            </div>
                            <div>
                                <b-dropdown id="dropdown-1" text="Dropdown Button" toggle-class="dropdown-custom p-0" class="my-0 p-0 dropdown-custom" :boundary="cardDiv" no-caret>
                                    <template #button-content>
                                        <more-vertical-icon size="1.4x" :class="isDark? '': 'iconColorWhite'" class="p-0 custom-class" v-on:click="showEditGroup = !showEditGroup"></more-vertical-icon>
                                    </template>
                                    <b-dropdown-item-button @click="editGroup()" class="w-100" style="width: 100% !important;">Edit</b-dropdown-item-button>
                                    <b-dropdown-item-button @click="deleteGroup()">Delete</b-dropdown-item-button>
                                </b-dropdown>
                            </div>
                        </div>
                        
                    </div>
                    <div v-if="selectedGroup && todoGroups && todoGroups.length > 0 && !colapseMyGroups">
                        <div v-for="(group,id) in todoGroups" :key="'button_todo_group_' + id" v-on:click="setGroup(group._id)" class="pl-2 pr-2 d-flex justify-content-between" :class="(selectedGroup == group._id)? 'selectedGroup': 'normalGroup'" style="cursor: pointer;">
                        
                            <div>
                                <span class="bullet bullet-sm mr-1" :style="'background:' + group.color + '!important;'"></span>
                                {{group.name}}
                            </div>
                        </div>
                    </div>

                    <div class="d-flex justify-content-between px-2 mt-1" style="padding-bottom: 5px;">
                        <div>
                            Shared Groups
                        </div>
                    </div>

                    <!-- SHARED GROUPS -->
                    <div v-if="selectedGroup && shareTodoGroups && shareTodoGroups.length > 0">
                        <div v-for="(group,id) in shareTodoGroups" :key="'button_todo_group_' + id" v-on:click="setGroup(group._id)" class="pl-2 pr-2 d-flex justify-content-between" :class="(selectedGroup == group._id)? 'selectedGroup': 'normalGroup'" style="cursor: pointer;">
                        
                            <div>
                                <span class="bullet bullet-sm mr-1" :style="'background:' + group.color + '!important;'"></span>
                                {{group.name}}
                            </div>
                            <div  v-if="userId != group.owner._id">
                                <span class="badge badge-pill badge-warning ml-1" :style="'background:' + group.color + ' !important;'">{{group.owner.name}}</span>
                            </div>
                        </div>
                    </div>
                    <div class="d-flex justify-content-between px-2 mt-1 pb-1">
                        <div>
                            Tags
                        </div>
                        <div class="d-flex">
                            <div v-on:click="addTag()" style="cursor: pointer;">
                                <plus-icon size="1.4x" class="custom-class"></plus-icon>
                            </div>
                            <div>
                                <b-dropdown id="dropdown-1" text="Dropdown Button" toggle-class="dropdown-custom p-0" class="my-0 p-0 dropdown-custom" :boundary="cardDiv" no-caret>
                                    <template #button-content>
                                        <more-vertical-icon size="1.4x" :class="isDark? '': 'iconColorWhite'" class="p-0 custom-class" v-on:click="showEditGroup = !showEditGroup"></more-vertical-icon>
                                    </template>
                                    <b-dropdown-item-button @click="editTags()" class="w-100" style="width: 100% !important;">Edit</b-dropdown-item-button>
                                    <b-dropdown-item-button @click="deleteTag()">Delete</b-dropdown-item-button>
                                </b-dropdown>
                            </div>
                        </div>
                        
                    </div>
                    <div v-if="todoTagsOfGroup">
                        <div v-for="(tag,id) in todoTagsOfGroup" :key="'button_todo_tag_' + id" class="pl-2 pr-2 d-flex justify-content-between align-items-middle" style="padding-bottom: 5px;">
                            <b-form-checkbox  v-model="tag.status" class="test d-flex align-items-start py-0" :style="'cursor: pointer; --color:' + tag.color + ';'">

                                <div  class="pt-0" :class="(selectedGroup == tag._id)? 'selectedGroup': 'normalGroup'" :style="'cursor: pointer;'" >
                                    {{tag.name}}
                                </div>

                            </b-form-checkbox>
                        </div>
                    </div>
                   
                </div>
            </div>


            <!-- TOP MENU where 3 dots are -->
            <div class="d-flex justify-content-between mr-1" style="padding-top: 10px; stroke:white !important; height: 7vh !important;" v-if="selectedGroupName">
                <div class="d-flex align-items-center ml-1">
                    <!-- <span class="bullet bullet-sm mr-1" :style="'background:' + selectedGroupName.color + '!important;'"></span> -->
                    <div style="font-size: 1.5rem;">
                        {{selectedGroupName.name}}
                    </div>
                </div>
                <div class="d-flex">
                    <div class="d-flex align-items-center">
                        <div class="mr-1 pr-1 border-right" v-on:click="selectTodos('ALL')" style="cursor: pointer;"  :class="typeSort == 'ALL' ? 'selectedType':'normalType'">All</div>
                        <div class="mr-1 pr-1 border-right" v-on:click="selectTodos('UNFI')" style="cursor: pointer;" :class="typeSort == 'UNFI' ? 'selectedType':'normalType'" >Not finished</div>
                        <div class="mr-1" v-on:click="selectTodos('FINI')" style="cursor: pointer;" :class="typeSort == 'FINI' ? 'selectedType':'normalType'">Done</div>
                    </div>
                </div>
               
                
            </div>

            <div class="m-0 p-0" style="overflow-y: auto; overflow-x: hidden; height: 68vh;" v-if="selectedGroup">
                <todos-in-group :todoGroupId="selectedGroup" />
            </div>

        </div>
       
        <add-todo></add-todo>
        <add-group></add-group>
        <edit-group></edit-group>
        <add-tag></add-tag>
        <edit-todo-tag></edit-todo-tag>
        <delete-group></delete-group>
        <delete-todo-tag></delete-todo-tag>
    </div>
</template>

<script>
    import { BButton, BDropdown, BDropdownItemButton, BFormCheckbox } from 'bootstrap-vue'
    import TodosInGroup from './Components/TodosInGroup.vue'
    import AddTodo from './Components/AddTodo.vue'
    import AddGroup from './Components/AddGroup.vue'
    import { PlusIcon, MoreVerticalIcon, ChevronDownIcon, ChevronUpIcon } from 'vue-feather-icons'
    import EditGroup from './Components/EditGroup.vue'
    import AddTag from './Components/AddTag.vue'
    import EditTodoTag from './Components/EditTodoTag.vue'
    import DeleteGroup from './Components/DeleteGroup.vue'
    import DeleteTodoTag from './Components/DeleteTodoTag.vue'
    import useAppConfig from '@core/app-config/useAppConfig'
    import { computed } from '@vue/composition-api'


    export default {
        setup() {
            const { skin } = useAppConfig()

            const isDark = computed(() => skin.value === 'dark')

            return { skin, isDark }
        },
        components: {
            // BCard
            // BCardText,
            // Calendar,
            BFormCheckbox,
            BButton,
            BDropdown,
            BDropdownItemButton,
            TodosInGroup,
            PlusIcon,
            MoreVerticalIcon,
            ChevronDownIcon,
            ChevronUpIcon,
            // SettingsIcon,
            // Trash2Icon,
            // BModal,
            // BFormInput,
            // BFormGroup,
            AddTodo,
            AddGroup,
            EditGroup,         
            AddTag,
            EditTodoTag,
            DeleteGroup,
            DeleteTodoTag   // DatePicker
        },
        computed:{
            selectedGroupName() {
                return this.$store.getters['todo/getGroupName'](this.selectedGroup)
            },
            todoTagsOfGroup() {
                return this.$store.getters['todo/getTodoTagsFromGroup'](this.selectedGroup)
            },
            groupPermissions() {
                return this.$store.getters['todo/getGroupPremissions'](this.selectedGroup)
            },
            ownerOfTheGroup() {
                return this.$store.getters['todo/getGroupOwner'](this.selectedGroup)
            },
            shareTodoGroups() {
                return this.$store.getters['todo/getAllSharedGroups']
            },
            sharedTodos() {
                return this.$store.getters['todo/getSharedTodos'](this.selectedGroup)
            },
            userId() {
                return this.$store.getters['user/getUserId']
            },
            todoGroups() {
                return this.$store.getters['todo/getAllGroups']
            },
            todos() {
                return this.$store.getters['todo/getTodos'](this.selectedGroup, this.typeToSort)
            },
            selectedGroup() {
                return this.$store.getters['todo/getSelectedGroup']
            }
        },
        data() {
            return {
                typeSort: 'ALL',
                colapseMyGroups: false,
                cardDiv: null,
                showEditGroup: false,
                moreOptionsIcon: require('@/assets/svg/more-vertical.svg'),
                deleteIcon: require('@/assets/svg/trash.svg')
            }
        },
        methods: {
            test(tag) {
                const tagRefs = `tag_checkbox_${tag}`
                console.log(this.$refs[tagRefs][0].click())
                
            },
            selectTodos(type) {
                this.typeSort = type
                this.$store.dispatch('todo/update_type', { type})
            },
            colapseMyGruopy() {
                this.colapseMyGroups = !this.colapseMyGroups
            },
            editGroup() {
                this.$bvModal.show('modal-edit-group')
            },
            editTags() {
                this.$bvModal.show('modal-edit-todo-tag')
            },
            deleteTag() {
                this.$bvModal.show('modal-delete-todo-tag')
            },
            deleteGroup() {
                this.$bvModal.show('modal-delete-group')
            },
            addGroup() {
                this.$bvModal.show('modal-add-group')
            },
            addTag() {
                this.$bvModal.show('modal-add-tag')
            },
            setGroup(selected) {
                this.$store.dispatch('todo/set_selected_group', { 'selectedGroup': selected})
            },
            async getTodoGroups() {
                try {
                    const data = await this.$http.get('/api/todo/group')

                    if (data.data && data.data.length === 0) {
                        throw 'Prislo je do napake'
                    }

                    this.$store.dispatch('todo/update_todos', { 'todos': data.data})
                    this.$store.dispatch('todo/set_selected_group', { 'selectedGroup': data.data[0]['_id']})
                } catch (err) {
                    console.log(err)
                }

                try {

                    const data = await this.$http.get('/api/todo/shared-with-me')

                    if (data.data && data.data.length === 0) {
                        throw 'Prislo je do napake'
                    }

                    this.$store.dispatch('todo/set_shared_group', { 'todos': data.data})
                } catch (err) {
                    console.log(err)
                }

                try {
                    const data = await this.$http.get('/api/todo/tag')

                    if (data.data && data.data.length === 0) {
                        throw 'Prislo je do napake'
                    }

                    this.$store.dispatch('todo/set_tags', { 'tags': data.data})
                } catch (err) {
                    console.log(err)
                }
                

            }
        },
        mounted() {
            this.getTodoGroups()

            this.cardDiv = this.$refs['card-div']
        }
    }
</script>

<style lang="scss">
    @import '~@core/scss/base/bootstrap-extended/include';

    .iconColorWhite{
        color: #6e6b7b !important;
    }
    .selectedType {
        padding-bottom: 5px;
        padding-top: 5px;
        color: #7367f0;
    }
    .normalType {
        padding-bottom: 5px;
        padding-top: 5px;
    }
     .normalType:hover {
        color: #7367f0;
    }

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
        border-color: $blue !important;
        background-color: $blue !important;
    }
    .btn-custom:active{
        border-color: $blue !important;
        background-color: $blue !important;
    }
    .btn-custom:hover{
        box-shadow: 0 8px 25px -8px $blue !important;
    }
    .card{
        border-radius: 15px;
    }
    .dropdown-custom{
        border: none;
        background: transparent !important;
    }

    .dropdown-custom:focus-visible{
        border: none;
        background: transparent !important;
    }
    .dropdown-custom:hover{
        box-shadow: none !important;
        border: none;
        background: transparent !important;
    }
    .dropdown-custom:active{
        border: none;
        background: transparent !important;
    }
    .dropdown-custom:target{
        border: none;
        background-color: transparent !important;
    }
    .dropdown-custom:visited{
        border: none;
        background: transparent !important;
    }

    .btn-secondary:target{
        border: none;
        background: transparent !important;
    }

    .btn-secondary:focus{
        border: none;
        background: transparent !important;
    }

    .dropdown-item {
        width: 100% !important;
    }

    .btn-custom:target{
        border: 1px solid;
        border-color: $blue !important;
        background-color: $blue !important;
    }
    .btn-custom:focus{
        border: 1px solid;
        border-color: $blue !important;
        background-color: $blue !important;
    }
</style>

<style lang="scss">
    .test{
        padding-top: 3px;
    }
    .test.custom-checkbox .custom-control-input:checked ~ .custom-control-label::before {
        background-color: var(--color) !important;
        border-radius: 50%;
        padding: 2px !important;
        // border: 2px solid red !important;
    }
    .test.custom-checkbox .custom-control-input ~ .custom-control-label::before {
        // background-color: green!important;
        // width: 15px !important;
        // height: 15px !important;
        border-radius: 50%;
        border: 2px solid var(--color) !important;
        // border-radius: 50%;
    }
</style>