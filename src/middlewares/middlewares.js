exports.globalMiddleWare = (req, res, next) => {
  res.locals.errors = req.flash('errors') // só dentro da resposta
  res.locals.success = req.flash('success')
  res.locals.user = req.session.user
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