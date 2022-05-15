import { useEffect, useState } from 'react'
import axios from 'axios'

const PhoneId = ({ person, number }) => <p>{person} {number}</p>

const NameList = ({ persons, filt }) => {
  return (
  persons.flatMap(person =>
    person.name.toLowerCase().includes(filt.toLocaleLowerCase()) ? <PhoneId key={person.name} person={person.name} number={person.number}/> : '')
  )
}

const FilterForm = ({filter, handle}) => {
  return (
    <form>
        <div>
          filter shown with: <input
                                value={filter}
                                onChange={handle} />
        </div>
      </form>
  )
}

const IdList = (props) => {
  return (
    <form onSubmit={props.concatName}>
        <div>
          name: <input
                  value={props.newName}
                  onChange={props.handleNamePrompt}
                />
        </div>
        <div>
          number: <input
                  value={props.newNum}
                  onChange={props.handleNumPrompt}
                />
        </div>
        <div>
          <button type="submit">
            add
          </button>
        </div>
      </form>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNum, setNewNum] = useState('')
  const [filt, setFilt] = useState('')

  useEffect(() => {
    console.log('effect')
    axios.get('http://localhost:3001/persons').then(respose => {
      console.log('promise fulfilled')
      setPersons(respose.data)
    })
  }, [])
  console.log('render', persons.length, 'persons')

  const handleNamePrompt = (e) => {
    console.log('handleNamePrompt event:', e.target.value)
    setNewName(e.target.value)
  }

  const handleNumPrompt = (e) => {
    console.log('handleNumPrompt event:', e.target.value)
    setNewNum(e.target.value)
  }

  const handleFilter = (e) => {
    setFilt(e.target.value)
  }

  const concatName = (e) => {
    e.preventDefault()
    console.log('concatName event target value:', e.target.value)

    if (persons.map(person => person.name).includes(newName)) {
      alert(`${newName} is already added to phonebook`)
    } else {
      setPersons(persons.concat( {name: newName, number: newNum} ))
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <FilterForm filter={filt}
                  handle={handleFilter} />
      <h2>Add a new</h2>
      <IdList concatName={concatName}
              newName={newName}
              handleNamePrompt={handleNamePrompt}
              newNum={newNum}
              handleNumPrompt={handleNumPrompt} />
      <h2>Numbers</h2>
      <NameList persons={persons}
                filt={filt} />
    </div>
  )

}
//{persons.flatMap(person => person.name.toLowerCase().includes(filt.toLocaleLowerCase()) ? <p>{person.name} {person.number}</p> : '')}
// <PhoneId key={person.name} person={person.name} number={person.number}/> : <PhoneId key={person.name} person={'asd'} number={'asd'}

export default App
