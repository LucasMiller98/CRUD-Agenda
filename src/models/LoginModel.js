const mongoose = require('mongoose')
const validator = require('validator')
const bcryptjs = require('bcryptjs')

const LoginSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true }
})

const LoginModel = mongoose.model('Login', LoginSchema)

class Login {
  constructor(body) {
    this.body = body
    this.errors = []
    this.user = null
  }

  async login() {
    this.valida()
    if(this.errors.length > 0) return

    this.user = await LoginModel.findOne({ email: this.body.email })

    if(!this.user) {
      this.errors.push('E-mail e/ou senha incorreta.')
      return
    }
    
    if(!bcryptjs.compareSync(this.body.password, this.user.password)) {
      this.errors.push('E-mail e/ou senha inválida.')
      this.user = null
      return
    }
  }

  async register() {
    this.valida()

    if(this.errors.length > 0) return

    await this.userExists()

    if(this.errors.length > 0) return

    const salt = bcryptjs.genSaltSync() // gerando um salt
    // hash da senha baseado no valor da senha
    this.body.password = bcryptjs.hashSync(this.body.password, salt)

    this.user = await LoginModel.create(this.body)

  }

  async userExists() {
    this.user = await LoginModel.findOne({ email: this.body.email })

    if(this.user) {
      this.errors.push(`O e-mail "${this.body.email}" já existe.`)
    }

  }
   
  valida() {
    this.cleanUp()

    if(!validator.isEmail(this.body.email)) {
      this.errors.push('Email e/ou senha inválida.')
    }

    if(this.body.password.length < 3 || this.body.password.length > 50) {
      this.errors.push('A senha precisa ter entre 3 e 50 caracteres.')
    }
  }

  cleanUp() {
    for(const key in this.body) {
      if(typeof this.body[key] !== 'string') { // se não for string, converte para uma string vazia
        this.body[key] = ''
      }
    }

    this.body = { 
      // garante os campos necessários nesse model para salvar no BD
      email: this.body.email,
      password: this.body.password
    }
  }
}

module.exports = Login