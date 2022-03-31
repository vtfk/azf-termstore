module.exports = {
  GRAPH: {
    rootUrl: `https://graph.microsoft.com/${process.env.GRAPH_VERSION || 'v1.0'}`,
    auth: {
      url: process.env.GRAPH_AUTH_ENDPOINT || 'https://login.microsoftonline.com/vtfk.onmicrosoft.com/oauth2/v2.0/token',
      clientId: process.env.GRAPH_AUTH_CLIENT_ID || '123456-1234-1234-123456',
      secret: process.env.GRAPH_AUTH_SECRET || 'wnksdnsjblnsfjb',
      scope: process.env.GRAPH_AUTH_SCOPE || 'https://graph.microsoft.com/.default',
      grantType: process.env.GRAPH_AUTH_GRANT_TYPE || 'client_credentials'
    }
  },
  TERMSTORE: {
    setId: process.env.TERMSTORE_SET_ID
  },
  JWT_SECRET: process.env.JWT_SECRET
}
