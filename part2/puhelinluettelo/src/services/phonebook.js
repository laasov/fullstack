import axios from 'axios'

const baseUrl = '/api/persons'

const getAll = () => {
    return axios.get(baseUrl)
}

const create = newId => {
    return axios.post(baseUrl, newId)
}

const update = (nam, num, id) => {
    return axios.put(`${baseUrl}/${id}`, {name : nam, number : num})
}

const remove = id => {
    return axios.delete(`${baseUrl}/${id}`)
}


export default { getAll, create, update, remove }
