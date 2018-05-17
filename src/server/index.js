import { Meteor } from 'meteor/meteor'
import Provider from './Provider'
import Client from './Client'

let providerInstance = null

const DDPAuth = {
  startProvider () {
    if (providerInstance) {
      throw new Meteor.Error('DDPAuth provider can be started only once!')
    }

    providerInstance = new Provider()
    providerInstance.start()
  },

  startClient (connection) {
    const instance = new Client(connection)
    instance.start()
  },
}

export {
  DDPAuth
}
