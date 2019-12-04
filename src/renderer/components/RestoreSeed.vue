<template>

	<div class="modal" :class="{'is-active': showModal}">
		<div class="modal-background"></div>
		<div class="modal-card" style="width:780px">
			<header class="modal-card-head"  style="">
				<p class="text-white">{{ $t("msg.restore.title") }}</p>

			</header>
			<section class="modal-card-body" style="height:480px; ">

				<!--				<remove :showModal="openRemove"></remove>-->
				<h1 class="title">{{ $t('msg.restore.title') }}</h1>
				<div v-if="page==='addSeeds'">

					<div>
						<div class="tabs wrap is-centered text-center" style="max-width:100%;border-width:thick ">
							<ul>
								<li :class="[ tabOpen === 'word1' ? 'is-active' : '']">
									<a @click="tabOpen='word1' " class="is-large">
										<input
												style="border:none;border-style: none;width: 70px;"
												v-model="word1" placeholder=""
												@paste="onPaste" >
									</a>1
								</li>
								<li :class="[ tabOpen === 'word2' ? 'is-active' : '']"><a
										@click="tabOpen='word2'">
									<input
											style="border: none; border-style: none;width: 70px; "
											v-model="word2" placeholder="" >
								</a>2
								</li>
								<li :class="[ tabOpen === 'word3' ? 'is-active' : '']"><a
										@click="tabOpen='word3'">
									<input
											style="border: none; border-style: none;width: 70px; "
											v-model="word3" placeholder="" >
								</a>3
								</li>
								<li :class="[ tabOpen === 'word4' ? 'is-active' : '']"><a
										@click="tabOpen='word4'">
									<input
											style="border: none; border-style: none;width: 70px; "
											v-model="word4" placeholder="" >
								</a>4
								</li>
								<li :class="[ tabOpen === 'word5' ? 'is-active' : '']"><a
										@click="tabOpen='word5'">
									<input
											style="border: none; border-style: none;width: 70px; "
											v-model="word5" placeholder="" >
								</a>5
								</li>
								<li :class="[ tabOpen === 'word6' ? 'is-active' : '']"><a
										@click="tabOpen='word6'">
									<input
											style="border: none; border-style: none;width: 70px; "
											v-model="word6" placeholder="" >
								</a>6
								</li>
							</ul>
						</div>
						<div class="tabs is-centered text-center">
							<ul>

								<li :class="[ tabOpen === 'word7' ? 'is-active' : '']">
									<a @click="tabOpen='word7'">
										<input
												style="border: none; border-style: none;width: 70px; "
												v-model="word7" placeholder="" >
									</a>7
								</li>
								<li :class="[ tabOpen === 'word8' ? 'is-active' : '']"><a
										@click="tabOpen='word8'">
									<input
											style="border: none; border-style: none;width: 70px; "
											v-model="word8" placeholder="" >
								</a>8
								</li>
								<li :class="[ tabOpen === 'word9' ? 'is-active' : '']"><a
										@click="tabOpen='word9'">
									<input
											style="border: none; border-style: none;width: 70px; "
											v-model="word9" placeholder="" >
								</a>9
								</li>
								<li :class="[ tabOpen === 'word10' ? 'is-active' : '']"><a
										@click="tabOpen='word10'">
									<input
											style="border: none; border-style: none;width: 70px; "
											v-model="word10" placeholder="" >
								</a>10
								</li>
								<li :class="[ tabOpen === 'word11' ? 'is-active' : '']"><a
										@click="tabOpen='word11'">
									<input
											style="border: none; border-style: none;width: 70px; "
											v-model="word11" placeholder="" >
								</a>11
								</li>
								<li :class="[ tabOpen === 'word12' ? 'is-active' : '']"><a
										@click="tabOpen='word12'">
									<input
											style="border: none; border-style: none;width: 70px; "
											v-model="word12" placeholder="" >
								</a>12
								</li>
							</ul>
						</div>
						<div class="tabs wrap is-centered text-center" style="max-width:100%;border-width:thick ">
							<ul>
								<li :class="[ tabOpen === 'word13' ? 'is-active' : '']"><a
										@click="tabOpen='word13'">
									<input
											style="border: none; border-style: none;width: 70px; "
											v-model="word13" placeholder="" >
								</a>13
								<li :class="[ tabOpen === 'word14' ? 'is-active' : '']"><a
										@click="tabOpen='word14'">
									<input
											style="border: none; border-style: none;width: 70px; "
											v-model="word14" placeholder="" >
								</a>14
								</li>
								<li :class="[ tabOpen === 'word15' ? 'is-active' : '']"><a
										@click="tabOpen='word15'">
									<input
											style="border: none; border-style: none;width: 70px; "
											v-model="word15" placeholder="" >
								</a>15
								</li>
								<li :class="[ tabOpen === 'word16' ? 'is-active' : '']"><a
										@click="tabOpen='word16'">
									<input
											style="border: none; border-style: none;width: 70px; "
											v-model="word16" placeholder="" >
								</a>16
								</li>
								<li :class="[ tabOpen === 'word17' ? 'is-active' : '']"><a
										@click="tabOpen='word17'">
									<input
											style="border: none; border-style: none;width: 70px; "
											v-model="word17" placeholder="" >
								</a>17
								</li>
								<li :class="[ tabOpen === 'word18' ? 'is-active' : '']"><a
										@click="tabOpen='word18'">
									<input
											style="border: none; border-style: none;width: 70px; "
											v-model="word18" placeholder="" >
								</a>18
								</li>
							</ul>
						</div>
						<div class="tabs is-centered text-center">
							<ul>
								<li :class="[ tabOpen === 'word19' ? 'is-active' : '']">
									<a @click="tabOpen='word19'">
										<input
												style="border: none; border-style: none;width: 70px; "
												v-model="word19" placeholder="" >
									</a>19
								</li>
								<li :class="[ tabOpen === 'word20' ? 'is-active' : '']">
									<a @click="tabOpen='word20'">
										<input
												style="border: none; border-style: none;width: 70px; "
												v-model="word20" placeholder="" >
									</a>20
								</li>
								<li :class="[ tabOpen === 'word21' ? 'is-active' : '']"><a
										@click="tabOpen='word21'">
									<input
											style="border: none; border-style: none;width: 70px; "
											v-model="word21" placeholder="" >
								</a>21
								</li>
								<li :class="[ tabOpen === 'word22' ? 'is-active' : '']"><a
										@click="tabOpen='word22'">
									<input
											style="border: none; border-style: none;width: 70px; "
											v-model="word22" placeholder="" >
								</a>22
								</li>
								<li :class="[ tabOpen === 'word23' ? 'is-active' : '']"><a
										@click="tabOpen='word23'">
									<input
											style="border: none; border-style: none;width: 70px; "
											v-model="word23" placeholder="" >
								</a>23
								</li>
								<li :class="[ tabOpen === 'word24' ? 'is-active' : '']"><a
										@click="tabOpen='word24'">
									<input
											style="border: none; border-style: none;width: 70px; "
											v-model="word24" placeholder="" >
								</a>24
								</li>
							</ul>
						</div>
					</div>
					<button class="button is-link  is-outlined" @click="page='addPassword'">
						{{ $t('msg.restore.add') }}
					</button>
				</div>

				<div v-else-if="page==='addPassword'">
					<p class="has-text-weight-semibold has-text-warning"
					   style="margin-bottom:12px">
						{{ $t('msg.restore.newPassword') }}
					</p>
					<div class="box" style="width:380px">

						<div class="field">
							<label class="label">{{ $t('msg.password') }}</label>
							<div class="control">
								<input class="input" type="password" placeholder="********" required
									   :class="{'is-warning': errorPassword}" v-model="password">
							</div>
						</div>

						<div class="field">
							<label class="label">{{ $t('msg.passwordAgain') }}</label>
							<div class="control">
								<input class="input" type="password" placeholder="********" required
									   :class="{'is-warning': errorPassword}" v-model="password2">
							</div>
							<p class="help is-warning" v-if="errorPassword">{{errorInfoPassword}}</p>
						</div>

						<div class="field">
							<button class="button is-link" @click="createWallet" >
								{{ $t('msg.restore.recover') }}</button>
							<button class="button is-text" @click="back">
								{{ $t("msg.back") }}</button>
						</div>
					</div>
				</div>

				<div v-else-if="page==='recoverError'">
					<div class="notification is-warning">
						<p>{{recoverErrorInfo}}</p>
					</div>

					<button class="button is-link  is-outlined" @click="page='addSeeds'">
						{{ $t('msg.restore.reAdd') }}
					</button>
				</div>
				<div v-else-if="page==='recovered'">
					<div class="animated bounce has-text-weight-semibold has-text-warning"
						 style="animation-iteration-count:2;margin-bottom:10px">
						<p>{{ $t('msg.restore.recovered') }} </p>
						<p>{{ $t('msg.restore.restoring') }}</p>
					</div>
					<div v-if="restoreOutputs.length > 0">
						<div class="message is-link" style="width:400px">
							<div class="message-body">
								<div class="control">
									<p class="is-size-7" v-for="output in restoreOutputs">{{ output }}</p>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div v-else-if="page==='restored'">
					<p class="animated bounce has-text-weight-semibold has-text-warning is-size-5"
					   style="animation-iteration-count:2;margin-bottom:40px">
						{{ $t('msg.restore.restored') }}
					</p>
					<a class="button is-link  is-outlined" @click="toLogin">{{ $t('msg.restore.login') }}</a>
				</div>


			</section>
		</div>
	</div>

