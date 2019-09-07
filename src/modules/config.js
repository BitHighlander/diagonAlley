let TAG = " | Config | "
const VERSION = 1.0
var fs = require('fs');
import path from 'path';
import { app, remote } from 'electron';
import os from 'os'
const mkdirp = require('mkdirp');

let appRootDir = require('app-root-dir').get().replace('app.asar', '').replace(/(\s+)/g, '\\$1');
export const rootDir = require('app-root-dir').get()

//Language Settings

export const  languageList = [
    'English',
    '简体中文', //Mandrin
    'русский', //Russian
    'español'  //Spanish
]

export const  languages = [
    {
        name:'English',
        code:'en',
        english:'English'
    },
    {
        name:'简体中文',
        code:'zh',
        english:'Chinese'
    },
    {
        name:'русский',
        code:'ru',
        english:'russian'
    },
    {
        name:'español',
        code:'es',
        english:'Spanish'
    }
]






function getPlatform(){
    switch (os.platform()) {
        case 'aix':
        case 'freebsd':
        case 'linux':
        case 'openbsd':
        case 'android':
          return 'linux';
        case 'darwin':
        case 'sunos':
          return 'mac';
        case 'win32':
          return 'win';
      }
}

export const platform = getPlatform()

const IS_PROD = process.env.NODE_ENV === 'production';
const root = process.cwd();
const APP = process.type === 'renderer' ? remote.app : app

const binariesPath =
  IS_PROD || APP.isPackaged
    ? path.join(process.resourcesPath, 'bin', platform)
    : path.join(root, 'resources', 'bin', platform);

const grinWalletBinaries = platform==='win'?'grin-wallet.exe':'grin-wallet'
const grinBinaries = platform==='win'?'grin.exe':'grin'

export let grinWalletPath = path.join(binariesPath, grinWalletBinaries)
export let grinPath = path.join(binariesPath, grinBinaries)

if(platform=='win'){
  grinWalletPath = '"' + path.resolve(grinWalletPath) + '"'
  grinPath = '"' + path.resolve(grinPath) + '"'
}

export const chainType = 'main'
export const grinNode = "http://grin2-node.niffler.org:3413"
export const grinNode2 = "http://grin2-node2.niffler.org:3413"
export const grinLocalNode= "http://127.0.0.1:3413"
export const grinDIR = path.join(APP.getPath('home'), '.diagonalley')

//TODO move all to diagon
export const seedDir = path.join(APP.getPath('home'), '.diagonalley', chainType, 'wallet_data')

export const seedPath = path.join(APP.getPath('home'), '.grin', chainType, 'wallet_data/wallet.seed')
export const seedPathCore = path.join(APP.getPath('home'), '.grin', chainType, 'wallet_data/wallet.seed')
export const seedPathDiagon = path.join(APP.getPath('home'), '.diagonalley', chainType, 'wallet_data/wallet.seed')
export const seedPathNiffler = path.join(APP.getPath('home'), '.grin', chainType, 'wallet_data/wallet.seed')

export const walletTOMLPath = path.join(APP.getPath('home'), '.grin', chainType, 'grin-wallet.toml')
export const nodeTOMLPath = path.join(APP.getPath('home'), '.grin', chainType, 'grin-server.toml')
export const walletPath = path.join(APP.getPath('home'), '.grin', chainType)
export const apiSecretPath = path.join(APP.getPath('home'), '.grin', chainType, '.api_secret')
export const grinNodeLog = path.join(APP.getPath('home'), '.grin', chainType, 'grin-server.log')
export const chainDataPath = path.join(APP.getPath('home'), '.grin', chainType, 'chain_data')

//configs config
export const nifflerConfig = path.join(APP.getPath('home'), '.niffler','config.json')
export const diagonConfig = path.join(APP.getPath('home'), '.diagonalley','diagonAlley.json')

//wallet settings

export const diagonPath = path.join(APP.getPath('home'), '.diagonalley')
export const logDir = path.join(diagonPath, 'log')
export const tempTxDir = path.join(diagonPath, 'temp_tx')
export const configPath = path.join(diagonPath, 'diagonAlley.json')

export const releaseUrl = 'https://api.github.com/repos/BitHighlander/diagonAlley/releases/latest'
export const downloadUrl = 'https://github.com/BitHighlander/diagonAlley/releases/latest'

//innit
export function innitConfig(languageSelected){
    let tag = TAG + " | importConfig | "
    try{
        let output = {}
        console.log(tag,"CHECKPOINT innitConfig")
        console.log(tag,"diagonPath: ",diagonPath)
        console.log(tag,"seedDir: ",seedDir)

        mkdirp(diagonPath, function (err) {
            if (err) console.error(err)
            else console.log('created: ',configPath)
        });

        mkdirp(logDir, function (err) {
            if (err) console.error(err)
            else console.log('created: ',logDir)
        });

        mkdirp(tempTxDir, function (err) {
            if (err) console.error(err)
            else console.log('tempTxDir: ',tempTxDir)
        });

        mkdirp(seedDir, function (err) {
            if (err) console.error(err)
            else console.log('seedDir: ',seedDir)
        });


        console.log(tag," innit config checkpiont 2")

        let config = {}
        config.locale = languageSelected.code
        config.localeSelected = true
        config.version = VERSION

        fs.writeFileSync(configPath,JSON.stringify(config))

    }catch (e) {
        console.error(tag,"e: ",e)
        return {}
    }
}


