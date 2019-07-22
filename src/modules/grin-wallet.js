/*
        GRIN API-Client
            - highlander

                        oooo$$$$$$$$$$$$oooo
                      oo$$$$$$$$$$$$$$$$$$$$$$$$o
                   oo$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$o
                 o$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$o
               o$$$$$$$$$    $$$$$$$$$$$$$    $$$$$$$$$o
              o$$$$$$$$$      $$$$$$$$$$$      $$$$$$$$$$o
             $$$$$$$$$$$      $$$$$$$$$$$      $$$$$$$$$$$$
            $$$$$$$$$$$$$    $$$$$$$$$$$$$    $$$$$$$$$$$$$$
           $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
          o$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
          $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
          $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$" "$$$
          $$$$$  $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$   o$$$
          "$$$$   $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$     $$$$
            $$$$    "$$$$$$$$$$$$$$$$$$$$$$$$$$$$"      o$$$
            "$$$o     """$$$$$$$$$$$$$$$$$$"$$"         $$$
              $$$o          "$$""$$$$$$""&&&&         o$$$
               $$$$o                     &&**      o$$$"
                "$$$$o                            o$$$$
                  "$$$$$oo                      o$$$$""
                     ""$$$$$oooo              $$$$$"""
                        ""$$$$$$$oo $$$$$$$$$$$$$

    WALLET - API
    https://github.com/mimblewimble/grin/blob/master/doc/api/node_api.md

 */
import rp from "request-promise-native";

require('dotenv').config()
const https = require('https')
const Axios = require('axios')
const axios = Axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    })
})
const GRIN_ATOMIC = 1000000000
const Store = require('electron-store');
const store = new Store();


let wallet713Enabled = false

const TAG = " | GRIN WALLET | "
let getWalletInfo = async function (apiKey) {
    try {
        let tag = " | getWalletInfo | "
        let output
        let URL_BASE = 'http://grin:' + apiKey + '@127.0.0.1:3420'


        console.log(tag,"URL_BASE: ",URL_BASE)

        let result = await send_get_request(URL_BASE + '/v2/owner/retrieve_summary_info')
        console.log(tag,"result: ",result)

        if(wallet713Enabled){
            if(typeof(result) === "string") result = JSON.parse(result)
            output = result
        }else{
            output = result[1]
        }


        return output
    } catch (error) {
        return error
    }
}


let getTransactions = async function (apiKey) {
    try {
        let URL_BASE = 'http://grin:' + apiKey + '@127.0.0.1:3420'
        let result = await send_get_request(URL_BASE + "/v2/wallet/owner/retrieve_txs?refresh")

        //result = JSON.parse(result)
        // if(wallet713Enabled){
        //    if(typeof(result) === "string") result = JSON.parse(result)
        //    result = result
        // }else{
        //    result = result[1]
        // }
        result = result[1]
        console.log(result)

        //clean result
        let output = []
        for (let i = 0; i < result.length; i++) {
            let entry = result[i]
            let cleanEntry = {}

            //wallet713?
            cleanEntry.id = entry.id
            cleanEntry.parent_key_id = entry.parent_key_id
            cleanEntry.num_inputs = entry.num_inputs
            cleanEntry.num_outputs = entry.num_outputs

            //output
            cleanEntry.tx_type = entry.tx_type
            cleanEntry.confirmed = entry.confirmed
            cleanEntry.tx_slate_id = entry.tx_slate_id
            cleanEntry.amount_credited = entry.amount_credited / GRIN_ATOMIC
            cleanEntry.amount_debited = entry.amount_debited / GRIN_ATOMIC
            cleanEntry.fee = entry.fee / GRIN_ATOMIC


            output.push(cleanEntry)

        }

        return output
    } catch (e) {
        console.error('e', e)
        throw e
    }
}

/*
    Fully wrapped call
    (not really to an address, named to match ME spec)

 */
let sendToAddress = async function (apiKey,address,amount) {
    let tag = TAG + " | send_to_address | "
    try {
        let saveData = {}
        console.log(tag,"address: ",address)
        console.log(tag,"amount: ",amount)

        saveData.address = address
        saveData.amount = amount
        let URL_BASE = 'http://grin:' + apiKey + '@127.0.0.1:3420'
        let url = URL_BASE+"/v2/owner/issue_send_tx"

        amount = parseInt(amount * 1000000000)

        let body = {
            amount:amount, //* `amount` - The amount to send, in nanogrins. (`1 G = 1_000_000_000nG`)
            minimum_confirmations:1, // `minimum_confirmations` - The minimum number of confirmations an output
            /// should have in order to be included in the transaction.
            method:"http", //methods
            dest:address,
            max_outputs:100,
            num_change_outputs:1,
            selection_strategy_is_use_all:false
        }
        saveData.method = body.method

        console.log(tag,"body: ",body)
        let result = await sendPostRequest(url,body)
        console.log(tag,"result: ",result)
        console.log(tag,"result: ",result.id)
        saveData.slate = result
        saveData.txid = result.id
        saveData.time = new Date().getTime()

        //broadcast tx
        // let url2 = URL_BASE+"/v1/wallet/owner/post_tx"
        // let broadcastResp = await sendPostRequest(url2,result)
        // console.log(tag,"broadcastResp: ",broadcastResp)
        // saveData.sendResp = broadcastResp.toString()

        //TODO save all to electron-store
        store.set(result.id,saveData)
        //handle errors

        if(!result.id) throw Error("102: unknown response format!")

        return result.id
    } catch (e) {
        //if error cancel!
        //TODO only dev??
        //prod handelling
        //cancel_send_slate(result.id)

        console.error(tag,'e', e)
        throw e
    }
}


