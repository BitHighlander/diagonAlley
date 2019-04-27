/*
    GRIN Dev toolkit



 */
require('dotenv').config()
var spawn = require('child_process').spawn;
const rp = require("request-promise-native")
const fs = require('fs-extra')
const path = require('path')
const TAG = " | GRIN-DAEMON | "
let appRootDir = require('app-root-dir').get();
appRootDir = appRootDir.replace("app.asar", "")
//appRootDir = appRootDir.replace(" ","\ ")
const json2csv = require('json2csv').Parser;
let homedir = require('os').homedir();

let wallet713Enabled = true
const wallet11Enabled = false

const Store = require('electron-store');
const store = new Store();

const timer = ms => new Promise( res => setTimeout(res, ms));


const startDaemon = function () {

    let grinDaemon
    if (process.env.NODE_ENV === "development") {
        if (process.platform === "linux") {
            grinDaemon = spawn(appRootDir + '/executables/' + process.platform + '/grin')
        } else if(process.platform === "win32"){
	          grinDaemon = spawn(appRootDir + '\\executables\\' + process.platform + '/grin')
        }else if(process.platform === "darwin"){
            grinDaemon = spawn(appRootDir + '/executables/' + process.platform + '/grin')
        }else {
            console.error("************* OS NOT SUPPORTED!!!!! ********************")
        }
    } else {
        if (process.platform === "linux") {
            grinDaemon = spawn(appRootDir + '/executables/' + process.platform + '/grin')
        } else if(process.platform === "win32"){
	          grinDaemon = spawn(appRootDir + '\\executables\\' + process.platform + '/grin')
        }else if(process.platform === "darwin"){
            grinDaemon = spawn(appRootDir + process.platform + '/grin')
        }else{
            console.error("************* OS NOT SUPPORTED!!!!! ********************")
        }
    }

    return grinDaemon
}

const initWallet = function (password) {
    let debug = true
    let tag = TAG + ' | init_wallet | '
    return new Promise(async (resolve, reject) => {
        let output = {}
        output.success = false
        let grinDaemon

        if(wallet713Enabled){
	        if (process.env.NODE_ENV === "development") {
		        console.log("DEV DETECTED!!! ******************8 ")
		        if (process.platform === "linux") {
			        grinDaemon = spawn(appRootDir + '/executables/' + process.platform + '/wallet713', ["-c",homedir+"/.diagonalley/main/wallet713-commands.toml","-p",password])
		        } else if(process.platform === "darwin"){
			        grinDaemon = spawn(appRootDir + '/executables/' + process.platform + '/wallet713', ["-c",homedir+"/.diagonalley/main/wallet713-commands.toml","-p",password])
		        } else if (process.platform === "win32"){
			        grinDaemon = spawn(appRootDir + '\\executables\\' + process.platform + '\\wallet713', ["-c",homedir+"\\.diagonalley\\main\\wallet713-commands.toml",'-p', password])
		        }
	        } else {
		        if (process.platform === "linux") {
			        grinDaemon = spawn(appRootDir + 'executables/' + process.platform + '/wallet713', ["-c",homedir+"/.diagonalley/main/wallet713-commands.toml","-p",password])
		        } else if(process.platform === "darwin") {
			        grinDaemon = spawn(appRootDir + process.platform + '/wallet713', ["-c",homedir+"/.diagonalley/main/wallet713-commands.toml","-p",password])
		        }else if (process.platform === "win32"){
			        grinDaemon = spawn(appRootDir + '\\executables\\' + process.platform + '\\wallet713', ["-c",homedir+"\\.diagonalley\\main\\wallet713-commands.toml",'-p', password])
		        }
	        }

	        let response = []
					await timer(300);
			    grinDaemon.stdin.write("1")
					console.log("****** stdin : ",grinDaemon.stdin)
					grinDaemon.stdin.write('\r\n');
					await timer(300);
					grinDaemon.stdin.write(password)
	        grinDaemon.stdin.write('\r\n');
	        grinDaemon.stdin.end();

	        grinDaemon.stdout.on('data', function (data) {
		        let payload = data.toString()
		        if (debug) console.log('stdout: ' + payload)
		        response.push(payload)
	        })

	        grinDaemon.stderr.on('data', function (data) {
		        let payload = data.toString()
		        if (debug) console.error('stderr: ' + payload)
		        response.push(payload)
	        })

	        grinDaemon.on('exit', function (code) {
		        output.exit = code.toString()
	            if(output.exit === "0"){

			        let responseAll = response.join(' ')
			        console.log("responseAll: ",responseAll)
			        // let pieces = responseAll.split('Please back-up these words in a non-digital format.')
			        // console.log("pieces: ",pieces)

			        let seed = responseAll.substring(
				        responseAll.lastIndexOf("Your recovery phrase is:"),
				        responseAll.lastIndexOf("Please back-up these words in a non-digital format.")
			        );
			        seed = seed.replace("Your recovery phrase is:","")

			        console.log("seed: ",seed)
			        seed = seed.split(" ")
			        console.log("seedArray: ",seed)


		            let address = responseAll.substring(
			            responseAll.lastIndexOf("[93mYour grinbox address[0m: ["),
			            responseAll.lastIndexOf("[0m")
		            );
		            console.log("address: ",address)
		            address = address.replace(/[^a-zA-Z0-9]/g, '');
		            console.log("address: ",address)
		            // address = address.replace("[93mYour grinbox address[0m: [","")
		            address = address.replace("93mYourgrinboxaddress0m","")
		            address = address.replace("0m36mwallet7130m94mUselistentoconnecttogrinboxorhelptoseeavailablecommands0m36mwallet713","")
		            address = address.replace("0m36mwallet713","") //0m36mwallet713
		            address = address.replace("0m94mUsehelptoseeavailablecommands","")//0m94mUsehelptoseeavailablecommands
		            address = address.replace("92m","")
		            console.log("address: ",address)

		            if(!seed[0] || seed.length > 24) seed.shift()

			        output.success = true
			        output.seed = seed
                    output.address = address
			        resolve(output)
		        }else if(output.exit === "1"){
			        console.error(tag,"error: ",output)
			        if(process.platform === "win32"){
				        //weird windows bug, leave open
			        }else{
				        resolve(output)
			        }
		        } else {
			        console.error(tag,"error: ",output)
			        throw Error("Not an exit code!")
		        }
	        })
        }else{
	        try{
		        if(process.platform === "win32"){
			        await fs.mkdir(homedir + "\\.diagonalley")
			        await fs.mkdir(homedir + "\\.diagonalley\\main")
		        }else{
			        await fs.mkdir(homedir + "/.diagonalley")
			        await fs.mkdir(homedir + "/.diagonalley/main")
		        }
	        }catch(e){

	        }


	        if (process.env.NODE_ENV === "development") {
		        if (process.platform === "linux") {
			        grinDaemon = spawn(appRootDir + '/executables/' + process.platform + '/grin', ['wallet', '-d', homedir+'/.diagonalley','--pass', password, 'init'])
		        } else if(process.platform === "win32"){
			        console.log(tag," checkpoint windows")
			        grinDaemon = spawn(appRootDir + '\\executables\\' + process.platform + '\\grin', ['wallet','-d', homedir+'\\.diagonalley','--pass', password, 'init'])
		        }else if(process.platform === "darwin"){
			        grinDaemon = spawn(appRootDir + '/executables/' + process.platform + '/grin', ['wallet', '-d', homedir+'/.diagonalley','--pass', password, 'init'])
		        }else {
			        console.error("************* OS NOT SUPPORTED!!!!! ********************")
		        }
	        } else {
		        if (process.platform === "linux") {
			        grinDaemon = spawn(appRootDir + 'executables/' + process.platform + '/grin', ['wallet', '-d', homedir+'/.diagonalley', '--pass', password, 'init'])
		        } else if(process.platform === "win32"){
			        grinDaemon = spawn(appRootDir + process.platform + '\\grin', ['wallet', '-d', homedir+'\\.diagonalley', '--pass', password, 'init'])
		        }else if(process.platform === "darwin"){
			        grinDaemon = spawn(appRootDir + process.platform + '/grin', ['wallet', '-d', homedir+'/.diagonalley', '--pass', password, 'init'])
		        }else{
			        console.error("************* OS NOT SUPPORTED!!!!! ********************")
		        }
	        }


	        let count = 0
	        const response = []
	        grinDaemon.stdout.on('data', function (data) {
		        let payload = data.toString()
		        if(debug) console.log(tag,"payload: ",payload)
		        response.push(payload)
	        })

	        grinDaemon.stderr.on('data', function (data) {
		        let payload = data.toString()
		        response.push(payload)
	        })

	        grinDaemon.on('exit', function (code) {
		        if (debug) console.log('child process exited with code ' + code.toString())

		        output.exit = code.toString()

		        //if exit code 0 success
		        if(output.exit === "0"){

			        let responseAll = response.join(' ')
			        console.log("responseAll: ",responseAll)
			        // let pieces = responseAll.split('Please back-up these words in a non-digital format.')
			        // console.log("pieces: ",pieces)

			        var seed = responseAll.substring(
				        responseAll.lastIndexOf("Your recovery phrase is:"),
				        responseAll.lastIndexOf("Please back-up these words in a non-digital format.")
			        );
			        seed = seed.replace("Your recovery phrase is:","")


			        console.log("seed: ",seed)
			        seed = seed.split(" ")
			        console.log("seedArray: ",seed)

			        if(!seed[0] || seed.length > 24) seed.shift()

			        output.success = true
			        output.seed = seed
			        resolve(output)
		        }else if(output.exit === "1"){
			        console.error(tag,"error: ",output)
			        if(process.platform === "win32"){
				        //weird windows bug, leave open
			        }else{
				        resolve(output)
			        }

		        } else {
			        console.error(tag,"error: ",output)
			        throw Error("Not an exit code!")
		        }

	        })
        }


        // setTimeout(resolve, seconds*1000)
    })
}

let detectSeedFile = async function () {
    let debug = true
    let tag = TAG + ' | detect_seed_file | '
    let output = false
    try {
        console.log("PATH: ", __dirname)

        let seedPath
        if(wallet713Enabled){
	        if(process.platform === "win32"){
		        seedPath = homedir + '\\.diagonalley\\main\\wallet713_data\\wallet.seed'
	        }else{
		        seedPath = homedir + '/.diagonalley/main/wallet713_data/wallet.seed'
	        }
	        if (debug) console.log(tag, seedPath)


	        let seedFIle
	        if (fs.existsSync(seedPath)) {
		        seedFIle = await fs.readJson(seedPath)
	        }
	        if (debug) console.log(tag, seedFIle)

	        if (seedFIle.encrypted_seed) {
		        output = true
	        }
        }else{
	        if(process.platform === "win32"){
		        seedPath = homedir + '\\.diagonalley\\main\\wallet_data\\wallet.seed'
	        }else{
		        seedPath = homedir + '/.diagonalley/main/wallet_data/wallet.seed'
	        }
	        if (debug) console.log(tag, seedPath)


	        let seedFIle
	        if (fs.existsSync(seedPath)) {
		        seedFIle = await fs.readJson(seedPath)
	        }
	        if (debug) console.log(tag, seedFIle)

	        if (seedFIle.encrypted_seed) {
		        output = true
	        }
        }


        return output
    } catch (error) {
        return output
    }
}

