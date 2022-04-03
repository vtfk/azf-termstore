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
  logger('debug', ['handle-terms', 'getTermStore', 'start'])
  const data = await get(token, `${rootUrl}/termStore`)
  logger('debug', ['handle-terms', 'getTermStore', 'finished', data.id])
  return data
}

/**
 * Get all groups in Term Store
 * @param {String} token Microsoft Graph token
 * @returns {Object} Groups in termStore
 */
const getTermGroups = async token => {
  logger('debug', ['handle-terms', 'getTermGroups', 'start'])
  const data = await get(token, `${rootUrl}/termStore/groups`)
  logger('debug', ['handle-terms', 'getTermGroups', 'finished', data.value.length])
  return data
}

/**
 * Get specific group in Term Store
 * @param {String} token Microsoft Graph token
 * @param {GUID} groupId GUID of group to find
 * @returns {Object} Group in termStore
 */
const getTermGroup = async (token, groupId) => {
  logger('debug', ['handle-terms', 'getTermGroup', groupId, 'start'])
  const data = await get(token, `${rootUrl}/termStore/groups/${groupId}`)
  logger('debug', ['handle-terms', 'getTermGroup', 'finished', data.id])
  return data
}

/**
 * Get term set in a specific group in Term Store
 * @param {String} token Microsoft Graph token
 * @param {GUID} groupId GUID of group to get term set from
 * @returns {Object} Term Set of group in termStore
 */
const getTermGroupSets = async (token, groupId) => {
  logger('debug', ['handle-terms', 'getTermGroupSets', groupId, 'start'])
  const data = await get(token, `${rootUrl}/termStore/groups/${groupId}/sets`)
  logger('debug', ['handle-terms', 'getTermGroupSets', 'finished', data.value.length])
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
  logger('debug', ['handle-terms', 'getTermSetTerms', setId, 'start'])
  const data = await get(token, `${rootUrl}/termStore/sets/${setId}/${recursive ? 'terms' : 'children'}`)
  logger('debug', ['handle-terms', 'getTermSetTerms', 'finished', data.value.length])
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
  logger('debug', ['handle-terms', 'getTermSetTermChildren', setId, termId, 'start'])
  const data = await get(token, `${rootUrl}/termStore/sets/${setId}/terms/${termId}/children`)
  logger('debug', ['handle-terms', 'getTermSetTermChildren', 'finished', data.value.length])
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
  logger('debug', ['handle-terms', 'addTermSetTerm', setId, 'start'])
  const data = await add(token, `${rootUrl}/termStore/sets/${setId}/children`, payload)
  logger('debug', ['handle-terms', 'addTermSetTerm', 'finished', data.id])
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
  logger('debug', ['handle-terms', 'addTermSetTermChildTerm', setId, termId, 'start'])
  const data = await add(token, `${rootUrl}/termStore/sets/${setId}/terms/${termId}/children`, payload)
  logger('debug', ['handle-terms', 'addTermSetTermChildTerm', 'finished', data.id])
  return data
}

/**
 * Create a new term object to pass to {@link addTermSetTerm} or {@link addTermSetTermChildTerm}
 * @param {String} name Label name for the new term
 * @param {String} [description] Description for the new term
 * @param {String} [languageTag] ISO language code for the new term (default is 'en-US')
 * @returns {Object} New term object to pass to {@link addTermSetTerm} or {@link addTermSetTermChildTerm}
 */
const newTerm = (name, description, languageTag = 'en-US') => {
  const term = {
    labels: [
      {
        languageTag,
        name,
        isDefault: true
      }
    ]
  }
  if (description) {
    term.descriptions = [
      {
        description,
        languageTag
      }
    ]
  }

  return term
}

/* ################################## FINDERS ################################## */

/**
 * Find term object by label name
 * @param {Array} terms Array of term objects found by {@link getTermSetTerms}
 * @param {String} name Label name of the term to find
 * @returns {Object} Term object or undefined
 */
const findTermByLabel = (terms, name) => terms.find(term => term.labels && term.labels.filter(label => label.name === name).length > 0)

module.exports = {
  getTermStore,
  getTermGroups,
  getTermGroup,
  getTermGroupSets,
  getTermSetTerms,
  getTermSetTermChildren,
  addTermSetTerm,
  addTermSetTermChildTerm,
  findTermByLabel,
  newTerm
}
