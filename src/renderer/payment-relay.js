import openSocket from 'socket.io-client';
import rp from 'request-promise-native'
const  socket = openSocket(process.env.REACT_APP_API_HOST,{reconnect: true, rejectUnauthorized: false});

const TAG = " | socket-api | "
console.log("SOCKET HOST: ",process.env.REACT_APP_API_HOST)


let send_post_request = async function (url,body) {
    let tag = TAG + " | send_post_request | "
    try {
        //url = "http://" + process.env.GRIN_USERNAME + ":" + process.env.GRIN_PASSWORD + "@" + url
        console.log(tag,"url: ",url)


        let options = {
            method: 'POST',
            uri: url,
            body: body,
            json: true // Automatically stratifies the body to JSON
        };

        let result = await rp(options)
        console.log(result)
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
            throw Error("102: Missconfiguration! invalid api secret!")
        }else if (errorCode === '500' && errorMessage.indexOf("Client Callback Error: Posting transaction slate") >= 0) {
            throw Error("102: invalid slate!")
        } else {
            log.error('e', e)
            throw Error("999: Unknown Error: " + e.message)
        }
    }
}

socket.on('payments', async function (message) {
    let tag = TAG + " | send_post_request | "
    try {
        console.log('orderUpdate: ',message)
        console.log('orderUpdate: ',typeof(message));
        if(typeof(message)==="string")message = JSON.parse(message)

        //chingle!
        var audio = new Audio('./src/renderer/assets/sounds/chaching.mp3');
        audio.play();

        //accept request to signs
        if(message.state === 'unsigned'){
            //TODO more validation

            //chingle!


            //make post
            //TODO config? meh
            let url = "http://127.0.0.1:3415/v1/wallet/foreign/receive_tx"
            let response = await send_post_request(url,message.payload)
            console.log("response: ",typeof(response))


            let payload = {}
            payload.user = message.user
            payload.event = "PushToSender"
            payload.state = "signed"
            payload.payload = response

            //emit it back
            socket.emit('payments', payload);
        }else{
            //ignore others
            //shouldnt normally hit?
            console.error(message)
            throw Error("101: unknown msg type")
        }
    } catch (e) {
        console.error(message)
    }
});


let joinEvent = {
    event:"announce",
    username:process.env.LOCAL_USER,
    status:"live",
    message:"user "+process.env.LOCAL_USER+" is online! ready to accept payments."
}
socket.emit('join',JSON.stringify(joinEvent))

let announce_online = function(socket){
    let joinEvent = {
        event:"announce",
        username:process.env.LOCAL_USER,
        status:"live",
        message:"user "+process.env.LOCAL_USER+" is online! ready to accept payments."
    }
    socket.emit('join',JSON.stringify(joinEvent))
}



socket.on('reconnect',async function(){
    announce_online(socket)
})