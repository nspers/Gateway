<template>
    <div class="spon subMain">
        <ButtonGroup size="large">
            <Button @click="addRole()">
                <Icon type="ios-add-circle-outline" />
                新增命令
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
                    <strong>厂商id：</strong>
                    <div class="editDiv">
                        <Input size="large" clearable v-model="useData.factoryId" />
                    </div>
                </li>
                <li class="clearfix">
                    <strong>厂商类型：</strong>
                    <div class="editDiv">
                        <Input size="large" clearable v-model="useData.msgType" />
                    </div>
                </li>
                <li class="clearfix">
                    <strong>消息id：</strong>
                    <div class="editDiv">
                        <Input size="large" clearable v-model="useData.msgId"  />
                    </div>
                </li>
                <li class="clearfix">
                    <strong>命令id：</strong>
                    <div class="editDiv">
                        <Input size="large" clearable v-model="useData.interfaceId"  />
                    </div>
                </li>
                <li class="clearfix">
                    <strong>请求类型：</strong>
                    <div class="editDiv">
                        <Input size="large" clearable v-model="useData.requestType"  />
                    </div>
                </li>
                
                <li class="clearfix">
                    <strong>描述：</strong>
                    <div class="editDiv">
                        <Input v-model="useData.describe" type="textarea" :rows="4"/>
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
                    title: '厂商id',
                    key: 'factoryId'
                },
                {
                    title: '厂商类型',
                    key: 'msgType'
                },
                {
                    title: '消息id',
                    key: 'msgId'
                },
                {
                    title: '命令id',
                    key: 'interfaceId'
                },
                {
                    title: '请求类型',
                    key: 'requestType'
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
            this.$api.get('sysMsgInfo/selectMsgInfoList').then(function(res){
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
            this.$api.delete('sysMsgInfo/deleteSysMsgInfo/' + this.data1[index].id).then(function(res){
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
                this.$api.put('sysMsgInfo/updateSysMsgInfo',this.useData).then(function(res){
                    console.log(res);
                    self.edit = false
                    self.showData = false
                    self.updataList()
                })
            }else{
                this.$api.post('sysMsgInfo/insertSysMsgInfo',this.useData).then(function(res){
                    self.showData = false
                    self.updataList()
                })                
            }
            
        }
    }
}
</script>

