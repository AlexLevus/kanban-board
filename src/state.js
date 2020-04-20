import { getNewCardId, getNewListId } from './utils'

export default class State {
  static getState() {
    return JSON.parse(localStorage.getItem('lists') || '[]')
  }

  static setState(newState) {
    localStorage.setItem('lists', JSON.stringify(newState))
  }

  static addCardToState(listId, name) {
    const state = State.getState()
    const newCard = {
      days: 0,
      desc: '',
      end_date: null,
      id: getNewCardId(state),
      isDone: false,
      isStarted: false,
      name,
      start_date: null,
    }

    const [cardList] = state.filter(list => list.id === listId)
    cardList.tasks = [...cardList.tasks, newCard]

    State.setState(state)
  }

  static addListToState(name) {
    const state = State.getState()
    const newList = {
      arrange: state.length + 1,
      id: getNewListId(state),
      name,
      tasks: [],
      tasks_count: 0,
    }

    state.push(newList)

    State.setState(state)
  }

  static deleteListFromState(id) {
    const state = State.getState()
    const newState = state.filter(list => list.id !== id)

    State.setState(newState)
  }

  static deleteCardFromState(id) {
    const state = State.getState()

    const cardList = state.find(list => list.tasks.some(task => task.id === id))
    const newListTasks = cardList.tasks.filter(task => task.id !== id)

    state[cardList.arrange - 1].tasks = newListTasks

    State.setState(state)
  }
}
