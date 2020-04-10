<template>
  <v-expansion-panels :value="[0]" accordion tile multiple hover>
    <v-expansion-panel>
      <v-expansion-panel-header>Monthly Income</v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-row>
          <v-col cols="12">
            <v-dialog v-model="dialog" width="350">
              <template v-slot:activator="{ on }">
                <v-simple-table>
                  <template v-slot:default>
                    <tbody>
                      <tr v-for="(income, index) in incomes" :key="index">
                        <td v-on="on" @click="editItem(income)">
                          {{ income.category }}
                        </td>
                        <td v-on="on" @click="editItem(income)">
                          {{ income.amount | currency }}
                        </td>
                        <td>
                          <v-icon small @click="deleteItem(income)">
                            mdi-close
                          </v-icon>
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </template>
              <v-card>
                <v-card-text>
                  <v-form @submit.prevent="save">
                    <v-row>
                      <v-col cols="12">
                        <v-select
                          v-model="editedItem.category"
                          :items="incomeCategories"
                          :error-messages="selectEditedItemErrors"
                          label="Income"
                          outlined
                          clearable
                          required
                          @change="$v.editedItem.category.$touch()"
                          @blur="$v.editedItem.category.$touch()"
                        ></v-select>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          type="number"
                          v-model.number="editedItem.amount"
                          :error-messages="amountEditedItemErrors"
                          label="Amount"
                          outlined
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
          </v-col>
        </v-row>
      </v-expansion-panel-content>
    </v-expansion-panel>
    <v-expansion-panel>
      <v-expansion-panel-header>
        <v-row>
          <v-col cols="12">
            <v-icon>mdi-plus</v-icon>
            Add Income
          </v-col>
        </v-row>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-form @submit.prevent="save">
          <v-row>
            <v-col cols="12" md="5">
              <v-select
                v-model="newIncome.category"
                :items="incomeCategories"
                :error-messages="selectErrors"
                label="Income"
                outlined
                clearable
                autofocus
                required
                @change="$v.newIncome.category.$touch()"
                @blur="$v.newIncome.category.$touch()"
              ></v-select>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                type="number"
                v-model.number="newIncome.amount"
                :error-messages="amountErrors"
                label="Amount"
                outlined
                required
                @input="$v.newIncome.amount.$touch()"
                @blur="$v.newIncome.amount.$touch()"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="2">
              <v-btn
                type="submit"
                :disabled="$v.newIncome.$invalid"
                block
                color="green"
                x-large
                class="white--text"
              >
                <v-icon>mdi-plus</v-icon>
                Add Income
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-expansion-panel-content>
    </v-expansion-panel>
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
  name: 'Income',

  props: {
    date: {
      type: String,
      required: true
    },
    incomes: {
      type: Array,
      required: true
    }
  },

  validations: {
    newIncome: {
      category: { required },
      amount: {
        required,
        decimal,
        maxLength: maxLength(15),
        minValue: minValue(1)
      }
    },
    editedItem: {
      category: { required },
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
    newIncome: {
      category: '',
      amount: 0
    },
    editedIndex: -1,
    editedItem: {
      category: '',
      amount: 0
    },
    defaultItem: {
      category: '',
      amount: 0
    }
  }),

  computed: {
    ...mapGetters('budget', ['incomeCategories']),
    selectErrors() {
      const errors = []
      if (!this.$v.newIncome.category.$dirty) return errors
      !this.$v.newIncome.category.required &&
        errors.push('Category income required!')
      return errors
    },
    amountErrors() {
      const errors = []
      if (!this.$v.newIncome.amount.$dirty) return errors
      !this.$v.newIncome.amount.decimal &&
        errors.push('Amount must be a valid number')
      !this.$v.newIncome.amount.required && errors.push('Amount required!')
      !this.$v.newIncome.amount.minValue &&
        errors.push('Amount must be higher than zero!')
      !this.$v.newIncome.amount.maxLength && errors.push('Amount too large!')
      return errors
    },
    selectEditedItemErrors() {
      const errors = []
      if (!this.$v.editedItem.category.$dirty) return errors
      !this.$v.editedItem.category.required &&
        errors.push('Category income required!')
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

    totalIncomesOfMonth() {
      return this.incomes
        .map((income) => income.amount)
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
      this.editedIndex = this.incomes.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem(item) {
      const index = this.incomes.indexOf(item)
      this.$store.dispatch('budget/deleteItem', {
        date: this.date,
        index: index,
        budgetAttr: 'incomes'
      })
    },

    close() {
      this.dialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },

    save() {
      this.$v.$touch()
      if (this.editedIndex > -1 && !this.$v.editedItem.$invalid) {
        this.$store.dispatch('budget/updateItem', {
          date: this.date,
          index: this.editedIndex,
          editedItem: this.editedItem,
          budgetAttr: 'incomes'
        })
      } else if (!this.$v.newIncome.$invalid) {
        this.$store
          .dispatch('budget/addItem', {
            date: this.date,
            newItem: this.newIncome,
            budgetAttr: 'incomes'
          })
          .then(() => (this.newIncome = this.createFreshObject()))
      }
      this.close()
    },
    createFreshObject() {
      return {
        category: '',
        amount: 0
      }
    }
  }
}
</script>
