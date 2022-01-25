const express = require('express')
const server = express()
const fs = require('fs')

server.use(express.json({extended: true}))

const readFile = () => {
  const content = fs.readFileSync('./data/items.json', 'utf-8')
  return JSON.parse(content)
}

const writeFile = (content) => {
  const updateFile = JSON.stringify(content)
  fs.writeFileSync('./data/items.json', updateFile, 'utf-8') // salvando a arquivo
}

server.get('/', (req, res) => { // create
  const content = readFile()
  res.send(content)
})


server.post('/', (req, res) => { // read
  const {name, email, phone} = req.body
  const currentContent = readFile()
  const id = Math.random().toString(32).substr(2, 9) // gerador de id
  currentContent.push({id, name, email, phone})
  writeFile(currentContent)
  res.send({id, name, email, phone})
})


server.put('/:id', (req, res) => { // update
  const {id} = req.params

  const {name, email, phone} = req.body

  const currentContent = readFile() // lendo o arquivo
  const selectedItem = currentContent.findIndex((item) => item.id ===id)

  const {id: cid, name: cname, email: cemail, phone: cphone} = currentContent[selectedItem]

  const newObject = {
    id: id ? id : cid,
    name: name ? name : cname,
    email: email ? email : cemail,
    phone: phone ? phone : cphone,
  }

  currentContent[selectedItem] = newObject
  writeFile(currentContent)

  res.send(newObject)
    
})

server.delete('/:id', (req, res) => { //delete
  const {id} = req.params
  const currentContent = readFile()
  const selectedItem = currentContent.findIndex((item) => item.id ===id)

  currentContent.splice(selectedItem, 1)
  writeFile(currentContent)
  res.send(true)
})

//criando um 
server.listen(3050, () => {
  console.log('rodando servidor')
})
