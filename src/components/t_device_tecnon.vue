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
                        <strong>集中器主键标识：</strong>
                        <div class="editDiv">
                            <FormItem prop="ccuuId">
                                <Input size="large" clearable v-model="useData.ccuuId" />
                            </FormItem>
                        </div>
                    </li>
                    <li class="clearfix">
                        <strong>集中器代码标识 UID：</strong>
                        <div class="editDiv">
                            <FormItem prop="cuuid">
                                <Input size="large" clearable v-model="useData.cuuid"  />
                            </FormItem>
                        </div>
                    </li>
                    <li class="clearfix">
                        <strong>集中器名称：</strong>
                        <div class="editDiv">
                            <FormItem prop="ccuuName">
                                <Input size="large" clearable v-model="useData.ccuuName"  />
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
                    key: 'factoryId'
                },
                {
                    title: '集中器主键标识',
                    key: 'ccuuId'
                },
                {
                    title: '集中器代码标识 UID',
                    key: 'cuuid'
                },
                {
                    title: '集中器名称',
                    key: 'ccuuName'
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
            this.$api.get('sysDeviceIotcomm/selectIotcommList/').then(function(res){
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
            this.$api.delete('sysDeviceIotcomm/delectIotcomm/' + this.data1[index].id).then(function(res){
                self.updataList()
                self.deleteModel = false
            })                
        },
        editRole(index){
            this.edit = true
            var self = this
            this.$api.get('sysDeviceIotcomm/selectIotcommList/' + this.data1[index].id).then(function(res){
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
                        this.$api.put('sysDeviceIotcomm/updateIotcomm',this.useData).then(function(res){
                            console.log(res);
                            self.edit = false
                            self.showData = false
                            self.updataList()
                        })
                    }else{
                        this.$api.post('sysDeviceIotcomm/saveIotcomm',this.useData).then(function(res){
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
<style scoped>
.showUser li strong{width:150px;}
</style>