let cancelTx = async function (apiKey, id) {
    try {
        let URL_BASE = 'http://grin:' + apiKey + '@127.0.0.1:3420'
        let url = URL_BASE+"/v1/wallet/owner/cancel_tx?tx_id="+id
        console.log("url: ",url)


        let result = await sendPostRequest(url)
        console.log("result: ",result)
        //if(!result) throw Error("102: unknown response format!")
        //this works but not result?
        return result
    } catch (e) {
        console.error('e', e)
        throw e
    }
}

let postTx = async function (apiKey, body) {
    let tag = TAG + " | postTX | "
    try {
        let URL_BASE = 'http://grin:' + apiKey + '@127.0.0.1:3420'
        let url = URL_BASE+"/v1/wallet/owner/post?fluff"

        console.log(tag,"url: ",url)
        console.log(tag,"body: ",body)

        let result = await sendPostRequest(url,body)
        console.log(tag,"result: ",result)

        //if(!result) throw Error("102: unknown response format!")
        //this works but not result?

        return result
    } catch (e) {
        console.error('e', e)
        throw e
    }
}

let rePostTx = async function (apiKey, id) {
    try {
        let URL_BASE = 'http://grin:' + apiKey + '@127.0.0.1:3420'
        let url = URL_BASE+"/v2/owner/repost?fluff&tx_id?"+id
        console.log("url: ",url)


        let result = await sendPostRequest(url)
        console.log("result: ",result)
        //if(!result) throw Error("102: unknown response format!")
        //this works but not result?
        return result
    } catch (e) {
        console.error('e', e)
        throw e
    }
}

let send_get_request = async function (url) {
    let debug = true
    let TAG = " | send_get_request | "
    try {
        if (debug) console.log(TAG,'url: ', url)
        let result = await rp(url)

        if (debug) console.log(TAG,'result: ', result)

        // todo validate
        return JSON.parse(result)
    } catch (e) {
        if (debug) console.error(TAG,'e: ', e)

        // magic to decode error code
        let errorCode = e.message.replace(' - ""', '')
        let errorMessage = e.message
        if (errorCode === '401') {
            throw Error('102: Missconguration! invalid api secret!')
        } else if (errorMessage.indexOf('ECONNREFUSED') >= 0) {
            throw Error('103: client not running! nothing on ip:port ' + url)
        } else {
            console.error('e', e)
            throw Error('999: Unknown Error: ' + e.message)
        }
    }
}

let sendPostRequest = async function (url,body) {
    let tag = TAG + " | send_post_request | "
    let output = {}
    output.success = false
    try {
        //url = "http://" + process.env.GRIN_USERNAME + ":" + process.env.GRIN_PASSWORD + "@" + url
        console.log(tag,"url: ",url)


        let options = {
            method: 'POST',
            uri: url,
            body: body,
            json: true // Automatically stratifies the body to JSON
        };
        console.log(tag,"options: ",options)
        let result = await rp(options)
        console.log(tag,"result: ",result)
        return result
    } catch (e) {
        let errorCode = e.message.replace(' - ""','')
        errorCode = errorCode.split("-")
        console.error(tag,"errorCode: ",errorCode)
        let errorMessage = e.message
        errorCode = errorCode[0].trim()
        console.error(tag,"errorCode: ",errorCode)
        console.error(tag,"errorMessage: ",errorMessage)
        if(errorCode === '401'){
            return Error("102: Missconfiguration! invalid api secret!")
        }else if (errorCode === '500' && errorMessage.indexOf("Client Callback Error: Posting transaction slate") >= 0) {
            return Error("102: invalid slate!")
        } else {
            console.error('e', e)
            return Error("999: Unknown Error: " + e.message)
        }
    }
}


export default {
    cancelTx,
    getWalletInfo,
    getTransactions,
    sendPostRequest,
    sendToAddress,
    rePostTx,
    postTx
}
