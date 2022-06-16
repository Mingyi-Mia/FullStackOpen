const express = require('express')
const app = express()
var morgan = require('morgan')

app.use(express.json())
// app.use(morgan('tiny'))

const cors = require('cors')
app.use(cors())

// custom log - show the data sent in HTTP POST requests
morgan.token('data', (req) => {
    return req.method === 'POST' ? JSON.stringify(req.body) : null
})

app.use(morgan((tokens, req, res) => {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        tokens.data(req, res)
    ].join(' ')
}))


let persons = [
    { 
        "id": 1,
        "name": "Arto Hellas", 
        "number": "040-123456"
      },
      { 
        "id": 2,
        "name": "Ada Lovelace", 
        "number": "39-44-5323523"
      },
      { 
        "id": 3,
        "name": "Dan Abramov", 
        "number": "12-43-234345"
      },
      { 
        "id": 4,
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122"
      }
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    const time = new Date() 
    response.send(`<p>Phonebook has info for ${persons.length} people</p>
                   <p>${time}</p>`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    // console.log(id)
    // console.log(persons.map(n => n.id))
    const person = persons.find(person => person.id === id)
    // console.log(person?.id, typeof person?.id, id, typeof id, person?.id === id)

    if (person){
        response.json(person)
    } else{
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) =>{
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
})

const generateId = () => {
    return Math.floor(Math.random() * 1000)
}

app.post('/api/persons', (request, response) =>{
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'some information missing'
        })
    }

    const names = persons.map(person => person.name)
    if (names.includes(body.name)){
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number,
    }

    persons.concat(person)

    response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})