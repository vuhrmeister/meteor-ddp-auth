import LoginHandler from './LoginHandler'

const DDPAuth = {
  registerLoginHandler (connection) {
    const instance = new LoginHandler(connection)
    instance.start()
  },
}

export {
  DDPAuth
}
