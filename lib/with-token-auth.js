const { logConfig, logger } = require('@vtfk/logger')
const validate = require('./validate-jwt')
const { JWT_SECRET } = require('../config')
const HTTPError = require('./http-error')

module.exports = async (context, request, next) => {
  logConfig({
    prefix: `${context.invocationId} - termstore`,
    azure: {
      context,
      excludeInvocationId: true
    }
  })

  const bearerToken = request.headers.authorization
  if (!bearerToken) {
    logger('warn', ['with-token-auth', request.url, 'no-authorization-header'])
    return new HTTPError(400, 'Authorization header is missing').toJSON()
  }

  try {
    const token = bearerToken.replace('Bearer ', '')
    await validate({ jwt: token, tokenKey: JWT_SECRET })
    return next(context, request)
  } catch (error) {
    logger('error', ['with-token-auth', request.url, 'invalid-token', error])
    return new HTTPError(401, 'Authorization token is invalid').toJSON()
  }
}
