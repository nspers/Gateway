<template>
    <div class="nav">
        <Icon type="ios-apps" @click="toggleLeft" />
        <span>物联网应用网关管理平台</span>
		<div class="leftBottom">
            <Icon type="ios-contact" />{{username}} <a href="javascript:void(0)" @click="signout()">登出</a>
        </div>
    </div>
</template>
<script>
export default {
    name: 'App',
    data(){
        return{
            username:sessionStorage.username
        }
    },
    methods:{
        toggleLeft(){
            this.$store.commit('toggleNav')
            console.log(this.$store.state.toggle)
        },
        signout(){
            this.$api.get('anno/logout').then(function(res){
                sessionStorage.clear()
                location.reload()
            })
        }
    }
}
</script>
