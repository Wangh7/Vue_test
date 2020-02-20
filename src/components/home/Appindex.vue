<template>
  <div>
    hello world!
    <br><br>
    <button v-on:click="logoff">logoff</button>
  </div>
</template>

<script>
export default {
  name: 'Appindex',
  methods: {
    logoff () {
      this.$router.replace({path: '/login'})
    }
  }
}
</script>

<style scoped>

</style>
