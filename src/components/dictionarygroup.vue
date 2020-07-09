<template>
    <div class="spon subMain">
        <ButtonGroup size="large">
            <Button @click="addRole()">
                <Icon type="ios-cog-outline" />
                新增网关配置
            </Button>
        </ButtonGroup>
        <Table :loading="loading" :columns="columns1" :data="data1" max-height="600">
            <template slot-scope="{row, index }" slot="action">
                <Button type="info" size="small" style="margin-right: 5px" @click="editRole(index)">编辑</Button>
                <Button type="error" size="small" @click="openDelete(index)">删除</Button>
            </template>
        </Table>
        <Modal title="设备信息" v-model="showData" :loading="modalLoad" class-name="vertical-center-modal" @on-ok="submitUser()" width=620>
            <ul class="showUser">
                <li class="clearfix">
                    <strong>字典编码：</strong>
                    <div class="editDiv">
                        <Input size="large" clearable v-model="useData.type_code" />
                    </div>
                </li>
                <li class="clearfix">
                    <strong>字典名称：</strong>
                    <div class="editDiv">
                        <Input size="large" clearable v-model="useData.type_name" />
                    </div>
                </li>
                <li class="clearfix">
                    <strong>字典组ID：</strong>
                    <div class="editDiv">
                        <Input size="large" type="number" clearable v-model="useData.type_group_id" />
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
                <p>是否确认删除此配置?</p>
            </div>
            <div slot="footer">
                <Button type="error" size="large" long  @click="remove()">删除</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
import expandRow from './table-expand.vue';
export default {
    name: 'App',
    components: { expandRow },
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
                        return h(expandRow, {
                            props: {
                                row: params.row
                            }
                        })
                    }
                },
                {
                    title:'主键ID',
                    key:'id'
                },
                {
                    title: '字典组编码',
                    key: 'type_group_code'
                },
                {
                    title: '字典组名称',
                    key: 'type_group_name'
                },
                {
                    title: '操作',
                    slot: 'action'
                }
            ],
            data1: [],
            useData:{
                type_code:'',
                type_name:'',
                type_group_id:null,
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
            
            this.$api.get('sysData/selectDictionaryGroupList/').then(function(res){
                var newData = []
                newData = res.data
                self.data1 = res.data

                for(var i = 0;i < res.data.length; i++){
                    for(var s = 0;s < res.data[i].sysDataDictionary.length; s++){
                        for(var key in res.data[i].sysDataDictionary[s]){
                            newData[i][key] = res.data[i].sysDataDictionary[s][key]
                        }
                    }
                }
                console.log(newData)

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
            this.$api.delete('sysData/delectDictionaryGroup/' + this.data1[index].id).then(function(res){
                self.updataList()
                self.deleteModel = false
            })                
        },
        editRole(index){
            this.edit = true
            var self = this
            this.$api.get('sysData/selectDictionaryGroupList/' + this.data1[index].id).then(function(res){
                console.log(res);
                self.showData = true
                self.useData = res.data
            })
        },
        submitUser(){
            var self = this
            if(this.edit){
                this.$api.put('sysData/updateDictionaryGroup',this.useData).then(function(res){
                    console.log(res);
                    self.edit = false
                    self.showData = false
                    self.updataList()
                })
            }else{
                this.$api.post('sysData/saveDictionaryGroup',this.useData).then(function(res){
                    self.showData = false
                    self.updataList()
                })                
            }
            
        }
    }
}
</script>

