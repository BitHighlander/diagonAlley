<template>

	<div class="modal" :class="{'is-active': showModal}">
		<div class="modal-background"></div>
		<div class="modal-card" style="width:500px">
			<header class="modal-card-head">
				<p class="modal-card-title is-size-4 has-text-link has-text-weight-semibold">{{ $t("msg.check.title") }}</p>
			</header>
			<section class="modal-card-body" style="height:380px;background-color: whitesmoke;">
				<VueTerminal
						:intro="intro"
						console-sign="$"
						allow-arbitrary
						height="500px"
						@command="onCliCommand"
				></VueTerminal>
			</section>
		</div>
	</div>

</template>
<script>

    import { messageBus } from '@/messagebus'
    import Message from '@/components/Message'
    import { setTimeout } from 'timers';

    //

    export default {
        name: "Terminal",
        props: {
            showModal: {
                type: Boolean,
                default: false
            }
        },
        components: {
            Message,
            //VueTerminal
        },
        data() {
            return {
                intro: "Welcome to vue-terminal demo",
                checking:false,
                checked:false,
                checkOutputs: [],
                openStopMsg: false,
                stopMsg: this.$t("msg.check.stopCheckMsg"),
                commands: {
                    // yargs arguments
                    test: ({ color, _ }) => {
                        console.log("color",color)

                        // Return help since no match
                        return "testing"
                    }
                }
            }
        },
        created() {
            messageBus.$on('walletCheckFinished', ()=>{
                this.$log.debug('Got walletCheckFinished message.')

            })
        },
        methods: {
            onCliCommand(data, resolve, reject) {
                console.log(data);
                setTimeout(() => {
                    resolve("");
                }, 300);
            },

            updateOutput(data){
                this.checkOutputs.push(data)
            },

            closeModal() {
                if(!this.checking)this.clearup()
                messageBus.$emit('close', 'windowCheck');
            },

            clearup(){
                this.checking = false
                this.checked = false
                this.checkOutputs = []
                this.openStopMsg = false
                this.openCheckedMsg = false
            },
        }
    }
</script>
<style>

	.vue-command {
	.term {
		-webkit-border-radius: 8px;
		-moz-border-radius: 8px;
		border-radius: 8px;
	}

	.term-std {
		min-height: 300px;
		max-height: 300px;
		overflow-y: scroll;
	}
	}

	.center{
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
