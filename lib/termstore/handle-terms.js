const { logger } = require('@vtfk/logger')
const { GRAPH: { rootUrl } } = require('../../config')
const { add, get } = require('../graph/handle-graph-data')

/* ################################## GETTERS ################################## */

/**
 * Get Term Store (Taxonomy)
 * @param {String} token Microsoft Graph token
 * @returns {Object} termStore
 */
const getTermStore = async token => {
  logger('info', ['handle-terms', 'getTermStore', 'start'])
  const data = await get(token, `${rootUrl}/termStore`)
  logger('info', ['handle-terms', 'getTermStore', 'finished', data.id])
  return data
}

/**
 * Get all groups in Term Store
 * @param {String} token Microsoft Graph token
 * @returns {Object} Groups in termStore
 */
const getTermGroups = async token => {
  logger('info', ['handle-terms', 'getTermGroups', 'start'])
  const data = await get(token, `${rootUrl}/termStore/groups`)
  logger('info', ['handle-terms', 'getTermGroups', 'finished', data.value.length])
  return data
}

/**
 * Get specific group in Term Store
 * @param {String} token Microsoft Graph token
 * @param {GUID} groupId GUID of group to find
 * @returns {Object} Group in termStore
 */
const getTermGroup = async (token, groupId) => {
  logger('info', ['handle-terms', 'getTermGroup', groupId, 'start'])
  const data = await get(token, `${rootUrl}/termStore/groups/${groupId}`)
  logger('info', ['handle-terms', 'getTermGroup', 'finished', data.id])
  return data
}

/**
 * Get term set in a specific group in Term Store
 * @param {String} token Microsoft Graph token
 * @param {GUID} groupId GUID of group to get term set from
 * @returns {Object} Term Set of group in termStore
 */
const getTermGroupSets = async (token, groupId) => {
  logger('info', ['handle-terms', 'getTermGroupSets', groupId, 'start'])
  const data = await get(token, `${rootUrl}/termStore/groups/${groupId}/sets`)
  logger('info', ['handle-terms', 'getTermGroupSets', 'finished', data.value.length])
  return data
}

/**
 * Get terms in a specific set in Term Store
 * @param {String} token Microsoft Graph token
 * @param {GUID} setId GUID of term set to get terms from
 * @param {Boolean} recursive If true, will get all terms under the term set (recursive). If false, will only get first level children
 * @returns {Object} Terms of a set in termStore
 */
const getTermSetTerms = async (token, setId, recursive = true) => {
  logger('info', ['handle-terms', 'getTermSetTerms', setId, 'start'])
  const data = await get(token, `${rootUrl}/termStore/sets/${setId}/${recursive ? 'terms' : 'children'}`)
  logger('info', ['handle-terms', 'getTermSetTerms', 'finished', data.value.length])
  return data
}

/**
 * Get terms of a term in a specific set in Term Store
 * @param {String} token Microsoft Graph token
 * @param {GUID} setId GUID of term set to get terms from
 * @param {GUID} termId GUID of term to get terms from
 * @returns {Object} Terms of a term in a set in termStore
 */
const getTermSetTermChildren = async (token, setId, termId) => {
  logger('info', ['handle-terms', 'getTermSetTermChildren', setId, termId, 'start'])
  const data = await get(token, `${rootUrl}/termStore/sets/${setId}/terms/${termId}/children`)
  logger('info', ['handle-terms', 'getTermSetTermChildren', 'finished', data.value.length])
  return data
}

/* ################################## ADDERS ################################## */

/**
 * Add term to a specific term set
 * @param {String} token Microsoft Graph token
 * @param {GUID} setId GUID of term set to add term to
 * @returns {Object|Boolean} New term if successful or false if it failed
 */
const addTermSetTerm = async (token, setId, payload) => {
  logger('info', ['handle-terms', 'addTermSetTerm', setId, 'start'])
  const data = await add(token, `${rootUrl}/termStore/sets/${setId}/children`, payload)
  logger('info', ['handle-terms', 'addTermSetTerm', 'finished', data.id])
  return data
}

/**
 * Add term to a term of a specific term set
 * @param {String} token Microsoft Graph token
 * @param {GUID} setId GUID of term set to add term to
 * @param {GUID} termId GUID of term to add term to
 * @returns {Object|Boolean} New term if successful or false if it failed
 */
const addTermSetTermChildTerm = async (token, setId, termId, payload) => {
  logger('info', ['handle-terms', 'addTermSetTermChildTerm', setId, termId, 'start'])
  const data = await add(token, `${rootUrl}/termStore/sets/${setId}/terms/${termId}/children`, payload)
  logger('info', ['handle-terms', 'addTermSetTermChildTerm', 'finished', data.id])
  return data
}

module.exports = {
  getTermStore,
  getTermGroups,
  getTermGroup,
  getTermGroupSets,
  getTermSetTerms,
  getTermSetTermChildren,
  addTermSetTerm,
  addTermSetTermChildTerm
}
