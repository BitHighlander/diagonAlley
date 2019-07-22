import Vue from 'vue'
import axios from 'axios'
import VueI18n from 'vue-i18n'
import App from './App'
import 'bulma/css/bulma.css'
import 'animate.css/animate.css'
import { remote, ipcRenderer} from 'electron'
import VueClipboard from 'vue-clipboard2'
import walletService from '../modules/wallet'
import gnodeService from '../modules/gnode'
import {RemoteGnodeService} from '../modules/gnode'
import log from '../modules/logger'
import dbService from '@/db'
import CountryFlag from 'vue-country-flag'

import 'vue-awesome/icons'
import Icon from 'vue-awesome/components/Icon'

Vue.component('icon', Icon)
Vue.component('vue-country-flag', CountryFlag)

Vue.gnodeService = Vue.prototype.$gnodeService = gnodeService
Vue.remoteGnodeService = Vue.prototype.$remoteGnodeService = RemoteGnodeService

Vue.walletService = Vue.prototype.$walletService = walletService
Vue.dbService = Vue.prototype.$dbService = dbService
Vue.log = Vue.prototype.$log = log

import en from '../lang/en'
import zh from '../lang/zh'
import ru from '../lang/ru'
import es from '../lang/es'

Vue.use(VueI18n)


const messages = {
  en,
  ru,
  zh,
  es,
}

import {locale} from '../modules/config'
const i18n = new VueI18n({
  locale: locale,
  //locale: 'es',
  messages
})

remote.globalShortcut.register('CommandOrControl+Shift+K', () => {
  remote.BrowserWindow.getFocusedWindow().webContents.openDevTools()
})

window.addEventListener('beforeunload', () => {
  remote.globalShortcut.unregisterAll()
})

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.use(require('vue-moment'))
var VueTruncate = require('vue-truncate-filter')
Vue.use(VueTruncate)
//Vue.use(BootstrapVue);

Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  template: '<App/>',
  i18n
}).$mount('#app')

import { messageBus } from '@/messagebus'

ipcRenderer.on('before-quit', ()=>{
  log.debug('Render got msg is about to quit.')
  messageBus.$emit('quit')
  walletService.stopAll()
})