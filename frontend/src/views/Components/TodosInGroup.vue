<template>
    <div>
        <!-- MY TODOS -->
        <div v-if="todos && todos.length > 0"> 
            <div class="row py-1 item" :class="id===0? 'row-first': 'row-todos'" v-for="(item, id) in todos" :key="'Todos_' + id"  >
                <div class="col-2 d-flex justify-content-center">
                    <b-form-checkbox
                        v-model="item.status"
                        @change="updateTodoStatus(id, item._id)"
                    ></b-form-checkbox>
                </div>
                <div class="col-10 text-left d-flex justify-content-between"  @click="editTodo(item)" v-if="item" style="cursor: pointer;">
                    <div>
                        {{item.name}}
                        <div style="font-size: 0.7rem;">{{item.description.substring(0,30)}}</div>
                    </div>
                    <div class="d-flex align-items-center justify-content-end ml-1">
                        <div  class="text-right" v-if="item.tags && item.tags.length > 0">
                            <span v-for="(tag,idTag) in item.tags" :key="'tag_'+ idTag" class="badge badge-pill mr-1" :style="'background:' + tag.color + '!important; margin-bottom: 5px;'">{{tag.name}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- SHARED TODOS -->
        <div v-if="sharedTodos && sharedTodos.length > 0"> 
            <div class="row py-1" :class="id===0? 'row-first': 'row-todos'" v-for="(item, id) in sharedTodos" :key="'Shared_todos_' + id" >
                <div class="col-2 d-flex justify-content-center">
                    <b-form-checkbox
                        v-model="item.status"
                        @change="updateTodoStatus(id, item._id)"
                    ></b-form-checkbox>
                </div>
                <div class="col-10 text-left d-flex justify-content-between" @click="editTodo(item)" v-if="item" style="cursor: pointer;">
                    <div>
                        {{item.name}}
                        <div style="font-size: 0.7rem;">{{item.description.substring(0,30)}}</div>
                    </div>
                    <div class="d-flex align-items-center">
                        <div v-if="item.tags && item.tags.length > 0">
                            <!-- <span v-for="(tag,idTag) in item.tags" :key="'tag_'+ idTag" class="badge badge-pill badge-warning mr-2">{{tag.name}}</span> -->
                            <span v-for="(tag,idTag) in item.tags" :key="'tag_'+ idTag" class="badge badge-pill mr-1" :style="'background:' + tag.color + '!important; margin-bottom: 5px;'">{{tag.name}}</span>
                        </div>
                    </div>
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
            async updateTodoStatus(id, itemId) {
                const group = this.selectedGroup
                const todoId = itemId

                let payload = null

                if (this.todos[id]) {
                    payload = {
                        'id': todoId,
                        'name': this.todos[id].name,
                        'description': this.todos[id].description,
                        'status': this.todos[id].status
                    }
                } else if (this.sharedTodos[id]) {
                    payload = {
                        'id': todoId,
                        'name': this.sharedTodos[id].name,
                        'description': this.sharedTodos[id].description,
                        'status': this.sharedTodos[id].status
                    }
                }
                

                try {
                    const data = await this.$http.put(`/api/todo/${todoId}`, payload)

                    this.$store.dispatch('todo/edit_todo', { 'idGroup': group, 'idTodo': todoId, 'todo_new': data.data})
                } catch (err) {
                    console.log(err)
                }
            },
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