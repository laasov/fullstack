import { useEffect, useState } from 'react'
import idService from './services/phonebook'

/*

Completed all tasks up to 2.19
Tested -- all seem to work OK

Scrap:

// Called from DeleteButton
const removeId = person => {
  if (window.confirm(`Delete ${person.person.name} ?`)) {
    idService.remove(person.person.id)
    window.location.reload()
  }


// Called from NameList
const DeleteButton = (person, action) => {

  console.log('db', action)

  return (
    <button onClick={() => action(person)}>
      delete2
    </button>
  )
  }

*/


// Called from NameList
const PhoneId = person => <>{person.person.name} {person.person.number}</>

// Called from App independently
const NameList = ({ persons, filt, setmsg }) => {
  const flc = filt.toLowerCase()

  const removeId = person => {
    if (window.confirm(`Delete ${person.name} ?`)) {
      idService.remove(person.id)
      setmsg(`Removed ${person.name}`)
      setTimeout(() => { 
        setmsg(null)
        window.location.reload()
      }, 3000)
    }
  }

  return (
    persons.flatMap(person =>
      person.name.toLowerCase().includes(flc) 
        ? <p key={person.id}>
            <PhoneId person={person}/>
            <button onClick={() => removeId(person)}>delete</button>
          </p>
        : null)
  )
}

// Called from App idependently
const FilterForm = ({ filter, handle }) => {
  return (
    <form>
        <div>
          filter shown with: <input value={filter} onChange={handle} />
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

// Called from App independently
const ChangeMessage = ({ message }) => {
  
  const msgStyle = (message !== null && message.includes('Information'))
    ? {
      color: 'red',
      fontStyle: 'italic',
      background: 'lightgrey',
      textAlign: 'center'
    }
    : {
      color: 'green',
      fontStyle: 'italic',
      background: 'lightgrey',
      textAlign: 'center'
    }


  if (message === null) {
    return null
  }

  return (
    <div style={msgStyle}>
      {message}
    </div>
  )
}


const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNum, setNewNum] = useState('')
  const [filt, setFilt] = useState('')
  const [msg, setMsg] = useState(null)

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

  const concatName = (e) => {
    e.preventDefault()
    
    // If name exists...
    if (persons.map(person => person.name).includes(newName)) {
      const pers = persons.find(pers => pers.name === newName)

      if (window.confirm(`${newName} is already added to phonebook, replace old number with a new one?`)) {
        idService
          .update(pers.name, newNum, pers.id)
          .then(succ => {
            console.log(succ)
            setMsg(`Changed number of ${pers.name} to ${newNum}`)
            setTimeout(() => {
            setMsg(null)
            window.location.reload()
            }, 3000)
          })
          .catch(error => {
            console.log(error)
            setMsg(`Information of ${pers.name} has already been removed from server`)
            setTimeout(() => {
              setMsg(null)
              window.location.reload()
            }, 3000)
          }) 
      } 
    // If name does not exist...
    } else {
      idService
        .create( {name: newName, number: newNum} )
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson.data))
        })
      
      setMsg(`Added ${newName}`)
      setTimeout(() => { setMsg(null) }, 3000)
    }
  }

  return (
    <div>
      <h3>Phonebook</h3>
      <ChangeMessage message={msg}/>
      <FilterForm filter={filt}
                  handle={handleFilter}/>
      <h3>Add a new</h3>
      <IdList concatName={concatName}
              newName={newName}
              handleNamePrompt={handleNamePrompt}
              newNum={newNum}
              handleNumPrompt={handleNumPrompt}/>
      <h3>Numbers</h3>
      <NameList persons={persons}
                filt={filt} 
                setmsg={setMsg}/>
    </div>
  )

}

export default App