const startWalletPrivate = function (password) {
    let tag = TAG + ' | on_start_wallet_private | '
    return new Promise((resolve, reject) => {
	    //stop grin daemons
	    let child = spawn('pkill',['grin']);

	    if(wallet713Enabled){
		    let child = spawn('pkill',['wallet713']);

		    tag = tag + " | startWallet713 | "
		    console.log("CHECKPOINT1 *****************8 startWallet713")
		    console.log("CHECKPOINT1 *****************8 password: ",password)

		    //let grinDaemon = spawn('./src/renderer/executables/' + process.platform + '/grin', ['wallet', '--pass', password, 'listen'])
		    let grinDaemon
		    if (process.env.NODE_ENV === "development") {
			    console.log("DEV DETECTED!!! ******************8 ")
			    if (process.platform === "linux") {
				    grinDaemon = spawn(appRootDir + '/executables/' + process.platform + '/wallet713', ["-c",homedir+"/.diagonalley/main/wallet713.toml",'--daemon','--passphrase', password])
			    }else if(process.platform === "darwin"){
				    grinDaemon = spawn(appRootDir + '/executables/' + process.platform + '/wallet713', ["-c",homedir+"/.diagonalley/main/wallet713.toml",'--daemon','--passphrase', password])
			    }else if(process.platform === "win32"){
				    console.log(tag," checkpoint windows")
				    grinDaemon = spawn(appRootDir + '\\executables\\' + process.platform + '\\wallet713', ["-c",homedir+"\\.diagonalley\\main/wallet713.toml",'--daemon','--passphrase', password] )
			    }
		    } else {
			    if (process.platform === "linux") {
				    grinDaemon = spawn(appRootDir + 'executables/' + process.platform + '/wallet713', ["-c",homedir+"/.diagonalley/main/wallet713.toml",'--daemon', '--passphrase', password])
			    } else if(process.platform === "darwin") {
				    //OSX
				    grinDaemon = spawn(appRootDir + process.platform + '/wallet713', ["-c",homedir+"/.diagonalley/main/wallet713.toml",'--daemon', '--passphrase', password, '--passphrase'])
			    }else if(process.platform === "win32"){
				    console.log(tag," checkpoint windows")
				    grinDaemon = spawn(appRootDir + '\\executables\\' + process.platform + '\\wallet713', ["-c",homedir+"\\.diagonalley\\main/wallet713.toml",'--daemon','--passphrase', password] )
			    }
		    }

		    console.log("CHECKPOINT2 *****************8 startWallet713")
		    let output = {}
		    output.success = true
		    output.acceptingHttpPayments = true
		    output.acceptingGrinBoxPayments = true
		    resolve(output)

		    // grinDaemon.stdout.on('data', function (data) {
			 //    let payload = data.toString()
			 //    console.log(tag, 'stdout: ' + payload)
		    //
			 //    if(payload.indexOf('starting listener for foreign api') >= 0){
				//     output.acceptingHttpPayments = true
			 //    }
		    //
			 //    if(payload.indexOf('listener started for ') >= 0){
				//     output.acceptingGrinBoxPayments = true
				//     console.log("CHECKPOINT4 *****************8 startWallet713 payload: ",payload)
		    //
				//     //address
				//     var address = payload.substring(
				// 	    payload.lastIndexOf("listener started for [[92m"),
				// 	    payload.lastIndexOf("[0m]")
				//     );
				//     address = address.replace("listener started for [[92m","")
				//     address = address.replace("[0m]","")
				//     console.log("CHECKPOINT5 *****************8 startWallet713 address: ",address)
				//     output.address = address
				//     output.success = true
				//     resolve(output)
			 //    }
		    // })
		    //
		    // grinDaemon.stderr.on('data', function (data) {
			 //    let payload = data.toString()
			 //    console.log(tag, 'stderr: ' + payload)
			 //    if(!output.errors) output.errors = []
			 //    output.errors.push(payload)
		    // })
		    //
		    // grinDaemon.on('exit', function (code) {
			 //    console.log(tag, 'child process exited with code ' + code)
				// output.error = "failed to start!"
			 //    resolve(output)
		    // })
        }else{
		    //let grinDaemon = spawn(appRootDir+'/' + process.platform + '/grin', ['wallet', '--pass', password, 'owner_api'])
		    console.log(tag," APPROOTDIR: ",appRootDir)
		    let grinDaemon
		    if (process.env.NODE_ENV === "development") {
			    console.log("DEV DETECTED!!! ******************8 ")
			    if (process.platform === "linux") {
				    if(wallet11Enabled){
					    grinDaemon = spawn(appRootDir + '/executables/' + process.platform + '/grin-wallet', ['--pass', password, 'owner_api'])
				    }else{
					    grinDaemon = spawn(appRootDir + '/executables/' + process.platform + '/grin', ['wallet','-d', homedir+'/.diagonalley','--pass', password, 'owner_api'])
				    }
			    } else if(process.platform === "win32"){
				    console.log(tag," checkpoint windows")
				    grinDaemon = spawn(appRootDir + '\\executables\\' + process.platform + '\\grin', ['wallet','-d', homedir+'\\.diagonalley','--pass', password, 'owner_api'])
			    }else if(process.platform === "darwin"){
				    if(wallet11Enabled){
					    grinDaemon = spawn(appRootDir + '/executables/' + process.platform + '/grin-wallet', ['--pass', password, 'owner_api'])
				    }else{
					    grinDaemon = spawn(appRootDir + '/executables/' + process.platform + '/grin', ['wallet','-d', homedir+'/.diagonalley','--pass', password, 'owner_api'])
				    }
			    }else {
				    console.error("************* OS NOT SUPPORTED!!!!! ********************")
			    }

		    } else {
			    if (process.platform === "linux") {
				    if(wallet11Enabled) {
					    grinDaemon = spawn(appRootDir + 'executables/' + process.platform + '/grin-wallet', ['--pass', password, 'owner_api'])
				    }else{
					    grinDaemon = spawn(appRootDir + 'executables/' + process.platform + '/grin', ['wallet','-d', homedir+'/.diagonalley','--pass', password, 'owner_api'])
				    }
			    } else if(process.platform === "win32"){
				    console.log(tag," checkpoint windows")
				    grinDaemon = spawn(appRootDir + process.platform + '\\grin', ['wallet','-d', homedir+'\\.diagonalley','--pass', password, 'owner_api'])
			    }else if(process.platform === "darwin"){
				    if(wallet11Enabled) {
					    grinDaemon = spawn(appRootDir + process.platform + '/grin-wallet', ['--pass', password, 'owner_api'])
				    }else{
					    grinDaemon = spawn(appRootDir + process.platform + '/grin', ['wallet','-d', homedir+'/.diagonalley','--pass', password, 'owner_api'])
				    }
			    }else {
				    console.error("************* OS NOT SUPPORTED!!!!! ********************")
			    }
		    }


		    console.log("CHECKPOINT *****************8 startWalletPrivate ")
			//resolve(grinDaemon)

		    let output = {}
		    output.success = false

		    grinDaemon.stdout.on('data', function (data) {
			    let payload = data.toString()
			    console.log(tag, 'stdout: ' + payload)

			    if (payload.indexOf('WARN grin_servers::grin::server - Grin server started.') >= 0) {
				    // Normal

				    // output.success = true
				    // output.message =(data.toString())
				    // resolve(output)
			    }
		    })

		    grinDaemon.stderr.on('data', function (data) {
			    let payload = data.toString()

			    console.log(tag, 'stderr: ' + payload)

			    // if fatal
			    if (payload.indexOf('Address already in use (os error 98)') >= 0) {
				    // fatal
				    resolve(output)
			    }

			    // resolve error
		    })

		    grinDaemon.on('exit', function (code) {
			    console.log(tag, 'child process exited with code ' + code)
			    //output.error = code.toString()
			    resolve(output)
		    })

		    // setTimeout(resolve, seconds*1000)
        }

    })
}

const startWalletPublic = function (password) {
    return new Promise((resolve, reject) => {
        let tag = TAG + " | startWalletPublic | "
        console.log("CHECKPOINT *****************8 startWalletPublic ")

	    if(wallet713Enabled){
        	//bundled in private
		    let output = {}
		    output.success = true
		    resolve(output)
	    }else{
		    //let grinDaemon = spawn('./src/renderer/executables/' + process.platform + '/grin', ['wallet', '--pass', password, 'listen'])
		    let grinDaemon
		    if (process.env.NODE_ENV === "development") {
			    console.log("DEV DETECTED!!! ******************8 ")
			    if (process.platform === "linux") {
				    if(wallet11Enabled) {
					    grinDaemon = spawn(appRootDir + '/executables/' + process.platform + '/grin-wallet', ['--pass', password, 'listen'])
				    }else{
					    grinDaemon = spawn(appRootDir + '/executables/' + process.platform + '/grin', ['wallet','-d', homedir+'/.diagonalley','--pass', password, 'listen'])
				    }
			    } else if(process.platform === "win32"){
				    console.log(tag," checkpoint windows")
				    grinDaemon = spawn(appRootDir + '\\executables\\' + process.platform + '\\grin', ['wallet','-d', homedir+'\\.diagonalley','--pass', password, 'listen'])
			    }else if(process.platform === "darwin"){
				    if(wallet11Enabled) {
					    grinDaemon = spawn(appRootDir + '/executables/' + process.platform + '/grin', ['wallet','-d', homedir+'/.diagonalley','--pass', password, 'listen'])
				    }else{
					    grinDaemon = spawn(appRootDir + '/executables/' + process.platform + '/grin', ['wallet','-d', homedir+'/.diagonalley','--pass', password, 'listen'])
				    }
			    }else {
				    console.error("************* OS NOT SUPPORTED!!!!! ********************")
			    }
		    } else {
			    if (process.platform === "linux") {
				    if(wallet11Enabled) {
					    grinDaemon = spawn(appRootDir + 'executables/' + process.platform + '/grin', ['wallet','-d', homedir+'/.diagonalley','--pass', password, 'listen'])
				    }else{
					    grinDaemon = spawn(appRootDir + 'executables/' + process.platform + '/grin', ['wallet','-d', homedir+'/.diagonalley','--pass', password, 'listen'])
				    }
			    } else if(process.platform === "win32"){
				    grinDaemon = spawn(appRootDir + process.platform + '\\grin', ['wallet','-d', homedir+'\\.diagonalley','--pass', password, 'listen'])
			    }else if(process.platform === "darwin"){
				    if(wallet11Enabled) {
					    grinDaemon = spawn(appRootDir + process.platform + '/grin', ['wallet','-d', homedir+'/.diagonalley','--pass', password, 'listen'])
				    }else{
					    grinDaemon = spawn(appRootDir + process.platform + '/grin', ['wallet','-d', homedir+'/.diagonalley','--pass', password, 'listen'])
				    }

			    }else {
				    console.error("************* OS NOT SUPPORTED!!!!! ********************")
			    }
		    }

		    let output = {}
		    output.success = false

		    grinDaemon.stdout.on('data', function (data) {
			    let payload = data.toString()
			    console.log('stdout: ' + payload)
			    if (payload.indexOf('WARN grin_servers::grin::server - Grin server started.')) {
				    // Normal

				    // output.success = true
				    // output.message =(data.toString())
				    // resolve(output)
			    }
		    })

		    grinDaemon.stderr.on('data', function (data) {
			    let payload = data.toString()
			    console.log('stderr: ' + payload)

			    // if fatal
			    if (payload.indexOf('Address already in use (os error 98)') >= 0) {
				    // fatal
				    output.error = Error('101: port already used!! (grin wallet public). Do you have the App open already? ')
				    resolve(output)
			    }

			    // resolve error
		    })

		    grinDaemon.on('exit', function (code) {
			    console.log('child process exited with code ' + code.toString())

			    output.error = code.toString()
			    resolve(output)
		    })
	    }


        // setTimeout(resolve, seconds*1000)
    })
}

