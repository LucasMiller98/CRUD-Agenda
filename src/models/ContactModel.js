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
    
    const contact = await ContactModel.findById(id)

    return contact
  }

  static async searchContacts() {
    const contacts = await ContactModel.find()
      .sort({ createAt: -1 }) 

    return contacts
  }

  async register() {
    this.valida()

    if(this.errors.length > 0) return

    this.contact = await ContactModel.create(this.body)

  }

  static async delete(id) {
    if(typeof id !== 'string') return

    const contact = await ContactModel.findOneAndDelete({ _id: id })
    return contact
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

  async edit(id) {
    if(typeof id !== 'string') return

    this.valida()

    if(this.errors.length > 0) return

    this.contact = await ContactModel.findByIdAndUpdate(id, this.body, { new: true }) // retorna os dados atualizados.
    

  }
  
}

module.exports = Contact