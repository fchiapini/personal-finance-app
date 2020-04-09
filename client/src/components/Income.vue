<template>
  <div>
    <v-expansion-panels tile multiple>
      <v-expansion-panel>
        <v-expansion-panel-header>
          Monthly Income
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-row v-for="(income, index) in incomes" :key="index">
            <v-col cols="12" md="8">
              <v-select
                :items="incomeCategories"
                label="Income"
                outlined
                clearable
                :value="income.category"
              ></v-select>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                type="number"
                label="Amount"
                outlined
                :value="income.amount"
                prefix="$"
              ></v-text-field>
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
            <v-card outlined>
              <v-card-text>
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
                      v-model="newIncome.amount"
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
                      :disabled="$v.$invalid"
                      block
                      outlined
                      x-large
                      class="green--text"
                    >
                      <v-icon>mdi-plus</v-icon>
                      Add Income
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-form>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-data-table
      :headers="headers"
      :items="incomes"
      :items-per-page="5"
      sort-by="category"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat color="green lighten-1" dark>
          <v-dialog v-model="dialog" max-width="600px">
            <template v-slot:activator="{ on }">
              <v-btn text class="mb-2" v-on="on">
                <v-icon>mdi-plus</v-icon>
                Add Income
              </v-btn>
            </template>
            <v-card color="primary" dark>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>
              <v-divider />
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-select
                        v-model="editedItem.category"
                        :items="incomeCategories"
                        label="Category income"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        type="number"
                        v-model.number="editedItem.amount"
                        label="Amount"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn outlined @click="close">Cancel</v-btn>
                <v-btn outlined @click="save">Save</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-spacer />
        </v-toolbar>
      </template>
      <template v-slot:item.amount="{ item }">
        {{ item.amount | currency }}
      </template>
      <template v-slot:item.action="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)">
          mdi-pencil
        </v-icon>
        <v-icon small @click="deleteItem(item)">
          mdi-delete
        </v-icon>
      </template>
      <template slot="body.append">
        <tr>
          <th class="body-1 font-weight-bold">
            Total:
          </th>
          <td class="font-weight-bold">{{ totalIncomesOfMonth | currency }}</td>
        </tr>
      </template>
    </v-data-table>
  </div>
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
    }
  },

  data: () => ({
    dialog: false,
    headers: [
      {
        text: 'Category',
        align: 'start',
        sortable: true,
        value: 'category'
      },
      { text: 'Amount', value: 'amount', sortable: false },
      { text: 'Actions', value: 'action', sortable: false }
    ],
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
    formTitle() {
      return this.editedIndex === -1 ? 'New Income' : 'Edit Income'
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
      if (confirm('Are you sure you want to delete this item?')) {
        this.$store.dispatch('budget/deleteItem', {
          date: this.date,
          index: index,
          budgetAttr: 'incomes'
        })
      }
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
      if (this.editedIndex > -1 && !this.$v.$invalid) {
        this.$store.dispatch('budget/updateItem', {
          date: this.date,
          index: this.editedIndex,
          editedItem: this.editedItem,
          budgetAttr: 'incomes'
        })
      } else if (!this.$v.$invalid) {
        this.$store.dispatch('budget/addItem', {
          date: this.date,
          newItem: this.newIncome,
          budgetAttr: 'incomes'
        })
      }
      this.close()
    }
  }
}
</script>
