<template>

    <b-modal
        id="modal-add-tag"
        title="Add tag"
        transition=""
        @show="resetModal"
        @hidden="resetModal"
        @ok="handleOk"
    >   
        <form ref="form" @submit.stop.prevent="handleSubmit">
            <b-form-group
                label="Name"
                label-for="name-input"
                invalid-feedback="Name is required"
                :state="nameState"
            >
                <b-form-input
                    id="name-input"
                    v-model="name"
                    :state="nameState"
                    required
                ></b-form-input>
            </b-form-group>
            
            <b-form-group
                label="Color"
                label-for="color-input"
                invalid-feedback="Color is required"
                :state="colorState"
            >
                <v-select
                    v-model="color"
                    label="color"
                    :options="optionColor"
                    placeholder="Choose color"
                    style="max-height: 100px;"
                >
                    <template #selected-option="item">
                        <span class="bullet bullet-sm mr-1" :style="'background:' + item.color + '!important;'"></span> {{item.color}}

                    </template>
                    
                    <template #option="item">
                        <span class="bullet bullet-sm mr-1" :style="'background:' + item.color + '!important;'"></span> {{item.color}}
                    </template>

                </v-select>
            </b-form-group>
        </form>
    </b-modal>
</template>

<script>
    import { BModal, BFormInput, BFormGroup   } from 'bootstrap-vue'
    import vSelect from 'vue-select'

    export default {
        components: {
            BModal,
            BFormInput,
            BFormGroup,
            vSelect
        },
        // computed: {
        //     todos() {
        //         return this.$store.getters['todo/getTodos'](this.selectedGroup)
        //     },
        //     selectedGroup() {
        //         return this.$store.getters['todo/getSelectedGroup']
        //     }
        // },
        data() {
            return {
                optionColor: ['#7367F0', '#6EC193', '#53AFBE', '#FEB449', '#FE5C36', '#739BAA', '#F5C89F', '#8EBFB5', '#FEA6B0', '#95B2D1', '#42A48D', '#86415E', '#BC1654', '#F53435', '#FBF37C', '#7F7F7F', '#58555A'],
                color: '',
                name: '',
                nameState: null,
                colorState: null
            }
        },
        methods: {
            checkFormValidity() {
                let valid = this.$refs.form.checkValidity()
                

                if ((this.color === '' || !this.color)) valid = false 

                this.nameState = valid
                this.colorState = valid

                return valid
            },
            resetModal() {
                this.color = ''
                this.name = ''
                this.nameState = null
                this.colorState = null
            },
            handleOk(bvModalEvt) {
                // Prevent modal from closing
                bvModalEvt.preventDefault()
                // Trigger submit handler
                this.handleSubmit()
            },
            handleSubmit() {
                // Exit when the form isn't valid
                if (!this.checkFormValidity()) {
                    return
                }
                
                this.addTag()
            },
            async addTag() {

                const payload = {
                    'name': this.name,
                    'color': this.color
                }
                
                try {
                    const data = await this.$http.post('/api/todo/tag', payload)
                
                    const new_tag = data.data

                    this.$store.dispatch('tags/add_tag', { new_tag})

                    this.$bvModal.hide('modal-add-tag')
                } catch (err) {
                    console.log(err)
                }
               

            }
           
        }
    }
</script>

<style lang="scss">
    @import '~@core/scss/vue/libs/vue-select.scss';

    .emailDoesntExist{
        color: #fe5c36 !important;
    }

    button.vs__deselect{
    fill: rgb(32, 31, 31) !important;
    }
</style>

