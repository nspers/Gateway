<template>
    <div class="abloomy subMain">
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
        <Modal title="设备信息" v-model="showData" :loading="modalLoad" class-name="vertical-center-modal" @on-ok="submitUser()"  @on-cancel="resetFrom()" width=620>
            <Form ref="formValidate" :model="useData" :rules="this.$ruleInline">
                <ul class="showUser">
                    <li class="clearfix">
                        <strong>厂商类型名称：</strong>
                        <!-- <div class="editDiv">
                            <Input size="large" clearable v-model="useData.requestType" />
                        </div> -->
                        <div class="editDiv">
                            <FormItem prop="menuName">
                                <Select v-model="useData.menuName" size="large">
                                    <Option v-for="item in vendorType" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                            </FormItem>
                        </div>
                    </li>
                    <li class="clearfix">
                        <strong>命令类型：</strong>
                        <div class="editDiv">
                            <FormItem prop="msgType">
                                <Input size="large" type="number" clearable v-model="useData.msgType" />
                            </FormItem>
                        </div>
                    </li>
                    <li class="clearfix">
                        <strong>命令路径：</strong>
                        <div class="editDiv">
                            <FormItem prop="interfaceId">
                                <Input size="large" clearable v-model="useData.interfaceId" />
                            </FormItem>
                        </div>
                    </li>
                    <li class="clearfix">
                        <strong>请求类型：</strong>
                        <!-- <div class="editDiv">
                            <Input size="large" clearable v-model="useData.requestType" />
                        </div> -->
                        <div class="editDiv">
                            <FormItem prop="requestType">
                                <Select v-model="useData.requestType" size="large">
                                    <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
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
            cityList:[
                {
                    value: 'get',
                    label: 'Get'
                },
                {
                    value: 'websocket',
                    label: 'WebSocket'
                },
                {
                    value: 'post',
                    label: 'Post'
                }
            ],
            columns1: [
                {
                    title:'厂商ID',
                    key:'factoryId'
                },
                {
                    title:'命令类型',
                    key:'msgType'
                },
                {
                    title: '命令路径',
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
            vendorType:[],
            data1: [],
            useData:{}
        }
    },
    created:function() {
        this.updataList()
        console.log(sessionStorage.menu);
        let menu = JSON.parse(sessionStorage.menu)
        for (let index = 0;  index < menu.length; index++) {
            if(menu[index].url == 'menuList'){
                for (let i = 0; i < menu[index].childList.length; i++) {
                    this.vendorType.push({value:menu[index].childList[i].name,label:menu[index].childList[i].name})
                }
            }
        }
    },
    mounted:function() {
        this.$nextTick(function(){
            
        })
    },
    methods:{
        updataList(){
            var self = this
            this.loading = true
            this.$api.get('sysMsgInfo/selectMsgInfoList/').then(function(res){
                self.data1 = res.data
                self.loading = false
            })
        },
        addRole(){
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
            this.$api.delete('sysMsgInfo/deleteSysMsgInfo/' + this.data1[index].id).then(function(res){
                self.updataList()
                self.deleteModel = false
            })                
        },
        editRole(index){
            this.edit = true
            var self = this
            this.$api.get('sysMsgInfo/selectMsgInfoList/' + this.data1[index].id).then(function(res){
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
            })
        }
    }
}
</script>