const displaySeed = function (password) {
    return new Promise((resolve, reject) => {
        let tag = TAG + " | displaySeed | "
        console.log("CHECKPOINT *****************8 displaySeed ")

        let responses = []
	    let grinDaemon

        if(wallet713Enabled){
	        if (process.env.NODE_ENV === "development") {
		        if (process.platform === "linux") {
			        grinDaemon = spawn(appRootDir + '/executables/' + process.platform + '/wallet713', ["-c",homedir+"/.diagonalley/main/wallet713-commands.toml","-p",password])
		        } else if(process.platform === "win32"){
			        console.log(tag," checkpoint windows")
			        grinDaemon = spawn(appRootDir + '\\executables\\' + process.platform + '\\wallet713', ["-c",homedir+"\\.diagonalley\\main\\wallet713-commands.toml","-p",password])
		        }else if(process.platform === "darwin"){
			        grinDaemon = spawn(appRootDir + '/executables/' + process.platform + '/wallet713', ["-c",homedir+"/.diagonalley/main/wallet713-commands.toml","-p",password])
		        }else {
			        console.error("************* OS NOT SUPPORTED!!!!! ********************")
		        }
	        } else {
		        if (process.platform === "linux") {
			        grinDaemon = spawn(appRootDir + 'executables/' + process.platform + '/wallet713', ["-c",homedir+"/.diagonalley/main/wallet713-commands.toml","-p",password])
		        } else if(process.platform === "win32"){
			        grinDaemon = spawn(appRootDir + process.platform + '\\wallet713', ["-c",homedir+"\\.diagonalley\\main\\wallet713-commands.toml","-p",password])
		        }else if(process.platform === "darwin"){
			        grinDaemon = spawn(appRootDir + process.platform + '/wallet713', ["-c",homedir+"/.diagonalley/main/wallet713-commands.toml","-p",password])
		        }else{
			        console.error("************* OS NOT SUPPORTED!!!!! ********************")
		        }
	        }


	        grinDaemon.stdin.write("recover -d -p "+password)
	        grinDaemon.stdin.end();

        }else{
	        if (process.env.NODE_ENV === "development") {
		        if (process.platform === "linux") {
			        grinDaemon = spawn(appRootDir + '/executables/' + process.platform + '/grin', ['wallet','-d', homedir+'/.diagonalley', '--pass', password, 'recover','-d'])
		        } else if(process.platform === "win32"){
			        console.log(tag," checkpoint windows")
			        grinDaemon = spawn(appRootDir + '\\executables\\' + process.platform + '\\grin', ['wallet','-d', homedir+'\\.diagonalley','--pass', password, 'recover','-d'])
		        }else if(process.platform === "darwin"){
			        grinDaemon = spawn(appRootDir + '/executables/' + process.platform + '/grin', ['wallet','-d', homedir+'/.diagonalley', '--pass', password, 'recover','-d'])
		        }else {
			        console.error("************* OS NOT SUPPORTED!!!!! ********************")
		        }
	        } else {
		        if (process.platform === "linux") {
			        grinDaemon = spawn(appRootDir + 'executables/' + process.platform + '/grin', ['wallet','-d', homedir+'/.diagonalley', '--pass', password, 'recover','-d'])
		        } else if(process.platform === "win32"){
			        grinDaemon = spawn(appRootDir + process.platform + '\\grin', ['wallet','-d', homedir+'\\.diagonalley','--pass', password, 'recover','-d'])
		        }else if(process.platform === "darwin"){
			        grinDaemon = spawn(appRootDir + process.platform + '/grin', ['wallet','-d', homedir+'/.diagonalley', '--pass', password, 'recover','-d'])
		        }else{
			        console.error("************* OS NOT SUPPORTED!!!!! ********************")
		        }
	        }

        }

        let output = {}
        output.success = false

        grinDaemon.stdout.on('data', function (data) {
            let payload = data.toString()
            console.log('stdout: ' + payload)
            responses.push(payload)

        })

        grinDaemon.stderr.on('data', function (data) {
            let payload = data.toString()
            console.log('stdout: ' + payload)
            responses.push(payload)
        })

        grinDaemon.on('exit', function (code) {
            console.log('child process exited with code ' + code.toString())
            let exitCode = code.toString()
            if(exitCode == 0){

	            let responseAll = responses.join(' ')
	            console.log("responseAll: ",responseAll)
	            // let pieces = responseAll.split('Please back-up these words in a non-digital format.')
	            // console.log("pieces: ",pieces)

	            var seed = responseAll.substring(
		            responseAll.lastIndexOf("Your recovery phrase is:"),
		            responseAll.lastIndexOf("Please back-up these words in a non-digital format.")
	            );
	            seed = seed.replace("Your recovery phrase is:","")

	            console.log("seed: ",seed)
	            seed = seed.split(" ")
	            console.log("seedArray: ",seed)

				if(wallet713Enabled){
					let address = responseAll.substring(
						responseAll.lastIndexOf("[93mYour grinbox address[0m: ["),
						responseAll.lastIndexOf("[0m")
					);
					console.log("address: ",address)
					address = address.replace(/[^a-zA-Z0-9]/g, '');
					console.log("address: ",address)
					// address = address.replace("[93mYour grinbox address[0m: [","")
					address = address.replace("92m","")
					address = address.replace("93mYourgrinboxaddress0m","")
					address = address.replace("0m36mwallet7130m94mUselistentoconnecttogrinboxorhelptoseeavailablecommands0m36mwallet713","")
					// address = address.replace("[94mUse `listen` to connect to grinbox or `help` to see available commands [0m ","")
					// address = address.replace("[0m ","")
					address = address.replace("0m94mUsehelptoseeavailablecommands","")//0m94mUsehelptoseeavailablecommands
					address = address.replace("0m36mwallet713","")//0m94mUsehelptoseeavailablecommands

					console.log("seedArray: ",address)

					output.address = address
				}
	            if(!seed[0] || seed.length > 24) seed.shift()

                output.responses = responseAll
                output.seed = seed
                output.success = true
            }else{
                output.error = "Failed to get seed! exit: "+exitCode
                output.responses = responses
            }

            resolve(output)
        })

        // setTimeout(resolve, seconds*1000)
    })
}

let detectDiagonConfig = async function () {
    let tag = TAG + " | result | "
    try {
        let result = false
	    let envFile

        if(wallet713Enabled){
	        if (process.platform === "linux") {
		        envFile = fs.existsSync(homedir + "/.diagonalley/diagonAlley.json")
		        console.log("envFile: ", envFile)
	        } else if(process.platform === "win32"){
		        envFile = fs.existsSync(homedir + "\\.diagonalley\\diagonAlley.json")
		        console.log("envFile: ", envFile)
	        } else if(process.platform === "darwin"){
		        envFile = fs.existsSync(homedir + "/.diagonalley/diagonAlley.json")
		        console.log("envFile: ", envFile)
	        }
        }else{
	        if (process.platform === "linux") {
		        envFile = fs.existsSync(homedir + "/.diagonalley/diagonAlley.json")
		        console.log("envFile: ", envFile)
	        } else if(process.platform === "win32"){
		        envFile = fs.existsSync(homedir + "\\.diagonalley\\diagonAlley.json")
		        console.log("envFile: ", envFile)
	        } else if(process.platform === "darwin"){
		        envFile = fs.existsSync(homedir + "/.diagonalley/diagonAlley.json")
		        console.log("envFile: ", envFile)
	        }
        }


        if (envFile) {
            result = true
        }
        return result
    } catch (e) {
        console.error(e)
        return false
    }
}

let detectWalletConfig = async function () {
    let tag = TAG + " | result | "
    try {
        let result = false
        let envFile
        try{


	        if(wallet713Enabled){
		        if (process.platform === "linux") {
			        envFile = fs.existsSync(homedir + "/.diagonalley/main/grin-wallet.toml")
			        console.log("envFile: ", envFile)
		        } else if(process.platform === "win32"){
			        envFile = fs.existsSync(homedir + "\\.diagonalley\\main\\grin-wallet.toml")
			        console.log("envFile: ", envFile)
		        } else if(process.platform === "darwin"){
			        envFile = fs.existsSync(homedir + "/.diagonalley/main/grin-wallet.toml")
			        console.log("envFile: ", envFile)
		        }
            }else{
		        if (process.platform === "linux") {
			        envFile = fs.existsSync(homedir + "/.diagonalley/main/grin-wallet.toml")
			        console.log("envFile: ", envFile)
		        } else if(process.platform === "win32"){
			        envFile = fs.existsSync(homedir + "\\.diagonalley\\main\\grin-wallet.toml")
			        console.log("envFile: ", envFile)
		        } else if(process.platform === "darwin"){
			        envFile = fs.existsSync(homedir + "/.diagonalley/main/grin-wallet.toml")
			        console.log("envFile: ", envFile)
		        }
            }



        }catch(e){
            envFile = false
        }
        //console.log("envFile: ",envFile)
        if (envFile) {
            result = true
        }
        return result
    } catch (e) {
        console.error(e)
        return false
    }
}

let detectServerConfig = async function () {
    let tag = TAG + " | result | "
    try {
        let result = false
        let envFile
        try{
            envFile = fs.existsSync(homedir + "/.diagonalley/main/grin-server.toml")
        }catch(e){
            envFile = false
        }
        //console.log("envFile: ",envFile)
        if (envFile) {
            result = true
        }
        return result
    } catch (e) {
        console.error(e)
        return false
    }
}

