/* global Package */

Package.describe({
  name: 'vuhrmeister:ddp-auth',
  version: '0.1.0',
  summary: '',
  git: 'https://github.com/vuhrmeister/meteor-ddp-auth',
  documentation: 'README.md'
})

Package.onUse(function (api) {
  api.versionsFrom('1.6')

  api.use([
    'ecmascript',
    'check',
    'mongo',
    'accounts-base',
  ])

  api.mainModule('src/server/index.js', 'server')
  api.mainModule('src/client/index.js', 'client')
})
