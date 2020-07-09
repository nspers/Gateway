<template>
    <div class="tecnon subMain">
        <ButtonGroup size="large">
            <Button @click="addRole()">
                <Icon type="ios-add-circle-outline" />
                新增设备
            </Button>
        </ButtonGroup>
        <Table :loading="loading" border :columns="columns1" :data="data1" max-height="600">
            <template slot-scope="{ row, index }" slot="action">
                <Button type="info" size="small" style="margin-right: 5px" @click="editRole(index)">编辑</Button>
                <Button type="error" size="small" @click="openDelete(index)">删除</Button>
            </template>
        </Table>
        <Modal title="设备信息" v-model="showData" :loading="modalLoad" class-name="vertical-center-modal" @on-ok="submitUser()" @on-cancel="resetFrom()"  width=620>
            <Form ref="formValidate" :model="useData" :rules="this.$ruleInline">
                <ul class="showUser">
                    <li class="clearfix">
                        <strong>IP地址：</strong>
                        <div class="editDiv">
                            <FormItem prop="ip">
                                <Input size="large" clearable v-model="useData.ip" />
                            </FormItem>
                        </div>
                    </li>
                    <li class="clearfix">
                        <strong>设备名称：</strong>
                        <div class="editDiv">
                            <FormItem prop="device_name">
                                <Input size="large" clearable v-model="useData.device_name"  />
                            </FormItem>
                        </div>
                    </li>
                    <li class="clearfix">
                        <strong>设备方应用设备ID：</strong>
                        <div class="editDiv">
                            <FormItem prop="device_id">
                                <Input size="large" clearable v-model="useData.device_id"  />
                            </FormItem>
                        </div>
                    </li>
                    <li class="clearfix">
                        <strong>平台设备ID：</strong>
                        <div class="editDiv">
                            <FormItem prop="did">
                                <Input size="large" clearable v-model="useData.did"  />
                            </FormItem>
                        </div>
                    </li>
                    <li class="clearfix">
                        <strong>网页地址：</strong>
                        <div class="editDiv">
                            <FormItem prop="url">
                                <Input size="large" clearable v-model="useData.url"  />
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
            columns1: [
                {
                    title: '主键ID',
                    key: 'id'
                },
                {
                    title: '厂商ID',
                    key: 'factory_id'
                },
                {
                    title: 'IP地址',
                    key: 'ip'
                },
                {
                    title: '设备名称',
                    key: 'device_name'
                },
                {
                    title: '设备方应用设备ID',
                    key: 'device_id'
                },
                {
                    title: '平台设备ID',
                    key: 'did'
                },
                {
                    title: '网页地址',
                    key: 'url'
                },
                {
                    title: '描述',
                    key: 'describe'
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
            this.$api.get('sysDevice/selectTecnonList/').then(function(res){
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
            this.$api.delete('sysDevice/delectTecnon/' + this.data1[index].id).then(function(res){
                self.updataList()
                self.deleteModel = false
            })                
        },
        editRole(index){
            this.edit = true
            var self = this
            this.$api.get('sysDevice/selectTecnonList/' + this.data1[index].id).then(function(res){
                console.log(res);
                self.showData = true
                self.useData = res.data
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
                        this.$api.put('sysDevice/updateTecnon',this.useData).then(function(res){
                            console.log(res);
                            self.edit = false
                            self.showData = false
                            self.updataList()
                        })
                    }else{
                        this.$api.post('sysDevice/saveTecnon',this.useData).then(function(res){
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

