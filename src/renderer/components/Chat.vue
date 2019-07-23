<!--<template>-->
<!--	<div class="tile is-ancestor">-->
<!--		<div class="tile is-4 is-vertical is-parent">-->
<!--			<div class="tile is-child box">-->
<!--				<h3>Usernames</h3>-->
<!--				<div class="list-group members-group overflow: auto;">-->

<!--					<div class="list-group-item member-item justify-content-between bg-faded"-->
<!--						v-for="(value, key) in members">-->
<!--						<div @click="selectUser(value)">-->
<!--&lt;!&ndash;							<img v-bind:src="value.avatar" class="rounded-circle mr-1" @click="selectUser(value)">&ndash;&gt;-->
<!--&lt;!&ndash;							<small> {{ value.username }}</small>&ndash;&gt;-->
<!--						</div>-->
<!--					</div>-->
<!--				</div>-->

<!--			</div>-->
<!--		</div>-->
<!--		<div class="tile is-parent">-->
<!--			<div class="tile is-child box">-->
<!--				<h3>Messages</h3>-->
<!--				<div class="panel list-group">-->

<!--					<img v-for="message in messages">-->
<!--						<img v-bind:src="message.avatar" class="rounded-circle float-left mr-2" height="32" width="32"></img>-->
<!--						<a class="panel-block list-group-item">{{message.message }}</a>-->
<!--						<small class="float-right">-->

<!--							{{ message.username }}-->
<!--							@-->
<!--							{{formatMessageDate(message.date) }}</small>-->

<!--					</div>-->

<!--					<div class="content">-->
<!--						&lt;!&ndash; Content &ndash;&gt;-->
<!--						<div class="input-group">-->
<!--							<input type="text" class="form-control" v-model="message"-->
<!--								   v-on:keyup.enter="send" placeholder="Message text...">-->
<!--							<span class="input-group-btn">-->
<!--                                <a class="button" @click="">submit</a>-->
<!--                                </span>-->
<!--						</div>-->
<!--					</div>-->



<!--				</div>-->




<!--		</div>-->

<!--	</div>-->
<!--</template>-->

<!--<script>-->
<!--    import { messageBus } from '@/messagebus'-->
<!--    import {version} from '../../modules/config'-->
<!--    import openSocket from 'socket.io-client';-->
<!--    import moment from 'moment';-->

<!--    //sub to service-->
<!--    let domain-->
<!--    if(process.env.NODE_ENV === "development"){-->
<!--        domain = process.env.VUE_APP_SERVICE_HOSTNAME || "http://diagonalley.io"-->
<!--        console.log("********* domain: ",domain)-->
<!--    } else {-->
<!--        domain = "http://diagonAlley.io"-->
<!--    }-->
<!--    // const socket = openSocket(domain, {reconnect: true, rejectUnauthorized: false});-->

<!--    export default {-->
<!--        name: "Chat",-->
<!--        data() {-->
<!--            return {-->
<!--                message:"",-->
<!--                online:[],-->
<!--                members: [],-->
<!--                messages: [],-->
<!--            }-->
<!--        },-->
<!--        created(){-->
<!--            //start sockets-->
<!--            /***************************************-->
<!--             //CHAT-->
<!--             //**************************************/-->
<!--            // socket.on('messages', function(message) {-->
<!--            //     this.messages.push(message);-->
<!--            //     //this.updateScroll()-->
<!--            // }.bind(this));-->
<!--            // socket.on('member_add', function(member) {-->
<!--            //     //Vue.set(this.members, member.socket, member);-->
<!--            // }.bind(this));-->
<!--            // socket.on('member_delete', function(socket_id) {-->
<!--            //     //Vue.delete(this.members, socket_id);-->
<!--            // }.bind(this));-->
<!--            // socket.on('message_history', function(messages) {-->
<!--            //     console.log("messages: ",messages)-->
<!--            //     this.messages = messages;-->
<!--            // }.bind(this));-->
<!--            // // socket.on('member_history', function(members) {-->
<!--            // //     this.members = members;-->
<!--            // // }.bind(this));-->


<!--            //get online users-->
<!--            this.$http-->
<!--                .get(domain+"/online")-->
<!--                .then(response => {-->
<!--                    this.$log.info("response: ", response.data)-->
<!--                    this.$log.info("response: ", typeof(response.data))-->
<!--                    let users = Object.keys(response.data)-->
<!--                    this.$log.info("users: ", users)-->

<!--                    //TODO remove yourself-->
<!--                    let members = []-->
<!--                    for(let i = 0; i < users.length; i++){-->
<!--                        //-->
<!--                        let member = {}-->
<!--                        member.username = users[i]-->
<!--                        member.avatar = "http://api.adorable.io/avatars/30/" + users[i] + '.png'-->
<!--                        members.push(member)-->
<!--                    }-->

<!--                    this.online = users-->
<!--                    this.members = members-->
<!--                })-->
<!--                .catch((e) => {-->
<!--                    this.error = true;-->
<!--                    this.error = e;-->
<!--                });-->
<!--        },-->
<!--        methods: {-->
<!--            selectUser: function (user) {-->
<!--                this.$log.info("user: ", user)-->
<!--                this.$log.info("user: ", user.username)-->
<!--                //set destination-->
<!--                messageBus.$emit('usernameSelected', user.username);-->
<!--                messageBus.$emit('selectTab', 'wallet');-->
<!--				//change tab-->

<!--            },-->
<!--            formatMessageDate: function (date) {-->
<!--                return moment(date).format("h:mm:ss a");-->
<!--            },-->
<!--            send: function () {-->

<!--                // let message = {}-->
<!--                // message.username = this.username-->
<!--                // message.payload = this.message-->
<!--                // socket.emit('send', JSON.stringify(message));-->
<!--                // this.message = '';-->
<!--            },-->
<!--        }-->
<!--    }-->
<!--</script>-->

<!--<style scoped>-->

<!--</style>-->