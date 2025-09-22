const express = require('express')
const app = express()
var morgan = require('morgan')
const cors = require('cors')
morgan.token('body', (req) => JSON.stringify(req.body))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.use(cors())

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.get('/', (request, response) => {
    response.send('<h1>Hi</h1>')
})

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
    response.json(persons)
})

console.log("hola")

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
    
    const person = {
        "id" : Math.floor(Math.random() * 1000000).toString(),
        "name" : body.name,
        "number": body.number
    }
    persons = persons.concat(person)
    response.json(person)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(p => p.id === id)
    if(person){
        response.json(person)
    }
    else{
        response.status(404).end()
    }
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

