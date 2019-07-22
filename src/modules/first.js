// NERF!!
// var fs = require('fs');
// import {defaultGnodeOptions, diagonPath, logDir, getConfig, setConfig, updateConfig, tempTxDir} from './config';
// import btcTools from "./btc-tools.js"
// import log from './logger'
//
// //NOTE this runs in main! logs only in there
// export async function checkFirstTime(){
//     console.log(diagonPath)
//
//     //get config status
//
//     const isFirstTime = fs.existsSync(diagonPath)?false:true
//     if(isFirstTime){
//
//         fs.mkdirSync(diagonPath)
//         fs.mkdirSync(logDir)
//         fs.mkdirSync(tempTxDir)
//         //create keypair
//         //generate new signing keys
//         let seed = await btcTools.onGetNewSeed()
//         console.log("seed:  ",seed)
//         let btcKeys = await btcTools.onBuildWallet(seed.seed)
//         console.log("btcKeys:  ",btcKeys)
//         let signingPub  = btcKeys.signingPub
//         let signingPriv = btcKeys.signingPriv
//         console.log("signingPub:  ",signingPub)
//         console.log("signingPriv:  ",signingPriv)
//
//         let config = {
//             signingPub,
//             signingPriv,
//             gnode:defaultGnodeOptions,
//             firstTime:true
//         }
//         setConfig(config)
//     }
//     else{
//         console.log("not first time? :  ")
//         updateConfig({'firstTime':false})
//     }
// }
//
// export function isFirstTime(){
//     return getConfig()['firstTime']
// }
//
