<template>
    <div v-if="todos">
        <!-- {{todos}} -->
        <div class="row py-1 row-todos" v-for="(item, id) in todos" :key="'Todos_' + id">
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
</template>

<script>
    import {BFormCheckbox} from 'bootstrap-vue'

    export default {
        components:{
            BFormCheckbox
        },
        computed:{
            todos() {
                return this.$store.getters['todo/getTodos'](this.selectedGroup)
            },
            selectedGroup() {
                return this.$store.getters['todo/getSelectedGroup']
            }
        },
        data() {
            return {
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
            // async getTodos() {
            //     const todo = this.selectedGroup
            //     const data = await this.$http.get(`/api/todo/group/${todo}`)
            //     this.todos = data.data.todos
            // }
        },
        mounted() {
            // this.getTodos()
        }
        // watch:{
        //     selectedGroup() {
        //         this.getTodos()
        //     }
        // }

    }

</script>


<style scoped>
    .row-todos{
        border-top:    1px solid rgba(110,110,110,0.3);
        border-right:  1px solid rgba(110,110,110,0.3);
        border-bottom: 0px solid rgba(110,110,110,0.3);
        border-left:   0px solid  rgba(110,110,110,0.3);
        overflow: hidden;
    }
</style>