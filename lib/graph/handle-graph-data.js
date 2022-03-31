const axios = require('axios').default
const { logger } = require('@vtfk/logger')
const HTTPError = require('../http-error')

const callGraph = async payload => {
  try {
    logger('info', ['handle-graph-data', 'callGraph', payload.method, 'url', payload.url])
    const { data } = await axios(payload)
    logger('info', ['handle-graph-data', 'callGraph', payload.method, 'finished'])
    return data
  } catch (error) {
    const { status, data } = error.response
    logger('error', ['handle-graph-data', 'error', status, data])
    throw new HTTPError(status || 500, data || 'Failed to get graph data', error)
  }
}

const get = async (token, url, params) => {
  if (!token) {
    logger('error', ['handle-graph-data', 'get', 'token missing'])
    throw new HTTPError(401, 'Unauthorized. Token missing')
  }

  const axiosCall = {
    method: 'GET',
    url,
    headers: {
      Authorization: token
    }
  }
  if (params) axiosCall.params = { ...params }

  const data = await callGraph(axiosCall)
  return data
}

const add = async (token, url, payload) => {
  if (!token) {
    logger('error', ['handle-graph-data', 'add', 'token missing'])
    throw new HTTPError(401, 'Unauthorized. Token missing')
  }

  const axiosCall = {
    method: 'POST',
    url,
    headers: {
      Authorization: token
    },
    data: payload
  }

  const data = await callGraph(axiosCall)
  return data
}

module.exports = {
  get,
  add
}
