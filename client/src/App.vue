<template>
  <v-app>
    <Navbar />
    <v-content>
      <v-progress-linear
        v-if="loader"
        indeterminate
        color="primary"
      ></v-progress-linear>
      <router-view></router-view>
    </v-content>
    <v-footer padless class="footer-copyright">
      <v-col class="text-center" cols="12">
        {{ new Date().getFullYear() }} &copy; Felipe Chiapini -
        <strong>My Personal Finance</strong>
      </v-col>
    </v-footer>
  </v-app>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
import { mapState } from 'vuex'

export default {
  name: 'App',

  components: {
    Navbar
  },

  data: () => ({}),

  computed: {
    ...mapState('user', ['user']),
    ...mapState(['loader'])
  }
}
</script>
<style lang="sass">
.footer-copyright
  font-size: .75rem
  background-color: #ECEEF1 !important
  color: #495257 !important
  line-height: 1.5
</style>
