import { useState, useEffect } from 'react'
import personService from './services/persons'

const PersonForm = (props) => {
  return (
  <form onSubmit={props.addNewPerson}>
        <div>Name: <input value={props.newName} onChange={props.handleNameChange} /></div>
        <div>Number: <input value={props.newNumber} onChange={props.handleNumberChange} /></div>
        <div>
          <button type="submit">+</button>
        </div>
      </form> 
  )
}

const Filter = (props) => {
  return (
    <form onSubmit={props.handleFilterChange}>
        Filter: <input value={props.filter} onChange={props.handleFilterChange} />
    </form>
  );
}

const Persons = (props) => {
  return(
    <li>
    {props.person.name} {props.person.number}
    <button onClick={props.deletePerson}>X</button>
    </li>  
)
}

const Notification = ({ message }) => {
  if (message === "") {
    return null
  }

  return (
    <div className='notification'>
      {message}
    </div>
  )
}



const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState([''])
  const [errorMessage, setErrormessage] = useState('')

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])


const handleNameChange = (event) => {
  setNewName(event.target.value)
}

const handleNumberChange = (event) => {
  setNewNumber(event.target.value)
}

const handleFilterChange = (event) => {
  setFilter(event.target.value)
}

const handleMessageChange = (event) => {
  setErrormessage(event.target.value)
}

const addNewPerson = (event) => {
  event.preventDefault()
  const nameObject = {
    name: newName,
    number: newNumber
  }
if (!persons.map(persons=>persons.name).includes(nameObject.name)){
  personService
    .create(nameObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
      })
      setErrormessage(`${nameObject.name} added`)
}

else if (window.confirm(`${nameObject.name} is already there. Do you want to change the number?`)){
  const personToChange = persons.find(n=>n.name === nameObject.name)
  personService
  .update(personToChange.id, nameObject)
  .then(returnedPerson => {
    setPersons(persons.map(person => person.id !== personToChange.id ? person : returnedPerson))
    setErrormessage(`${nameObject.name}'s number changed`)
  }
  )
.catch(error => {
  setErrormessage(`${personToChange.name}' is already deleted`)
})
}
setNewName('')
setNewNumber('')
setTimeout(() => {
  setErrormessage("")
}, 2000)
    }

const deletePerson = (personTodelete) => {
  if (window.confirm(`Are you sure you want to delete ${personTodelete.name}`)){
  personService
  .deletePerson(personTodelete.id)
  .then(res=>{
    const del = persons.filter(person => personTodelete.id !== person.id)
    setPersons(del)})
  }
  setErrormessage(`${personTodelete.name} deleted`)
  setTimeout(() => {
    setErrormessage("")
}, 2000)
}


  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage} />
      <Filter 
      filter={filter} 
      handleFilterChange={handleFilterChange}
      />
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        addNewPerson={addNewPerson}
      />
      <ul>
      {persons.filter(person=>person.name.toLowerCase().includes(filter)).map(person =>
       <Persons
       key={person.name}
       person={person} 
       deletePerson={()=>deletePerson(person)}
       />
    )}
    </ul>
    </div>
  )
}

export default App
