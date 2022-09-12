import validator from 'validator'

export class Login {
  constructor(formClass) {
    this.form = document.querySelector(formClass)
  }

  init() {
    this.events()
  }

  events() {
    if(!this.form) return
    
    this.form.addEventListener('submit', (event) => {
      event.preventDefault()

      this.validate(event)
    })
  }

  validate(event) {
    const element = event.target
    const emailInput = element.querySelector('input[name="email"]')    
    const passwordInput = element.querySelector('input[name="password"]')
    let isError = false
    
    if(!validator.isEmail(emailInput)) {
      alert('Email inválido')
      isError = true
    }

    if(passwordInput.value.length < 3 || passwordInput.value.length > 50) {
      alert('Senha precisa ter entre 3 e 50 caracteres.')
      isError = true
    }

    if(!isError) {
      element.submit()
    }
  }
}