let readEnv = async function () {
    let tag = TAG + " | readEnv | "
    try {
        let result = false

        let envFile

		if(wallet713Enabled){
			if(process.platform === "win32"){
				envFile = await fs.readFile(homedir + "\\.diagonalley\\diagonAlley.json")
			}else if(process.platform === "linux"){
				envFile = await fs.readFile(homedir + "/.diagonalley/diagonAlley.json")
			}else if(process.platform === "darwin"){
				if (process.env.NODE_ENV === "development") {
					envFile = await fs.readFile(homedir + "/.diagonalley/diagonAlley.json")
				}else{
					envFile = await fs.readFile(homedir + "/.diagonalley/diagonAlley.json")
				}
			}
			console.log(tag, "envFile: ", envFile)
			envFile = envFile.toString('utf-8')
			console.log("envFile: ", envFile)

		}else{
			if(process.platform === "win32"){
				envFile = await fs.readFile(homedir + "\\.diagonalley\\diagonAlley.json")
			}else if(process.platform === "linux"){
				envFile = await fs.readFile(homedir + "/.diagonalley/diagonAlley.json")
			}else if(process.platform === "darwin"){
				if (process.env.NODE_ENV === "development") {
					envFile = await fs.readFile(homedir + "/.diagonalley/diagonAlley.json")
				}else{
					envFile = await fs.readFile(homedir + "/.diagonalley/diagonAlley.json")
				}
			}
			console.log(tag, "envFile: ", envFile)
			envFile = envFile.toString('utf-8')
			console.log("envFile: ", envFile)
		}

        return JSON.parse(envFile)
    } catch (e) {
        console.error(e)
        return false
    }
}

let readServerConfig = async function () {
    let tag = TAG + " | readServerConfig | "
    try {
        let result = false

        let envFile
        if(process.platform === "win32"){
            envFile = await fs.readFile(homedir + "\\.diagonalley\\main\\grin-server.toml")
        }else{
            envFile = await fs.readFile(homedir + "/.diagonalley/main/grin-server.toml")
        }
        console.log(tag, "envFile: ", envFile)

        return envFile.toString('utf-8')
    } catch (e) {
        console.error(e)
        return false
    }
}

let readWalletConfig = async function () {
    let tag = TAG + " | readWalletConfig | "
    try {
        let result = false

        let envFile
        if(process.platform === "win32"){
            envFile = await fs.readFile(homedir + "\\.diagonalley\\main\\grin-wallet.toml")
        }else if(process.platform === "linux"){
	        envFile = await fs.readFile(homedir + "/.diagonalley/main/grin-wallet.toml")
        }else if(process.platform === "darwin"){
	        if (process.env.NODE_ENV === "development") {
		        envFile = await fs.readFile(homedir + "/.diagonalley/main/grin-wallet.toml")
	        }else{
		        envFile = await fs.readFile(homedir + "/.diagonalley/main/grin-wallet.toml")
	        }

        }

        console.log(tag, "envFile: ", envFile)
        console.log("envFile: ", envFile)

        return envFile.toString('utf-8')
    } catch (e) {
        console.error(e)
        return false
    }
}

let readWallet713Config = async function () {
    let tag = TAG + " | readWallet713Config | "
    try {
        let result = false

        let envFile
        if(process.platform === "win32"){
            envFile = await fs.readFile(homedir + "\\.diagonalley\\main\\wallet713.toml")
        }else{
            envFile = await fs.readFile(homedir + "/.diagonalley/main/wallet713.toml")
        }

        console.log(tag, "envFile: ", envFile)
        console.log("envFile: ", envFile)

        return envFile.toString('utf-8')
    } catch (e) {
        console.error(e)
        return false
    }
}

let getApiKey = async function () {
    let tag = TAG + " | getApiKey | "
    try {
        let result
	    try{
		    if(process.platform === "win32"){
			    await fs.mkdir(homedir + "\\.diagonalley")
			    await fs.mkdir(homedir + "\\.diagonalley\\main")
		    }else{
			    await fs.mkdir(homedir + "/.diagonalley")
			    await fs.mkdir(homedir + "/.diagonalley/main")
		    }
	    }catch(e){

	    }

	    try{
		    if(process.platform === "win32"){
			    result = await fs.readFile(homedir + '\\.diagonalley\\main\\.api_secret')
		    }else if(process.platform === "linux"){
			    result = await fs.readFile(homedir + '/.diagonalley/main/.api_secret')
		    }else if(process.platform === "darwin"){
			    result = await fs.readFile(homedir + '/.diagonalley/main/.api_secret')
		    }
		    if(!result){
			    result = Math.random().toString(36).slice(-8);

			    if(process.platform === "win32"){
				    await fs.writeFile(homedir + '\\.diagonalley\\main\\.api_secret',result)
			    }else{
				    await fs.writeFile(homedir + '/.diagonalley/main/.api_secret',result)
			    }
		    }

		    result = result.toString('utf-8')
	    }catch(e){
		    result = Math.random().toString(36).slice(-8);

		    if(process.platform === "win32"){
			    await fs.writeFile(homedir + '\\.diagonalley\\main\\.api_secret',result)
		    }else{
			    await fs.writeFile(homedir + '/.diagonalley/main/.api_secret',result)
		    }
	    }


        return result
    } catch (e) {
        console.error(e)
        return false
    }
}

let detectApiKey = async function () {
    let tag = TAG + " | result | "
    try {
        let result = false
	    try{
		    if(process.platform === "win32"){
			    await fs.mkdir(homedir + "\\.diagonalley")
			    await fs.mkdir(homedir + "\\.diagonalley\\main")
		    }else{
			    await fs.mkdir(homedir + "/.diagonalley")
			    await fs.mkdir(homedir + "/.diagonalley/main")
		    }
	    }catch(e){

	    }


	    if(wallet713Enabled){
            return true
	    }else{

		    let envFile

		    if(process.platform === "win32"){
			    envFile = await fs.readFile(homedir + "\\.diagonalley\\main\\.api_secret")
		    }else if(process.platform === "linux"){
			    envFile = await fs.exists(homedir + '/.diagonalley/main/.api_secret')
		    }else if(process.platform === "darwin"){
			    envFile = await fs.exists(homedir + '/.diagonalley/main/.api_secret')
		    }



		    if (envFile) {
			    result = true
		    }
        }


        return result
    } catch (e) {
        console.error(e)
        return false
    }
}

let generateEnv = async function (hash, username, signingPub,signingPriv, apiKey, address) {
    let tag = TAG + " | generateEnv | "
    try {
        let result = false
        let portNode = "3413"
        let portWallet = "3420"

        console.log(tag,"signingPub: ",signingPub)
	    console.log(tag,"apiKey: ",apiKey)
	    console.log(tag,"address: ",address)

        try{

            if(wallet713Enabled){
	            if(process.platform === "win32"){
		            await fs.mkdir(homedir + "\\.diagonalley")
		            await fs.mkdir(homedir + "\\.diagonalley\\main")
	            }else{
		            await fs.mkdir(homedir + "/.diagonalley")
		            await fs.mkdir(homedir + "/.diagonalley/main")
	            }
            }else{
	            if(process.platform === "win32"){
		            await fs.mkdir(homedir + "\\.diagonalley")
		            await fs.mkdir(homedir + "\\.diagonalley\\main")
	            }else{
		            await fs.mkdir(homedir + "/.diagonalley")
		            await fs.mkdir(homedir + "/.diagonalley/main")
	            }
            }


        }catch(e){
            //ignore
        }

        var configFile = {
            hash,
            signingPub,
            signingPriv,
            username,
            portNode,
            portWallet,
            apiKey
        }

        console.log(tag, configFile)
        let resultWrite

	    if(wallet713Enabled){
		    configFile.address = address
		    configFile.diagonalleyEnabled = wallet713Enabled

		    if(process.platform === "win32"){
			    resultWrite = await fs.writeJson(homedir + "\\.diagonalley\\diagonAlley.json", configFile)
		    }else if(process.platform === "linux"){
			    resultWrite = await fs.writeJson(homedir + "/.diagonalley/diagonAlley.json", configFile)
		    }else if(process.platform === "darwin"){
			    if (process.env.NODE_ENV === "development") {
				    resultWrite = await fs.writeJson(homedir + "/.diagonalley/diagonAlley.json", configFile)
			    }else{
				    resultWrite = await fs.writeJson(homedir + "/.diagonalley/diagonAlley.json", configFile)
			    }
		    }

        }else{
		    if(process.platform === "win32"){
			    resultWrite = await fs.writeJson(homedir + "\\.diagonalley\\diagonAlley.json", configFile)
		    }else if(process.platform === "linux"){
			    resultWrite = await fs.writeJson(homedir + "/.diagonalley/diagonAlley.json", configFile)
		    }else if(process.platform === "darwin"){
			    if (process.env.NODE_ENV === "development") {
				    resultWrite = await fs.writeJson(homedir + "/.diagonalley/diagonAlley.json", configFile)
			    }else{
				    resultWrite = await fs.writeJson(homedir + "/.diagonalley/diagonAlley.json", configFile)
			    }

		    }
        }



        console.log(resultWrite)
        return resultWrite
    } catch (e) {
        console.error(tag,e)
        return false
    }
}

const editFile = async function (param, newValue) {
    let tag = TAG + " | edit_file | "
    try {
        console.log(tag, "checkpoint")
        //

	    let file

	    if(wallet713Enabled){
		    file = await fs.readJson(homedir + "/.diagonalley/diagonAlley.json")
		    console.log(file)
        }else{
		    file = await fs.readJson(homedir + "/.diagonalley/diagonAlley.json")
		    console.log(file)
        }


        //TODO edit

        // file = file.toString("utf-8")
        // console.log(tag,"file: ",file)
        // console.log(tag,"file: ",typeof(file))
        //
        // //parse to array on content I wish
        // let pieces = file.split(param)
        // console.log(tag,"pieces: ",pieces)
        //
        // //remove toxic input
        // let shards = pieces[1].split("\n")
        //
        // //put back together
        // let output = pieces[0] + param + "="+newValue +"\n"+ shards[1]
        // console.log(tag,"output: ",output)
        //
        // //overwrite to disk
        // let result = fs.writeFile(process.env.HOME + "/.diagonalley/diagonAlley.json",output)
        // console.log(tag,result)

        return file
    } catch (e) {
        console.error(tag, "e: ", e)
        throw e
    }
}

const turnOffTui = async function () {
    let tag = TAG + " | edit_file | "
    try {
        console.log(tag, "checkpoint")
        //TODO edit
        let configPath = homedir + "/.diagonalley/main/grin-server.toml"
        let configFile = await fs.readFile(configPath, 'utf8')
        console.log(tag,configFile)

        let output = configFile.replace("run_tui = true", "run_tui = false")

        //overwrite to disk
        let result = await fs.writeFile(homedir + "/.diagonalley/main/grin-server.toml", output)
        console.log(tag, result)

        return output
    } catch (e) {
        console.error(tag, "e: ", e)
        throw e
    }
}

