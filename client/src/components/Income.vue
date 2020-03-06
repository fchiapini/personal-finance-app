<template>
    <v-data-table
      :headers="headers"
      :items="incomes"
      sort-by="category"
      class="elevation-1" >
      <template v-slot:top >
        <v-toolbar flat color="white">
          <v-toolbar-title>Income</v-toolbar-title>
          <v-divider
            class="mx-4"
            inset
            vertical>
          </v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="1000px">
            <template v-slot:activator="{ on }">
              <v-btn color="primary" dark class="mb-2" v-on="on">Add Income</v-btn>
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
                      :items="categories"
                      label="Category income"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.amount" placeholder="0 yen" label="Amount"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-date-picker v-model="editedItem.date" type="month"></v-date-picker>
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
      <template v-slot:item.action="{ item }">
      <v-icon
        small
        class="mr-2"
        @click="editItem(item)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        small
        @click="deleteItem(item)"
      >
        mdi-delete
      </v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn color="primary" @click="initialize">Reset</v-btn>
    </template>
    </v-data-table>
</template>

<script>
export default {
    name: 'Income',

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
      incomes: [],
      editedIndex: -1,
      editedItem: {
        category: '',
        amount: 0
      },
      defaultItem: {
        category: '',
        amount: 0
      },
      categories: ['Salary', 'Renting', 'Pension', 'Extra hours', 'Bonus', 'Vacation', 'Others']
    }),

    computed: {
      formTitle() {
        return this.editedIndex === -1 ? 'New Income' : 'Edit Income';
      }
    },

    watch: {
      dialog (val) {
        val || this.close();
      }
    },

    created() {
      this.initialize();
    },

    methods: {
      initialize() {
        this.incomes = [
          {
            category: 'Salary',
            amount: 100000
          },
          {
            category: 'Renting',
            amount: 100000
          },
          {
            category: 'Vacation',
            amount: 100000
          },
          {
            category: 'Extra hours',
            amount: 100000
          }
        ]
      },

      editItem (item) {
        this.editedIndex = this.incomes.indexOf(item);
        this.editedItem = Object.assign({}, item);
        this.dialog = true;
      },

      deleteItem (item) {
        const index = this.incomes.indexOf(item);
        confirm('Are you sure you want to delete this item?') && this.incomes.splice(index, 1);
      },

      close () {
        this.dialog = false;
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        }, 300);
      },

      save () {
        if (this.editedIndex > -1) {
          Object.assign(this.incomes[this.editedIndex], this.editedItem);
        } else {
          this.incomes.push(this.editedItem);
        }
        this.close();
      }
    }
}
</script>