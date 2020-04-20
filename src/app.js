import RestClient from './restClient'
import List from './list'

import './styles.css'

const api = new RestClient('https://perpower.ru/tasks/')

window.addEventListener('load', () => {
  api.getData()
  List.renderLists()
})
