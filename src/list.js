import RestClient from './restClient'
import DragAndDrop from './dragAndDrop'
import State from './state'

const api = new RestClient('https://perpower.ru/tasks/')

export default class List {
  static renderLists(listArrange, listId) {
    cleanAllEventListeners()
    const listsData = State.getState()

    const html = listsData
      .map(
        ({
          id, name, tasks, arrange
        }) => `
          <div id="list${id}" class="list" draggable="true">
            <div class="list__container">
              ${getHeaderTemplate(id, name)}
              ${getContentTemplate(id, tasks)}
              ${getFooterTemplate(id, arrange, listId)}
            </div>
          </div>`
      )
      .join('')

    const root = document.getElementById('root')

    root.innerHTML = html + addNewListTemplate

    if (listId) {
      List.renderAddNewCardForm(listId)
    }

    List.setForNewListListeners()
    List.setFooterListeners(listArrange)
    List.setDeleteListeners()
    List.setTextareaListeners()
    List.setDragAndDropListeners()
  }

  static addNewCard(arrange, listId) {
    return e => {
      List.renderLists(arrange, +listId)
    }
  }

  static setDragAndDropListeners() {
    const lists = document.querySelectorAll('.list[draggable=true]')
    const cards = document.querySelectorAll('.card')

    cards.forEach(card => {
      card.addEventListener('dragstart', DragAndDrop.dragStart)
      card.addEventListener('dragenter', DragAndDrop.dragEnter)
      card.addEventListener('dragover', DragAndDrop.dragOver)
      card.addEventListener('dragend', DragAndDrop.dragEnd)
      card.addEventListener('dragleave', DragAndDrop.dragLeave)
      card.addEventListener('drop', DragAndDrop.dragDropCard)
    })

    lists.forEach(listContent => {
      listContent.addEventListener('dragstart', DragAndDrop.dragStart)
      listContent.addEventListener('dragover', DragAndDrop.dragOver)
      listContent.addEventListener('dragend', DragAndDrop.dragEnd)
      listContent.addEventListener('drop', DragAndDrop.dragDropList)
    })
  }

  static setFooterListeners(arrange) {
    const footers = document.querySelectorAll('#footer')
    footers.forEach(openNewCardForm(arrange))
  }

  static setTextareaListeners() {
    const textareas = document.querySelectorAll('.js-text')
    textareas.forEach(setTextareaHeight)
    textareas.forEach(changeName)
  }

  static setDeleteListeners() {
    const deleteButtons = document.querySelectorAll('.js-delete')
    deleteButtons.forEach(deleteItem)
  }

  static setForNewListListeners() {
    const addListButton = document.querySelector('.list__container_hover')
    addListButton.addEventListener('click', addNewList, true)
  }

  static renderAddNewCardForm(id) {
    const addCardButton = document.getElementById('btn-add')
    const closeFormButton = document.getElementById('btn-close')

    addCardButton.addEventListener('click', addNewCard(id))
    closeFormButton.addEventListener('click', () => List.renderLists())

    setTextareaListeners(id)

    setTimeout(() => {
      document.addEventListener('click', closeNewCardForm)
    })
  }
}

const toCard = ({ id, name }) => `
  <div id="card${id}" class="card" draggable="true">
    <textarea id="${id}" type="text" class="card__text js-text js-card-text" placeholder="Введите название карточки" required>${name}</textarea>
    <button id="${id}" type="button" class="btn btn-close btn-card js-delete js-delete-card">+</button>
  </div>
`

const getHeaderTemplate = (id, name) => `
  <div class="list__header">
    <textarea
      class="list-name js-text js-header-text"
      placeholder="Введите название колонки"
      ondragstart="return false"
      id="${id}"
      maxlength="250">${name}</textarea>
      <button id="${id}" type="button" class="btn btn-close js-delete js-delete-list">+</button>
  </div>
  `

const getContentTemplate = (id, tasks) => `
  <div id="list${id}" class="list__content">
    ${tasks.map(toCard).join('')}
  </div>
  `

const getFooterTemplate = (id, arrange, listId) => {
  const className = `list__footer ${listId ? '' : 'list__footer_hover'}`

  return `
  <div id="footer" class="${className}" data-list-id="${id}">
    ${id === listId ? addNewCardForm() : addNewCardBtn(id, arrange)}
  </div>`
}

const addNewCardBtn = (id, arrange) => `
  <span class="btn-icon"></span>
  <button type="button" class="btn" data-list-id="${id}" data-arrange="${arrange}" id="add-btn">
    Добавить карточку
  </button>
  `

const addNewListTemplate = `
  <div class="list">
    <div class="list__container list__container_hover">
      <div id="new-list-container" class="list__footer">
        <span class="btn-icon"></span>
        <button id="btn-list-add" type="button" class="btn">Добавить колонку</button>
      </div>
    </div>
  </div>
  `