let writeConfigFileServer = async function () {
    let debug = true
    let tag = " | writeConfigFileServer | "
    try {

        try{

            if(wallet713Enabled){
	            if(process.platform === "win32"){
		            await fs.mkdir(homedir + "\\.diagonalley")
		            await fs.mkdir(homedir + "\\.diagonalley\\main")
	            }else{
		            await fs.mkdir(homedir + "/.diagonalley")
		            await fs.mkdir(homedir + "/.diagonalley/main")
	            }
            }else{
	            if(process.platform === "win32"){
		            await fs.mkdir(homedir + "\\.diagonalley")
		            await fs.mkdir(homedir + "\\.diagonalley\\main")
	            }else{
		            await fs.mkdir(homedir + "/.diagonalley")
		            await fs.mkdir(homedir + "/.diagonalley/main")
	            }
            }
        }catch(e){
            //ignore
        }

        //stripped out comments
        //TODO for more info view website
        let output = "[server]\n" +
            "db_root = \"" + homedir + "/.diagonalley/main/chain_data\"\n" +
            "api_http_addr = \"127.0.0.1:3413\"\n" +
            "api_secret_path = \"" + homedir + "/.diagonalley/main/.api_secret\"\n" +
            "chain_type = \"Mainnet\"\n" +
            "chain_validation_mode = \"Disabled\"\n" +
            "archive_mode = false\n" +
            "skip_sync_wait = false\n" +
            "run_tui = true\n" +
            "run_test_miner = false\n" +
            "[server.p2p_config]\n" +
            "host = \"0.0.0.0\"\n" +
            "port = 3414\n" +
            "seeding_type = \"DNSSeed\"\n" +
            "[server.p2p_config.capabilities]\n" +
            "bits = 15\n" +
            "[server.pool_config]\n" +
            "accept_fee_base = 1000000\n" +
            "max_pool_size = 50000\n" +
            "max_stempool_size = 50000\n" +
            "mineable_max_weight = 39976\n" +
            "[server.dandelion_config]\n" +
            "relay_secs = 600\n" +
            "embargo_secs = 180\n" +
            "patience_secs = 10\n" +
            "peers_preferred = [\"192.168.0.3:3414\", \"192.168.0.4:3414\", \"35.157.67.48:13414\", \"204.48.26.36:13414\", \"35.203.155.51:13414\",\"153.169.74.3:13414\",\"89.101.91.246:13414\",\"35.246.154.78:13414\",\"51.175.188.119:13414\",\"217.182.192.59:13414\",\"35.227.48.174:13414\",\"84.94.235.161:13414\",\"95.236.53.34:13414\",\"162.244.80.115:13414\",\"167.99.53.226:13414\",\"119.237.58.248:13414\",\"68.107.96.202:13414\",\"76.21.112.249:13414\"]\n" +
            "stem_probability = 90\n" +
            "[server.stratum_mining_config]\n" +
            "enable_stratum_server = false\n" +
            "stratum_server_addr = \"127.0.0.1:3416\"\n" +
            "attempt_time_per_block = 15\n" +
            "minimum_share_difficulty = 1\n" +
            "wallet_listener_url = \"http://127.0.0.1:3415\"\n" +
            "burn_reward = false\n" +
            "[logging]\n" +
            "log_to_stdout = true\n" +
            "stdout_log_level = \"Info\"\n" +
            "log_to_file = true\n" +
            "file_log_level = \"Info\"\n" +
            "log_file_path = \"" + homedir + "/.diagonalley/main/grin-server.log\"\n" +
            "log_file_append = true\n" +
            "log_max_size = 16777216"


        let result

	    if(wallet713Enabled){
		    if(process.platform === "win32"){
			    result = await fs.writeJson(homedir + "\\.diagonalley\\main\\grin-server.toml", output)
		    }else{
			    result = await fs.writeFile(homedir + "/.diagonalley/main/grin-server.toml", output)
		    }
        }else{
		    if(process.platform === "win32"){
			    result = await fs.writeJson(homedir + "\\.diagonalley\\main\\grin-server.toml", output)
		    }else{
			    result = await fs.writeFile(homedir + "/.diagonalley/main/grin-server.toml", output)
		    }
        }



        return result
    } catch (e) {
        console.error('e', e)
        throw Error('999: Unknown Error: ' + e.message)
    }
}

const recheckWallet = function (password,context) {
    let tag = TAG + " | recheckWallet | "
    return new Promise((resolve, reject) => {

        console.log(tag, " checkpoint1")
        let grinDaemon

	    if(wallet713Enabled){
		    if (process.env.NODE_ENV === "development") {
			    if (process.platform === "linux") {
				    grinDaemon = spawn(appRootDir + '/executables/' + process.platform + '/wallet713', ["-c",homedir+"/.diagonalley/main/wallet713-commands.toml","-p",password])
			    } else if(process.platform === "win32"){
				    console.log(tag," checkpoint windows")
				    grinDaemon = spawn(appRootDir + '\\executables\\' + process.platform + '\\wallet713', ["-c",homedir+"/.diagonalley/main/wallet713-commands.toml","-p",password])
			    }else if(process.platform === "darwin"){
				    grinDaemon = spawn(appRootDir + '/executables/' + process.platform + '/wallet713', ["-c",homedir+"/.diagonalley/main/wallet713-commands.toml","-p",password])
			    }else {
				    console.error("************* OS NOT SUPPORTED!!!!! ********************")
			    }
		    } else {
			    if (process.platform === "linux") {
				    grinDaemon = spawn(appRootDir + 'executables/' + process.platform + '/wallet713', ["-c",homedir+"/.diagonalley/main/wallet713-commands.toml","-p",password])
			    } else if(process.platform === "win32"){
				    grinDaemon = spawn(appRootDir + process.platform + '\\wallet713', ["-c",homedir+"/.diagonalley/main/wallet713-commands.toml","-p",password])
			    }else if(process.platform === "darwin"){
				    grinDaemon = spawn(appRootDir + process.platform + '/wallet713', ["-c",homedir+"/.diagonalley/main/wallet713-commands.toml","-p",password])
			    }else{
				    console.error("************* OS NOT SUPPORTED!!!!! ********************")
			    }
		    }

		    //
		    grinDaemon.stdin.write("check")
		    grinDaemon.stdin.end();

        }else{
		    if (process.env.NODE_ENV === "development") {
			    if (process.platform === "linux") {
				    grinDaemon = spawn(appRootDir + '/executables/' + process.platform + '/grin', ['wallet','-d', homedir+'/.diagonalley', '--pass', password,'check'])
			    } else if(process.platform === "win32"){
				    console.log(tag," checkpoint windows")
				    grinDaemon = spawn(appRootDir + '\\executables\\' + process.platform + '\\grin', ['wallet','-d', homedir+'\\.diagonalley','--pass', password,'check'])
			    }else if(process.platform === "darwin"){
				    grinDaemon = spawn(appRootDir + '/executables/' + process.platform + '/grin', ['wallet','-d', homedir+'/.diagonalley', '--pass', password,'check'])
			    }else {
				    console.error("************* OS NOT SUPPORTED!!!!! ********************")
			    }
		    } else {
			    if (process.platform === "linux") {
				    grinDaemon = spawn(appRootDir + 'executables/' + process.platform + '/grin', ['wallet','-d', homedir+'/.diagonalley', '--pass', password,'check'])
			    } else if(process.platform === "win32"){
				    grinDaemon = spawn(appRootDir + process.platform + '\\grin', ['wallet', '-d', homedir+'\\.diagonalley', '--pass', password,'check'])
			    }else if(process.platform === "darwin"){
				    grinDaemon = spawn(appRootDir + process.platform + '/grin', ['wallet','-d', homedir+'/.diagonalley', '--pass', password,'check'])
			    }else{
				    console.error("************* OS NOT SUPPORTED!!!!! ********************")
			    }
		    }
        }


        //return grinDaemon
		    //resolve(grinDaemon)

		    grinDaemon.stdout.on('data', function (data) {
		        let payload = data.toString()
		        console.log('stdout: ' + payload)
		        //progress
                if(payload.indexOf("(Highest index:") >=0){
                    //parse progress percentage
                    var currentHeight = payload.substring(
                            payload.lastIndexOf("(Highest index: "),
                            payload.lastIndexOf(")")
                    );
                    currentHeight = currentHeight.replace("(Highest index: ","")

                    var maxHeight = payload.substring(
                            payload.lastIndexOf(" up to index "),
                            payload.lastIndexOf(". (Highest index: ")
                    );
                    maxHeight = maxHeight.replace(" up to index ","")

                    console.log(tag,"currentHeight: ",currentHeight)
                    console.log(tag,"maxHeight: ",maxHeight)
                    let percentage = parseInt(currentHeight)/parseInt(maxHeight) * 100
                    context.counter = percentage
                }

                //only show messages of inputs found!
                if(payload.indexOf("(Highest index:") >=0 || payload.indexOf("scanning") >=0){
                        //
                }else{
                    context.rescanProgess = payload
                }

		    })

		    grinDaemon.stderr.on('data', function (data) {
		        let payload = data.toString()
		        console.error('stderr: ' + payload)
		    })

		    grinDaemon.on('exit', function (code) {
		        console.log('child process exited with code ' + code.toString())

		        context.$refs.rescanWallet.hide()
		        context.refresh()
            resolve(true)
		    })

        // setTimeout(resolve, seconds*1000)
    })
}

