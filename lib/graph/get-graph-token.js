const axios = require('axios').default
const qs = require('qs')
const { logger } = require('@vtfk/logger')
const { GRAPH: { auth } } = require('../../config')
const HTTPError = require('../http-error')

module.exports = async () => {
  const authOptions = {
    client_id: auth.clientId,
    scope: auth.scope,
    client_secret: auth.secret,
    grant_type: auth.grantType
  }

  try {
    const { data } = await axios({
      url: auth.url,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: qs.stringify(authOptions)
    })

    const token = `${data.token_type} ${data.access_token}`.trim()
    logger('debug', ['get-graph-token', token.length])
    return token
  } catch (error) {
    const { status, data } = error.response
    logger('error', ['get-graph-token', 'error', status, data])
    throw new HTTPError(status || 401, data || 'Failed to get graph token', error)
  }
}
