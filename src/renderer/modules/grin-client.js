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

    CLIENT - API
    https://github.com/mimblewimble/grin/blob/master/doc/api/node_api.md

 */
require('dotenv').config()
const https = require('https')
const Axios = require('axios')
const axios = Axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    })
})

let getChainInfo = async function (apiKey) {
    try {
        let output

        //let URL_BASE = 'http://grin:' + apiKey + '@127.0.0.1:3413'
        let URL_BASE = 'https://grin:thanksvault713kizQ4ZVv@node.713.mw'
        let url = URL_BASE + '/v1/status'

        output = await send_get_request(url)

        return output
    } catch (error) {
        return false
    }
}

let send_get_request = async function (url) {
    let debug = true
    let tag = " | send_get_request | "
    try {
        if (debug) console.log('url: ', url)
        let result = await axios({
            url: url,
            method: 'GET'
        })
        if (debug) console.log(tag, 'client result: ', result.data)

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
    getChainInfo,
}