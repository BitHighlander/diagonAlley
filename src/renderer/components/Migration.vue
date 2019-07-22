<template>

	<div class="modal" :class="{'is-active': showModal}">
		<div class="modal-background"></div>
		<div class="modal-card" style="width:480px">
			<header class="modal-card-head">
				{{ $t("msg.passwordTitle") }}

			</header>
			<section class="modal-card-body" style="height:380px;background-color: whitesmoke;">

				Migration view

				Found Niffler
				Fount wallet713
				Fount old diagonAlley


				<!--				<remove :showModal="openRemove"></remove>-->



			</section>
		</div>
	</div>

</template>
<script>

    import { messageBus } from '@/messagebus'
    import {version, grinNode, gnodeOption} from '../../modules/config'


    export default {
        name: "Migration",
        props: {
            showModal: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {

            }
        },
        beforeDestroy: function(){
            this.showModal = false
        },
        mounted() {
            //this.checkRunning()
            //this.$log.info('isfirst(login.vue)? '+isFirstTime())
            //this.firstTime = isFirstTime()
        },
        methods: {
            closeModal() {
                messageBus.$emit('close', 'windowPassword');
                this.clearup()
            },
        }
    }
</script>
<style>
	.center{
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
