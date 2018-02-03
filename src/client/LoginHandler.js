import { Accounts } from 'meteor/accounts-base'
import { LOGIN_METHOD } from '../config'

export default class LoginHandler {
  constructor (connection) {
    this.connection = connection
  }

  start () {
    Accounts.onLogin(this.login)
    this.connection.onReconnect = this.login
  }

  login = () => {
    const loginToken = Accounts._lastLoginTokenWhenPolled
    if (loginToken) {
      this.connection.call(LOGIN_METHOD, loginToken)
    }
  }
}
