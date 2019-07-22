<template>

	<div class="modal" :class="{'is-active': showModal}">
		<div class="modal-background" @click="closeModal"></div>
		<div class="modal-card" style="width:480px">
			<header class="modal-card-head">

				<!--				<p class="modal-card-title is-size-4 has-text-link has-text-weight-semibold">{{ $t("msg.receive") }}(HTTP/HTTPS)</p>-->
				<!--				-->
				<button class="delete" aria-label="close" @click="closeModal"></button>
			</header>
			<section class="modal-card-body" style="height:380px;background-color: whitesmoke;">

				<h2>Check Public Api</h2>

			</section>
		</div>
	</div>

</template>
<script>

    import { messageBus } from '@/messagebus'


    export default {
        name: "CheckPublic",
        props: {
            showModal: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                username:'Harry Potter',
            }
        },
        beforeDestroy: function(){
            this.showModal = false
        },
        mounted() {
        },
        methods: {
            closeModal() {
                messageBus.$emit('close', 'windowCheckPublic');
            },
            checkForm(){
                //validate username

                //isTaken

                this.errors = []
                if (!this.account) {
                    this.errors.push(this.$t('msg.httpSend.WrongAddress'));
                }
                if (!this.errors.length) {
                    return true;
                }
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
