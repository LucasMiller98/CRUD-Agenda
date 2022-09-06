require('dotenv').config() // environment variable

const express = require('express')
const path = require('path')
const helmet = require('helmet')
const csrf = require('csurf')
const { globalMiddleWare, checkCsrfError, csrfMiddleware } = require('./src/middlewares/middlewares')
const routes = require('./routes')
const app = express()

const mongoose = require('mongoose')
mongoose.connect(process.env.CONNECTIONSTRING, { 
  useNewUrlParser: true, useUnifiedTopology: true 
}).then(() => { // enquanto não tiver conexão, o node não escuta nada.
  app.emit('okay') // evento para emitir que um sinal para o node.
}).catch(error => console.error(error.message))

const session = require('express-session') // salva um cookie no navegador do cliente
const MongoStore = require('connect-mongo')
const flash = require('connect-flash')

app.use(helmet())
app.use(express.urlencoded({ extended: true })) // post de form dentro da app. 
app.use(express.json())
// Conteúdo estático
app.use(express.static(path.resolve(__dirname, 'public'))) // arquivos que são estaticos e podem ser acessados diretamente: .css, images, JS 

const sessionOptions = session({
  secret: 'secret message',
  store: MongoStore.create({ 
    mongoUrl: process.env.CONNECTIONSTRING 
  }), //connecar

  resave: false,
  saveUninitialized: false,
  cookie: { // quanto tempo oo cookie vai durar
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 dias em milésimos de segundos
    httpOnly: true
  }
})

app.use(sessionOptions)
app.use(flash())

// caminho absoluto
app.set('views', path.resolve(__dirname, 'src', 'views'))
app.set('view engine', 'ejs')

app.use(csrf()) // previne um ataque ao site
// nossos proprios middlewares
app.use(globalMiddleWare)
app.use(checkCsrfError)
app.use(csrfMiddleware)
app.use(routes)

app.on('okay', () => { // quando tiver tudo okay, o node vai começar a escutar.
  app.listen(3002, () => console.log(`
  Acesse: http://localhost:3002
  Server is running on port 3002`))
})