//import config
//NERF https://github.com/mimblewimble/grin-wallet/issues/187
// Cant run wallet on custom dir
export function importConfig(type){
    let tag = TAG + " | importConfig | "
    try{
        let output = {}

        console.log(tag,"diagonPath: ",diagonPath)
        console.log(tag,"seedDir: ",seedDir)

        mkdirp(diagonPath, function (err) {
            if (err) console.error(err)
            else console.log('created: ',configPath)
        });

        mkdirp(logDir, function (err) {
            if (err) console.error(err)
            else console.log('created: ',logDir)
        });

        mkdirp(tempTxDir, function (err) {
            if (err) console.error(err)
            else console.log('tempTxDir: ',tempTxDir)
        });

        mkdirp(seedDir, function (err) {
            if (err) console.error(err)
            else console.log('seedDir: ',seedDir)
        });


        console.log(tag," import config checkpiont 2")


        switch(type) {
            case "niffler":
                console.log(tag,"niffler import detected")
                //if niffer wallet found
                let nifflerWallet
                try{
                    nifflerWallet = fs.readFileSync(seedPathNiffler)
                }catch(e){}

                //copy wallet over to our path
                if(nifflerWallet){
                    output.isWallet = true
                    console.log(tag,"niffler wallet found")
                    fs.writeFileSync(seedPath,nifflerWallet.toString())
                } else {
                    output.isWallet = false
                    console.log(tag,"no niffler wallet found!")
                }

                //config to file
                let nifflerConfigContent = JSON.parse(fs.readFileSync(nifflerConfig))
                if(nifflerConfigContent){
                    output.isConfig = true
                    console.log(tag,"Niffler config found!")
                    nifflerConfigContent.version = VERSION
                    fs.writeFileSync(configPath,JSON.stringify(nifflerConfigContent))
                } else {

                    output.isConfig = false
                    console.log(tag,"No Niffler config found!")
                }

                return output;
                break;
            case "diagonV1":

                //if diagon wallet found
                let diagonV1Wallet = fs.readFileSync(seedPathCore)
                //copy wallet over to our path
                if(diagonV1Wallet){
                    output.isWallet = true
                    fs.writeFileSync(seedPath,diagonV1Wallet)
                }

                return output;
                break;
            default:
            // code block
        }

    }catch (e) {
        console.error(tag,"e: ",e)
        return {}
    }
}

export function checkConfigs(){
    let output = {}
    output.isConfigured = false
    output.isWallet = false
    output.isRegistered = false

    let fileFound = fs.existsSync(diagonConfig)?true:false
    if(fileFound){
        output.config = JSON.parse(fs.readFileSync(configPath))
        if(output.config.version) output.isConfigured = true
        if(output.config.username) output.isRegistered = true
    }

    if(output.config  && output.config.version )output.isConfigured = true

    //wallet in niffler path?
    output.nifflerDetected = fs.existsSync(nifflerConfig)?true:false
    if(output.nifflerDetected){
        output.nifflerConfig = JSON.parse(fs.readFileSync(nifflerConfig))
    }

    //wallet in diagonalley path?
    if(output.config && !output.config.version){
        output.diagonOldDetected = true
    }
    if(output.diagonOldDetected){
        output.diagonOldConfig = output.config
    }

    //wallet in grin wallet path?
    output.legacyWalletDetected = fs.existsSync(seedPathCore)?true:false

    //wallet in wallet713 path?

    //wallet found?
    let walletFound = fs.existsSync(seedPath)?true:false
    if(walletFound){
        output.isWallet = true
    }

    return output
}

export function getWallet(){
    try{
        return fs.readFileSync(seedPath)
    }catch (e) {
        return {}
    }
}

export function getConfig(){
  try{
    return JSON.parse(fs.readFileSync(configPath))
  }catch (e) {
    return {}
  }
}

export function setConfig(options){
  return fs.writeFileSync(configPath, JSON.stringify(options))
}

export function updateConfig(options){
  let options_ = getConfig()
  for(var key in options){
    options_[key] = options[key]
  }
  setConfig(options_)
}

//export const logLevel = getConfig()['debug']?'debug':'info'
export const logLevel = 'debug'

export const hedwigServer = 'https://v1.hedwig.im'
export const hedwigClient =
  IS_PROD || APP.isPackaged
    ? path.resolve(path.join(process.resourcesPath, 'bin', 'hedwig', 'client.js'))
    : path.resolve(path.join(root, 'hedwig', 'client.js'))

export const hedwigApp = 'DiagonAlley'

export const grinRsWallet =
  IS_PROD || APP.isPackaged
    ? path.resolve(path.join(process.resourcesPath, 'bin', 'grinRs', 'wallet.js'))
    : path.resolve(path.join(root, 'grinRs', 'wallet.js'))

export const nodeExecutable =
    IS_PROD || APP.isPackaged
      ? path.resolve(path.join(process.resourcesPath, 'bin', 'grinRs', 'node.exe'))
      : path.resolve(path.join(root, 'grinRs', 'node.exe'))


export function getLocale(){
  let locale = getConfig()['locale']
  if(locale)return locale
  locale = APP.getLocale().toLowerCase()
  if(locale.startsWith('zh'))return 'zh'
  if(locale.startsWith('ru'))return 'ru'
  return 'en'
}
export function setLocale(locale){
  updateConfig({'locale':locale})
}
export const locale = getLocale()


import pkg from '../../package.json'
export const version = pkg.version

//other gnode options:
        //type:'remoteAllTime', addr: 'http://xxxx:3413'
        //type:'localAllTime', addr: 'http://127.0.0.1:3413'
export const defaultGnodeOptions= {
  'type':'smart',
  'remoteAddr': grinNode,
  'localAddr': grinLocalNode,
  'background': true
}
export const gnodeOption = getConfig()['gnode']
