/*
    CoinCap.io



 */
require('dotenv').config()
const https = require('https')
const Axios = require('axios')
const axios = Axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    })
})

let URL_BASE = "http://api.coincap.io/v2"

//TODO
let URL_BASE_EXPLORER = "https://grin.merklepath.com"

// module.exports = {
//   getInfo: function () {
//     return get_chain_info()
//   }
//
// }


let getBlockHeight = async function () {
    try {
        let output

        let url = URL_BASE_EXPLORER + '/api/v1/supply'
        let result = await send_get_request(url)
        console.log("BLOCK HEIGHT RESULT: ",result )
        return result.height
    } catch (error) {
        return false
    }
}

let getCoinData = async function (coin) {
    try {
        let output

        let url = URL_BASE + '/assets/'+coin
        let result = await send_get_request(url)
        return result
    } catch (error) {
        return false
    }
}


let getMarketData = async function (coin) {
    try {
        let output

        let url = URL_BASE + '/assets/'+coin+"/history?interval=d1"
        let result = await send_get_request(url)
        return result
    } catch (error) {
        return false
    }
}


let send_get_request = async function (url) {
    let debug = true
    try {
        if (debug) console.log('url: ', url)
        let result = await axios({
            url: url,
            method: 'GET'
        })
        if (debug) console.log('result: ', result.data)

        //todo validate
        return result.data
    } catch (e) {
        // magic to decode error code
        let errorCode = e.message.replace(' - ""', '')
        let errorMessage = e.message
        if (errorCode === '401') {
            throw Error('102: Misconfiguration! invalid api secret!')
        } else if (errorMessage.indexOf('ECONNREFUSED') >= 0) {
            throw Error('103: client not running! nothing on ip:port ' + process.env['GRIN_IP'] + ':' + process.env['GRIN_PORT_NODE'])
        } else {
            console.error('e', e)
            throw Error('999: Unknown Error: ' + e.message)
        }
    }
}


export default {
    getBlockHeight,
    getCoinData,
}