// const http = require('http')
const express = require('express')
const app = express()

// activate the json-parser (JASON data to JS object)
app.use(express.json())

const cors = require('cors')
app.use(cors())

let notes = [
    {
      id: 1,
      content: "HTML is easy",
      date: "2022-05-30T17:30:31.098Z",
      important: true
    },
    {
      id: 2,
      content: "Browser can execute only Javascript",
      date: "2022-05-30T18:39:34.091Z",
      important: false
    },
    {
      id: 3,
      content: "GET and POST are the most important methods of HTTP protocol",
      date: "2022-05-30T19:20:14.298Z",
      important: true
    }
  ]

// middleware is a function that receives three parameters
// next yields control to the next middleware
const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
  }
// use the middleware
app.use(requestLogger)

// const app = http.createServer((request, response) => {
//     // response.writeHead(200, {'Content-Type': 'text/plain'})
//     // response.end('Hello world')

//     // informs the receiver that the data is in the JSON format
//     response.writeHead(200, {'Content-Type': 'application/json'})
//     // notes array gets transformed into JSON 
//     response.end(JSON.stringify(notes))
// })

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
    // json is a string
    response.json(notes)
})


// Fetching a single resource
app.get('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id) // string to number
    // console.log(id)
    const note = notes.find(note => {
        // console.log(note.id, typeof note.id, id, typeof id, note.id === id )
        return note.id === id
    })
    
    // check if note exist
    if (note){
        response.json(note)
    } else{
        // end method for responding to the request without sending any data
        response.status(404).end()
    }

    // console.log(note)
    // response.json(note)
})


// Deleting resources
app.delete('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    notes = notes.filter(note => note.id !== id)

    response.status(204).end()
})


// Receiving data
// app.post('/api/notes', (request, response) => {
//     // const note = request.body
//     // console.log(note)
//     // response.json(note)

//     const maxId = notes.length > 0 ? Math.max(...notes.map(n => n.id)) : 0
    
//     const note = request.body
//     note.id = maxId + 1

//     notes = notes.concat(note)

//     response.json(note)
//   })

const generateId = () => {
    // The array can be transformed into individual numbers by using the "three dot" spread syntax ....
    const maxId = notes.length > 0 ? Math.max(...notes.map(n => n.id)) : 0

    return maxId + 1
}

app.post('/api/notes', (request, response) => {
    const body = request.body

    if (!body.content) {
        return response.status(400).json({
            error: 'content missing'
        })
    }

    const note = {
        content: body.content,
        important: body.important || false,
        date: new Date(),
        id: generateId(),
    }

    notes = notes.concat(note)

    response.json(note)
})

// middleware that is used for catching requests made to non-existent routes
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
app.use(unknownEndpoint)

// const PORT = 3001
const PORT = process.env.PORT || 3001
// app.listen(PORT)
// console.log(`Server running on port ${PORT}`)
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})