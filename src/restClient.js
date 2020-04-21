import State from './state'
import { addToLocalStorage } from './utils'

export default class RestClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl
    this.postOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  }

  async getData() {
    const response = await fetch(this.baseUrl + 'get_tasks')
    const data = response.json()
    addToLocalStorage(data)
  }

  async createList(name) {
    const data = {
      status_name: name,
    }

    State.addListToState(name)

    const response = await fetch(this.baseUrl + 'create_status', {
      ...this.postOptions,
      body: JSON.stringify(data),
    })

    const result = await response.json()
    return result
  }

  async renameList(id, name) {
    const data = {
      status_name: name,
      id,
    }

    const response = await fetch(this.baseUrl + 'rename_status', {
      ...this.postOptions,
      body: JSON.stringify(data),
    })

    const result = await response.json()
    return result
  }

  async deleteList(id) {
    const data = {
      id,
    }

    State.deleteListFromState(id)

    const response = await fetch(this.baseUrl + 'delete_status', {
      ...this.postOptions,
      body: JSON.stringify(data),
    })

    const result = await response.json()
    return result
  }

  async moveList(id, nextId) {
    const data = {
      id,
      index: nextId,
    }

    const response = await fetch(this.baseUrl + 'move_panel', {
      ...this.postOptions,
      body: JSON.stringify(data),
    })

    const result = await response.json()
    return result
  }

  async createCard(name, desc, listId) {
    const data = {
      name,
      desc,
      status_id: listId,
    }

    State.addCardToState(listId, name)

    const response = await fetch(this.baseUrl + 'create_task', {
      ...this.postOptions,
      body: JSON.stringify(data),
    })

    const result = await response.json()
    return result
  }

  async renameCard(id, name) {
    const data = {
      name,
      task_id: id,
    }

    const response = await fetch(this.baseUrl + 'rename_task', {
      ...this.postOptions,
      body: JSON.stringify(data),
    })

    const result = await response.json()
    return result
  }

  async deleteCard(id) {
    const data = {
      task_id: id,
    }

    State.deleteCardFromState(id)

    const response = await fetch(this.baseUrl + 'delete_task', {
      ...this.postOptions,
      body: JSON.stringify(data),
    })

    const result = await response.json()
    return result
  }

  async moveCard(cardId, listId) {
    const data = {
      task_id: cardId,
      status_id: listId,
    }

    const response = await fetch(this.baseUrl + 'move_task', {
      ...this.postOptions,
      body: JSON.stringify(data),
    })

    const result = await response.json()
    return result
  }
}