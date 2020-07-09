<style scoped>
    .expand-row{
        height: 40px;
        line-height: 40px;
        font-size: 13px;
        padding:0;
    }
    td.ivu-table-expanded-cell{padding:0 !important;}
</style>
<template>
    <div>
        <Table :columns="columns1" border :data="rows">
            <template slot-scope="{ row, index }" slot="action">
                <Button type="info" size="small" style="margin-right: 5px" @click="editRole(index)">编辑</Button>
                <Button type="error" size="small" @click="openDelete(index)">删除</Button>
            </template>
        </Table>
        <Modal title="设备信息" v-model="showData" :loading="modalLoad" class-name="vertical-center-modal" @on-ok="submitUser()" @on-cancel="resetFrom()"  width=620>
            <Form ref="formValidate" :model="useData" :rules="this.$ruleInline">
                <ul class="showUser">
                    <li class="clearfix">
                        <strong>菜单名称：</strong>
                        <div class="editDiv">
                            <FormItem prop="name">
                                <Input size="large" clearable v-model="useData.name" />
                            </FormItem>
                        </div>
                    </li>
                    <li class="clearfix">
                        <strong>PID：</strong>
                        <div class="editDiv">
                            <FormItem prop="pid">
                                <Input size="large" clearable v-model="useData.pid" />
                            </FormItem>
                        </div>
                    </li>
                    <li class="clearfix">
                        <strong>访问路径：</strong>
                        <div class="editDiv">
                            <Input size="large" clearable v-model="useData.url"/>
                        </div>
                    </li>
                </ul>
                <FormItem class="footerAddSub">
                    <Button type="primary" size="large" @click="submitUser()">确定</Button>
                </FormItem>
            </Form>
        </Modal>
        <Modal v-model="deleteModel" width="360">
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="ios-information-circle"></Icon>
                <span>删除确认</span>
            </p>
            <div style="text-align:center">
                <p>是否确认删除此设备?</p>
            </div>
            <div slot="footer">
                <Button type="error" size="large" long  @click="remove()">删除</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    import expandRow from './table-expand'
    export default {
        props: {
            row: Array
        },
        components: {expandRow},
        data(){
            return{
                rows:[],
                showData:false,
                modalLoad:true,
                loading:false,
                edit:false,
                deleteModel:false,
                deleteIndex:0,
                columns1: [
                    {
                        type: 'expand',
                        width: 50,
                        render: (h, params) => {
                            let menu = JSON.parse(JSON.stringify(params.row.childList))
                            if(menu){
                                return h(expandRow, {
                                    props: {
                                        row: menu
                                    }
                                })
                            }else{
                                return h('')
                            }
                        }
                    },
                    {
                        title:'菜单ID',
                        key:'id'
                    },
                    {
                        title: '菜单名称',
                        key: 'name'
                    },
                    {
                        title: '父级id',
                        key: 'pid'
                    },
                    {
                        title: '访问路径',
                        key: 'url'
                    },
                    {
                        title: '操作',
                        slot: 'action'
                    }
                ],
                data1:[],
                useData:{}
            }
        },
        created:function() {
            sessionStorage.row = JSON.stringify(this.row)
            this.rows = JSON.parse(sessionStorage.row)
            this.updataList()
        },
        methods:{
            updataList(ref){
                // var self = this
                // this.loading = true
                // this.$api.get('sysMenu/selectMenuList/').then(function(res){
                //     self.data1 = res.data
                //     self.loading = false
                // })
                this.rows = JSON.parse(sessionStorage.row)
                if(ref){
                    this.$api.get('sysMenu/selectMenuList/').then(function(res){
                        sessionStorage.setItem('menu',JSON.stringify(res.data))
                        history.go(0) 
                    })
                }
            },
            openDelete(index){
                this.deleteModel = true
                this.deleteIndex = index
            },
            remove(){
                var self = this
                var index = this.deleteIndex
                this.$api.delete('sysMenu/deleteMenu/' + this.rows[index].id).then(function(res){
                    self.updataList(1)
                    self.deleteModel = false
                })                
            },
            editRole(index){
                console.log(this.rows[index]);
                this.edit = true
                this.showData = true
                this.useData = this.rows[index]
            },
            resetFrom(){
                this.useData = {}
                this.$refs.formValidate.resetFields();
                this.updataList()
            },
            submitUser(){
                var self = this
                this.$refs.formValidate.validate((valid) => {
                    if (valid) {
                        if(this.edit){
                            this.$api.put('sysMenu/updateMenu',this.useData).then(function(res){
                                console.log(res);
                                self.edit = false
                                self.showData = false
                                self.updataList(1)
                            })
                        }else{
                            this.$api.post('sysMenu/insertMenu',this.useData).then(function(res){
                                self.showData = false
                                self.updataList(1)
                            })                
                        }
                    }
                })
            }
        }
    };
</script>
