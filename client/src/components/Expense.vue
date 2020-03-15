<template>
  <v-data-table
    :headers="headers"
    :items="expenses"
    sort-by="category"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat color="white">
        <v-toolbar-title>
          Expense: {{ totalExpensesOfMonth | currency }}
        </v-toolbar-title>
        <v-dialog v-model="dialog" max-width="600px">
          <template v-slot:activator="{ on }">
            <v-btn outlined color="primary" dark class="mb-2" v-on="on">
              Add Expense
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-select
                      v-model="editedItem.category"
                      :items="categoriesList"
                      label="Category expense"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-select
                      v-model="editedItem.description"
                      :items="descriptions"
                      label="Description"
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
              <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="save">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.amount="{ item }">
      {{ item.amount | currency }}
    </template>
    <template v-slot:item.action="{ item }">
      <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
      <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
    </template>
  </v-data-table>
</template>

<script>
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
      { text: 'Description', value: 'description', sortable: false },
      { text: 'Actions', value: 'action', sortable: false }
    ],
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
    },
    categories: [
      'Housing',
      'Transport',
      'Food',
      'Health',
      'Education',
      'Clothing',
      'Personal care',
      'Leisure',
      'Tax',
      'Others'
    ],
    descriptions: [
      'Renting',
      'Housing fee',
      'House instalment',
      'Housing insurance',
      'House cleaning',
      'Car instalment',
      'Car insurance',
      'Parking lot fee',
      'Health insurance',
      'Health care',
      'School',
      'College',
      'Course',
      'Housing tax',
      'Life insurance',
      'Electricity',
      'Water',
      'Phone bill',
      'Gas',
      'Cable/Streaming',
      'Internet',
      'Train/Metro',
      'Bus',
      'Fuel',
      'Supermarket',
      'Grocery shop',
      'Bakery',
      'Medicine',
      'Hair',
      'Gym',
      'Doctor',
      'Dentist',
      'Hospital',
      'Trip',
      'Theater',
      'Restaurant/Bar',
      'Movie renting',
      'Cloth',
      'Shoes',
      'Accessories',
      'Gifts'
    ]
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New Expense' : 'Edit Expense'
    },

    categoriesList() {
      return this.categories.concat().sort()
    },

    totalExpensesOfMonth() {
      return this.expenses
        .map(expense => expense.amount)
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
      if (confirm('Are you sure you want to delete this item?')) {
        this.$emit('delete-item', {
          date: this.date,
          index: index,
          budgetAttr: 'expenses'
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
        this.$emit('update-item', {
          date: this.date,
          index: this.editedIndex,
          editedItem: this.editedItem,
          budgetAttr: 'expenses'
        })
      } else {
        this.$emit('add-item', {
          date: this.date,
          newItem: this.editedItem,
          budgetAttr: 'expenses'
        })
      }
      this.close()
    }
  }
}
</script>
