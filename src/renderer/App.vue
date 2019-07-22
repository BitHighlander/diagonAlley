<template>
  <div id="app" >

    <!-- LOGO -->
    <img id="logo" src="~@/assets/logo.png" alt="electron-vue" height="350" width="775">
    <!-- -->

    <div v-if="isWalletLocked">
      <!-- Unprotected -->
      <password :showModal="openPassword"></password>
      <welcome :showModal="openWelcome"></welcome>
      <Setup :showModal="openSetup"></Setup>
      <RestoreSeed :showModal="openRestoreSeed"></RestoreSeed>
      <Configuration :showModal="openConfiguration"></Configuration>
      <Register :showModal="openRegister"></Register>
    </div>

    <div v-else="isWalletLocked">
      <!-- Nav tabs -->
      <div class="tabs">
        <ul>
          <li v-bind:class="{ 'is-active': tabsel == 'wallet' }" @click="tabsel = 'wallet'"><a>wallet</a></li>
          <li v-bind:class="{ 'is-active': tabsel == 'transactions' }" @click="tabsel = 'Transactions'"><a>Transactions</a></li>
          <li v-bind:class="{ 'is-active': tabsel == 'chat' }" @click="tabsel = 'chat'"><a>The Leaky Cauldron</a></li>
          <!--        <li v-bind:class="{ 'is-active': tabsel == 'price' }" @click="tabsel = 'price'"><a>price</a></li>-->
          <li v-bind:class="{ 'is-active': tabsel == 'settings' }" @click="tabsel = 'settings'"><a>settings</a></li>
          <li v-bind:class="{ 'is-active': tabsel == 'help' }" @click="tabsel = 'help'"><a>help</a></li>
        </ul>
      </div>

      <!-- Tab panes -->
      <div class="content">
        <div v-show="tabsel == 'wallet'">

          <div class="tile is-ancestor">
            <div class="tile is-4 is-vertical is-parent">
              <div class="tile is-child box">
                <h3>Username:</h3> {{username}}
                <p class="is-size-7 tag animated" v-bind:class="{headShake: isAnimate}" style="animation-iteration-count:3">
                  {{ $t("msg.app.height") }}:{{height}}</p>

              </div>
              <div class="tile is-child box">
                <summary-info></summary-info>
              </div>
            </div>
            <div class="tile is-parent">
              <div class="tile is-child box">
                <send></send>

                <footer>
                  <div class="content has-text-right ">
                    <a class="button" @click="update">refesh</a>
                    <a class="button" @click="openCheck = true">re-check Balance</a>
                  </div>
                </footer>

              </div>
            </div>
          </div>


        </div>

        <div v-show="tabsel == 'Transactions'">
          <transaction v-bind:count_per_page="3"></transaction>
          <commit v-bind:count_per_page="3" v-bind:nodeHeight="height"></commit>
        </div>
        <div v-show="tabsel == 'chat'">

          <!--        <Chat></Chat>-->

          <div class="tile is-ancestor">
            <div class="tile is-4 is-vertical is-parent">
              <div class="tile is-child box">
                <h3>Usernames</h3>
                <ul class="list-group members-group">

                  <div class="list-group-item member-item justify-content-between bg-faded overflow: auto; height: 400"
                      v-for="(value, key) in members">
                    <div @click="selectUsername(value)">
                      <img v-bind:src="value.avatar" class="rounded-circle mr-1" >
                      <small> {{ value.username }}</small>
                    </div>
                  </div>
                </ul>

              </div>
            </div>
            <div class="tile is-parent">
              <div class="tile is-child box">
                <h3>Messages</h3>
                <div class="panel list-group">

                  <div v-for="message in messages">
                    {{message.username}}: {{message.message}}
                  </div>

                </div>

                <div class="content">
                  <!-- Content -->
                  <div class="input-group">
                    <input type="text" class="form-control" v-model="message"
                           v-on:keyup.enter="send" placeholder="Message text...">
                    <span class="input-group-btn">
                                <a class="button" @click="">submit</a>
                                </span>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>
        <div v-show="tabsel == 'settings'">

              <div class="control">
                <h1>signingPub</h1><input class="input" title="signingPub: " type="text" placeholder="Text input" v-model="signingPub">
                <h1>signingPriv</h1><input class="input" title="signingPriv: " type="password" placeholder="signingPub" v-model="signingPriv">
              </div>

              <a class="button" @click="openPassword = true">login</a>
              <a class="button" @click="openRegister = true">Register</a>
              <a class="button" @click="playChingle">chingle</a>
              <a class="button" @click="announce">announce</a>
              <a class="button" @click="openDisplaySeed = true">Display Seed</a>
              <!--        <Settings></Settings>-->



        </div>
        <div v-show="tabsel == 'help'">

          <webview id="foo" src="https://diagonalley.io/getting-started" style="display:inline-flex; width:940px; height:680px"></webview>

        </div>
      </div>

      <div class="section" v-if="ownerApiRunning">
        <!-- Protected -->
        <receive :showModal="openReceive"></receive>
        <http-receive :showModal="openHttpReceive"></http-receive>
        <file-send :showModal="openFileSend"></file-send>
        <finalize :showModal="openFinalize"></finalize>
        <hedwig-v1 :showModal="openHedwigV1"></hedwig-v1>
        <check :showModal="openCheck"></check>
        <lang :showModal="openLang"></lang>
        <gnode :showModal="openGnode"></gnode>
        <CheckPublic :showModal="openCheckPublic"></CheckPublic>
        <CheckPrivate :showModal="openCheckPrivate"></CheckPrivate>
        <DisplaySeed :showModal="openDisplaySeed"></DisplaySeed>

      </div>
    </div>



  </div>
