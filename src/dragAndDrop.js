import RestClient from './restClient'
import { getChildNumber } from './utils'

const api = new RestClient('https://perpower.ru/tasks/')
let draggedElement = null

export default class DragAndDrop {
  static dragStart(e) {
    e.stopPropagation()
    if (e.target.tagName !== 'DIV') {
      e.preventDefault()
      return false
    }
    const parentListId = this.parentElement.id
    const elementType = this.classList.contains('list') ? 'list' : 'card'

    e.dataTransfer.setData('text/plain', e.target.id)
    e.dataTransfer.setData('parentListId', parentListId)
    e.dataTransfer.setData('elementType', elementType)

    setTimeout(() => {
      this.classList.add('element-dragged')
    })

    draggedElement = this
  }

  static dragEnd(e) {
    const draggedCard = document.querySelector('.element-dragged')
    const hoveredCard = document.querySelector('.card-hovered')

    if (draggedCard) {
      draggedCard.classList.remove('element-dragged')
    }

    if (hoveredCard) {
      hoveredCard.classList.remove('card-hovered')
    }

    draggedElement = null
  }

  static dragOver(e) {
    e.preventDefault()
  }

  static dragEnter(e) {
    if (draggedElement.classList.contains('card')) {
      this.classList.add('card-hovered')
    }
  }

  static dragLeave(e) {
    this.classList.remove('card-hovered')
  }

  static dragDropList(e) {
    const sourceId = e.dataTransfer.getData('text/plain')
    const sourceElement = document.getElementById(sourceId)
    const parentListId = e.dataTransfer.getData('parentListId')
    const elementType = e.dataTransfer.getData('elementType')

    const listContent = this.querySelector('.list__content')
    const dropId = +sourceId.split(elementType)[1]
    const nextDropId = +this.id.split('list')[1]
    const isCardsInSameList = listContent && parentListId !== listContent.id

    if (elementType === 'card' && isCardsInSameList) {
      listContent.appendChild(sourceElement)
      api.moveCard(dropId, nextDropId)
    }

    if (elementType === 'list') {
      const parent = this.parentElement
      const dropListNumber = getChildNumber(sourceElement)
      const nextListNumber = getChildNumber(this)

      if (nextListNumber > dropListNumber) {
        parent.insertBefore(sourceElement, this.nextSibling)
      } else {
        parent.insertBefore(sourceElement, this)
      }

      if (dropId !== nextDropId) {
        api.moveList(dropId, nextDropId)
      }
    }
  }

  static dragDropCard(e) {
    const elementType = e.dataTransfer.getData('elementType')

    if (elementType === 'card') {
      e.stopPropagation()
      const sourceId = e.dataTransfer.getData('text/plain')
      const sourceElement = document.getElementById(sourceId)
      const parent = this.parentElement
      const dropCardNumber = getChildNumber(sourceElement)
      const nextCardNumber = getChildNumber(this)

      if (nextCardNumber > dropCardNumber) {
        parent.insertBefore(sourceElement, this.nextSibling)
      } else {
        parent.insertBefore(sourceElement, this)
      }

      const dropId = sourceId.split('card')[1]
      const nextId = this.id.split('card')[1]
      const nextParentId = parent.id.split('list')[1]

      if (dropId !== nextId) {
        api.moveCard(dropId, nextParentId)
      }
    }
  }
}