const recoverWallet = function (password,seed,context) {
	let debug = true
	let tag = TAG + ' | recoverWallet | '
	return new Promise(async (resolve, reject) => {
		let output = {}
		output.success = false
		let grinDaemon

		if(wallet713Enabled){

			try{
				if(process.platform === "win32"){
					await fs.mkdir(homedir + "\\.diagonalley")
					await fs.mkdir(homedir + "\\.diagonalley\\main")
				}else{
					await fs.mkdir(homedir + "/.diagonalley")
					await fs.mkdir(homedir + "/.diagonalley/main")
				}
			}catch(e){

			}

			if (process.env.NODE_ENV === "development") {
				console.log(tag,"DEV DETECTED!!! ******************8 ")
				if (process.platform === "linux") {
					grinDaemon = spawn(appRootDir + '/executables/' + process.platform + '/wallet713', ["-c",homedir+"/.diagonalley/main/wallet713-commands.toml","-p",password])
				} else if(process.platform === "darwin"){
					grinDaemon = spawn(appRootDir + '/executables/' + process.platform + '/wallet713', ["-c",homedir+"/.diagonalley/main/wallet713-commands.toml","-p",password])
				}else if(process.platform === "win32"){
					grinDaemon = spawn(appRootDir + '\\executables\\' + process.platform + '\\wallet713', ["-c",homedir+"/.diagonalley/main/wallet713-commands.toml","-p",password])
				}

			} else {
				if (process.platform === "linux") {
					grinDaemon = spawn(appRootDir + 'executables/' + process.platform + '/wallet713', ["-c",homedir+"/.diagonalley/main/wallet713-commands.toml","-p",password])
				} else if(process.platform === "darwin") {
					grinDaemon = spawn(appRootDir + process.platform + '/wallet713', ["-c",homedir+"/.diagonalley/main/wallet713-commands.toml","-p",password])
				}else if(process.platform === "win32"){
					grinDaemon = spawn(appRootDir + '\\executables\\' + process.platform + '\\wallet713', ["-c",homedir+"/.diagonalley/main/wallet713-commands.toml","-p",password])
				}
			}

			grinDaemon.stdout.on('data', function (data) {
				let payload = data.toString()
				if (debug) console.log('stdout: ' + payload)
				response.push(payload)
			})

			grinDaemon.stderr.on('data', function (data) {
				let payload = data.toString()
				if (debug) console.error('stderr: ' + payload)
				response.push(payload)
			})

			grinDaemon.on('exit', function (code) {
				output.exit = code.toString()
				if(output.exit === "0"){

					let responseAll = response.join(' ')
					console.log("responseAll: ",responseAll)
					// let pieces = responseAll.split('Please back-up these words in a non-digital format.')
					// console.log("pieces: ",pieces)

					let seed = responseAll.substring(
						responseAll.lastIndexOf("Your recovery phrase is:"),
						responseAll.lastIndexOf("Please back-up these words in a non-digital format.")
					);
					seed = seed.replace("Your recovery phrase is:","")

					console.log("seed: ",seed)
					seed = seed.split(" ")
					console.log("seedArray: ",seed)


					let address = responseAll.substring(
						responseAll.lastIndexOf("[93mYour grinbox address[0m: ["),
						responseAll.lastIndexOf("[0m")
					);
					console.log("address: ",address)
					address = address.replace(/[^a-zA-Z0-9]/g, '');
					console.log("address: ",address)
					// address = address.replace("[93mYour grinbox address[0m: [","")
					address = address.replace("93mYourgrinboxaddress0m","")
					address = address.replace("0m36mwallet7130m94mUselistentoconnecttogrinboxorhelptoseeavailablecommands0m36mwallet713","")
					address = address.replace("0m36mwallet713","") //0m36mwallet713
					address = address.replace("0m94mUsehelptoseeavailablecommands","")//0m94mUsehelptoseeavailablecommands
					address = address.replace("92m","")
					console.log("address: ",address)

					if(!seed[0] || seed.length > 24) seed.shift()

					output.success = true
					output.seed = seed
					output.address = address
					resolve(output)
				}else if(output.exit === "1"){
					console.error(tag,"error: ",output)
					if(process.platform === "win32"){
						//weird windows bug, leave open
					}else{
						resolve(output)
					}
				} else {
					console.error(tag,"error: ",output)
					throw Error("Not an exit code!")
				}
			})

			let response = []
			await timer(300);
			grinDaemon.stdin.write("2")
			console.log("****** stdin : ",grinDaemon.stdin)
			grinDaemon.stdin.write('\r\n');
			await timer(300);
			grinDaemon.stdin.write(seed)
			grinDaemon.stdin.write('\r\n');
			await timer(300);
			grinDaemon.stdin.write(password)
			grinDaemon.stdin.write('\r\n');
			grinDaemon.stdin.end();


		}else{
			try{
				if(process.platform === "win32"){
					await fs.mkdir(homedir + "\\.diagonalley")
					await fs.mkdir(homedir + "\\.diagonalley\\main")
				}else{
					await fs.mkdir(homedir + "/.diagonalley")
					await fs.mkdir(homedir + "/.diagonalley/main")
				}
			}catch(e){

			}
			console.log(tag,"CHECKPOINT")

			if (process.env.NODE_ENV === "development") {
				if (process.platform === "linux") {
					grinDaemon = spawn(appRootDir + '/executables/' + process.platform + '/grin', ['wallet','-d', homedir+'/.diagonalley', '--pass', password, 'init','-r'])
				} else if(process.platform === "win32"){
					console.log(tag," checkpoint windows")
					grinDaemon = spawn(appRootDir + '\\executables\\' + process.platform + '\\grin', ['wallet','-d', homedir+'\\.diagonalley','--pass', password, 'init','-r'])
				}else if(process.platform === "darwin"){
					grinDaemon = spawn(appRootDir + '/executables/' + process.platform + '/grin', ['wallet','-d', homedir+'/.diagonalley', '--pass', password, 'init','-r'])
				}else {
					console.error("************* OS NOT SUPPORTED!!!!! ********************")
				}
			} else {
				if (process.platform === "linux") {
					grinDaemon = spawn(appRootDir + 'executables/' + process.platform + '/grin', ['wallet','-d', homedir+'/.diagonalley', '--pass', password, 'init','-r'])
				} else if(process.platform === "win32"){
					grinDaemon = spawn(appRootDir + process.platform + '\\grin', ['wallet','-d', homedir+'\\.diagonalley','--pass', password, 'init','-r'])
				}else if(process.platform === "darwin"){
					grinDaemon = spawn(appRootDir + process.platform + '/grin', ['wallet','-d', homedir+'/.diagonalley', '--pass', password, 'init','-r'])
				}else{
					console.error("************* OS NOT SUPPORTED!!!!! ********************")
				}
			}
			console.log(tag,"seed: ",seed)
			console.log(tag,"seed: ",typeof(seed))
			console.log(tag,"grinDaemon: ",grinDaemon)


			grinDaemon.stdin.write(seed)
			await timer(300);
			//grinDaemon.stdin.write('\r\n');
			//grinDaemon.stdin.end();

			let count = 0
			const response = []
			grinDaemon.stdout.on('data', function (data) {
				let payload = data.toString()
				if(debug) console.log(tag,"payload: ",payload)
				response.push(payload)
			})

			grinDaemon.stderr.on('data', function (data) {
				let payload = data.toString()
				response.push(payload)
			})

			grinDaemon.on('exit', function (code) {
				if (debug) console.log('child process exited with code ' + code.toString())

				output.exit = code.toString()

				//if exit code 0 success
				if(output.exit === "0"){

					let responseAll = response.join(' ')
					console.log("responseAll: ",responseAll)
					// let pieces = responseAll.split('Please back-up these words in a non-digital format.')
					// console.log("pieces: ",pieces)

					var seed = responseAll.substring(
						responseAll.lastIndexOf("Your recovery phrase is:"),
						responseAll.lastIndexOf("Please back-up these words in a non-digital format.")
					);
					seed = seed.replace("Your recovery phrase is:","")

					console.log("seed: ",seed)
					seed = seed.split(" ")
					console.log("seedArray: ",seed)

					output.success = true
					output.seed = seed
					resolve(output)
				}else if(output.exit === "1"){
					console.error(tag,"error: ",output)
					if(process.platform === "win32"){
						//weird windows bug, leave open
					}else{
						resolve(output)
					}

				} else {
					console.error(tag,"error: ",output)
					throw Error("Not an exit code!")
				}

			})
		}


		// setTimeout(resolve, seconds*1000)
	})
}

let detectTuiOn = async function () {
    let debug = true
    let tag = " | detectTuiOn | "
    try {
        let output = false
        //
        let configPath = homedir + "/.diagonalley/main/grin-server.toml"
        let configFile = await fs.readFile(configPath, 'utf8')
        console.log(configFile)

        if (configFile.indexOf("run_tui = true") >= 0) {
            output = true
        }

        return output
    } catch (e) {
        console.error('e', e)
        throw Error('999: Unknown Error: ' + e.message)
    }
}

const sendGrin = function (password, dest, amount) {
    let tag = TAG + " | sendGrin | "
    return new Promise(async (resolve, reject) => {
        let sendingEvents = []
        console.log(tag," checkpoint1")

        let grinDaemon

	    if(wallet713Enabled){
		    if (process.env.NODE_ENV === "development") {
			    if (process.platform === "linux") {
				    grinDaemon = spawn(appRootDir + '/executables/' + process.platform + '/wallet713common', ["-c",homedir+"/.diagonalley/main/wallet713-send.toml","-p",password])
			    } else if(process.platform === "win32"){
				    console.log(tag," checkpoint windows")
				    grinDaemon = spawn(appRootDir + '\\executables\\' + process.platform + '\\wallet713common', ["-c",homedir+"\\.diagonalley\\main\\wallet713-send.toml","-p",password])
			    }else if(process.platform === "darwin"){
				    grinDaemon = spawn(appRootDir + '/executables/' + process.platform + '/wallet713common', ["-c",homedir+"/.diagonalley/main/wallet713-send.toml","-p",password])
			    }else {
				    console.error("************* OS NOT SUPPORTED!!!!! ********************")
			    }
		    } else {
			    if (process.platform === "linux") {
				    grinDaemon = spawn(appRootDir + '/executables/' + process.platform + '/wallet713common', ["-c",homedir+"/.diagonalley/main/wallet713-send.toml","-p",password])
			    } else if(process.platform === "win32"){
			        grinDaemon = spawn(appRootDir + process.platform + '\\wallet713common', ["-c",homedir+"\\.diagonalley\\main\\wallet713-send.toml","-p",password])
			    }else if(process.platform === "darwin"){
					 grinDaemon = spawn(appRootDir + process.platform + '/wallet713common', ["-c",homedir+"/.diagonalley/main/wallet713-send.toml","-p",password])
			    }else{
				    console.error("************* OS NOT SUPPORTED!!!!! ********************")
			    }
		    }
		    console.log(tag,"command: ","send "+amount+" --to ",dest)

		    await timer(200);
		    grinDaemon.stdin.write("listen")
		    grinDaemon.stdin.write("\r\n")
		    await timer(1000);
		    grinDaemon.stdin.write("send "+amount+" --to "+dest)
		    grinDaemon.stdin.write("\r")
		    await timer(300);
		    grinDaemon.stdin.end();

        }else{
		    if (process.env.NODE_ENV === "development") {
			    if (process.platform === "linux") {
				    if(wallet11Enabled) {
					    grinDaemon = spawn(appRootDir + '/executables/' + process.platform + '/grin', ['wallet','-d', homedir+'/.diagonalley','--pass', password, 'send', '-d', dest, amount])
				    }else{
					    grinDaemon = spawn(appRootDir + '/executables/' + process.platform + '/grin', ['wallet','-d', homedir+'/.diagonalley', '--pass', password, 'send', '-d', dest, amount])
				    }
			    } else if(process.platform === "win32"){
				    console.log(tag," checkpoint windows")
				    grinDaemon = spawn(appRootDir + '\\executables\\' + process.platform + '\\grin', ['wallet','-d', homedir+'\\.diagonalley', '--pass', password, 'send', '-d', dest, amount])
			    }else if(process.platform === "darwin"){
				    if(wallet11Enabled) {
					    grinDaemon = spawn(appRootDir + '/executables/' + process.platform + '/grin', ['wallet','-d', homedir+'/.diagonalley','--pass', password, 'send', '-d', dest, amount])
				    }else{
					    grinDaemon = spawn(appRootDir + '/executables/' + process.platform + '/grin', ['wallet','-d', homedir+'/.diagonalley', '--pass', password, 'send', '-d', dest, amount])
				    }

			    }else {
				    console.error("************* OS NOT SUPPORTED!!!!! ********************")
			    }
		    } else {
			    if (process.platform === "linux") {
				    if(wallet11Enabled) {
					    grinDaemon = spawn(appRootDir + '/executables/' + process.platform + '/grin', ['wallet','-d', homedir+'/.diagonalley','--pass', password, 'send', '-d', dest, amount])
				    }else{
					    grinDaemon = spawn(appRootDir + '/executables/' + process.platform + '/grin', ['wallet','-d', homedir+'/.diagonalley', '--pass', password, 'send', '-d', dest, amount])
				    }
			    } else if(process.platform === "win32"){
				    grinDaemon = spawn(appRootDir + process.platform + '\\grin', ['wallet', '-d', homedir+'\\.diagonalley', '--pass', password,'send', '-d', dest, amount])
			    }else if(process.platform === "darwin"){
				    if(wallet11Enabled) {
					    grinDaemon = spawn(appRootDir + process.platform + '/grin-wallet', ['-d', homedir+'/.diagonalley','--pass', password,'send', '-d', dest, amount])
				    }else{
					    grinDaemon = spawn(appRootDir + process.platform + '/grin', ['wallet','-d', homedir+'/.diagonalley', '--pass', password,'send', '-d', dest, amount])
				    }
			    }else{
				    console.error("************* OS NOT SUPPORTED!!!!! ********************")
			    }
		    }
        }




        let output = {}
        output.success = false
        grinDaemon.stdout.on('data', function (data) {
            let payload = data.toString()
            console.log('stdout: ' + payload)
            sendingEvents.push(payload)
        })

        grinDaemon.stderr.on('data', function (data) {
            let payload = data.toString()
            console.error('stderr: ' + payload)
            sendingEvents.push('stderr: ' +data.toString())
            // if fatal

            // resolve error
        })

        grinDaemon.on('exit', function (code) {
            console.log('child process exited with code ' + code.toString())
	        console.log(tag,' Send Result: ' , output)
            if(code === 0){

            	//indexof
	            // sendingEvents = sendingEvents.join(' ')
	            // if(sendingEvents.indexOf("Not enough funds.") >= 0){
	            // 	output.message = "Not enough available funds! "
	            // } else if(sendingEvents.indexOf("grins sent successfully to") >= 0){
	            // 	//grins sent successfully to
		         //    output.success = true
		         //    output.message = "sent "+amount+" GRIN successfully to "+dest+"!"
	            // }else if(sendingEvents.indexOf("could not parse") >= 0){
		         //    //grins sent successfully to
		         //    // output.success = true
		         //    output.message = "Invalid address!"
	            // }else{
	            // 	//
		         //    console.error("Unhandled sending result!")
		         //    output.logs = sendingEvents
	            // }

	            output.success = true
	            output.message = "sent "+amount+" GRIN successfully to "+dest+"!"
            } else{
                output.code = code.toString()
                output.message = "See logfile for more information!"
                output.events = sendingEvents
            }

            resolve(output)
        })

        //TODO setTimeout(resolve, seconds*1000)
    })
}

