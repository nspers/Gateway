<template>
    <div class="use subMain">
        <ButtonGroup size="large">
            <Button @click="addRole()">
                <Icon type="md-person-add" />
                新增角色
            </Button>
            <!-- <Button>
                <Icon type="md-trash" />
                删除角色
            </Button> -->
        </ButtonGroup>
        <Table :loading="loading" border ref="selection" :columns="columns1" :data="data1" @on-selection-change="chose" max-height="600">
            <template slot-scope="{ row, index }" slot="action">
                <Button type="info" size="small" style="margin-right: 5px" @click="editRole(index)">编辑</Button>
                <Button type="error" size="small" @click="openDelete(index)">删除</Button>
            </template>
        </Table>
        <!-- <Page :total="100" show-sizer /> -->
        <Modal title="设备信息" v-model="showData" :loading="modalLoad" class-name="vertical-center-modal" @on-ok="submitUser()" @on-cancel="resetFrom()"  width=620>
            <Form ref="formValidate" :model="useData" :rules="this.$ruleInline">
                <ul class="showUser">
                    <li class="clearfix">
                        <strong>用户名称：</strong>
                        <div class="editDiv">
                            <FormItem prop="name">
                                <Input size="large" clearable v-model="useData.name" />
                            </FormItem>
                        </div>
                    </li>
                    <li class="clearfix">
                        <strong>用户账号：</strong>
                        <div class="editDiv">
                            <FormItem prop="account">
                                <Input size="large" clearable v-model="useData.account" />
                            </FormItem>
                        </div>
                    </li>
                    <li class="clearfix">
                        <strong>用户密码：</strong>
                        <div class="editDiv">
                            <FormItem prop="password">
                                <Input type="password" size="large" clearable v-model="useData.password"  />
                            </FormItem>
                        </div>
                    </li>
                    <li class="clearfix">
                        <strong>是否禁用：</strong>
                        <div class="editDiv">
                            <FormItem prop="forbidden">
                                <i-switch v-model="useData.forbidden" :true-value="Number(1)" :false-value="Number(0)" />
                            </FormItem>
                        </div>
                    </li>
                    <li class="clearfix">
                        <strong>拥有权限：</strong>
                        <div class="editDiv">
                            <FormItem prop="forbidden">
                                <i-switch v-model="useData.authority" :true-value="Number(1)" :false-value="Number(0)" />
                            </FormItem>
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
                <p>是否确认删除此用户?</p>
            </div>
            <div slot="footer">
                <Button type="error" size="large" long  @click="remove()">删除</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
export default {
    name: 'App',
    data(){
        return{
            showData:false,
            modalLoad:true,
            loading:false,
            edit:false,
            deleteModel:false,
            deleteIndex:0,
            useData:{
                name:'',
                account:'',
                password:'',
                forbidden:0,
                authority:0
            },
            columns1: [
                // {
                //     type: 'selection',
                //     width: 60,
                //     align: 'center'
                // },
                {
                    title: '用户名',
                    key: 'name'
                },
                {
                    title: '账号',
                    key: 'account'
                },
                {
                    title: '启用',
                    key: 'qiyong'
                },
                {
                    title: '可操作权限',
                    key: 'quanxian'
                },
                {
                    title: '操作',
                    slot: 'action'
                }
            ],
            data1: []
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
        updataList(){
            var self = this
            this.loading = true
            this.$api.get('sys/selectUserList',{size:10}).then(function(res){
                self.loading = false
                if(res.code == 0){
                    self.data1 = res.data.content
                    for(var i = 0;i < res.data.content.length;i++){
                        if(res.data.content[i].forbidden == '1'){
                            res.data.content[i].qiyong = '是'
                        }else{
                            res.data.content[i].qiyong = '否'
                        }

                        if(res.data.content[i].authority == '1'){
                            res.data.content[i].quanxian = '是'
                        }else{
                            res.data.content[i].quanxian = '否'
                        }
                    }
                }
            })
        },
        editRole(index){
            this.edit = true
            var self = this
            this.$api.get('sys/selectUserDetail',{id:this.data1[index].id}).then(function(res){
                console.log(res);
                self.showData = true
                self.useData = res.data
            })
            // this.$Modal.info({
            //     title: 'User Info',
            //     content: `Name：${this.data1[index].name}<br>Age：${this.data1[index].age}<br>Address：${this.data1[index].address}`
            // })
        },
        openDelete(index){
            this.deleteModel = true
            this.deleteIndex = index
        },
        remove(){
            var self = this
            var index = this.deleteIndex
            // this.data1.splice(index, 1);
            this.$api.delete('sys/deleteUser/' + this.data1[index].id).then(function(res){
                self.updataList()
                self.deleteModel = false
            })                
        },
        addRole(){
            //this.socketApi.sendSock('你试着往我这里返回一些数据');  
            this.showData = true
            this.edit = false
            this.useData = {
                name:'',
                account:'',
                password:'',
                forbidden:0,
                authority:0                
            }
        },
        chose(selection){
            //console.log(selection)
        },
        resetFrom(){
            this.$refs.formValidate.resetFields();
        },
        submitUser(){
            var self = this
            this.$refs.formValidate.validate((valid) => {
                if (valid) {
                    if(this.edit){
                        this.$api.put('sys/updateUser',this.useData).then(function(res){
                            console.log(res);
                            self.edit = false
                            self.showData = false
                            self.updataList()
                        })
                    }else{
                        this.$api.post('sys/saveUser',this.useData).then(function(res){
                            self.showData = false
                            self.updataList()
                        })                
                    }
                }
            })
            
        },
        transform(data){
            for(var key in data){
                // if(typeof data[key] == 'boolean'){
                //     data[key] = data[key]*1
                    if(key == 'authority'){
                        data[key] = data[key] + ''
                    }
                // }
            }
            return data
        }
    }
}
</script>
