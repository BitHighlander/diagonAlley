<template>
  <div>
    <p class="subtitle is-5">{{ $t("msg.info.spendable") }}:</p>
    <p class="title" v-bind:class="{'is-2':!smallTitle, 'is-4':smallTitle}">{{spendable}} ツ</p>
    <p>{{ $t("msg.info.total") }}: {{total}} ツ</p> 
    <p>{{ $t("msg.unconfirmed") }}: {{unconfirmed}} ツ</p>
    <p>{{ $t("msg.info.unfinalization") }}: {{unfinalization}} ツ</p>
    <p v-if="immature>0">{{ $t("msg.info.immature") }}: {{immature}} ツ</p>
    <p>{{ $t("msg.locked") }}: {{locked}} ツ</p>
  </div>
</template>

<script>
  import { messageBus } from '@/messagebus'

  export default {
    name: 'summary-info',
    data(){
      return {
        spendable: 0,
        total: 0,
        unconfirmed: 0,
        unfinalization: 0,
        immature: 0,
        locked: 0,
        smallTitle: false
      }
    },

    mounted () {
      this.getSummaryinfo()
    },
    created () {
      messageBus.$on('update', ()=>this.getSummaryinfo())
    },
    methods: {
      getSummaryinfo: function() {
        this.$walletService.getSummaryInfo(10)
          .then( (res) => {
            let data = res.data.result.Ok
            this.spendable = data[1]['amount_currently_spendable']/1000000000
            this.total = data[1]['total']/1000000000
            this.unconfirmed = data[1]['amount_awaiting_confirmation']/1000000000
            this.locked = data[1]['amount_locked']/1000000000
            this.unfinalization = data[1]['amount_awaiting_finalization']/1000000000
            this.immature = data[1]['amount_immature']/1000000000
            this.$dbService.setSpendable(this.spendable)

            if(this.spendable.toString().length > 6)this.smallTitle=true
          }).catch((error) => {
            this.$log.error('getSummaryinfo error:' + error)
            if (error.response) {   
              let resp = error.response      
              this.$log.error(`resp.data:${resp.data}; status:${resp.status};headers:${resp.headers}`)
            }
          })        
      }
    }
  }
</script>

<style>
</style>
