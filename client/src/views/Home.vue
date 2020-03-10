<template>
  <div class="home">
    <Budget></Budget>
  </div>
</template>

<script>
// @ is an alias to /src
import Budget from '@/components/Budget.vue';

export default {
  name: 'Home',
  components: {
    Budget
  }
}
</script>
