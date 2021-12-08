<template>
    <div >
        <!-- MY TODOS -->
        <div v-if="todos && todos.length > 0"> 
            <div class="row py-1 item" :class="id===0? 'row-first': 'row-todos'" v-for="(item, id) in todos" :key="'Todos_' + id" @click="editTodo(item)" style="cursor: pointer;">
                <div class="col-2 d-flex justify-content-center">
                    <b-form-checkbox
                        id="checkbox-group-1"
                        v-model="selected"
                    ></b-form-checkbox>
                </div>
                <div class="col-10 text-left d-flex justify-content-between">
                    {{item.name}}
                    <span class="badge badge-pill badge-warning mr-2">Important</span>
                </div>
            </div>
        </div>

        <!-- SHARED TODOS -->
        <div v-if="sharedTodos && sharedTodos.length > 0"> 
            <div class="row py-1" :class="id===0? 'row-first': 'row-todos'" v-for="(item, id) in sharedTodos" :key="'Shared_todos_' + id" @click="editTodo(item)">
                <div class="col-2 d-flex justify-content-center">
                    <b-form-checkbox
                        id="checkbox-group-1"
                        v-model="selected"
                    ></b-form-checkbox>
                </div>
                <div class="col-10 text-left d-flex justify-content-between">
                    {{item.name}}
                    <span class="badge badge-pill badge-warning mr-2">Important</span>
                </div>
            </div>
        </div>
       
        <edit-todo :todo="todoForEditing"></edit-todo>
    </div>
</template>

<script>
    import {BFormCheckbox} from 'bootstrap-vue'
    import EditTodo from './EditTodo.vue'

    export default {
        components:{
            BFormCheckbox,
            EditTodo
        },
        computed:{
            
            sharedTodos() {
                return this.$store.getters['todo/getSharedTodos'](this.selectedGroup)
            },
            todos() {
                return this.$store.getters['todo/getTodos'](this.selectedGroup)
            },
            selectedGroup() {
                return this.$store.getters['todo/getSelectedGroup']
            }
        },
        data() {
            return {
                todoForEditing: null,
                name: '',
                description: '',
                status: '',
                nameState: null,
                descState: null,
                // todos: [],
                selected: ''
            }
        },
        methods: {
            editTodo(todo) {
                this.todoForEditing = todo
                this.$bvModal.show('modal-edit-todo')
            }
        },
        mounted() {
            // this.getTodos()
        }
    }

</script>


<style lang="scss" scoped>
    @import '~@core/scss/base/bootstrap-extended/include';

    .row-first{
        border-top:    none !important;
        border-right:  1px solid rgba(110,110,110,0.3);
        border-bottom: 0px solid rgba(110,110,110,0.3);
        border-left:   0px solid  rgba(110,110,110,0.3);
        overflow: hidden;
    }
    .row-todos{
        border-top:    1px solid rgba(110,110,110,0.3);
        border-right:  1px solid rgba(110,110,110,0.3);
        border-bottom: 0px solid rgba(110,110,110,0.3);
        border-left:   0px solid  rgba(110,110,110,0.3);
        overflow: hidden;
    }
    .item:hover{
        color: $primary;
    }
</style>