let deleteChainData = async function () {
    let debug = true
    let tag = " | turnOffTui | "
    try {
        //stop grin daemons
        let child = spawn('pkill',['grin']);



	    if(wallet713Enabled){
		    if(process.platform === "win32"){
			    //
			    let configPath = homedir+"\\.diagonalley\\main\\chain_data"
			    let success = await fs.remove(configPath)

			    let walletdb = homedir+"\\.diagonalley\\main\\wallet713_data\\db"
			    let success2 = await fs.remove(walletdb)

			    let wallettxs = homedir+"\\.diagonalley\\main\\saved_txs"
			    let success3 = await fs.remove(wallettxs)

			    console.log(success)
			    console.log(success2)
			    console.log(success3)
		    }else{
			    //
			    let configPath = homedir+"/.diagonalley/main/chain_data"
			    let success = await fs.remove(configPath)

			    let walletdb = homedir+"/.diagonalley/main/wallet713_data/db"
			    let success2 = await fs.remove(walletdb)

			    let wallettxs = homedir+"/.diagonalley/main/saved_txs"
			    let success3 = await fs.remove(wallettxs)

			    console.log(success)
			    console.log(success2)
			    console.log(success3)
		    }
        }else{
		    if(process.platform === "win32"){
			    //
			    let configPath = homedir+"\\.diagonalley\\main\\chain_data"
			    let success = await fs.remove(configPath)

			    let walletdb = homedir+"\\.diagonalley\\main\\wallet_data\\db"
			    let success2 = await fs.remove(walletdb)

			    let wallettxs = homedir+"\\.diagonalley\\main\\saved_txs"
			    let success3 = await fs.remove(wallettxs)

			    console.log(success)
			    console.log(success2)
			    console.log(success3)
		    }else{
			    //
			    let configPath = homedir+"/.diagonalley/main/chain_data"
			    let success = await fs.remove(configPath)

			    let walletdb = homedir+"/.diagonalley/main/wallet_data/db"
			    let success2 = await fs.remove(walletdb)

			    let wallettxs = homedir+"/.diagonalley/main/saved_txs"
			    let success3 = await fs.remove(wallettxs)

			    console.log(success)
			    console.log(success2)
			    console.log(success3)
		    }
        }





        return true
    } catch (e) {
        console.error('e', e)
        throw Error('999: Unknown Error: ' + e.message)
    }
}

let deleteWalletConfigs = async function () {
    let debug = true
    let tag = " | turnOffTui | "
    try {
        //stop grin daemons
        let child = spawn('pkill',['grin']);


	    if(wallet713Enabled){
		    if(process.platform === "win32"){
			    //
			    //TODO
			    let configPath = homedir+"\\.diagonalley\\main\\grin-server.toml"
			    let success = await fs.remove(configPath)

			    let walletdb = homedir+"\\.diagonalley\\main\\grin-wallet.toml"
			    let success2 = await fs.remove(walletdb)

			    console.log(success)
			    console.log(success2)

		    }else{
			    //
			    //TODO
			    let configPath = homedir+"/.diagonalley/main/grin-server.toml"
			    let success = await fs.remove(configPath)

			    let walletdb = homedir+"/.diagonalley/main/grin-wallet.toml"
			    let success2 = await fs.remove(walletdb)

			    console.log(success)
			    console.log(success2)

		    }
        }else{
		    if(process.platform === "win32"){
			    //
			    //TODO
			    let configPath = homedir+"\\.diagonalley\\main\\grin-server.toml"
			    let success = await fs.remove(configPath)

			    let walletdb = homedir+"\\.diagonalley\\main\\grin-wallet.toml"
			    let success2 = await fs.remove(walletdb)

			    console.log(success)
			    console.log(success2)

		    }else{
			    //
			    //TODO
			    let configPath = homedir+"/.diagonalley/main/grin-server.toml"
			    let success = await fs.remove(configPath)

			    let walletdb = homedir+"/.diagonalley/main/grin-wallet.toml"
			    let success2 = await fs.remove(walletdb)

			    console.log(success)
			    console.log(success2)

		    }
        }


        return true
    } catch (e) {
        console.error('e', e)
        throw Error('999: Unknown Error: ' + e.message)
    }
}

let playChingle = async function () {
    let debug = true
    let tag = " | playChingle | "
    try {

        let audio

        if (process.env.NODE_ENV === "development") {
            //chingle!

            if (process.platform === "win32") {
                audio = new Audio('.\\src\\renderer\\assets\\sounds\\chaching.mp3');
            } else {
                audio = new Audio('./src/renderer/assets/sounds/chaching.mp3');
            }

        } else {
            if (process.platform === "linux") {
                audio = new Audio(appRootDir+'executables/chaching.mp3');
            } else if(process.platform === "darwin"){
                audio = new Audio(appRootDir+'chaching.mp3');
            } else if(process.platform === "win32"){
                audio = new Audio(appRootDir+'chaching.mp3');
            }else{
                console.error("*** OS NOT SUPPORTED **** ",process.platform)
            }
        }
        audio.play();

        return true
    } catch (e) {
        console.error('e', e)
        throw Error('999: Unknown Error: ' + e.message)
    }
}

