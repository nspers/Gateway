<template>
    <div class="spon subMain">
        <ButtonGroup size="large">
            <Button @click="addRole()">
                <Icon type="ios-cog-outline" />
                新增网关配置
            </Button>
        </ButtonGroup>
        <Table :loading="loading" border :columns="columns1" :data="data1" max-height="600">
            <template slot-scope="{ row, index }" slot="action">
                <Button type="info" size="small" style="margin-right: 5px" @click="editRole(index)">编辑</Button>
                <Button type="error" size="small" @click="openDelete(index)">删除</Button>
            </template>
        </Table>
        <Modal title="网关配置" v-model="showData" :loading="modalLoad" class-name="vertical-center-modal" @on-ok="submitUser()" @on-cancel="resetFrom()" width=620>
            <Form ref="formValidate" :model="useData" :rules="this.$ruleInline">
                <ul class="showUser">
                    <li class="clearfix">
                        <strong>系统ID：</strong>
                        <div class="editDiv">
                            <FormItem prop="sys_id">
                                <Input size="large" clearable v-model="useData.sys_id" />
                            </FormItem>
                        </div>
                    </li>
                    <li class="clearfix">
                        <strong>链路ID：</strong>
                        <div class="editDiv">
                            <FormItem prop="connect_id">
                                <Input size="large" clearable v-model="useData.connect_id" />
                            </FormItem>
                        </div>
                    </li>
                    <li class="clearfix">
                        <strong>链路类型：</strong>
                        <div class="editDiv">
                            <FormItem prop="type_group_code">
                                <Input size="large" clearable v-model="useData.type_group_code" />
                            </FormItem>
                        </div>
                    </li>
                    <li class="clearfix">
                        <strong>IP地址：</strong>
                        <div class="editDiv">
                            <FormItem prop="ip">
                                <Input size="large" clearable v-model="useData.ip" />
                            </FormItem>
                        </div>
                    </li>
                    <li class="clearfix">
                        <strong>端口号：</strong>
                        <div class="editDiv">
                            <FormItem prop="port">
                                <Input size="large" clearable v-model="useData.port" />
                            </FormItem>
                        </div>
                    </li>
                    <li class="clearfix">
                        <strong>socket 名字：</strong>
                        <div class="editDiv">
                            <FormItem prop="socket_name">
                                <Input size="large" clearable v-model="useData.socket_name" />
                            </FormItem>
                        </div>
                    </li>
                    <li class="clearfix">
                        <strong>系统类型：</strong>
                        <div class="editDiv">
                            <FormItem prop="sys_type">
                                <Input size="large" clearable v-model="useData.sys_type" />
                            </FormItem>
                        </div>
                    </li>
                    <li class="clearfix">
                        <strong>描述：</strong>
                        <div class="editDiv">
                            <Input v-model="useData.describe" type="textarea" :rows="4"/>
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
                <p>是否确认删除此配置?</p>
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
            columns1: [
                {
                    title:'主键ID',
                    key:'id'
                },
                {
                    title: '系统ID',
                    key: 'sys_id'
                },
                {
                    title: '链路ID',
                    key: 'connect_id'
                },
                {
                    title: '链路类型',
                    key: 'type_group_code'
                },
                {
                    title: '描述',
                    key: 'describe'
                },
                {
                    title: 'IP地址',
                    key: 'ip'
                },
                {
                    title: '端口号',
                    key: 'port'
                },
                {
                    title: 'socket 名字',
                    key: 'socket_name'
                },
                {
                    title: '系统类型',
                    key: 'sys_type'
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
        updataList(){
            var self = this
            this.loading = true
            this.$api.get('sysGateway/selectConfigList/').then(function(res){
                self.data1 = res.data
                self.loading = false
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
            this.$api.delete('sysGateway/delectConfig/' + this.data1[index].id).then(function(res){
                self.updataList()
                self.deleteModel = false
            })                
        },
        editRole(index){
            this.edit = true
            var self = this
            this.$api.get('sysGateway/selectConfigList/' + this.data1[index].id).then(function(res){
                console.log(res);
                self.useData = res.data
                self.showData = true
            })
        },
        resetFrom(){
            this.$refs.formValidate.resetFields();
        },
        submitUser(){
            var self = this
            this.$refs.formValidate.validate((valid) => {
                if (valid) {
                    if(this.edit){
                        this.$api.put('sysGateway/updateConfig',this.useData).then(function(res){
                            console.log(res);
                            self.edit = false
                            self.showData = false
                            self.updataList()
                        })
                    }else{
                        this.$api.post('sysGateway/saveConfig',this.useData).then(function(res){
                            self.showData = false
                            self.updataList()
                        })                
                    }
                }
            })
        }
    }
}
</script>

