export function addToLocalStorage(list) {
  list.then(result => {
    localStorage.setItem('lists', JSON.stringify(result.panels))
  })
}

export function getFromLocalStorage() {
  return JSON.parse(localStorage.getItem('lists') || '[]')
}

export function getNewCardId(state) {
  const tasks = state.reduce((acc, cur) => [...acc, ...cur.tasks], [])
  const result = Math.max(...tasks.map(task => task.id)) + 1
  return result
}

export function getNewListId(state) {
  const result = Math.max(...state.map(list => list.id)) + 1
  return result
}

export function getChildNumber(node) {
  return Array.prototype.indexOf.call(node.parentNode.children, node)
}