</template>

<script>
  import { messageBus } from '@/messagebus'
  import mixin from '@/mixin'

  import SummaryInfo from '@/components/SummaryInfo'
  import Password from '@/components/Password'
  import Transaction from '@/components/Transaction'
  import Commit from '@/components/Commit'
  import Receive from '@/components/Receive'
  import Send from '@/components/Send'
  import HttpReceive from '@/components/HttpReceive'
  import FileSend from '@/components/FileSend'
  import Finalize from '@/components/Finalize'
  import HedwigV1 from '@/components/HedwigV1'
  import Check from '@/components/Check'
  import Lang from '@/components/Lang'
  import Gnode from '@/components/Gnode'
  import Landing from '@/components/Landing'
  //import Chat from '@/components/Chat'
  import Price from '@/components/Price'
  import Settings from '@/components/Settings'
  import Help from '@/components/Help'
  import CheckPrivate from '@/components/CheckPrivate'
  import CheckPublic from '@/components/CheckPublic'
  import Setup from '@/components/Setup'
  import Welcome from '@/components/Welcome'
  import DisplaySeed from '@/components/DisplaySeed'
  import RestoreSeed from '@/components/RestoreSeed'
  import Configuration from '@/components/Configuration'

  //modules
  import fs from 'fs'
  import wallet from '../modules/grin-wallet';
  import openSocket from 'socket.io-client';
  import checkUpdate from '../modules/updateChecker'
  import sound from '../modules/sound'
  import {downloadUrl, locale, gnodeOption, getConfig, setConfig, updateConfig, apiSecretPath,checkConfigs} from '../modules/config'
  import Register from "./components/Register";
  import service from "../modules/diagonService.js"
  import moment from 'moment';

  const {ipcRenderer} = require('electron')

  //sub to service
  //let domain = "http://127.0.0.1:3000"
  let domain
  if(process.env.NODE_ENV === "development"){
    domain = process.env.VUE_APP_SERVICE_HOSTNAME || "http://diagonalley.io"
    console.log("********* domain: ",domain)
  } else {
    domain = "http://diagonAlley.io"
  }
  const socket = openSocket(domain, {reconnect: true, rejectUnauthorized: false});

  export default {
    name: 'DiagonAlley',
    mixins: [mixin],
    components: {
      Configuration,
      RestoreSeed,
      DisplaySeed,
      Setup,
      Welcome,
      CheckPrivate,
      CheckPublic,
      Register,
      Password,
      SummaryInfo,
      Transaction,
      Commit,
      Receive,
      Send,
      HttpReceive,
      FileSend,
      Finalize,
      HedwigV1,
      Check,
      Landing,
      Lang,
      Gnode,
      //Chat, NERF context issues? I suck at coding
      Price,
      Settings,
      Help,
    },
    data(){
      return {
        freshWallet:false,
        needsRescan:false,
        isWalletLocked:true,
        socketId:"",
        message:"",
        online:[],
        members: [],
        messages: [],
        socketsStarted:false,
        username:'',
        signingPub:'',
        signingPriv:'',
        errors: [],
        amount: null,
        address: '',
        slateVersion: 0,
        sending: false,
        sent: false,
        tabsel: "wallet",
        openConfiguration: false,
        openDisplaySeed: false,
        openRestoreSeed: false,
        openWelcome: false,
        openCheckPublic: false,
        openSetup: false,
        openCheckPrivate: false,
        openRegister: false,
        openPassword: false,
        openReceive: false,
        openHttpReceive:false,
        openFileSend: false,
        openFinalize: false,
        openHedwigV1: false,
        openCheck: false,
        openLang:false,
        openGnode:false,
        isConfigured:false,
        isDroppingDown: false,
        isDroppingDown2: false,
        isDroppingDown3: false,
        ownerApiRunning: false,
        height:null,
        isAnimate:false,
        walletExist:false,
        hedwigRunning:false,
        hedwigFailed:false,
        isRu: false
    }},
    mounted() {

      /*
          Setup stages

          isRightVersion?

          do I have a grin wallet already?
            if not, setup(welcome componiant)

          verifyPassword
            else offer new wallet

          do I have a config file?
            Should always

          does config file have a username?
            else register



       */

      this.$log.info("checkpoint 1 mounted")

      this.checkNewVersion()
      this.$log.info("checkpoint 2 passed version check")

      //detect configs
      this.loadConfig()

      // if(this.$walletService.isExist()){
      //   this.$log.info("checkpoint 4 passed walletService check")
      //   this.walletExist = true
      //
      //   //is password missing?
      //   let password = this.$walletService.getPassword()
      //   if(!password){
      //     this.$log.info("checkpoint 5a password not found in service!")
      //     this.openPassword = true
      //   } else {
      //     this.$log.info("checkpoint 5b password FOUND in service!")
      //     this.password = password
      //   }
      //
      //   this.update()
      // }

      //do I have a username
    },
    created () {
      this.checkOwnerApi()

      if(locale==='ru'){
        this.isRu = true
      }
      messageBus.$on('selectLocale', (locale)=>{
        if(locale==='ru')this.isRu = true
        else{
          this.isRu = false
        }
      })

      messageBus.$on('selectTab', (tab)=>{
        this.tabsel = tab
      })

      messageBus.$on('close', (window)=>{
        if(window =='windowDisplaySeed'){
          this.openDisplaySeed = false
        }
        if(window =='windowConfiguration'){
          this.openConfiguration = false
        }
        if(window =='windowRestoreSeed'){
          this.openRestoreSeed = false
        }
        if(window =='windowPassword'){
          this.openPassword = false
        }
        if(window =='windowSetup'){
          this.openSetup = false
        }
        if(window =='windowWelcome'){
          this.openWelcome = false
        }
        if(window =='windowReceive'){
          this.openReceive = false
        }
        if(window =='windowRegister'){
          this.openRegister = false
        }
        if(window =='windowCheckPrivate'){
          this.openCheckPrivate = false
        }
        if(window =='windowCheckPrivate'){
          this.openCheckPublic = false
        }
        if(window =='windowFileSend'){
          this.openFileSend = false
        }
        if(window =='windowFinalize'){
          this.openFinalize = false
        }
        if(window =='windowHttpReceive'){
          this.openHttpReceive = false
        }
        if(window =='windowHedwigV1'){
          this.openHedwigV1 = false
        }
        if(window =='windowCheck'){
          this.openCheck = false
        }
        if(window =='windowLang'){
          this.openLang = false
        }
        if(window =='windowGnode'){
          this.openGnode = false
        }
      })

      messageBus.$on('open', (window)=>{
        if(window =='windowConfiguration'){
          this.openConfiguration = true
        }
        if(window =='windowDisplaySeed'){
          this.openDisplaySeed = true
        }
        if(window =='windowRestoreSeed'){
          this.openRestoreSeed = true
        }
        if(window =='windowPassword'){
          this.openPassword = true
        }
        if(window =='windowSetup'){
          this.openSetup = true
        }
        if(window =='windowWelcome'){
          this.openWelcome = true
        }
        if(window =='windowReceive'){
          this.openReceive = true
        }
        if(window =='windowRegister'){
          this.openRegister = true
        }
        if(window =='windowCheckPrivate'){
          this.openCheckPrivate = true
        }
        if(window =='windowCheckPrivate'){
          this.openCheckPublic = true
        }
        if(window =='windowFileSend'){
          this.openFileSend = true
        }
        if(window =='windowFinalize'){
          this.openFinalize = true
        }
        if(window =='windowHttpReceive'){
          this.openHttpReceive = true
        }
        if(window =='windowHedwigV1'){
          this.openHedwigV1 = true
        }
        if(window =='windowCheck'){
          this.openCheck = true
        }
        if(window =='windowLang'){
          this.openLang = true
        }
        if(window =='windowGnode'){
          this.openGnode = true
        }
      })

      messageBus.$on('walletCreated', ()=>{
        this.$log.info('walletCreated Success! ')
        this.freshWallet = true
      })

      messageBus.$on('registeredUsername', ()=>{
        this.$log.info('Register Success! ')
        let config = getConfig()
        this.username = config.username
      })

      messageBus.$on('restoredThenLogin', ()=>{
        this.$log.info('wallet restored and now to login')
        this.isWalletLocked = false
        this.loadConfig()
      })
      messageBus.$on('logined', ()=>{
        this.$log.info('app.vue got user logined event')
        this.$walletService.initClient()
        this.ownerApiRunning = true
        this.getHeight()

        this.isWalletLocked = false

        if(this.needsRescan && !this.freshWallet){
          this.openCheck = true
        }

        //check config
        //do I have a username
        this.loadConfig()
        this.announce()
        this.startSockets()

      })
      messageBus.$on('update', ()=>this.getHeight())
      messageBus.$on('walletCreateFinished', ()=>{
        this.openSetup = false
        this.$log.info('app.vue got walletCreateFinished event')
        this.walletExist = true
        this.openRegister = true
        this.loadConfig()
      })

      messageBus.$on('walletExisted', ()=>{
        this.$log.warn('Found walletExisted during init new one')
        this.walletExist = true
        this.loadConfig()
      })

      messageBus.$on('successRegister', ()=>{
        this.$log.warn('registration complete!')
        this.needsRescan = true
        this.openPassword = true
      })

      messageBus.$on('hedwigRunning', ()=>{
        this.hedwigRunning = true
        this.hedwigFailed = false
      })
      messageBus.$on('hedwigFailed', ()=>{
        this.hedwigRunning= false
        this.hedwigFailed = true
      })
      
    },
    watch: {
      isDroppingDown:function(newVal, oldVal){
        if(newVal){
          setTimeout(
            ()=>{
              this.isDroppingDown = false}, 
            5*1000)
        }
      },
      isDroppingDown2:function(newVal, oldVal){
        if(newVal){
          setTimeout(
            ()=>{
              this.isDroppingDown2 = false}, 
            5*1000)
        }
      },
      isDroppingDown3:function(newVal, oldVal){
        if(newVal){
          setTimeout(
            ()=>{
              this.isDroppingDown3 = false}, 
            5*1000)
        }
      },
      ownerApiRunning:function(newVal, old){
        if(newVal){
          ipcRenderer.send('resize', 800, 880)
          this.autoRefresh(60*2.5*1000)
        }else{
          ipcRenderer.send('resize', 600, 480)
        }
      }, 
      height:function(newVal, old){
        this.isAnimate = true
        setTimeout(()=>{this.isAnimate = false}, 1000)
      }
    },
    methods: {
      selectUsername:function(user){
        this.$log.info("selectUsername: ",user)
        messageBus.$emit('usernameSelected', user.username)
        this.tabsel = 'wallet'
      },
      loadConfig:function(){

        let configStatus = checkConfigs()
        let config = getConfig()
        this.$log.info("config: ",config)
        if(!configStatus.isConfigured){
          this.$log.info("checkpoint 3 No config found!")
          //open settings modal
          this.openWelcome = true
        } else {
          this.$log.info("checkpoint 3a config found!")
          //isRegistered?
          if(configStatus.isRegistered){
            this.$log.info("checkpoint 4a username found!")
            //startup
            //isPasswork
            let password = this.$walletService.getPassword()
            if(password){
              if(!this.username){
                this.username = config.username
              }
              if(!this.signingPub){
                this.signingPub = config.signingPub
              }
              if(!this.signingPriv){
                this.signingPriv = config.signingPriv
              }
              if(!this.signingPub || !this.signingPriv){
                this.openRegister = true
              }
            } else{
              this.openPassword = true
            }


          }else{
            //if wallet
            if(configStatus.isWallet){
              this.$log.info("checkpoint 4b no username found!")
              this.openRegister = true
            }else{
              this.openWelcome = true
            }
          }
        }


      },
      getUsers:function(){
        this.$http
                .get(domain+"/online")
                .then(response => {
                  this.$log.info("response: ", response.data)
                  this.$log.info("response: ", typeof(response.data))
                  let users = Object.keys(response.data)
                  this.$log.info("users: ", users)

                  //TODO remove yourself
                  let members = []
                  for(let i = 0; i < users.length; i++){
                    //
                    let member = {}
                    member.username = users[i]
                    member.avatar = "http://api.adorable.io/avatars/30/" + users[i] + '.png'
                    members.push(member)
                  }

                  this.online = users
                  this.members = members
                })
                .catch((e) => {
                  this.error = true;
                  this.error = e;
                });
      },
      displaySeed:function(){
        this.openDisplaySeed = true
      },
      update:function(){
        messageBus.$emit('update')
      },
      send: function () {
        this.$log.info('Checkpoint send message!')

        let message = {}
        message.username = this.username
        message.payload = this.message
        socket.emit('send', JSON.stringify(message));
        this.message = '';
      },
      formatMessageDate: function (date) {
        return moment(date).format("h:mm:ss a");
      },
      async announce(){
        //await this.get
        let joinEvent = {
          event:"announce",
          account:this.signingPub,
          username:this.username,
          status:"live",
          message:"user "+this.username+" is online! ready to accept payments."
        }
        let signature = await service.signMessage(this.signingPub, JSON.stringify(joinEvent),this.signingPriv)
        this.$log.info("signature: ",signature)
        joinEvent.signature = signature
        socket.emit('join',JSON.stringify(joinEvent))
      },
      async startSockets() {
        this.$log.info('Checkpoint starting sockets!')

        //start node
        if(this.username){
          this.getUsers()
          this.$log.info("CHECKPOINT 1 start sockets!")
          //PAYMENTS
          socket.on('payments', async function (message) {
            let tag = " | WALLET.VUE | " + " | payments | "
            try {

              console.log('orderUpdate: ', message)
              console.log('orderUpdate: ', typeof(message));
              if(typeof(message)==="string") message = JSON.parse(message)

              //chingle!
              sound.playChingle()

              //accept request to signs
              if(message.state === 'unsigned'){
                //TODO more validation

                //make post

                //get api key
                let apiKey = fs.readFileSync(apiSecretPath).toString()
                if(!apiKey) throw Error("102: unable to receive payment! grin not configured!")

                let url = "http://grin:"+apiKey+"@127.0.0.1:3420/v2/foreign"
                let response = await wallet.sendPostRequest(url,message.payload)
                console.log("response: ",typeof(response))

                let payload = {}
                payload.user = message.user
                payload.event = "PushToSender"
                payload.state = "signed"
                payload.payload = response

                //save to store
                //daemon.saveTx(payload)

                //emit it back
                socket.emit('payments', payload);

                alert('Grin Received! id: '+response.id)
                //store.set(response.id,response)

              }else{
                //ignore others
                //shouldnt normally hit?
                console.error(message)
                throw Error("101: unknown msg type")
              }
            } catch (e) {
              console.error(tag,"ERROR: ",e)
            }
          }.bind(this));

          socket.on('reconnect',async function(){
            this.announce()
            this.socketId = socket.id
          }.bind(this))

          /***************************************
           //CHAT
           //**************************************/
          socket.on('messages', function(message) {
            this.messages.push(message);
            //this.updateScroll()
          }.bind(this));
          socket.on('member_add', function(member) {
            //Vue.set(this.members, member.socket, member);
          }.bind(this));
          socket.on('member_delete', function(socket_id) {
            //Vue.delete(this.members, socket_id);
          }.bind(this));
          socket.on('message_history', function(messages) {
            console.log("messages: ",messages)
            this.messages = messages;
          }.bind(this));
          // socket.on('member_history', function(members) {
          //     this.members = members;
          // }.bind(this));

          this.socketsStarted = true
        } else {
          this.$log.error(" USERNAME NOT SET! can not start sockets!")
        }

      },
      lang(){
        this.$i18n.locale = 'en'
      },
      setRussian(){
        this.$i18n.locale = 'ru'
        this.isRu = true
        this.local = 'ru'
        updateConfig({local:'ru'})
      },
      setChinese(){
        this.$i18n.locale = 'zh'
      },
      setSpanish(){
        this.$i18n.locale = 'es'
      },
      checkConfig(){
        let configFile = getConfig()
        this.$log.debug('configFile: ',configFile)

        // if(!configFile){
        //   this.$log.debug('Checkpoint missing config file! ')
        //   this.openSetup = true
        //   return false
        // }else{
        //   this.$log.debug('Checkpoint found config file! ')
        //   this.isConfigured = true
        //   return true
        // }
      },
      playChingle(){
        sound.playChingle()
      },
      checkOwnerApi(){
        let ret = this.$walletService.getNodeHeight()
        if(!ret){return false}
        ret.then(
          (res) =>{
            this.ownerApiRunning = true
          }).catch((error)=>{
            this.ownerApiRunning = false
          })
      },
      getHeight(){
        this.$walletService.getNodeHeight().then(
          (res) =>{
            this.height = parseInt(res.data.result.Ok.height)
          }).catch((error)=>{
            this.$log.error(error)
          })
      },

      logout(){
        this.$log.debug('logout')
        ipcRenderer.send('quit')
      },
      
      autoRefresh(interval){
        setInterval(()=>{
          if(this.ownerApiRunning){
            messageBus.$emit('update')
          }
        }, interval)
      },
      
      async checkNewVersion(){
        let toUpdate = await checkUpdate()

        let message = this.$t('msg.app.available')+": "+toUpdate.latest+"\n"+this.$t('msg.app.current')+": "+toUpdate.current+"\n"+this.$t('msg.app.updateMsg')
        if(toUpdate && toUpdate.isUpdate){
          this.$electron.remote.dialog.showMessageBox({
            type: 'info',
            title: this.$t('msg.app.updateTitle'),
            buttons: [this.$t('msg.app.yes'), this.$t('msg.app.no')],
            message: message,
          }, (res, checkboxChecked) => {
          if (res === 0) { 
            this.$electron.shell.openExternal(downloadUrl)
            this.$log.debug('User choose to update. now quit app.')
            ipcRenderer.send('quit')
          }else{
            this.$log.info('User chose not to update.')
          }})
        }
      }
    },
  }
</script>

<style>
.icon-running{
  background: #00aa72;
  border-color: #e5f8f1;
}
.icon-failed{
  background: #D8000C;
  border-color: #FFBABA;
}
.icon-status{
  display: inline-block;
  -webkit-border-radius: 25px;
  -moz-border-radius: 25px;
  border-radius: 25px;
  height: 15px;
  width: 15px;
  border-width: 4px;
  border-style: solid;
  margin-right: 4px;
  vertical-align: top;
}
.button.is-small2 {
    border-radius: 2px;
    font-size: 0.675rem;
}
</style>