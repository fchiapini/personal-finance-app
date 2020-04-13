<template>
  <v-expansion-panels flat multiple hover :value="panels">
    <v-expansion-panel
      v-for="(category, index) in expenseCategories"
      :key="index"
    >
      <v-expansion-panel-header
        class="subtitle-1 font-weight-bold cyan--text text--darken-1"
      >
        {{ category }}
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-row>
          <v-col cols="12">
            <v-simple-table>
              <tbody>
                <tr
                  v-for="(expense, index) in expenses.filter(
                    (expense) => expense.category === category
                  )"
                  :key="index"
                  class="grey--text text--darken-2"
                >
                  <td class="body-2" @click="editItem(expense)">
                    {{ expense.description }}
                  </td>
                  <td class="body-2" @click="editItem(expense)">
                    {{ expense.amount | currency }}
                  </td>
                  <td>
                    <v-icon small @click="deleteItem(expense)">
                      mdi-close
                    </v-icon>
                  </td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-col>
        </v-row>
        <v-divider></v-divider>
        <v-expansion-panels flat>
          <v-expansion-panel>
            <v-expansion-panel-header class="pt-2 pr-0 pb-0 pl-0">
              <v-row>
                <v-col cols="12" class="cyan--text">
                  <v-icon>mdi-plus</v-icon>
                  Add Item
                </v-col>
              </v-row>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-form @submit.prevent="save(category)">
                <v-row>
                  <v-col cols="12" md="5">
                    <v-select
                      v-model="newExpense.description"
                      :items="expenseCategoryDescriptions"
                      :error-messages="selectErrors"
                      label="Expense"
                      outlined
                      dense
                      clearable
                      autofocus
                      required
                      @change="$v.newExpense.description.$touch()"
                      @blur="$v.newExpense.description.$touch()"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      type="number"
                      v-model.number="newExpense.amount"
                      :error-messages="amountErrors"
                      label="Amount"
                      outlined
                      dense
                      required
                      @input="$v.newExpense.amount.$touch()"
                      @blur="$v.newExpense.amount.$touch()"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="2">
                    <v-btn
                      type="submit"
                      :disabled="$v.newExpense.$invalid"
                      block
                      color="primary"
                      large
                      class="white--text"
                    >
                      <v-icon>mdi-plus</v-icon>
                      Add Expense
                    </v-btn>
                  </v-col>
                </v-row>
              </v-form>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-expansion-panel-content>
    </v-expansion-panel>
    <v-dialog v-model="dialog" width="350">
      <v-card>
        <v-card-text>
          <v-form @submit.prevent="save">
            <v-row>
              <v-col cols="12">
                <v-select
                  v-model="editedItem.description"
                  :items="expenseCategoryDescriptions"
                  :error-messages="selectEditedItemErrors"
                  label="Expense"
                  outlined
                  dense
                  clearable
                  required
                  @change="$v.editedItem.description.$touch()"
                  @blur="$v.editedItem.description.$touch()"
                ></v-select>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  type="number"
                  v-model.number="editedItem.amount"
                  :error-messages="amountEditedItemErrors"
                  label="Amount"
                  outlined
                  dense
                  required
                  @input="$v.editedItem.amount.$touch()"
                  @blur="$v.editedItem.amount.$touch()"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-btn
                  type="submit"
                  :disabled="$v.editedItem.$anyError"
                  block
                  color="green"
                  x-large
                  class="white--text"
                >
                  <v-icon>mdi-send</v-icon>
                  Update
                </v-btn>
              </v-col>
              <v-col cols="12">
                <v-btn
                  block
                  outlined
                  color="primary"
                  x-large
                  class="white--text"
                  @click="close"
                >
                  <v-icon>mdi-close</v-icon>
                  Cancel
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-expansion-panels>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  required,
  decimal,
  minValue,
  maxLength
} from 'vuelidate/lib/validators'
export default {
  name: 'Expense',

  props: {
    date: {
      type: String,
      required: true
    },
    expenses: {
      type: Array,
      required: true
    }
  },

  validations: {
    newExpense: {
      description: { required },
      amount: {
        required,
        decimal,
        maxLength: maxLength(15),
        minValue: minValue(1)
      }
    },
    editedItem: {
      description: { required },
      amount: {
        required,
        decimal,
        maxLength: maxLength(15),
        minValue: minValue(1)
      }
    }
  },

  data: () => ({
    dialog: false,
    panels: [],
    newExpense: {
      category: '',
      amount: 0,
      description: ''
    },
    editedIndex: -1,
    editedItem: {
      category: '',
      amount: 0,
      description: ''
    },
    defaultItem: {
      category: '',
      amount: 0,
      description: ''
    }
  }),

  created() {
    this.panels = this.expenseCategories.map((category, index) => index)
  },

  computed: {
    ...mapGetters('budget', [
      'expenseCategories',
      'expenseCategoryDescriptions'
    ]),
    selectErrors() {
      const errors = []
      if (!this.$v.newExpense.description.$dirty) return errors
      !this.$v.newExpense.description.required &&
        errors.push('Description required!')
      return errors
    },
    amountErrors() {
      const errors = []
      if (!this.$v.newExpense.amount.$dirty) return errors
      !this.$v.newExpense.amount.decimal &&
        errors.push('Amount must be a valid number')
      !this.$v.newExpense.amount.required && errors.push('Amount required!')
      !this.$v.newExpense.amount.minValue &&
        errors.push('Amount must be higher than zero!')
      !this.$v.newExpense.amount.maxLength && errors.push('Amount too large!')
      return errors
    },
    selectEditedItemErrors() {
      const errors = []
      if (!this.$v.editedItem.description.$dirty) return errors
      !this.$v.editedItem.description.required &&
        errors.push('Description required!')
      return errors
    },
    amountEditedItemErrors() {
      const errors = []
      if (!this.$v.editedItem.amount.$dirty) return errors
      !this.$v.editedItem.amount.decimal &&
        errors.push('Amount must be a valid number')
      !this.$v.editedItem.amount.required && errors.push('Amount required!')
      !this.$v.editedItem.amount.minValue &&
        errors.push('Amount must be higher than zero!')
      !this.$v.editedItem.amount.maxLength && errors.push('Amount too large!')
      return errors
    },
    totalExpensesOfMonth() {
      return this.expenses
        .map((expense) => expense.amount)
        .reduce((accumulator, currentValue) => accumulator + currentValue, 0)
    }
  },

  watch: {
    dialog(val) {
      val || this.close()
    }
  },

  methods: {
    editItem(item) {
      this.editedIndex = this.expenses.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem(item) {
      const index = this.expenses.indexOf(item)
      this.$store.dispatch('budget/deleteItem', {
        date: this.date,
        index: index,
        budgetAttr: 'expenses'
      })
    },

    close() {
      this.dialog = false
      this.$v.$reset()
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },

    save(category) {
      if (this.editedIndex > -1 && !this.$v.editedItem.$invalid) {
        this.$store.dispatch('budget/updateItem', {
          date: this.date,
          index: this.editedIndex,
          editedItem: this.editedItem,
          budgetAttr: 'expenses'
        })
      } else if (!this.$v.newExpense.$invalid) {
        this.newExpense.category = category
        this.$store
          .dispatch('budget/addItem', {
            date: this.date,
            newItem: this.newExpense,
            budgetAttr: 'expenses'
          })
          .then(() => (this.newExpense = this.createFreshObject()))
      }
      this.close()
    },
    createFreshObject() {
      return {
        category: '',
        amount: 0,
        description: ''
      }
    }
  }
}
</script>
