import { useEffect, useState } from 'react'
import idService from './services/phonebook'

/*

Completed all tasks up to 2.18
Tested -- all seem to work OK

*/


// Called from NameList
const PhoneId = person => <p>{person.person.name} {person.person.number} <DeleteButton person={person.person}/></p>

// Called from DeleteButton
const removeId = person => {
  if (window.confirm(`Delete ${person.person.name} ?`)) {
    idService.remove(person.person.id)
    window.location.reload()
  }
}

// Called from PhoneId
const DeleteButton = person => {
  return (
    <button onClick={() => removeId(person)}>
      delete
    </button>
  )
}

// Called from App independently
const NameList = ({ persons, filt }) => {
  const flc = filt.toLowerCase()

  return (
    persons.flatMap(person => 
      person.name.toLowerCase().includes(flc) ? <PhoneId key={person.name} person={person}/> : '')
  )
}

// Called from App idependently
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

// Called from App independently
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
    idService
      .getAll()
      .then(respose => {
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


  const handleClick = () => {
    console.log("Clicked")
  }

  const concatName = (e) => {
    e.preventDefault()
    
    if (persons.map(person => person.name).includes(newName)) {
      const pers = persons.find(pers => pers.name === newName)

      idService
        .update(pers.name, newNum, pers.id)
        .then(response => {
          window.confirm(`${newName} is already added to phonebook, replace old number with a new one?`)
          window.location.reload()
        })
    } else {
      idService
        .create( {name: newName, number: newNum} )
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNum('')
        })
      window.location.reload()
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
                filt={filt} 
                handleClick={handleClick}/>
    </div>
  )

}

export default App
