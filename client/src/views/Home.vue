<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <Budget></Budget>
    <!-- <Income></Income>
    <Expense></Expense> -->
  </div>
</template>

<script>
// @ is an alias to /src
// import Income from '@/components/Income.vue';
// import Expense from '@/components/Expense.vue';
import Budget from '@/components/Budget.vue';

export default {
  name: 'Home',
  components: {
    Budget
    // Income,
    // Expense
  }
}
</script>
