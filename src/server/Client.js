/* eslint-disable no-underscore-dangle */

import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'
import { Accounts } from 'meteor/accounts-base'
import { check } from 'meteor/check'
import {
  LOGIN_TOKENS_COLLECTION,
  LOGIN_TOKENS_PUBLICATION,
  LOGIN_METHOD,
} from '../config'

export default class Client {
  constructor (connection) {
    this.connection = connection
    this.secret = Meteor.settings.DDPAuth.secret
  }

  start () {
    this.LoginTokens = new Mongo.Collection(LOGIN_TOKENS_COLLECTION, {
      connection: this.connection,
    })

    this.connection.subscribe(LOGIN_TOKENS_PUBLICATION, this.secret)

    this.handleTokenChange()
    this.provideLoginMethod()
  }

  handleTokenChange () {
    this.LoginTokens.find().observeChanges({
      changed: (id, fields) => this.logout(id, fields.tokens),
      removed: (id) => this.logout(id),
    })
  }

  getUserSessions (userId) {
    return Object.values(Meteor.server.sessions)
      .filter(session => session.userId === userId)
  }

  logout (userId, tokens = []) {
    this.getUserSessions(userId).forEach(session => {
      const tokenExists = tokens.some(token => token === session.userLoginHashedToken)
      if (!tokenExists) {
        session._setUserId(null)
      }
    })
  }

  provideLoginMethod () {
    const LoginTokens = this.LoginTokens

    Meteor.methods({
      [LOGIN_METHOD] (token) {
        check(token, String)

        const hashedToken = Accounts._hashLoginToken(token)

        const user = LoginTokens.findOne({
          tokens: hashedToken,
        })

        if (user && this.userId === null) {
          this.setUserId(user._id)
          Meteor.server.sessions[this.connection.id].userLoginHashedToken = hashedToken
        }
      }
    })
  }
}
