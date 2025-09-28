require('dotenv').config()
const express = require('express')
const app = express()
const Phonebook = require('./models/phonebook')
app.use(express.json())
app.use(express.static('dist'))

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}


let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    Phonebook.find({}).then(persons =>{
        response.json(persons)
    })
})


app.get('/info', (request, response) => {
    const time = Date();
    response.send(`<p>Phonebook has info for ${persons.length} people</p>  
                    <p>${time}</p>`)

})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if((!body.name) || !body.number){
        return response.status(400).json({error: 'content missing'})
    }
    else if(persons.find(p => p.name === body.name)){
        return response.status(400).json({error: 'name already exists'})
    }
    
    const person = new Phonebook ({
        "name" : body.name,
        "number": body.number
    })
    person.save().then(savedPerson => {
        response.json(savedPerson)

    })
})

app.get('/api/persons/:id', (request, response) => {
    Phonebook.findById(request.params.id).then(person => {
        response.json(person)
    })
})
app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(p => p.id !== id)
    
    response.status(204).end()
    
})

app.use(unknownEndpoint)



const PORT = process.env.PORT || 3001
app.listen(PORT, () =>
    console.log(`server running on port ${PORT}`)
)

