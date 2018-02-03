import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'
import { check } from 'meteor/check'
import {
  LOGIN_TOKENS_COLLECTION,
  LOGIN_TOKENS_PUBLICATION,
} from '../config'

export default class Provider {
  constructor () {
    this.secret = Meteor.settings.DDPAuth.secret
  }

  start () {
    this.LoginTokens = new Mongo.Collection(LOGIN_TOKENS_COLLECTION, { connection: null })
    this.syncCollections()
    this.providePublication()
  }

  getAuthenticatedUsers () {
    const tokenField = 'services.resume.loginTokens.hashedToken'
    const selector = { [tokenField]: { $exists: true } }
    const fields = { [tokenField]: true }
    return Meteor.users.find(selector, { fields })
  }

  syncCollections () {
    this.getAuthenticatedUsers().observeChanges({
      added: (_id, fields) => {
        this.LoginTokens.insert({
          _id,
          tokens: this.extractHashedTokens(fields),
        })
      },
      changed: (_id, fields) => {
        this.LoginTokens.update(_id, {
          tokens: this.extractHashedTokens(fields),
        })
      },
      removed: (_id) => {
        this.LoginTokens.remove(_id)
      },
    })
  }

  extractHashedTokens ({ services }) {
    return services.resume.loginTokens.map(token => token.hashedToken)
  }

  providePublication () {
    Meteor.publish(LOGIN_TOKENS_PUBLICATION, (secret) => {
      check(secret, String)

      if (secret === this.secret) {
        return this.LoginTokens.find()
      }

      return this.ready()
    })
  }
}
