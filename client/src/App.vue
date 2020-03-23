<template>
  <v-app>
    <Navbar />
    <v-content>
      <router-view></router-view>
    </v-content>
    <v-card height="150">
      <v-footer absolute class="font-weight-medium" color="primary" dark>
        <v-col class="text-center" cols="12">
          {{ new Date().getFullYear() }} —
          <strong>My Personal Finance - by Felipe</strong>
        </v-col>
      </v-footer>
    </v-card>
  </v-app>
</template>

<script>
import Navbar from '@/components/Navbar.vue'

export default {
  name: 'App',

  components: {
    Navbar
  },

  data: () => ({})
}
</script>
