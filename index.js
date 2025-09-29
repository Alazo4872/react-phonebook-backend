require('dotenv').config()
const express = require('express')
const app = express()
const Phonebook = require('./models/phonebook')
app.use(express.json())
app.use(express.static('dist'))

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
const errorHandler = (error, request, response, next) => {
    console.error(error.message)
    if(error.name === 'CastError'){
        return response.status(400).send({error: 'Malformated id'})
    }
    next(error)
}


app.get('/api/persons', (request, response) => {
    Phonebook.find({}).then(persons =>{
        response.json(persons)
    })
})


app.get('/info', (request, response, next) => {
    const time = Date();
    Phonebook.countDocuments({}).then(count => {
        response.send(`<p>Phonebook has info for ${count} people</p>  
                    <p>${time}</p>`)
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if((!body.name) || !body.number){
        return response.status(400).json({error: 'content missing'})
    }
    
    const person = new Phonebook ({
        "name" : body.name,
        "number": body.number
    })
    person.save().then(savedPerson => {
        response.json(savedPerson)

    })
})

app.get('/api/persons/:id', (request, response, next) => {
    Phonebook.findById(request.params.id).then(person => {
        if(!person){
            return response.status(404).end()
        }
        response.json(person)
    }).catch(error => next(error))
})
app.delete('/api/persons/:id', (request, response, next) => {
    Phonebook.findByIdAndDelete(request.params.id).then(result => {
            response.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const {name, number} = request.body
    Phonebook.findById(request.params.id).then(person => {
        if(!person){
            return response.status(404).end()
        }
        person.name = name
        person.number = number

        return person.save().then(updatedNote => {
            response.json(updatedNote)
        })
    })
    .catch(error => next(error))
})

app.use(unknownEndpoint)
app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT, () =>
    console.log(`server running on port ${PORT}`)
)

