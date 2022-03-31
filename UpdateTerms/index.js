const { logger, logConfig } = require('@vtfk/logger')
const { uniqueValues } = require('@vtfk/utilities')
const withTokenAuth = require('../lib/with-token-auth')
const getGraphToken = require('../lib/graph/get-graph-token')
const { TERMSTORE: { setId } } = require('../config')
const { getTermSetTerms, addTermSetTerm, addTermSetTermChildTerm } = require('../lib/termstore/handle-terms')
const HTTPError = require('../lib/http-error')

const findTerm = (terms, name) => terms.find(term => term.labels && term.labels.filter(label => label.name === name).length > 0)

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

const addLogItem = (type, log, sector, section, team) => {
  if (team) {
    log.push(`${type.toUpperCase()}: Processing Team:    ${sector} / ${section} / ${team}`)
  } else if (!team && section) {
    log.push(`${type.toUpperCase()}: Processing Section: ${sector} / ${section}`)
  } else if (!team && !section && sector) {
    log.push(`${type.toUpperCase()}: Processing Sector:  ${sector}`)
  }
}

const updateTermStore = async (context, req) => {
  try {
    const sectors = req.body
    const dummyRun = !!req.query.dummyRun
    if (!sectors || !Array.isArray(sectors)) throw new HTTPError(500, 'Please pass sectors')
    if (dummyRun) {
      logConfig({
        prefix: `${context.invocationId} - termstore - dummyRun`
      })
    }

    // get all terms from term set (recursively)
    const token = await getGraphToken()
    const { value: termSetTerms } = await getTermSetTerms(token, setId)

    const outputLog = []

    // get unique sectorIds
    const sectorIds = uniqueValues(sectors, 'SektorId')

    // loop through all sectorIds
    for (const sectorId of sectorIds) {
      // handle sector
      const sector = sectors.find(item => item.SektorId === sectorId)
      let sectorTerm = findTerm(termSetTerms, sectorId)
      if (sectorTerm) {
        logger('info', ['sector', sector.Sektor, sectorTerm.id])
        addLogItem('info', outputLog, sector.Sektor)
      }
      else {
        // create sector term
        if (!dummyRun) {
          logger('warn', ['sector', sector.Sektor, 'will be created 😱'])
          try {
            sectorTerm = await addTermSetTerm(token, setId, newTerm(sector.SektorId, sector.Sektor))
            if (sectorTerm) {
              logger('info', ['sector', sector.Sektor, sectorTerm.id, 'created 👍'])
              addLogItem('warn', outputLog, `'${sector.Sektor}' created`)
            }
            else {
              logger('warn', ['sector', sector.Sektor, 'sector term not found and not created 😱'])
              addLogItem('warn', outputLog, `'${sector.Sektor}' not found and not created`)
            }
          } catch (err) {
            logger('error', ['sector', sector.Sektor, 'failed to create sector term 😡'])
            addLogItem('warn', outputLog, `'${sector.Sektor}' failed to create sector term : ${JSON.stringify(err.message)}`)
          }
        } else {
          logger('warn', ['sector', sector.Sektor, 'would be created 😱'])
          addLogItem('warn', outputLog, `'${sector.Sektor}' would be created`)
        }
      }

      // get unique sections by ['Sektor', 'SektorId', 'Seksjon', 'SeksjonId']
      const sections = uniqueValues(sectors.filter(item => item.SektorId === sectorId && item.SeksjonId), 'SeksjonId', ['Sektor', 'SektorId', 'Seksjon', 'SeksjonId'])

      // loop through all sections
      for (const section of sections) {
        // handle sections

        // if Seksjon is empty, skip entire section
        if (!section.Seksjon) {
          logger('warn', ['section', 'Seksjon is empty. skipping entire section', section, 'teams', sectors.filter(item => item.SektorId === sectorId && item.SeksjonId === section.SeksjonId && item.TeamId).map(item => item.Team), 'sectorTerm', sectorTerm])
          continue
        }

        // get sectionTerm
        let sectionTerm = findTerm(termSetTerms, section.Seksjon)
        if (sectionTerm) {
          logger('info', ['section', section.Seksjon, sectionTerm.id])
          addLogItem('info', outputLog, sector.Sektor, section.Seksjon)
        }
        else {
          // create section term
          if (!dummyRun) {
            logger('warn', ['section', section.Seksjon, 'will be created 😱'])
            try {
              sectionTerm = await addTermSetTermChildTerm(token, setId, sectorTerm.id, newTerm(section.Seksjon))
              if (sectionTerm) {
                logger('info', ['section', section.Seksjon, sectionTerm.id, 'created 👍'])
                addLogItem('info', outputLog, sector.Sektor, `'${section.Seksjon}' created`)
              }
              else {
                logger('warn', ['section', section.Seksjon, 'section term not found and not created 😱'])
                addLogItem('warn', outputLog, sector.Sektor, `'${section.Seksjon}' not found and not created`)
              }
            } catch (err) {
              logger('error', ['section', section.Seksjon, 'failed to create section term 😡'])
              addLogItem('warn', outputLog, sector.Sektor, `'${section.Seksjon}' failed to create section term : ${JSON.stringify(err.message)}`)
            }
          } else {
            logger('warn', ['section', section.Seksjon, 'would be created 😱'])
            addLogItem('warn', outputLog, sector.Sektor, `'${section.Seksjon}' would be created`)

          }
        }

        // get teams in this section
        const teams = sectors.filter(item => item.SektorId === sectorId && item.SeksjonId === section.SeksjonId && item.Team)

        // loop through all teams
        for (const team of teams) {
          // handle teams

          let teamTerm = findTerm(termSetTerms, team.Team)
          if (teamTerm) {
            logger('info', ['team', team.Team, teamTerm.id])
            addLogItem('info', outputLog, sector.Sektor, section.Seksjon, team.Team)
          }
          else {
            // create team term
            if (!dummyRun) {
              logger('warn', ['team', team.Team, 'will be created 😱'])
              try {
                teamTerm = await addTermSetTermChildTerm(token, setId, sectionTerm.id, newTerm(team.Team))
                if (teamTerm) {
                  logger('info', ['team', team.Team, teamTerm.id, 'created 👍'])
                  addLogItem('info', outputLog, sector.Sektor, section.Seksjon, `'${team.Team}' created`)
                }
                else {
                  logger('warn', ['team', team.Team, 'team term not found and not created 😱'])
                  addLogItem('warn', outputLog, sector.Sektor, section.Seksjon, `'${team.Team}' not found and not created`)
                }
              } catch (err) {
                logger('error', ['team', team.Team, 'failed to create team term 😡'])
                addLogItem('error', outputLog, sector.Sektor, section.Seksjon, `'${team.Team}' failed to create team term : ${JSON.stringify(err.message)}`)
              }
            } else {
              logger('warn', ['team', team.Team, 'would be created 😱'])
              addLogItem('warn', outputLog, sector.Sektor, section.Seksjon, `'${team.Team}' would be created`)
            }
          }
        }
      }
    }

    return {
      status: 200,
      body: {
        outputLog
      }
    }
  } catch (error) {
    if (error instanceof HTTPError) return error.toJSON()
    return {
      status: error.response?.status || 500,
      body: {
        error: error.response?.data || error.data || error.message
      }
    }
  }
}

module.exports = (context, req) => withTokenAuth(context, req, updateTermStore)