const addNewCardForm = () => `
    <div id="form" class="form">
      <div class="card card__add-form">
        <textarea type="text" id="add-textarea" class="card__text" maxlength="250" placeholder="Введите название карточки"
        autofocus required></textarea>
      </div>
      <div class="form__actions">
        <button id="btn-add" type="submit" class="btn btn-add">Добавить карточку</button>
        <button id="btn-close" type="button" class="btn btn-close">+</button>
      </div>
    </div>
  `

const addNewListForm = () => `
    <div id="form" class="form">
      <div class="card card__add-form">
        <textarea type="text" id="add-list-textarea" class="card__text card__text_add" maxlength="250" placeholder="Введите название колонки"
        autofocus required></textarea>
      </div>
      <div class="form__actions">
        <button id="btn-add-list" type="submit" class="btn btn-add">Добавить колонку</button>
        <button id="btn-close-list" type="button" class="btn btn-close">+</button>
      </div>
    </div>
  `

const openNewCardForm = arrange => (el, index) => {
  if (arrange === index + 1) {
    return
  }
  el.addEventListener('click', List.addNewCard(index + 1, el.dataset.listId))
}

const closeNewCardForm = e => {
  const addForm = document.getElementById('form')
  if (addForm && !addForm.contains(e.target) && e.target.id !== 'add-btn') {
    List.renderLists()
  }
}

const setTextareaHeight = textarea => {
  textarea.style.height = '1px'
  textarea.style.height = textarea.scrollHeight + 'px'

  textarea.addEventListener('input', e => {
    const el = e.target
    el.style.height = '1px'
    el.style.height = el.scrollHeight + 'px'
  })
}

const cleanAllEventListeners = () => {
  document.removeEventListener('click', closeNewCardForm)
}

const setTextareaListeners = id => {
  const addCardTextarea = document.getElementById('add-textarea')
  addCardTextarea.focus()
  setTextareaHeight(addCardTextarea)

  addCardTextarea.addEventListener('keydown', e => {
    const { value } = e.target
    if (e.keyCode === 13) {
      e.preventDefault()
      if (value !== '') {
        api.createCard(value, '', id)
        List.renderLists()
      }
    }
  })
}

const addNewCard = listId => e => {
  const newCardTextarea = document.getElementById('add-textarea')
  newCardTextarea.focus()
  const { value } = newCardTextarea
  if (value) {
    api.createCard(value, '', listId)
    List.renderLists()
  }
}

const addNewList = e => {
  const newListContainer = document.getElementById('new-list-container')
  newListContainer.innerHTML = addNewListForm()

  const addNewListButton = document.getElementById('btn-add-list')
  const closeNewListButton = document.getElementById('btn-close-list')
  const addNewListTextarea = document.getElementById('add-list-textarea')

  addNewListTextarea.focus()
  addNewListTextarea.style.height = '1px'
  addNewListTextarea.style.height = addNewListTextarea.scrollHeight + 'px'

  addNewListButton.addEventListener('click', e => {
    const { value } = addNewListTextarea
    if (value) {
      api.createList(value)
      List.renderLists()
    }
  })

  addNewListTextarea.addEventListener('input', e => {
    const textarea = e.target
    textarea.style.height = '1px'
    textarea.style.height = textarea.scrollHeight + 'px'
  })

  addNewListTextarea.addEventListener('keydown', e => {
    const { value } = e.target
    if (e.keyCode === 13) {
      e.preventDefault()
      if (value !== '') {
        api.createList(value)
        List.renderLists()
      }
    }
  })

  closeNewListButton.addEventListener('click', () => List.renderLists())

  document.addEventListener('click', closeNewCardForm, true)
}

const deleteItem = button => {
  const remove = (type, id) => (type === 'card' ? api.deleteCard(+id) : api.deleteList(+id))

  button.addEventListener('click', e => {
    const { id, classList } = e.target
    const type = classList.contains('js-delete-card') ? 'card' : 'list'
    remove(type, id)
    List.renderLists()
  })
}

const changeName = textarea => {
  const change = (type, id, value) => (type === 'card' ? api.renameCard(id, value) : api.renameList(id, value))

  textarea.addEventListener('blur', e => {
    const { value, defaultValue, classList } = e.target
    const elementType = classList.contains('js-card-text') ? 'card' : 'list'
    if (value && value !== defaultValue) {
      const { id } = e.target
      change(elementType, id, value)
    } else if (value === '') {
      e.target.value = defaultValue
    }
  })

  textarea.addEventListener('keydown', e => {
    if (e.keyCode === 13) {
      e.preventDefault()
      e.target.blur()
    }
  })
}
