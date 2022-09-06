exports.globalMiddleWare = (req, res, next) => {
  res.locals.umaVariavelLocal = 'Este é o valor da variável local' // só dentro da resposta
  next()
}

exports.middlewareTest = (req, res, next) => {
  next()
}

exports.checkCsrfError = (error, req, res, next) => {
  if(error) {
    return res.render('404')
  }

  next()
}

exports.csrfMiddleware = (req, res, next) => {
  res.locals.csrfToken = req.csrfToken()

  next()
}













// let { client } = req.body

  // if(client) {
  //   client = client.replace('Miller', 'NÃO USE MILLER')
  //   console.log(`Vi que você postou ${client}`)
  //   console.log()
  // }