<template>
    <div class="spon subMain">
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
        <Modal title="设备信息" v-model="showData" :loading="modalLoad" class-name="vertical-center-modal" @on-ok="submitUser()" width=620>
            <ul class="showUser">
                <li class="clearfix">
                    <strong>设备类型：</strong>
                    <div class="editDiv">
                        <Input size="large" clearable v-model="useData.type" />
                    </div>
                </li>
                <li class="clearfix">
                    <strong>厂商类型：</strong>
                    <div class="editDiv">
                        <Input size="large" clearable v-model="useData.subtype" />
                    </div>
                </li>
                <li class="clearfix">
                    <strong>设备类型名称：</strong>
                    <div class="editDiv">
                        <Input size="large" clearable v-model="useData.typeName"  />
                    </div>
                </li>
                <li class="clearfix">
                    <strong>厂商名称：</strong>
                    <div class="editDiv">
                        <Input size="large" clearable v-model="useData.factoryName"  />
                    </div>
                </li>
                <li class="clearfix">
                    <strong>服务ip地址：</strong>
                    <div class="editDiv">
                        <Input size="large" clearable v-model="useData.serverIp"  />
                    </div>
                </li>
                <li class="clearfix">
                    <strong>服务端口：</strong>
                    <div class="editDiv">
                        <Input size="large" clearable v-model="useData.serverPort"  />
                    </div>
                </li>
                <li class="clearfix">
                    <strong>描述：</strong>
                    <div class="editDiv">
                        <Input v-model="useData.describe" type="textarea" :rows="4"/>
                    </div>
                </li>  
                <li class="clearfix">
                    <strong>mq设备类型：</strong>
                    <div class="editDiv">
                        <Input size="large" clearable v-model="useData.mqType"  />
                    </div>
                </li>
                <li class="clearfix">
                    <strong>mq厂商类型：</strong>
                    <div class="editDiv">
                        <Input size="large" clearable v-model="useData.mqSubtype"  />
                    </div>
                </li>

                              
            </ul>
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
                    title: '设备类型',
                    key: 'type'
                },
                {
                    title: '厂商类型',
                    key: 'subtype'
                },
                {
                    title: '设备类型名称',
                    key: 'typeName'
                },
                {
                    title: '厂商名称',
                    key: 'factoryName'
                },
                {
                    title: '服务ip地址',
                    key: 'serverIp'
                },
                {
                    title: '服务端口',
                    key: 'serverPort'
                },
                {
                    title: '描述',
                    key: 'describe'
                },
                {
                    title: 'mq设备类型',
                    key: 'mqType'
                },
                {
                    title: 'mq厂商类型',
                    key: 'mqSubtype'
                },
                {
                    title: '操作',
                    slot: 'action'
                }
            ],
            data1: [],
            useData:{
                factory_id:0,
                ip:'',
                device_name:'',
                device_id:'',
                did:'',
                describe:''
            }
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
            this.$api.get('sysDeviceFactory/selectSysDeviceFactoryList').then(function(res){
                self.data1 = res.data
                self.loading = false
            })
        },
        addRole(){
            // this.socketApi.sendSock('你试着往我这里返回一些数据');  
            this.showData = true
            this.edit = false
            this.useData = {
                factory_id:null,
                ip:'',
                device_name:'',
                device_id:'',
                did:'',
                describe:''
            }
        },
        openDelete(index){
            this.deleteModel = true
            this.deleteIndex = index
        },
        remove(){
            var self = this
            var index = this.deleteIndex
            this.$api.delete('sysDeviceFactory/deleteSysDeviceFactory/' + this.data1[index].id).then(function(res){
                self.updataList()
                self.deleteModel = false
            })                
        },
        editRole(index){
            this.edit = true
            this.showData = true
            this.useData = this.data1[index]
            console.log(this.data1[index])
            // this.$api.get('sysDeviceFactory/selectSysDeviceFactoryList/' + this.data1[index].id).then(function(res){
            //     console.log(res);
            //     self.showData = true
            //     self.useData = res.data
            // })
        },
        submitUser(){
            var self = this
            if(this.edit){
                this.$api.put('sysDeviceFactory/updateSysDeviceFactory',this.useData).then(function(res){
                    console.log(res);
                    self.edit = false
                    self.showData = false
                    self.updataList()
                })
            }else{
                this.$api.post('sysDeviceFactory/insertSysDeviceFactory',this.useData).then(function(res){
                    self.showData = false
                    self.updataList()
                })                
            }
            
        }
    }
}
</script>

