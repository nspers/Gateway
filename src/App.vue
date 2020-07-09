<template>
    <div id="app">
        <keep-alive>
            <transition name="fade" mode="out-in">
                <router-view/>
            </transition>
        </keep-alive>
    </div>
</template>

<script>
import Vue from 'vue'
export default {
    name: 'App',
    async created() {
        Vue.prototype.$that = this;
    },
}
</script>
