import { firestoreAction } from 'vuexfire'
import { db } from '@/firebase/db.js'

function updateDb(document, userId) {
  db.collection('users')
    .doc(userId)
    .collection('budgets')
    .doc(document.id)
    .set(document)
    .then(() => {})
}

export default {
  namespaced: true,
  state: {
    months: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ],
    currencies: ['dollar', 'yen', 'real', 'euro'],
    budgets: [],
    incomeCategories: [
      'Salary',
      'Renting',
      'Pension',
      'Extra hours',
      'Bonus',
      'Vacation',
      'Others'
    ],
    expenseCategories: [
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
    expenseCategoryDescriptions: [
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
  },

  actions: {
    bindBudgets: firestoreAction(({ rootState, bindFirestoreRef }) => {
      // return the promise returned by `bindFirestoreRef`
      return bindFirestoreRef(
        'budgets',
        db
          .collection('users')
          .doc(rootState.user.user.id)
          .collection('budgets')
      )
    }),
    createBudget({ rootState }, budgetDate) {
      db.collection('users')
        .doc(rootState.user.user.id)
        .collection('budgets')
        .add({
          date: budgetDate,
          incomes: [],
          expenses: []
        })
    },
    addItem({ state, rootState }, params) {
      const { date, newItem, budgetAttr } = params
      let updateBudget = state.budgets.find(budget => budget.date === date)
      updateBudget[budgetAttr].push(newItem)
      updateDb(updateBudget, rootState.user.user.id)
    },
    updateItem({ state, rootState }, params) {
      const { date, index, editedItem, budgetAttr } = params
      let updateBudget = state.budgets.find(budget => budget.date === date)
      Object.assign(updateBudget[budgetAttr][index], editedItem)
      updateDb(updateBudget, rootState.user.user.id)
    },
    deleteItem({ state, rootState }, params) {
      const { date, index, budgetAttr } = params
      let updateBudget = state.budgets.find(budget => budget.date === date)
      updateBudget[budgetAttr].splice(index, 1)
      updateDb(updateBudget, rootState.user.user.id)
    }
  }
}
