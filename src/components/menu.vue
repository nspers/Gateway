<template>
    <div class="spon subMain">
        <ButtonGroup size="large">
            <Button @click="addRole()">
                <Icon type="ios-add-circle-outline" />
                新增菜单
            </Button>
        </ButtonGroup>
        <Table :loading="loading" :columns="columns1" :data="data1" max-height="600">
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
                            <Input size="large" clearable v-model="useData.pid" />
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
    name: 'App',
    components: {expandRow},
    data(){
        return{
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
                        // return h('div',JSON.stringify(params.row.childList))
                        return h(expandRow, {
                            props: {
                                row: menu
                            }
                        })
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
            data1: [],
            useData:{}
        }
    },
    created:function() {
        this.updataList()
    },
    mounted:function() {
        this.$nextTick(function(){
            
        })
    },
    methods:{
        updataList(ref){
            var self = this
            this.loading = true
            this.$api.get('sysMenu/selectMenuList/').then(function(res){
                self.data1 = res.data
                sessionStorage.setItem('menu',JSON.stringify(res.data))
                var lengthData = res.data.length
                var w = {}
                // for(var i = 0;i < res.data.length;i++){
                //     for(var s = 0;s < res.data[i].childList.length;s++){
                //         w[lengthData] = res.data[i].childList[s]
                //         lengthData++
                //     }
                // }
                Object.assign(self.data1,w)
                self.loading = false
                if(ref){
                    history.go(0) 
                }
            })
        },
        addRole(){
            // this.socketApi.sendSock('你试着往我这里返回一些数据');  
            this.showData = true
            this.edit = false
            this.useData = {}
        },
        openDelete(index){
            this.deleteModel = true
            this.deleteIndex = index
        },
        remove(){
            var self = this
            var index = this.deleteIndex
            this.$api.delete('sysMenu/deleteMenu/' + this.data1[index].id).then(function(res){
                self.updataList(1)
                self.deleteModel = false
            })                
        },
        editRole(index){            
            this.edit = true
            this.showData = true
            this.useData = this.data1[index]
        },
        resetFrom(){
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
}
</script>