</template>
<script>

    import { messageBus } from '@/messagebus'


    export default {
        name: "RestoreSeed",
        props: {
            showModal: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                tabOpen: 'word1',
                currentSeed: '',
                currentSeedInvalid: false,
                enoughSeeds: true,
                seeds:[],
                password: '',
                password2: '',
                total: 23,
                page: 'addSeeds',
                errorPassword: false,
                errorInfoPassword: '',
                recoverErrorInfo: '',
                restoreOutputs: [],
                word1:'',
                word2:'',
                word3:'',
                word4:'',
                word5:'',
                word6:'',
                word7:'',
                word8:'',
                word9:'',
                word10:'',
                word11:'',
                word12:'',
                word13:'',
                word14:'',
                word15:'',
                word16:'',
                word17:'',
                word18:'',
                word19:'',
                word20:'',
                word21:'',
                word22:'',
                word23:'',
                word24:'',
            }
        },
        created(){
            messageBus.$on('walletRecoverReturn', (ret)=>{
                if(ret === 'ok'){
                    this.page = 'recovered'
                    this.$walletService.restore(this.password, this.updateOutput)
                }else if(ret === 'invalidSeeds'){
                    this.page = 'recoverError'
                    this.recoverErrorInfo = this.$t('msg.restore.invalid')
                }else{
                    this.page = 'recoverError'
                    this.recoverErrorInfo = ret
                }
            })
            messageBus.$on('walletRestored', (ret)=>{
                this.$log.info('walletRestored!')
                this.closeModal()
            })
            messageBus.$on('walletRecoverReturnError', (ret)=>{
                this.error = ret
            })
            messageBus.$on('walletRecoverReturnExit', (code)=>{
                this.$log.info('walletRecoverReturnExit!')

				if(code === 0){
				    //close modal
					this.closeModal()

					//open register
                    messageBus.$emit('open', 'windowRegister');
				} else {
                    this.$log.error("exit code: ",code)
				}
            })
        },
        watch: {
            seeds:function(newVal, oldVal){
                if(newVal.length == this.total){
                    this.enoughSeeds = true
                }else{
                    this.enoughSeeds = true
                }
            },
            word1: function (val) {
                //validate word
                this.$log.debug("val: ",val)

                //edge case, if whole seed
                //val = val.split("\n")
                val = val.split(" ")
                this.$log.info("val2: ",val)
                this.word1 = val[0]
            },
            word12: function (val) {

            }
        },
        beforeDestroy: function(){
            this.showModal = false
        },
        mounted() {

        },
        methods: {
            createWallet(){
                this.$log.info('initR: Checkpoint')
                this.resetErrors()
                if(this.password.length == 0 ){
                    this.errorPassword = true
                    this.errorInfoPassword = this.$t('msg.create.errorPasswdEmpty')
                    return
                }
                if(this.password != this.password2 ){
                    this.errorPassword = true
                    this.errorInfoPassword = this.$t('msg.create.errorPasswdConsistency')
                    return
                }
                this.$walletService.recover(this.seeds.join(' '), this.password)

				//this.closeModal()
            },
            // async createWallet(){
            //     if(!this.password) throw Error("102:  can't create wallet without seed! ")
            //     this.$log.debug(this.seeds)
			//
			//
            //     const cryptr = new Cryptr(this.password);
            //     const hash = bcrypt.hashSync(this.password, 10);
			//
            //     //encrypt seeds
            //     const encryptedString = cryptr.encrypt(this.seeds);
            //     this.$log.debug('encryptedString: ',encryptedString)
			//
            //     await initWallet(encryptedString,hash)
			//
			//
            //     this.closeModal()
            //     messageBus.$emit('open','windowPassword')
            // },
            onPaste (evt) {
                this.$log.debug('on paste', evt)
                this.$log.debug('on paste', evt.clipboardData.getData('Text'))
                let seedWords = evt.clipboardData.getData('Text')
                seedWords = seedWords.split(" ")
                this.$log.info('seedWords', seedWords)
                this.$log.info('seedWords 12', seedWords[11])
                this.$log.info('seedWords 13', seedWords[12])
                this.$log.info('seedWords 14', seedWords[13])
                this.$log.info('seedWords 15', seedWords[14])

                for(let i = 0; i < seedWords.length; i++){
                    this.seeds.push(seedWords[i].trim().replace(/\W/g, ''))
                }

                //this.word1 = seedWords[0].trim().replace(/\W/g, '')
                this.word2 = seedWords[1].trim().replace(/\W/g, '')
                this.word3 = seedWords[2].trim().replace(/\W/g, '')
                this.word4 = seedWords[3].trim().replace(/\W/g, '')
                this.word5 = seedWords[4].trim().replace(/\W/g, '')
                this.word6 = seedWords[5].trim().replace(/\W/g, '')
                this.word7 = seedWords[6].trim().replace(/\W/g, '')
                this.word8 = seedWords[7].trim().replace(/\W/g, '')
                this.word9 = seedWords[8].trim().replace(/\W/g, '')
                this.word10 = seedWords[9].trim().replace(/\W/g, '')
                this.word11 = seedWords[10].trim().replace(/\W/g, '')
                this.word12 = seedWords[11].trim().replace(/\W/g, '')
                this.word13 = seedWords[12].trim().replace(/\W/g, '')
                this.word14 = seedWords[13].trim().replace(/\W/g, '')
                this.word15 = seedWords[14].trim().replace(/\W/g, '')
                this.word16 = seedWords[15].trim().replace(/\W/g, '')
                this.word17 = seedWords[16].trim().replace(/\W/g, '')
                this.word18 = seedWords[17].trim().replace(/\W/g, '')
                this.word19 = seedWords[18].trim().replace(/\W/g, '')
                this.word20 = seedWords[19].trim().replace(/\W/g, '')
                this.word21 = seedWords[20].trim().replace(/\W/g, '')
                this.word22 = seedWords[21].trim().replace(/\W/g, '')
                this.word23 = seedWords[22].trim().replace(/\W/g, '')
                this.word24 = seedWords[23].trim().replace(/\W/g, '')

                //this.word1 = seedWords[0]

                this.enoughSeeds = true

                return true
            },
            closeModal() {
                messageBus.$emit('close', 'windowRestoreSeed');
            },
            clearup(){
                this.enoughSeeds = false
                this.currentSeed = ''
                this.currentSeedInvalid = false
                this.seeds = []
                this.password =''
                this.password2 = ''
                this.page = 'addSeeds'
                this.errorPassword = false
                this.errorInfoPassword = ''
                this.recoverErrorInfo = ''

                this.restoreOutputs =[]
            },

            updateOutput(data){
                //let toDel = 'grin_wallet_libwallet::internal::restore'
                //this.restoreOutputs.push(data.replace(toDel, '').replace('WARN', ''))
                this.restoreOutputs.push(data)
            },

            validSeed(seed) {
                let re = /^[A-Za-z]+$/
                return re.test(seed)
            },
            add(){

                if(!this.word1) this.error("")

            },
            resetErrors(){
                this.errorPassword = false;
            },
            delete_(){
                if(this.seeds.length>0)this.seeds.pop()
            },
            initR(){
                this.resetErrors()
                if(this.password.length == 0 ){
                    this.errorPassword = true
                    this.errorInfoPassword = this.$t('msg.create.errorPasswdEmpty')
                    return
                }
                if(this.password != this.password2 ){
                    this.errorPassword = true
                    this.errorInfoPassword = this.$t('msg.create.errorPasswdConsistency')
                    return
                }
                this.$walletService.recover(this.seeds.join(' '), this.password)
            },
            back(){
                //this.clearup()
                this.closeModal()
                messageBus.$emit('open','windowWelcome')
            },
            toLogin(){
                //this.clearup()
                messageBus.$emit('restoredThenLogin')
            }

        }
    }
</script>
<style>
	.hz-label-150 div.field-label {
		min-width: 150px;
	}

	.hz-label-200 div.field-label {
		min-width: 200px;
	}

	.hz-label-250 div.field-label {
		min-width: 250px;
	}

	.hz-label-300 div.field-label {
		min-width: 300px;
	}

	.hz-label-150 div.field.is-horizontal,
	.hz-label-200 div.field.is-horizontal,
	.hz-label-250 div.field.is-horizontal,
	.hz-label-300 div.field.is-horizontal
	{
		margin-bottom: 0.75rem;
	}

	#odd-fix ol li {
		display: inline-block;
		width: 100%;
	}

	ol {
		list-style: none;
		counter-reset: my-awesome-counter;
	}
	ol li {
		counter-increment: my-awesome-counter;
	}
	ol li::before {
		content: counter(my-awesome-counter) ". ";
		color: red;
		font-weight: bold;
	}


	ol {
		margin: 0 0 30px 20px;
		columns: 4;
		-webkit-columns: 4;
		-moz-columns: 4;
		column-gap: 30px;
		-webkit-column-gap: 30px;
		-moz-column-gap: 30px;
	}

	ol li {
		margin: 0 0 10px 0;
	}


	.center{
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
