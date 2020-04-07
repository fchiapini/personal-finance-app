<template>
  <div>
    <p>Hey, there, looks like you need a budget for {{ month }}</p>
    <v-btn class="ma-2" tile color="primary" dark>
      Starting planning for {{ month }}
    </v-btn>
  </div>
</template>

<script>
export default {
  props: {
    budgetDate: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped></style>