let writeConfigFileWallet = async function (apiKey) {
    let debug = true
    let tag = " | writeConfigFileWallet | "
    try {

        let output
        if(!apiKey) throw Error("101 tried to make a config file without an apiKey!")

        if(wallet713Enabled){
	        output = "chain = \"Mainnet\"\n" +
		        "wallet713_data_path = \"wallet713_data\"\n" +
		        "grinbox_domain = \"grinbox.io\"\n" +
		        "grinbox_listener_auto_start = true\n" +
		        "default_keybase_ttl = \"24h\"\n" +
		        "owner_api = true\n" +
		        "owner_api_address = \"127.0.0.1:3420\"\n" +
		        "owner_api_secret = \""+apiKey+"\"\n" +
		        "foreign_api = true\n" +
		        "foreign_api_address = \"0.0.0.0:3415\"\n"

	        let outputCommand = "chain = \"Mainnet\"\n" +
		        "wallet713_data_path = \"wallet713_data\"\n" +
		        "grinbox_domain = \"grinbox.io\"\n" +
		        "grinbox_listener_auto_start = false\n" +
		        "default_keybase_ttl = \"24h\"\n" +
		        "owner_api = false\n" +
		        "owner_api_address = \"127.0.0.1:3420\"\n" +
		        "owner_api_secret = \""+apiKey+"\"\n" +
		        "foreign_api = false\n" +
		        "foreign_api_address = \"0.0.0.0:3415\"\n"

	        let outputSend = "chain = \"Mainnet\"\n" +
		        "wallet713_data_path = \"wallet713_data\"\n" +
		        "grinbox_domain = \"grinbox.io\"\n" +
		        "grinbox_listener_auto_start = true\n" +
		        "default_keybase_ttl = \"24h\"\n" +
		        "owner_api = false\n" +
		        "owner_api_address = \"127.0.0.1:3420\"\n" +
		        "owner_api_secret = \""+apiKey+"\"\n" +
		        "foreign_api = false\n" +
		        "foreign_api_address = \"0.0.0.0:3415\"\n"


	        try{
		        await fs.mkdir(process.env.HOME + "/.diagonalley")
		        await fs.mkdir(process.env.HOME + "/.diagonalley/main")
	        }catch(e){
	        }
	        //overwrite to disk
	        let result
	        let result2
	        let result3
	        if(process.platform === "win32"){
		        result3 = await fs.writeFile(homedir+"\\.diagonalley\\main\\wallet713-commands.toml",outputCommand)
		        result2 = await fs.writeFile(homedir+"\\.diagonalley\\main\\wallet713-send.toml",outputSend)
		        result = await fs.writeFile(homedir+"\\.diagonalley\\main\\wallet713.toml",output)
	        }else{
		        result2 = await fs.writeFile(homedir+"/.diagonalley/main/wallet713-commands.toml",outputCommand)
		        result3 = await fs.writeFile(homedir+"/.diagonalley/main/wallet713-send.toml",outputCommand)
		        result = await fs.writeFile(homedir+"/.diagonalley/main/wallet713.toml",output)
	        }
	        console.log(tag,result)
	        console.log(tag,result2)
	        console.log(tag,result3)
        }else{
	        if(process.platform === "win32"){
		        homedir = homedir.replace(/\\/g,'\\\\')

		        output = "\n" +
			        "#########################################\n" +
			        "### WALLET CONFIGURATION              ###\n" +
			        "#########################################\n" +
			        "[wallet]\n" +
			        "chain_type = \"Mainnet\"\n" +
			        "\n" +
			        "#host IP for wallet listener, change to \"0.0.0.0\" to receive grins\n" +
			        "api_listen_interface = \"0.0.0.0\"\n" +
			        "\n" +
			        "#path of TLS certificate file, self-signed certificates are not supported\n" +
			        "#tls_certificate_file = \"\"\n" +
			        "#private key for the TLS certificate\n" +
			        "#tls_certificate_key = \"\"\n" +
			        "\n" +
			        "#port for wallet listener\n" +
			        "api_listen_port = 3415\n" +
			        "\n" +
			        "#port for wallet owner api\n" +
			        "owner_api_listen_port = 3420\n" +
			        "\n" +
			        "#path of the secret token used by the API to authenticate the calls\n" +
			        "#comment it to disable basic auth\n" +
			        "api_secret_path = \""+ homedir +"\\\\.diagonalley\\\\main\\\\.api_secret\"\n" +
			        "\n" +
			        "#location of the node api secret for basic auth on the Grin API\n" +
			        "node_api_secret_path = \""+homedir+"\\\\.diagonalley\\\\main\\\\.api_secret\"\n" +
			        "\n" +
			        "#where the wallet should find a running node\n" +
			        "check_node_api_http_addr = \"http://node.niffler.org:3413\"\n" +
			        "\n" +
			        "#include the foreign API endpoints on the same port as the owner\n" +
			        "#API. Useful for networking environments like AWS ECS that make\n" +
			        "#it difficult to access multiple ports on a single service.\n" +
			        "owner_api_include_foreign = false\n" +
			        "\n" +
			        "#where to find wallet files (seed, data, etc)\n" +
			        "data_file_dir = \""+homedir+"\\\\.diagonalley\\\\main\\\\wallet_data\"\n" +
			        "\n" +
			        "#If true, don't store calculated commits in the database\n" +
			        "#better privacy, but at a performance cost of having to\n" +
			        "#re-calculate commits every time they're used\n" +
			        "no_commit_cache = false\n" +
			        "\n" +
			        "#Whether to use the black background color scheme for command line\n" +
			        "dark_background_color_scheme = true\n" +
			        "\n" +
			        "#The exploding lifetime for keybase notification on coins received.\n" +
			        "#Unit: Minute. Default value 1440 minutes for one day.\n" +
			        "#Refer to https://keybase.io/blog/keybase-exploding-messages for detail.\n" +
			        "#To disable this notification, set it as 0.\n" +
			        "keybase_notify_ttl = 1440\n" +
			        "\n" +
			        "\n" +
			        "#########################################\n" +
			        "### LOGGING CONFIGURATION             ###\n" +
			        "#########################################\n" +
			        "[logging]\n" +
			        "\n" +
			        "#whether to log to stdout\n" +
			        "log_to_stdout = true\n" +
			        "\n" +
			        "#log level for stdout: Error, Warning, Info, Debug, Trace\n" +
			        "stdout_log_level = \"Warning\"\n" +
			        "\n" +
			        "#whether to log to a file\n" +
			        "log_to_file = true\n" +
			        "\n" +
			        "#log level for file: Error, Warning, Info, Debug, Trace\n" +
			        "file_log_level = \"Info\"\n" +
			        "\n" +
			        "#log file path\n" +
			        "log_file_path = \""+homedir+"\\\\.diagonalley\\\\main\\\\grin-wallet.log\"\n" +
			        "\n" +
			        "#whether to append to the log file (true), or replace it on every run (false)\n" +
			        "log_file_append = true\n" +
			        "\n" +
			        "#maximum log file size in bytes before performing log rotation\n" +
			        "#comment it to disable log rotation\n" +
			        "log_max_size = 16777216\n" +
			        "\n"

	        }else{

		        output = "[wallet]\n" +
			        "chain_type = \"Mainnet\"\n" +
			        "api_listen_interface = \"0.0.0.0\"\n" +
			        "api_listen_port = 3415\n" +
			        "owner_api_listen_port = 3420\n" +
			        "api_secret_path = \"" + homedir + "/.diagonalley/main/.api_secret\"\n" +
			        "node_api_secret_path = \"" + homedir + "/.diagonalley/main/.api_secret\"\n" +
			        "check_node_api_http_addr = \"http://node.niffler.org:3413\"\n" +
			        "owner_api_include_foreign = false\n" +
			        "data_file_dir = \"" + homedir + "/.diagonalley/main/wallet_data\"\n" +
			        "no_commit_cache = false\n" +
			        "dark_background_color_scheme = true\n" +
			        "keybase_notify_ttl = 1440\n" +
			        "[logging]\n" +
			        "log_to_stdout = true\n" +
			        "stdout_log_level = \"Debug\"\n" +
			        "log_to_file = true\n" +
			        "file_log_level = \"Info\"\n" +
			        "log_file_path = \"" + homedir + "/.diagonalley/main/grin-wallet.log\"\n" +
			        "log_file_append = true\n" +
			        "log_max_size = 16777216\n"
	        }

        }


        //overwrite to disk
        let result
        if(process.platform === "win32"){
            result = await fs.writeFile(homedir+"\\.diagonalley\\main\\grin-wallet.toml",output)
        }else{
            result = await fs.writeFile(homedir+"/.diagonalley/main/grin-wallet.toml",output)
        }
        console.log(tag,result)

    } catch (e) {
        console.error('e', e)
        throw Error('999: Unknown Error: ' + e.message)
    }
}

let writeHistoryToFile = async function (history) {
    let debug = true
    let tag = " | writeConfigFileWallet | "
    try {


        let csvFile = await raw_to_csv(history,"tx-report")

	    let result
        //overwrite to disk
        if(wallet713Enabled){
	        result = await fs.writeFile(process.env.HOME+"/.diagonalley/wallethistory.csv",csvFile)
        }else{
	        if(process.platform === "win32"){
		        result = await fs.writeFile(homedir+"\\.diagonalley\\wallethistory.csv",csvFile)
	        }else{
		        result = await fs.writeFile(homedir+"/.diagonalley/wallethistory.csv",csvFile)
	        }
        }

        return result
    } catch (e) {
        console.error('e', e)
        throw Error('999: Unknown Error: ' + e.message)
    }
}

let raw_to_csv = async function (data, title) {
    let tag = TAG+" | raw_to_csv | "
    try {
        // let fields = Object.keys(data[0])
        let fields = []

        // get all keys
        for (let i = 0; i < data.length; i++) {
            let entryFields = Object.keys(data[i])
            for (let j = 0; j < entryFields.length; j++) {
                fields.push(entryFields[j])
            }
        }

        fields = fields.filter(function (elem, pos) {
            return fields.indexOf(elem) == pos
        })

        //const result = new json2csv({ data: data, fields: fields })
        const json2csvParser = new json2csv({fields})
        const result = json2csvParser.parse(data);
        console.log(tag,"result: ",result)

        return result
    } catch (e) {
        console.error(tag,e)
        throw e
    }
}

let validate_address = async function (destination) {
    let tag = TAG + " | validate_address | "
    try {
        let isValid = false
        //
        let body = {}
	    console.log(tag,"validate_address: ",destination)

        // if(process.platform === "win32"){
        // destination = destination+"/v1/wallet/foreign/receive_tx"
        // }else{
        // destination = destination+"/v1/wallet/foreign/receive_tx"
        // }
        //destination = destination+"/v1/wallet/foreign/receive_tx"

        let options = {
            method: 'POST',
            uri: destination,
            body: body,
            json: true // Automatically stringifies the body to JSON
        };
        console.log(tag,"options: ",options)
        try{
            let result = await rp(options)
            console.log(tag,"result: ",result)
        }catch(e){
            //Weirdness
            //ERROR is normal
            console.log(tag,"e: ",e)
            //expect error.body to contain
            //TODO this is so fucking stupid, we need a REAL validate my god
            //undefined == wallet713
            //num_participants = core wallet
            //any variant = windows (1.0.2)
            // invalid type: map,= windows (1.1.0)
            if(e.toString().indexOf("undefined") >= 0 || e.toString().indexOf("num_participants") >= 0 || e.toString().indexOf("any variant of untagged enum VersionedSlate") >= 0 || e.toString().indexOf("Invalid request body: invalid type: map, expected a string at line 1 column 1") >= 0){
                isValid = true
            }
        }

        return isValid
    } catch (e) {
        console.error('e', e)
        throw e
    }
}

function toHexString(byteArray) {
    return Array.from(byteArray, function(byte) {
        return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('')
}

let convert_tx = function(tx){
    //TODO slate versioning
    console.log(Object.keys(tx))
    let txParams = Object.keys(tx)
    //
    for(let i = 0; i < txParams.length; i++){
        //param
        let param = txParams[i]
        //console.log("param: ",param)
        //value
        let value = tx[param]
        //console.log("value: ",value)

        //
        if(param === "tx"){
            tx.tx.offset = toHexString(tx.tx.offset)

            let body = tx.tx.body
            for(let j = 0; j < body.inputs.length; j++){
                body.inputs[j].commit = toHexString(body.inputs[j].commit)
            }

            for(let j = 0; j < body.outputs.length; j++){
                body.outputs[j].commit = toHexString(body.outputs[j].commit)
                body.outputs[j].proof = toHexString(body.outputs[j].proof)
            }

            for(let j = 0; j < body.kernels.length; j++){
                body.kernels[j].excess = toHexString(body.kernels[j].excess)
                body.kernels[j].excess_sig = toHexString(body.kernels[j].excess_sig)
            }
            tx.tx.body = body
        }

        if(param === "participant_data"){
            let data = tx['participant_data']
            //console.log("data: ",data)

            for(let j = 0; j < data.length; j++){
                //
                data[j].public_blind_excess = toHexString(data[j].public_blind_excess)

                data[j].public_nonce = toHexString(data[j].public_nonce)

                if(data[j].part_sig)data[j].part_sig = toHexString(data[j].part_sig)
            }
            console.log("data: ",data)
            tx['participant_data'] = data
        }

    }


    return tx
}

let saveTx = async function (payload) {
    let tag = TAG + " | validate_address | "
    try {

        //clean up tx (convert byte arrays to hex)
        let tx = payload.tx
        tx = convert_tx(tx)
	    payload.tx = tx

        store.set(payload.txid,payload)

        return true
    } catch (e) {
        console.error('e', e)
        throw e
    }
}


export default {
    sendGrin,
    generateEnv,
    startDaemon,       // use bash script to start grin executable
    initWallet,        // generate seed and start a new wallet (returns seed! display once and throw away!)
    detectSeedFile,    // detect if grin wallet has written a seed file to disk
    startWalletPrivate,
    startWalletPublic,
    turnOffTui,
    detectServerConfig,
    detectWalletConfig,
    detectDiagonConfig,
    detectApiKey,
    getApiKey,
    recheckWallet,
    detectTuiOn,
    writeConfigFileServer,
    readEnv,
    readServerConfig,
    readWalletConfig,
    readWallet713Config,
    deleteChainData,
	recoverWallet,
    deleteWalletConfigs,
    playChingle,
    writeConfigFileWallet,
    validate_address,
    displaySeed,
    writeHistoryToFile,
	saveTx
}
