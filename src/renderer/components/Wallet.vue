<template>
    <div id="wrapper">

        <!--<b-modal ref="wallet713Selection" title="Select wallet713" ok-only @ok="closeModal" no-close-on-esc no-close-on-backdrop hide-header-close>-->
            <!--<p class="my-4">-->
            <!--<h3>-->

            <!--</h3>-->
            <!--<h5>{{errorMessage}}</h5>-->
        <!--</b-modal>-->

        <b-modal ref="password" title="Enter your wallets password" ok-only @ok="closeModal" no-close-on-esc no-close-on-backdrop hide-header-close>
            <p class="my-4">
            <form>
                <input id="n-password2" type="password" placeholder="Password" v-model=password>
            </form>
            <h5>{{errorMessage}}</h5>
        </b-modal>

        <b-modal ref="passwordCreate" title="create a password for your NEW wallet" ok-only @ok="initWallet" no-close-on-esc no-close-on-backdrop hide-header-close>
            <p class="my-4">
            <form>
                <input id="n-password3" type="password" placeholder="Password" v-model=password>
            </form>
            <br />
            <br />
            <h5>Or Restore Wallet from Seed!</h5>
            <b-btn @click="launchRestore">recover from mnemonic</b-btn>

            <h5>{{errorMessage}}</h5>
        </b-modal>

        <b-modal ref="startup" title="Starting GRIN node!" ok-only @ok="closeModal" no-close-on-esc no-close-on-backdrop hide-header-close>
            <p class="my-4">
            <div class="pixel-spinner">
                <div class="pixel-spinner-inner"></div>
            </div>
            <h4>logs: {{lastNodeMessage}}</h4>
        </b-modal>

        <b-modal ref="signup" title="Create new Username!" ok-only ok-inactive @ok="generateEnvFile" no-close-on-esc no-close-on-backdrop hide-header-close>
            <form>
                <div class="field">
                    <label class="label">Username</label>
                    <div class="control">
                        <input v-b-popover="'This username will allow others to send you payments!'"
                               :class="['input', ($v.form.username.$error) ? 'is-danger' : '']" type="text"
                               placeholder="Text input"
                               v-model="form.username">
                    </div>
                    <b-btn @click="generateUsername">Generate Username</b-btn>
                    <p v-if="$v.form.username.$error" class="help is-danger">This username is invalid</p>
                </div>
                {{errorMessage}}
            </form>
        </b-modal>

        <b-modal ref="restoreFromSeed" title="Restore Wallet!" ok-inactive @ok="restoreWallet" @cancel="closeModal" no-close-on-esc no-close-on-backdrop hide-header-close>
            <form>
                <div class="field">
                    <label class="label">Restore your wallet </label>
                    <b-row>
                        <b-col sm="10">
                            <b-form-textarea
                                    id="textarea-auto-height"
                                    rows="3"
                                    max-rows="8"
                                    placeholder="code present spot unable ... "
                                    v-model="inputSeed"
                            ></b-form-textarea>
                        </b-col>
                    </b-row>

                    <h6>Insert password for encrypting your NEW seed file</h6>
                    <form>
                        <input id="n-password4" type="password" placeholder="Password" v-model=password>
                    </form>

                    <!--<p v-if="$v.form.mnemonic.$error" class="help is-danger">This mnemonics is invalid!</p>-->
                </div>
                {{errorMessage}}
            </form>
        </b-modal>

        <b-modal ref="displaySeed" size="xl"  title="Backup your seed securely!" ok-only @ok="closeModal" no-close-on-esc no-close-on-backdrop hide-header-close>

            <div>

                <div v-if="wallet713Enabled">
                    <h6>Grinbox address: {{address}}</h6>
                </div>

                <div v-else>

                </div>

                <ol>
                    <li v-for="item in seed">
                        {{ item }}
                    </li>
                </ol>
                Please store this in a safe place! (Note: you will have access to the seed again inside the app.)
            </div>




        </b-modal>

        <b-modal ref="walletPrivateRunning" title="Starting GRIN node!" ok-only @ok="closeModal" no-close-on-esc no-close-on-backdrop hide-header-close>
            <p class="my-4">
            <h2>wallet Private API's not running</h2>
            <h2>attempting to start it!</h2>
            <div class="pixel-spinner">
                <div class="pixel-spinner-inner"></div>
            </div>

        </b-modal>

        <b-modal ref="walletPublicRunning" title="Starting GRIN node!" ok-only @ok="closeModal" no-close-on-esc no-close-on-backdrop hide-header-close>
            <p class="my-4">
            <h2>wallet public API's not running</h2>
            <h2>attempting to start it!</h2>
            <div class="pixel-spinner">
                <div class="pixel-spinner-inner"></div>
            </div>

        </b-modal>

        <b-modal ref="walletError" title="GRIN had an error" ok-only @ok="closeModal" no-close-on-esc no-close-on-backdrop hide-header-close>
            <p class="my-4">

            <h2> :( ... an error occurred. </h2>
            <h2>Error info: {{errorMessage}}</h2>
            <div class="pixel-spinner">
                <div class="pixel-spinner-inner"></div>
            </div>
            <h4>press ok to return to the app!</h4>
        </b-modal>

        <b-modal ref="sendTransactionConfirm" title="Confirm Sending GRIN!" ok-only @ok="sendTransaction" no-close-on-esc no-close-on-backdrop hide-header-close>
            <p class="my-4">
            <h4>destination: {{destination}}</h4>
            <br/>
            <h4>amount: {{amount}}</h4>
        </b-modal>

        <b-modal ref="sendTransactionResult" title="Attempting to send!" ok-only @ok="closeModal">
            <p class="my-4">

            <div class="pixel-spinner">
                <div class="pixel-spinner-inner"></div>
            </div>

            <h2>{{errorMessage}}</h2>
        </b-modal>


        <b-modal ref="receiveTransaction" title="You Got GRIN!" ok-only @ok="closeModal" no-close-on-esc no-close-on-backdrop hide-header-close>
            <p class="my-4">

            <h3>incoming TX: {{receiveId}}</h3>

            <div class="pixel-spinner">
                <div class="pixel-spinner-inner"></div>
            </div>

            <h2>{{errorMessage}}</h2>
        </b-modal>


        <b-modal  size="xl" ref="editConfigFileDiagon" title="Edit Config file!" ok-only @ok="saveConfigDiagon">

            <b-row class="my-1">
                <b-col sm="10">
                    <b-form-textarea id="input-large" size="lg" type="text" placeholder="Large Textarea" rows="30" v-model="configTextdiagon" />
                </b-col>
            </b-row>

        </b-modal>

        <b-modal  size="xl" ref="editConfigFileServer" title="Edit Config file!" ok-only @ok="saveConfigServer">

            <b-row class="my-1">
                <b-col sm="10">
                    <b-form-textarea id="input-large" size="lg" type="text" placeholder="Large Textarea" rows="30" v-model="configTextServer" />
                </b-col>
            </b-row>

        </b-modal>

        <b-modal  size="xl" ref="editConfigFileWallet" title="Edit Config file!" ok-only @ok="saveConfigWallet">

            <b-row class="my-1">
                <b-col sm="10">
                    <b-form-textarea id="input-large" size="lg" type="text" placeholder="Large Textarea" rows="30" v-model="configTextWallet" />
                </b-col>
            </b-row>

        </b-modal>

        <b-modal  size="xl" ref="editConfigFileWallet713" title="Edit Config file!" ok-only @ok="saveConfigWallet713">

            <b-row class="my-1">
                <b-col sm="10">
                    <b-form-textarea id="input-large" size="lg" type="text" placeholder="Large Textarea" rows="30" v-model="configTextWallet713" />
                </b-col>
            </b-row>

        </b-modal>

        <b-modal ref="rescanWallet" title="Rebuilding tx databse!" ok-only @ok="closeModal" no-close-on-esc no-close-on-backdrop hide-header-close>
            <p class="my-4">

            <h3>Rescaning! progress: {{rescanProgess}}</h3>

            <div v-if="!wallet713Enabled">
                <b-progress class="mt-2" :max="max" show-value>
                    <b-progress-bar :value="counter" variant="success" />
                </b-progress>
            </div>

            <div class="pixel-spinner">
                <div class="pixel-spinner-inner"></div>
            </div>
        </b-modal>

        <!-- LOGO -->
        <img id="logo" src="~@/assets/logo.png" alt="electron-vue">

        <!-- Primary wallet GUI -->
        <b-card no-body>
            <b-tabs card>
                <b-tab title="Wallet" active>

                    <b-row>
                        <b-col>
                            wallet713 {{wallet713Enabled}} <br/>
                            wallet v{{version}} <br/>
                            app v{{appVersion}} <br/>
                            inSync:{{inSync}}
                            <h6>height: {{height}} remote: {{remoteHeight}}</h6>
                            <h5>connections: {{peers}}</h5>
                            <h4>paymentURL: {{this.username}} </h4>
                            <button type="button" @click="doCopy">copy to clipboard!</button>
                            <h1>Balance: {{total}} </h1>
                            <h2>spendable {{spendable}}</h2>
                            <h2>locked {{locked}}</h2>
                            <h2>unconfirmed {{unconfirmed}}</h2>

                        </b-col>
                        <b-col>
                            <h2>Send (GRIN)</h2>
                            <b-form-group
                                    id="fieldset1"
                                    description=" https://diagonAlley.io/username* or http://ip:port of any GRIN node"
                                    label=" Enter your destination."
                                    label-for="input1"
                                    :invalid-feedback="invalidFeedback"
                                    :valid-feedback="validFeedback"
                                    :state="state"
                            >
                                <b-form-input id="input1" type="text" :state="state"
                                              v-model.trim="destination"></b-form-input>

                            </b-form-group>

                            <b-form-group
                                    id="fieldset1"
                                    description=" "
                                    label=" Enter your amount"
                                    label-for="input2"
                                    :invalid-feedback="invalidFeedback"
                                    :valid-feedback="validFeedback"
                                    :state="state"
                            >
                                <b-form-input id="input2" type="text" :state="state"
                                              v-model.trim="amount"></b-form-input>
                                <b-btn :disabled="!destination.length || !amount.length" @click="sendGrin"> SEND</b-btn>
                                <b-btn :disabled="!destination.length"  @click="sendAllGrin"> SEND ALL</b-btn>
                            </b-form-group>


                        </b-col>

                    </b-row>

                    <b-row>

                        <b-col>
                            <h2>Online Users: </h2>
                            <div v-for="user in online">
                                <b-card>
                                    User:
                                    <b-btn @click="setDestination(user)">{{ user }}</b-btn>
                                </b-card>
                            </div>
                        </b-col>
                        <b-col>

                            <div class="align-content-center">
                                <h2>ReScan Wallet inputs</h2>
                                <b-btn v-b-tooltip.hover title="Rescan Blockchain for ALL txs" @click="reScanWallet">scan</b-btn>
                                <b-btn v-b-tooltip.hover title="Force update content from API" @click="refresh">refresh</b-btn>
                                <b-btn v-b-tooltip.hover title="Broadcast Username to Diagon.io Service" @click="announce">announce</b-btn>
                            </div>

                        </b-col>

                    </b-row>


                </b-tab>

                <b-tab title="Transactions">

                    <div>


                        <b-container fluid>
                            <!-- User Interface controls -->
                            <b-row>
                                <b-col md="6" class="my-1">
                                    <b-form-group label-cols-sm="3" label="Filter" class="mb-0">
                                        <b-input-group>
                                            <b-form-input v-model="filter" placeholder="Type to Search" />
                                            <b-input-group-append>
                                                <b-button :disabled="!filter" @click="filter = ''">Clear</b-button>
                                            </b-input-group-append>
                                        </b-input-group>
                                    </b-form-group>
                                </b-col>

                                <b-col md="6" class="my-1">
                                    <b-form-group label-cols-sm="3" label="Sort" class="mb-0">
                                        <b-input-group>
                                            <b-form-select v-model="sortBy" :options="sortOptions">
                                                <option slot="tx_type" :value="null">-- none --</option>
                                            </b-form-select>
                                            <b-form-select :disabled="!sortBy" v-model="sortDesc" slot="append">
                                                <option :value="false">Asc</option> <option :value="true">Desc</option>
                                            </b-form-select>
                                        </b-input-group>
                                    </b-form-group>
                                </b-col>

                                <b-col md="6" class="my-1">
                                    <b-form-group label-cols-sm="3" label="Sort direction" class="mb-0">
                                        <b-input-group>
                                            <b-form-select v-model="sortDirection" slot="append">
                                                <option value="asc">Asc</option> <option value="desc">Desc</option>
                                                <option value="last">Last</option>
                                            </b-form-select>
                                        </b-input-group>
                                    </b-form-group>
                                </b-col>

                                <b-col md="6" class="my-1">
                                    <b-form-group label-cols-sm="3" label="Per page" class="mb-0">
                                        <b-form-select :options="pageOptions" v-model="perPage" />
                                    </b-form-group>
                                </b-col>
                            </b-row>

                            <!-- Main table element -->
                            <b-table
                                    show-empty
                                    stacked="md"
                                    :items="items"
                                    :fields="fields"
                                    :current-page="currentPage"
                                    :per-page="perPage"
                                    :filter="filter"
                                    :sort-by.sync="sortBy"
                                    :sort-desc.sync="sortDesc"
                                    :sort-direction="sortDirection"
                                    @filtered="onFiltered"
                            >
                                <!--<template slot="tx_type" slot-scope="row">-->
                                    <!--{{ row.tx_type }}-->
                                <!--</template>-->


                                <template slot="actions" slot-scope="row">
                                    <b-button size="sm" @click="info(row.item, row.index, $event.target)" class="mr-1">
                                        Info modal
                                    </b-button>
                                    <b-button size="sm" @click="row.toggleDetails">
                                        {{ row.detailsShowing ? 'Hide' : 'Show' }} Details
                                    </b-button>
                                </template>

                                <template slot="row-details" slot-scope="row">
                                    <b-card>
                                        <ul>
                                            <li v-for="(value, key) in row.item" :key="key">{{ key }}: {{ value }}</li>
                                        </ul>
                                    </b-card>
                                </template>
                            </b-table>

                            <b-row>
                                <b-col md="6" class="my-1">
                                    <b-pagination align="center"
                                            :total-rows="totalRows"
                                            :per-page="perPage"
                                            v-model="currentPage"
                                            class="my-0"
                                    />
                                </b-col>
                            </b-row>
                            <b-button align="right" variant="primary" @click="writeHistoryToFile">Write TX history to .csv </b-button>
                            <div class="mt-3" align="right">Current Page: {{ currentPage }} total txs: {{totalRows}}</div>
                            <!-- Info modal -->
                            <b-modal id="modalInfo" @hide="resetModal" :title="modalInfo.title" ok-only>
                                <pre>{{ modalInfo.content }}</pre>

                                <b-button align="right" variant="primary" @click="cancelTx">Cancel </b-button>
                                <b-button align="right" variant="primary" @click="postTx">Post </b-button>
                                <b-button align="right" variant="primary" @click="rePostTx">Re-Post </b-button>
                            </b-modal>
                        </b-container>

                    </div>
                    <b-btn @click="getTxHistory">refresh</b-btn>
                </b-tab>

                <b-tab title="The Leaky Cauldron">

                    <b-container class="bv-example-row">
                        <b-row class="text-center">
                            <b-col>
                                <ul class="list-group members-group">

                                    <li class="list-group-item member-item justify-content-between bg-faded"
                                        v-for="(value, key) in members">
                                        <img v-bind:src="value.avatar" class="rounded-circle mr-1">
                                        <small> {{ value.username }}</small>
                                    </li>
                                </ul>
                            </b-col>
                            <b-col cols="8">
                                <div class="pre-scrollable" id="MessageView">
                                    Messages
                                    <b-list-group>
                                        <b-list-group-item v-for="message in messages"
                                                           track-by="$index">
                                            <img v-bind:src="message.avatar" class="rounded-circle float-left mr-2" height="32" width="32"> {{
                                            message.message }}
                                            <small class="float-right">

                                                    {{ message.username }}
                                                 @
                                                    {{formatMessageDate(message.date) }}
                                            </small>
                                        </b-list-group-item>
                                    </b-list-group>

                                </div>
                                <div class="input-group">
                                    <input type="text" class="form-control" v-focus="true" v-model="message"
                                           v-on:keyup.enter="send" placeholder="Message text...">
                                    <span class="input-group-btn">
                                <b-btn class="btn btn-primary" type="button" @click="send">Send</b-btn>
                                </span>
                                </div>

                            </b-col>
                        </b-row>
                    </b-container>

                    <main class="col-sm-10 offset-sm-2 messages-main">

                    </main>


                </b-tab>

                <b-tab title="Price Charts">
                    <h2>Price: {{Math.round(this.grinPrice.priceUsd * 100) / 100}} (USD)</h2>
                    <h3>MarketCap: {{(Math.round(this.grinPrice.marketCapUsd * 100) /
                        100).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}}(USD)</h3>
                    <h3>24H volume: {{(Math.round(grinPrice.volumeUsd24Hr * 100) /
                        100).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}}(USD)</h3>
                    <h3>24 hour percent change: {{Math.round(grinPrice.changePercent24Hr* 100) / 100}}</h3>
                    <br/>
                    Source https://coincap.io/assets/grin

                    <!--<div id="chart">-->
                        <!--<apexchart ref="realtimeChart" type=line height=350 :options="chartOptions" :series="series"/>-->
                    <!--</div>-->

                </b-tab>

                <b-tab title="Settings">


                    <b-container class="bv-example-row">
                        <b-row>
                            <b-col>
                                <h3>Recovery</h3>
                                <b-btn  variant="primary" @click="displaySeed">Display seed</b-btn>
                                <br />
                                <br />
                                <!--<b-btn  variant="outline-primary" @click="testChingle">view file</b-btn>-->
                                <!--<b-btn  variant="outline-danger" @click="testChingle">Delete</b-btn>-->
                                <!--<b-btn  variant="outline-warning" @click="testChingle">Generate</b-btn>-->
                                <br />
                                <br />
                                <h4>Edit Config Files</h4>

                                <b-button variant="outline-primary" @click="openServerConfig">edit grin-server.toml</b-button>
                                <b-button variant="outline-info" @click="saveConfigServer">generate</b-button>
                                <br />
                                <b-button variant="outline-primary" @click="openWalletConfig">edit grin-wallet.toml</b-button>
                                <b-button variant="outline-info" @click="saveConfigWallet">generate</b-button>
                                <br />
                                <b-button variant="outline-primary" @click="openWallet713Config">edit wallet713.toml</b-button>
                                <b-button variant="outline-info" @click="saveConfigWallet713">generate</b-button>
                                <br />
                                <b-button variant="outline-primary" @click="openDiagonConfig">edit diagonAlley.json</b-button>
                                <b-button variant="outline-info" @click="saveConfigDiagon">generate</b-button>
                                <br />
                                <h2>Select Node:</h2>
                                <b-dropdown id="ddown1" text="Select Node" class="m-md-2">
                                    <b-dropdown-item>Run Full Node locally</b-dropdown-item>
                                    <b-dropdown-divider />
                                    <b-dropdown-item active>Use wallet713 node</b-dropdown-item>
                                    <b-dropdown-item disabled>Use DiagonAlley.io</b-dropdown-item>
                                    <b-dropdown-item>Point To Remote</b-dropdown-item>
                                </b-dropdown>
                                <br />

                                <h2>Select Wallet</h2>
                                <b-dropdown id="ddown1" text="Select Wallet" class="m-md-2">
                                    <b-dropdown-item disabled>use vault713</b-dropdown-item>
                                    <b-dropdown-item active>Use Core Wallet</b-dropdown-item>
                                </b-dropdown>
                                <br />
                            </b-col>
                            <b-col>

                                <h2> DiagonAlley.io info: </h2>
                                User: {{this.username}}
                                <br/>
                                socketId:{{socketId}}
                                <br/>
                                online:{{online}}
                                <br/>
                                <br/>

                                <h2>info: </h2>
                                version: {{version}}
                                <br />
                                platform:  {{platform}}
                                <br />
                                height: {{height}}
                                <br/>
                                Balance: {{total}}
                                <br/>
                                spendable {{spendable}}
                                <br/>
                                locked {{locked}}
                                <br/>
                                unconfirmed {{unconfirmed}}

                                <h3>Debug tasks</h3>
                                <b-button variant="outline-primary" @click="deleteChainData">Delete ALL chain data</b-button>
                                <br />
                                <b-button variant="outline-primary" @click="deleteWalletConfigs">Delete ALL configs</b-button>
                                <br />
                                <b-button variant="outline-primary" @click="restartNode">restart node</b-button>
                                <br />
                                <b-button variant="outline-primary" @click="testChingle">Test chingle</b-button>

                            </b-col>
                        </b-row>


                        <b-row>
                            <b-col>

                            </b-col>
                            <b-col>

                            </b-col>
                        </b-row>

                    </b-container>

                </b-tab>


                <div v-if="wallet713Enabled">
                    <b-tab title="Contacts">

                        <h2>Contacts</h2>
                        <h3>Create New Contact</h3>
                        <h3>edit Contact</h3>
                        <h3>Delete Contact</h3>
                    </b-tab>
                </div>




                <b-tab title="Help">

                    <webview id="foo" src="https://diagonalley.io/getting-started" style="display:inline-flex; width:840px; height:680px"></webview>

                </b-tab>



            </b-tabs>
        </b-card>

    </div>
</template>

<script>

    import {validationMixin} from 'vuelidate';
    import daemon from '../modules/grin-daemon.js';
    import client from '../modules/grin-client';
    import wallet from '../modules/grin-wallet';
    import coincap from '../modules/coincap';
    import VueApexCharts from 'vue-apexcharts'
    import 'bootstrap/dist/css/bootstrap.css'
    import 'bootstrap-vue/dist/bootstrap-vue.css'

    import {VMoney} from 'v-money'
    import service from "../modules/diagonService.js"
    import btcTools from "../modules/btc-tools.js"


    //start leaky
    import openSocket from 'socket.io-client';
    import {VueFocus} from 'vue-focus';
    import moment from 'moment';
    var bcrypt = require('bcryptjs');
    const Store = require('electron-store');
    const store = new Store();
    const {app} = require('electron').remote

    let domain
    if(process.env.NODE_ENV === "development"){
        domain = process.env.VUE_APP_SERVICE_HOSTNAME || "http://diagonalley.io"
        console.log("********* domain: ",domain)
    } else {
        domain = "http://diagonAlley.io"
    }

    const socket = openSocket(domain, {reconnect: true, rejectUnauthorized: false});
    const harryPotterNames = require('harry-potter-names')

    let is713Eligible = false

    //const
    const GRIN_ATOMIC = 1000000000
    var lastDate = 0;
    var data = []
    const TAG = " | WALLET.VUE | "
    function getDayWiseTimeSeries(baseval, count, yrange) {
        var i = 0;
        while (i < count) {
            var x = baseval;
            var y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

            data.push({
                x,
                y
            });
            lastDate = baseval
            baseval += 86400000;
            i++;
        }
    }

    getDayWiseTimeSeries(new Date('11 Feb 2017 GMT').getTime(), 10, {
        min: 10,
        max: 90
    })

    function getNewSeries(baseval, yrange) {
        var newDate = baseval + 86400000;
        lastDate = newDate
        data.push({
            x: newDate,
            y: Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min
        })
    }

    function resetData() {
        data = data.slice(data.length - 10, data.length);
    }
    const items = []
    export default {
        name: 'Wallet',
        mixins: [validationMixin],
        validations: {
            form: {
                username: {},
	            mnemonic: {}
            }
        },
        directives: {focus: focus},
        components: {
            ['apexchart']: VueApexCharts,
        },
        data() {
            return {
            	appVersion:app.getVersion(),
	            walletIPC:'',
            	walletversion:'',
                version:"",
                receiveId:"",
                items:items,
                fields: [
                    { key: 'time', label: 'first seen', sortable: true, class: 'text-center' },
	                { key: 'amount', label: 'amount', sortable: true, class: 'text-center' },
                    { key: 'tx_type', label: 'tx_type', sortable: true, class: 'text-center', sortDirection: 'desc' },
                    { key: 'confirmed', label: 'confirmed', sortable: true, class: 'text-center' },
                    { key: 'tx_slate_id', label: 'tx_slate_id', sortable: true, class: 'text-center' },
                    { key: 'actions', label: 'Actions' }
                ],
	            isListening:false,
	            inputSeed:'',
                counter: 0,
                firstStart:true,
                max: 100,
                currentPage: 1,
                perPage: 5,
                remoteHeight:"loading...",
                configTextDiagon:'loading...',
                configTextServer:'loading...',
                configTextWallet:'loading...',
                configTextWallet713:'loading...',
                totalRows: items.length,
                rescanProgess:'starting...',
                pageOptions: [5, 10, 15,20,50,100],
                sortBy: null,
                registerSuccess:false,
                sortDesc: false,
                socketsStarted:false,
                sortDirection: 'asc',
                filter: null,
                modalInfo: { title: '', content: '' },
                selectMode: 'single',
                selected: [{tx_slate_id:null}],
                txInfo:'',
                address:'',
                result: '...',
                lastNodeMessage:"loading.....",
                errorMessage:"",
                lastNodeError:"",
                inSync:false,
                socketId:"",
                lastNodeExit:"",
                error:"",
                peers: "",
                height: "",
                password: '',
                wallet713Enabled:is713Eligible,
                configuredLocalNode:false,
                platform:process.env.platform,
                isPasswordSet: false,
                isPasswordValid: false,
                setupState: 0,
                usernameRegisterd: false,
                apiKey: '',
                attemptedStartup: false,
                nodeStatus: "loading...",
                publicStatus: "loading...",
                privateStatus: "loading...",
                configTextdiagon:"loading...",
                form: {
                    username: '',
	                mnemonic: '',
                },
                seed: [],
                balance: "loading...",
                spendable: "loading...",
                locked: "loading...",
                username: "",
                unconfirmed: "loading...",
                total: "loading...",
                destination: '',
                confirmedSeed: false,
                displayedSeed: false,
                amount: '',
                state: '',
                online: [],
                validFeedback: 'false',
                invalidFeedback: 'true',
                refreshIntervial: '',
                message: '',
                messages: [],
                members: {},
                grinPrice: '',
                series: [{
                    data: data.slice()
                }],
                chartOptions: {
                    chart: {
                        animations: {
                            enabled: true,
                            easing: 'linear',
                            dynamicAnimation: {
                                speed: 2000
                            }
                        },
                        toolbar: {
                            show: false
                        },
                        zoom: {
                            enabled: false
                        }
                    },
                    dataLabels: {
                        enabled: false
                    },
                    stroke: {
                        curve: 'smooth'
                    },

                    title: {
                        text: 'Dynamic Updating Chart',
                        align: 'left'
                    },
                    markers: {
                        size: 0
                    },
                    xaxis: {
                        type: 'datetime',
                        range: 777600000,
                    },
                    yaxis: {
                        max: 100
                    },
                    legend: {
                        show: false
                    }
                }
            }
        },
        updated(){
            var container = this.$el.querySelector("#MessageView");
            container.scrollTop = container.scrollHeight;
        },
        computed: {
            sortOptions() {
                // Create an options list from our fields
                return this.fields
                    .filter(f => f.sortable)
                    .map(f => {
                        return { text: f.label, value: f.key }
                    })
            }
        },
        methods: {
            async closeModal() {
                let tag = " | closeModal | "
                this.isPasswordSet = true
                this.error = ''
                this.amount = ''
                this.destination = ''
                //this.$modal.hide('password');
                //does config file exist?
                let isValid = false
                let detectDiagonConfig = await daemon.detectDiagonConfig()
                if(detectDiagonConfig){
                    this.$log.info("CHECKPOINT1a: found diagon config!")
                    //TODO validate file
                    //if invalid fix

                    //read and check password
                    let configInfo = await daemon.readEnv()
                    let configHash = configInfo.hash
                    this.username = configInfo.username
	                if(!configInfo.apiKey) this.apiKey = await daemon.getApiKey()
                    this.apiKey = configInfo.apiKey

                    this.signingPub = configInfo.signingPub
                    this.signingPriv = configInfo.signingPriv
                    if(this.wallet713Enabled){
                    	this.address = configInfo.address
                    }
                    this.$log.debug("configHash: ",configHash)
                    isValid = bcrypt.compareSync(this.password, configHash);
                } else {
                    this.$log.info("CHECKPOINT1b: New password (no diagon config found)!")
                    //New Password

                    //verify there are config files


                    //if there is a seed
                    //TODO verify pw is really for seed

                    //launch username modal
		            this.$refs.signup.show()
                    return false
                }

                if(isValid){
                    this.$log.info("CHECKPOINT2a: password validated!")
                    this.$refs.password.hide()

                    //dont show signup
                    this.$refs.signup.hide()

                    let nodeStatus
                    if (!this.apiKey) {
                        this.$log.info("CHECKPOINT3a: no api key found!")
                        let apiKey = await daemon.getApiKey()
                        this.$log.debug("apiKey: ", apiKey)
                        this.apiKey = apiKey
                    } else {
                        this.$log.info("CHECKPOINT3b: api key found!")
                        nodeStatus = await client.getChainInfo(this.apiKey)
                        this.version = nodeStatus.user_agent
                        this.height = nodeStatus.tip.height
                    }

                    let detectServerConfig = await daemon.detectServerConfig()
                    let detectWalletConfig = await daemon.detectWalletConfig()
                    if (!detectServerConfig) {
                            await daemon.writeConfigFileServer(this.apiKey)
                    }
                    if(!detectWalletConfig){
                            await daemon.writeConfigFileWallet(this.apiKey)
                    }

                    if (this.configuredLocalNode) {
                        this.$log.info("CHECKPOINT4a: configured to run full node!!")
                        this.$log.debug("Node not running!: ", nodeStatus)
                        this.$refs.startup.show()

                        if (!this.attemptedStartup) {
                            this.$log.debug("Node not running! attempting startup ")

                            //check tui NOTE: this prevents linux crashing/memory leak
                            let isTuiOn = await daemon.detectTuiOn()
                            if (!isTuiOn) {
                                let daemonRunning = daemon.startDaemon()

                                // daemonRunning.stdout.on('data', function (data) {
                                //     //this.$log.info('****  stdout: ' + data);
                                //     //let logMessage = 'stdout: ' + data
                                //     this.$log.info('DAEMON:DEBUG stdout ****' ,logMessage.toString());
                                //     //this.lastNodeMessage = logMessage.toString()
                                // });
                                // daemonRunning.stderr.on('data', function (data) {
                                //     this.$log.info('DAEMON:ERROR stderr: ' + data);
                                //     //Here is where the error output goes
                                //     //this.lastNodeError = 'stderr: ' + data
                                //     //throw error modal
                                //     //this.errorMessage = 'stderr: ' + data
                                //     //this.$refs.walletError.show()
                                // });
                                // daemonRunning.on('close', function (code) {
                                //     this.$log.info('closing code: ' + code);
                                //     //Here you can get the exit code of the script
                                //     this.lastNodeExit = code.toString()
                                // });

                                //check toml file for tui off (NOTE: memory leak on linux letting tui run!!!)
                                this.attemptedStartup = true
                            } else {
                                await daemon.turnOffTui()
                                //
                                let isTuiOn = await daemon.detectTuiOn()
                                if (!isTuiOn) {
                                    daemon.startDaemon()
                                    this.closeModal()
                                } else {
                                    console.error("ERROR: 666: can not start (can not write config)")
                                }
                            }
                        }
                        this.refresh()
                        setTimeout(this.closeModal, 5000)
                    } else {
                        this.$log.info("CHECKPOINT4b: Light mode!")
                        //checkpoint step2
                        this.$refs.startup.hide()


	                    this.$log.info("apiKey: ",this.apiKey)

                        //is wallet running?
                        let walletInfo = await wallet.getWalletInfo(this.apiKey)
                        let acceptingPayments = await daemon.validate_address("http://127.0.0.1:3415/v1/wallet/foreign/receive_tx")
                        if(this.firstStart) acceptingPayments = false
                        this.$log.info(tag, "***** acceptingPayments: ", acceptingPayments)
                        this.$log.info(tag, "walletInfo: ", walletInfo)
                        if (!walletInfo.minimum_confirmations) {
                            this.$log.info("CHECKPOINT5a: private wallet not running!")
                            this.$refs.walletPrivateRunning.show()

                            //this.startWalletPoorMansIpc()
                            // // cant wait on this (never exits intentially)
	                        daemon.startWalletPrivate(this.password)
                            //let success = await daemon.startWalletPrivate(this.password)
                            // this.$log.info("Result attempted wallet startup: ", success)
                            //
                            // //compair address
                            // if(this.address === success.address){
                            // 	//checkpoint verfied address
	                         //    this.$log.info("CHECKPOINT6a: Verified address with startup!!")
                            // } else {
	                         //    this.$log.info("CHECKPOINT6b: Detected change in address!")
	                         //    this.$log.info(tag, "address diagon.config: ", this.address)
	                         //    this.$log.info(tag, "address daemon: ", success.address)
                            //
                            //     //Prefure daemon always
                            //     this.address = success.address
                            //
                            //     //change config file
                            //
                            // 	//modal (changed wallets?)
                            //
                            //     //if true do update .json
                            //     //start rescan of wallet
                            // }

                            //TODO keep this daemon around and force stop on exit?
                            // let grinDaemon = daemon.startWalletPrivate(this.password)

                            //
                            // grinDaemon.stdout.on('data', function (data) {
		                     //    let payload = data.toString()
		                     //    this.$log.info(tag, 'stdout: ' + payload)
                            // })
                            //
                            // grinDaemon.stderr.on('data', function (data) {
		                     //    let payload = data.toString()
		                     //    this.$log.info(tag, 'stderr: ' + payload)
                            // })
                            //
                            // grinDaemon.on('exit', function (code) {
		                     //    this.$log.info(tag, 'child process exited with code ' + code)
                            // })

                            //refresh
                            this.refresh()
                            setTimeout(this.closeModal, 5000)
                        } else if (!acceptingPayments) {
                            this.firstStart = false
                            this.$log.info("CHECKPOINT5c: public wallet not running!")
                            this.$refs.walletPrivateRunning.hide()
                            this.$refs.walletPublicRunning.show()
                            daemon.startWalletPublic(this.password)
                            this.refresh()
                            setTimeout(this.closeModal, 5000)
                        } else {
                            this.$log.info("CHECKPOINT5d: FINISH!")
                            //checkpoint finished!
                            this.announce()
                            this.refresh()
                            this.$refs.walletPublicRunning.hide()
                            this.$refs.walletPrivateRunning.hide()
                            if(!this.socketsStarted)this.startSockets()
                        }
                    }

                }else{
                    this.$log.info("CHECKPOINT2b: password validated!")
                    //checkpoint invalid pw
                    this.errorMessage = "invalid password"
                    this.$refs.password.show()
                }


            },
            async initWallet(){
            	let tag = " | initWallet | "
                this.$refs.displaySeed.show()
                this.$log.debug("No Wallet found! ")

	            if(!this.apiKey) this.apiKey = await daemon.getApiKey()
	            this.$log.debug(tag,"apiKey: ",this.apiKey)

                let detectServerConfig = await daemon.detectServerConfig()
                let detectWalletConfig = await daemon.detectWalletConfig()

                if (!detectServerConfig) {
                    await daemon.writeConfigFileServer(this.apiKey)
                }

                if(!detectWalletConfig){
                    await daemon.writeConfigFileWallet(this.apiKey)
                }

                let newSeed = await daemon.initWallet(this.password)

                if(this.wallet713Enabled){
                	this.address = newSeed.address
                }

	            if(newSeed.seed){
		            this.seed = newSeed.seed
		            this.$log.debug("seed: ", this.seed)
		            this.displayedSeed = true

	            }else{
		            this.errorMessage = " Failed to initialize wallet! This is a fatal error! error:"+JSON.stringify(newSeed)
		            this.$refs.walletError.show()
	            }
            },
            info(item, index, button) {
                this.selected = item
                this.modalInfo.title = `Row index: ${index}`
                this.modalInfo.content = JSON.stringify(item, null, 2)
                this.$root.$emit('bv::show::modal', 'modalInfo', button)
            },
	        launchRestore(){
		        this.$refs.passwordCreate.hide()
		        this.$refs.restoreFromSeed.show()
            },
            async openDiagonConfig() {
                //get server file
                let fileInfo = await daemon.readEnv()
                //set to content
                this.configTextdiagon =  fileInfo
                this.$refs.editConfigFileDiagon.show()
            },
            async openServerConfig() {
                //get server file
                let fileInfo = await daemon.readServerConfig()
                //set to content
                this.configTextServer =  fileInfo
                this.$refs.editConfigFileServer.show()
            },
            async openWalletConfig() {
                //get server file
                let fileInfo = await daemon.readWalletConfig()
                //set to content
                this.configTextWallet =  fileInfo
                this.$refs.editConfigFileWallet.show()
            },
            async openWallet713Config() {
                //get server file
                let fileInfo = await daemon.readWallet713Config()
                //set to content
                this.configTextWallet713 =  fileInfo
                this.$refs.editConfigFileWallet713.show()
            },
            async createDiagonConfig() {
                //get server file
            },
            async createServerConfig() {
                //get server file
	            if(!this.apiKey) this.apiKey = await daemon.getApiKey()
                daemon.writeConfigFileServer(this.apiKey)
            },
            async createWalletConfig() {
                //get server file
                daemon.writeConfigFileWallet()
            },
            async createWallet713Config() {
                //get server file
	            if(!this.apiKey) this.apiKey = await daemon.getApiKey()
                daemon.writeConfigFileWallet713(this.apiKey)
            },
            async saveConfigDiagon() {
                //TODO write to file from global object
                //get server file
                let fileInfo = await daemon.readEnv()
                //set to content
                this.configText =  fileInfo
            },
            async saveConfigServer() {
                //get server file
                let fileInfo = await daemon.readEnv()
                //set to content
                this.configText =  fileInfo
            },
            async saveConfigWallet() {
                //get server file
                let fileInfo = await daemon.readEnv()
                //set to content
                this.configText =  fileInfo
            },
            async saveConfigWallet713() {
                //get server file
                let fileInfo = await daemon.readEnv()
                //set to content
                this.configText =  JSON.stringify(fileInfo)
            },
            writeHistoryToFile() {
                //get history

                //write to file
                daemon.writeHistoryToFile(this.items)
                alert("SUCCESS: wallethistory.csv written to $HOME/.grin directory")
            },
            resetModal() {
                this.modalInfo.title = ''
                this.modalInfo.content = ''
            },
            onFiltered(filteredItems) {
                // Trigger pagination to update the number of buttons/pages due to filtering
                this.totalRows = filteredItems.length
                this.currentPage = 1
            },
            async saveTx(txid,tx){
                store.set(txid, tx);
            },
            async getTx(){
                let txInfo = await store.get(this.selected[0].tx_slate_id)
                this.txInfo = txInfo
            },
            async getAllTx(){

            },
            async deleteTx(){
                store.delete('unicorn');
            },
            rowSelected(items) {
                this.selected = items
                this.getTx()
            },
            async cancelTx(){
                let result = await wallet.cancelTx(this.apiKey,this.selected.tx_slate_id)
                this.result = result
                this.getTxHistory()
            },
            async rePostTx(){
                let result = await wallet.rePostTx(this.apiKey,this.selected.tx_slate_id)
                this.result = result
            },
            async postTx(){
                this.$log.info("selected: ",this.selected)
                this.$log.info("0selected: ",this.selected.slate)
                let result = await wallet.postTx(this.apiKey,this.selected.slate)
                this.result = result
            },
            formatTime(date){
                let dd = date.getDate();
                let mm = date.getMonth()+1;
                let yyyy = date.getFullYear();
                if(dd<10) {dd='0'+dd;}
                if(mm<10) {mm='0'+mm;}
                var hours = date.getHours();
                var minutes = date.getMinutes();
                var ampm = hours >= 12 ? 'pm' : 'am';
                hours = hours % 12;
                hours = hours ? hours : 12; // the hour '0' should be '12'
                minutes = minutes < 10 ? '0'+minutes : minutes;
                var strTime = hours + ':' + minutes + ' ' + ampm;
                return '('+strTime+') '+mm+'-'+dd+'-'+yyyy;
            },
            async getTxHistory() {



                let apiKey = await daemon.getApiKey()
                this.apiKey = apiKey
                let txHistory = await wallet.getTransactions(this.apiKey)
                this.$log.info("TX HISTORY: ",txHistory)

                //iterate over each
                let output = []
                for(let i = 0; i < txHistory.length; i++){
                    let txInfo = txHistory[i]

	                let txExtended
                    if(txInfo.tx_slate_id){
	                    txExtended = store.get(txInfo.tx_slate_id)
                    } else {
	                    txExtended = store.get("RestoredWithoutSlateId:"+txInfo.id)
                    }
                    if(txExtended){
                    	this.$log.info(" Found stored data on transaction! ")
	                    txInfo.extended = true
                    	txInfo.amount = txExtended.amount
                        txInfo.address = txExtended.address
                        txInfo.slate = txExtended.slate
                        let date = new Date(txExtended.time)
                        date = this.formatTime(date)
                        txInfo.time = date
                    }else{
	                    this.$log.info(" NO stored data on transaction found! ")
                        //fill in gaps
                        //save time at first seen
                        let timeFirstSeen = new Date().getTime()
                        if(!txInfo.tx_slate_id){
	                        txInfo.tx_slate_id = "RestoredWithoutSlateId:"+txInfo.id
                        }
                        let amount = txInfo.amount_credited - txInfo.amount_debited
                        store.set(txInfo.tx_slate_id,{time:timeFirstSeen,amount})
                    }
                    output.push(txInfo)
                }
                this.totalRows=output.length
                this.items = output

            },
            doCopy: function () {
                this.$copyText("https://diagonalley.io/"+this.username).then(function (e) {
                    alert('Copied')
                    this.$log.info(e)
                }, function (e) {
                    alert('Can not copy')
                    this.$log.info(e)
                })
            },
            updateScroll: function () {
                var container = this.$el.querySelector("#MessageView");
                container.scrollTop = container.scrollHeight;
            },
            testChingle: function () {
                daemon.playChingle()
            },
            deleteChainData: function () {
                    daemon.deleteChainData()
            },
            deleteWalletConfigs: function () {
                daemon.deleteWalletConfigs()
            },
            restartNode: function () {
                this.attemptedStartup = false
                this.closeModal()
            },
            open(link) {
                this.$electron.shell.openExternal(link)
            },
            send: function () {

                let message = {}
                message.username = this.username
                message.payload = this.message
                socket.emit('send', JSON.stringify(message));
                this.message = '';
            },
            formatMemberDate: function (date) {
                return moment(date).format("h:mm:ss a");
            },
            formatMessageDate: function (date) {
                return moment(date).format("h:mm:ss a");
            },
	        async startWalletPoorMansIpc(){

		        //walletIPC
		        let walletIPC = await daemon.startWalletPrivate(this.password)

		        let output = {}
		        output.success = false

		        walletIPC.stdout.on('data', function (data) {
			        let payload = data.toString()
			        console.log('stdout: ' + payload)
		        })

		        walletIPC.stderr.on('data', function (data) {
			        let payload = data.toString()
			        console.log('stderr: ' + payload)
		        })

		        walletIPC.on('exit', function (code) {
			        console.log('child process exited with code ' + code.toString())
		        })

                this.walletIPC = walletIPC
	        },
            async sendGrin() {

                this.$log.info("SEND GRIN PRESSED")
                //validate Address
	            let isValid
                if(this.wallet713Enabled){
	                isValid = true //TODO validate grinbox
                }else{
	                isValid = await daemon.validate_address(this.destination)
                }
                if(isValid){
                    this.errorMessage = "approve tx..."
                    this.$refs.sendTransactionConfirm.show()
                }else{
                    this.errorMessage = " Invalid Destination! "+this.destination
                    this.$refs.walletError.show()
                }

            },
	        async sendAllGrin() {

		        this.$log.info("SEND ALL GRIN PRESSED")

                //get balance
                let balance = this.spendable

                let fee = 0.008
                if(balance < fee){
		        	//too little to spend
                    alert(" Your spendable balance is less than the network fee: "+fee)
                }else {
		        	this.amount = balance - fee
	                //validate Address
	                let isValid = await daemon.validate_address(this.destination)

	                if(this.wallet713Enabled){
		                isValid = true //TODO validate grinbox
	                }else{
		                isValid = await daemon.validate_address(this.destination)
	                }

	                if(isValid){
		                this.errorMessage = "approve tx..."
		                this.$refs.sendTransactionConfirm.show()
	                }else{
		                this.errorMessage = " Invalid Destination! "+this.destination
		                this.$refs.walletError.show()
	                }
                }
	        },
            async sendTransaction() {
                this.$refs.sendTransactionConfirm.hide()
                this.errorMessage = "building tx...."
                this.$refs.sendTransactionResult.show()

                this.$log.info(this.destination)
                this.$log.info(this.amount)

                //Poor Man IPC
                //
	            //this.walletIPC.stdin.write("send "+amount+" --to "+dest)

                //TODO need to use API to collect rawTx!! (issues with postTx)
                let result = await daemon.sendGrin(this.password, this.destination, this.amount)
                //let result = await wallet.sendToAddress(this.apiKey,this.destination,this.amount)
                this.$log.info("SEND ***** ", result)
                this.errorMessage = result
            },
            async setDestination(name) {
                this.destination = "https://diagonalley.io/" + name
            },
            async refresh() {
                this.$log.info("I feel refreshed")
                this.getTxHistory()
                //this.$log.info(this.amount)
                let resp = await client.getChainInfo(this.apiKey)
                this.$log.info("resp: ",resp)
                this.version = resp.user_agent
                this.height = resp.tip.height

                let resp2 = await wallet.getWalletInfo(this.apiKey)
                this.$log.info("resp2: ", resp2)

                this.spendable = (resp2.amount_currently_spendable / GRIN_ATOMIC).toString()
                this.locked = (resp2.amount_locked / GRIN_ATOMIC).toString()
                this.unconfirmed = resp2.amount_awaiting_confirmation / GRIN_ATOMIC
                this.total = resp2.total / GRIN_ATOMIC

                if(this.height >= this.remoteHeight) {
                    this.inSync = true
                }

                //get online users
                this.$http
                    .get(domain+"/online")
                    .then(response => {
                        //this.$log.info("response: ", response.data)
                        //this.$log.info("response: ", typeof(response.data))
                        let users = Object.keys(response.data)
                        //this.$log.info("users: ", users)

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

                this.remoteHeight = await coincap.getBlockHeight()
                if(this.height >= this.remoteHeight) {
                    this.inSync = true
                } else {
                    //TODO out of sync modal
                }
            },
            async reScanWallet() {
                this.$log.info("reScanWallet pressed!")
		        this.$refs.rescanWallet.show()

                //this.$log.info(this.amount)
                let rescanProcess = await daemon.recheckWallet(this.password,this)
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
            intervals: function () {
                var me = this
                window.setInterval(function () {
                    getNewSeries(lastDate, {
                        min: 10,
                        max: 90
                    })

                    //this.$log.info("DATA: ",data)

                    me.$refs.realtimeChart.updateSeries([{
                        data: data
                    }])
                }, 2000)

                // every 60 seconds, we reset the data
                window.setInterval(function () {
                    resetData()
                    me.$refs.realtimeChart.updateSeries([{
                        data
                    }], false, true)
                }, 60000)
            },

            async confirmSeed() {
                this.confirmedSeed = true
                this.$refs.displaySeed.hide()
            },
            async displaySeed() {
                let seedResp = await daemon.displaySeed(this.password)

                this.seed = seedResp.seed
                if(this.wallet713Enabled){
                	this.address = seedResp.address
                }
                this.$log.info("SEED INFO: ",seedResp)
                this.$refs.displaySeed.show()
            },
	        async restoreWallet() {
		        //rescanWallet
		        this.$refs.rescanWallet.show()
		        this.$log.info("SEED INFO: ",this.inputSeed)
                await daemon.recoverWallet(this.password,this.inputSeed, this)

                if(!this.wallet713Enabled) await this.reScanWallet()
		        //this.$refs.displaySeed.show()
		        this.$refs.rescanWallet.hide()
                this.closeModal()
	        },
            async generateUsername() {
                let newUser = harryPotterNames.random()
                if (newUser.indexOf(")") >= 0) newUser = harryPotterNames.random()
                newUser = newUser.replace(/ /g, '_');

                this.$log.debug("newUser", newUser)
                this.form.username = newUser

                let isValidUser = await service.isValid(newUser)
                this.$log.debug("isValidUser: ",isValidUser)
                if (isValidUser.isAvailable) {
                    let resultRegister = await this.registerUsername()
	                this.$log.debug("resultRegister: ",resultRegister)

                } else {
                    this.errorMessage = "Error invalid username!"
                }
            },
	        async validateUsername(newUser) {
		        let isValidUser = await service.isValid(newUser)
		        this.$log.debug("isValidUser: ",isValidUser)
		        if (isValidUser.isAvailable) {
			       return true
		        } else {
			        this.errorMessage = "Error invalid username!"
                    return false
		        }
	        },
	        async registerUsername(newUser) {
		        let tag = " | registerUsername | "
		        this.$log.debug(tag,"checkpoint1")

                if(!this.signingPriv){
	                //generate new signing keys
	                let seed = await btcTools.onGetNewSeed()
	                let btcKeys = await btcTools.onBuildWallet(seed.seed)
	                //this.$log.info(tag,"btcKeys: ",btcKeys)
	                this.signingPub  = btcKeys.signingPub
	                this.signingPriv = btcKeys.signingPriv
                }

                //if valid register
                let registerSuccess = await service.register(newUser,this.signingPub,this.signingPriv)
                this.$log.debug("registerSuccess: ",registerSuccess.message)

                if(!registerSuccess.success){
		        	this.username = ""
	                this.errorMessage = registerSuccess.message
	                this.$refs.signup.show()
                } else{
	                return registerSuccess
                }


	        },
            async generateEnvFile() {
            	let tag = " | generateEnvFile | "
	            this.$log.debug(tag,"Checkpoint ")

                if(!this.form.username) {
	                this.$log.debug(tag,"Checkpoint 1a ")

            		this.errorMessage = " Empty username! can not register! "
	                this.$log.debug(tag,"username: ",this.form.username)

	                this.$refs.signup.show()
	                this.$log.debug(tag,"Checkpoint 1a a ")
                    this.closeModal()
	                this.$log.debug(tag,"Checkpoint 1a b ")
                } else {
	                this.$log.debug(tag,"username: ",this.form.username)
	                let registerSuccess = await this.registerUsername(this.form.username)
	                if(registerSuccess){
		                this.$log.debug(tag,"checkpoint1")
                        this.username = this.form.username
		                let apiKey = await daemon.getApiKey()

		                //let passwordhash
		                var hash = bcrypt.hashSync(this.password, 8);

		                this.$log.debug(tag,"pw hash: ",hash)
		                this.$log.debug(tag,"username: ",this.form.username)
		                this.$log.debug(tag,"signingPub: ",this.signingPub)
		                this.$log.debug(tag,"signingPriv: ",this.signingPriv)
		                this.$log.debug(tag,"address: ",this.address)

		                let envSuccessWrite = await daemon.generateEnv(hash,this.form.username, this.signingPub, this.signingPriv, apiKey, this.address)
		                this.$log.info("envSuccessWrite: ", envSuccessWrite)
		                this.closeModal()
	                }else{
		                this.errorMessage = registerSuccess.error
		                this.$log.debug(tag,"checkpoint1a")
		                this.$refs.signup.show()
	                }
            	}
            },
            async startNode() {
                //start node
                let nodeStart = await node.startNode(this)
                this.$log.info("nodeStart: ", nodeStart)

            },
            async startSockets() {
                //start node
                if(this.username){
                    this.$log.info("CHECKPOINT start sockets!")
                    //PAYMENTS
                    socket.on('payments', async function (message) {
                        let tag = " | WALLET.VUE | " + " | payments | "
                        try {

                            console.log('orderUpdate: ', message)
                            console.log('orderUpdate: ', typeof(message));
                            if(typeof(message)==="string") message = JSON.parse(message)

                            //chingle!
                            daemon.playChingle()

                            //accept request to signs
                            if(message.state === 'unsigned'){
                                //TODO more validation

                                //make post
                                //TODO config? meh its not changing
                                let url = "http://127.0.0.1:3415/v1/wallet/foreign/receive_tx"
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

                                alert('Grin Received! '+response.id)
                                store.set(response.id,response)

                            }else{
                                //ignore others
                                //shouldnt normally hit?
                                console.error(message)
                                throw Error("101: unknown msg type")
                            }
                        } catch (e) {
                            console.error(tag,"ERROR: ",e)
                        }
                    });

                    socket.on('reconnect',async function(){
                        this.announce()
                        this.socketId = socket.id
                    })

                    /***************************************
                    //CHAT
                    //**************************************/
                    socket.on('messages', function(message) {
                        this.messages.push(message);
                        this.updateScroll()
                    }.bind(this));
                    socket.on('member_add', function(member) {
                        //Vue.set(this.members, member.socket, member);
                    }.bind(this));
                    socket.on('member_delete', function(socket_id) {
                        //Vue.delete(this.members, socket_id);
                    }.bind(this));
                    socket.on('message_history', function(messages) {
                        this.messages = messages;
                    }.bind(this));
                    // socket.on('member_history', function(members) {
                    //     this.members = members;
                    // }.bind(this));

                    this.socketsStarted = true
                } else {
                    this.$log.error(" USERNAME NOT SET! can not start sockets!")
                }

            }
        },
        async created() {
            //TODO broke?
            //let grinPrice = await coincap.getCoinData("grin")
            //grinPrice.priceUsd = parseFloat(grinPrice.priceUsd).toFixed(2)
            //this.$log.info("grinPrice: ", grinPrice)
            //this.grinPrice = grinPrice.data

            let detectSeed = await daemon.detectSeedFile()
            this.$log.info("*** detectSeed: ",detectSeed)
            //Check for password
            if (!this.isPasswordSet && detectSeed) {
                this.$refs.password.show()
            } else {
                this.$refs.passwordCreate.show()
            }

        },
        async mounted() {
            this.$log.debug('landing mounted')
            //this.$modal.show('password')

            this.socketId = socket.id
            let configInfo = await daemon.readEnv()

            if(configInfo && configInfo.username){

                this.username = configInfo.username
                this.$log.debug("Config INFO: ", configInfo)
            }else {
                this.$log.debug(" Username not set!")
            }

            //this.intervals()
            this.getTxHistory()
            this.announce()
        },
	    destroyed: function() {

	    }
    }
</script>

<style>
    @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

    /*ul,ol {*/
        /*margin:0;*/
        /*padding:0 0 0 2em;*/

    /*}*/



    ol {
        list-style: none;
        counter-reset: my-awesome-counter;
    }
    ol li {
        counter-increment: my-awesome-counter;
    }
    ol li::before {
        content: counter(my-awesome-counter) ". ";
        color: red;
        font-weight: bold;
    }



    body {
        font-family: Montserrat, sans-serif;
    }



    * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }

    password {
        height: auto;
        margin-bottom: 20px;
        width: 420px;
    }

    ol {
        margin: 0 0 30px 20px;
        columns: 4;
        -webkit-columns: 4;
        -moz-columns: 4;
        column-gap: 30px;
        -webkit-column-gap: 30px;
        -moz-column-gap: 30px;
    }

    ol li {
        margin: 0 0 10px 0;
    }

    #odd-fix ol li {
        display: inline-block;
        width: 100%;
    }

    body {
        font-family: 'Source Sans Pro', sans-serif;
    }

    #wrapper {
        background: radial-gradient(
                ellipse at top left,
                rgba(255, 255, 255, 1) 40%,
                rgba(229, 229, 229, .9) 100%
        );
        height: 100vh;
        padding: 60px 80px;
        width: 100vw;
    }

    #logo {
        height: auto;
        margin-bottom: 20px;
        width: 420px;
    }

    main {
        display: flex;
        justify-content: space-between;
    }

    main > div {
        flex-basis: 50%;
    }

    .left-side {
        display: flex;
        flex-direction: column;
    }

    .welcome {
        color: #555;
        font-size: 23px;
        margin-bottom: 10px;
    }

    .title {
        color: #2c3e50;
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 6px;
    }

    .title.alt {
        font-size: 18px;
        margin-bottom: 10px;
    }

    .doc p {
        color: black;
        margin-bottom: 10px;
    }

    .doc button {
        font-size: .8em;
        cursor: pointer;
        outline: none;
        padding: 0.75em 2em;
        border-radius: 2em;
        display: inline-block;
        color: #fff;
        background-color: #4fc08d;
        transition: all 0.15s ease;
        box-sizing: border-box;
        border: 1px solid #4fc08d;
    }

    .doc button.alt {
        color: #42b983;
        background-color: transparent;
    }

    .pixel-spinner, .pixel-spinner * {
        box-sizing: border-box;
    }

    .pixel-spinner {
        height: 70px;
        width: 70px;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }

    .pixel-spinner .pixel-spinner-inner {
        width: calc(70px / 7);
        height: calc(70px / 7);
        background-color: #ff1d5e;
        color: #ff1d5e;
        box-shadow: 15px 15px 0 0,
        -15px -15px 0 0,
        15px -15px 0 0,
        -15px 15px 0 0,
        0 15px 0 0,
        15px 0 0 0,
        -15px 0 0 0,
        0 -15px 0 0;
        animation: pixel-spinner-animation 2000ms linear infinite;
    }

    @keyframes pixel-spinner-animation {
        50% {
            box-shadow: 20px 20px 0px 0px,
            -20px -20px 0px 0px,
            20px -20px 0px 0px,
            -20px 20px 0px 0px,
            0px 10px 0px 0px,
            10px 0px 0px 0px,
            -10px 0px 0px 0px,
            0px -10px 0px 0px;
        }
        75% {
            box-shadow: 20px 20px 0px 0px,
            -20px -20px 0px 0px,
            20px -20px 0px 0px,
            -20px 20px 0px 0px,
            0px 10px 0px 0px,
            10px 0px 0px 0px,
            -10px 0px 0px 0px,
            0px -10px 0px 0px;
        }
        100% {
            transform: rotate(360deg);
        }
    }
</style>
