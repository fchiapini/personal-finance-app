<template>
  <v-data-table
    :headers="headers"
    :items="incomes"
    :items-per-page="5"
    sort-by="category"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat color="green" dark>
        <v-dialog v-model="dialog" max-width="600px">
          <template v-slot:activator="{ on }">
            <v-btn text class="mb-2" v-on="on">
              <v-icon>mdi-plus</v-icon>
              Income
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
        <v-toolbar-title>
          Income: {{ totalIncomesOfMonth | currency }}
        </v-toolbar-title>
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
  </v-data-table>
</template>

<script>
import { mapGetters } from 'vuex'
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
      if (this.editedIndex > -1) {
        this.$store.dispatch('budget/updateItem', {
          date: this.date,
          index: this.editedIndex,
          editedItem: this.editedItem,
          budgetAttr: 'incomes'
        })
      } else {
        this.$store.dispatch('budget/addItem', {
          date: this.date,
          newItem: this.editedItem,
          budgetAttr: 'incomes'
        })
      }
      this.close()
    }
  }
}
</script>
