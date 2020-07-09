"use strict";

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import iView from 'view-design'
import router from './router'
import store from './store'
import api from './config'

import 'view-design/dist/styles/iview.css'
import './assets/css/reset.css'
import './assets/js/validator'

Vue.prototype.$api = api
Vue.config.productionTip = false
Vue.config.devtools = true

Vue.use(api)
Vue.use(iView)

Vue.prototype.$getViews = function(path){
    return resolve => {
        require.ensure([], (require) => {
            resolve(require('@/components/' + path + '.vue'))
        })
    }
}

new Vue({
  el: '#app',
  router,
  iView,
  store,
  components: { App },
  template: '<App/>'
}).$mount('#app')
