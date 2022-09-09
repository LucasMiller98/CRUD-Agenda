const mongoose = require('mongoose')
const validator = require('validator')

const ContactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  surname: { type: String, required: false, default: '' },
  email: { type: String, required: false, default: '' },
  phone: { type: String, required: false, default: '' },
  createAt: { type: Date, default: Date.now() }
})

const ContactModel = mongoose.model('Contact', ContactSchema)

class Contact {
  constructor(body) {
    this.body = body
    this.errors = []
    this.contact = null
  }

  static async searchById(id) {

    if(typeof id !== 'string') return
    
    const user = await ContactModel.findById(id)

    return user
  }

  async register() {
    this.valida()

    if(this.errors.length > 0) return

    this.contact = await ContactModel.create(this.body)

  }

  valida() {
    this.cleanUp()

    if(this.body.email && !validator.isEmail(this.body.email)) {
      this.errors.push('Email e/ou senha inválida.')
    }

    if(!this.body.name) this.errors.push('Nome é um campo obrigatório.')

    if(!this.body.email && !this.body.phone) {
      this.errors.push('Pelo menos um contato precisa ser enviado: email ou telefone.')
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
      name: this.body.name,
      surname: this.body.surname,
      email: this.body.email,
      phone: this.body.phone
    }
  }
}

module.exports = Contact