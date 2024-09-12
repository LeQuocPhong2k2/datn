// nơi lấy all link route api

const accountsRouter = require('./accounts')

function route(app) {
  app.use('/accounts', accountsRouter)
}

module.exports = route
