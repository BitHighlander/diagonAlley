import Vue from 'vue'
import axios from 'axios'
import VModal from 'vue-js-modal'
import BootstrapVue from 'bootstrap-vue'

import App from './App'
import router from './router'
import store from './store'
import VueLogger from 'vuejs-logger';
import VueClipboard from 'vue-clipboard2'

const isProduction = process.env.NODE_ENV === 'production';
if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

const options = {
    isEnabled: true,
    logLevel : isProduction ? 'error' : 'debug',
    stringifyArguments : false,
    showLogLevel : true,
    showMethodName : true,
    separator: '|',
    showConsoleColors: true
};

Vue.use(VueLogger, options);
Vue.use(VModal)
Vue.use(BootstrapVue);
Vue.use(VueClipboard)

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
