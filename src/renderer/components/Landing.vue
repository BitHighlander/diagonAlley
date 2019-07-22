<template>
  <password v-if="walletExist"></password>
  <new v-else></new>
</template>
  
<script>
  import New from '@/components/New'
  import Password from '@/components/Password'

  export default {
    name: 'landing',
    components: {
      Password,
      New
    },
    props: {
      walletExist: false,
    },
}
</script>

<style>
</style>
