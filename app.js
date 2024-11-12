const express = require('express')
const app = express()

const {open} = require('sqlite')
const sqlite3 = require('sqlite3')

const path = require('path')
const dbPath = path.join(__dirname, 'cricketTeam.db')

app.use(express.json())

let db = null

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('server started')
    })
  } catch (e) {
    console.log(`DB error: ${e.message}`)
    process.exit(1)
  }
}
initializeDBAndServer()

// convert snakeCase to camelCase
const convertDbObjectToResponseObject = dbObject => {
  return {
    playerId: dbObject.player_id,
    playerName: dbObject.player_name,
    jerseyNumber: dbObject.jersey_number,
    role: dbObject.role,
  }
}

//get Players Detailes API 1
app.get('/players/', async (request, response) => {
  const getPlayersQuery = `SELECT * FROM cricket_team ORDER BY player_id;`
  const playersDetailsArray = await db.all(getPlayersQuery)
  response.send(
    playersDetailsArray.map(eachObject =>
      convertDbObjectToResponseObject(eachObject),
    ),
  )
  console.log('running')
})

//Create Player API 2
app.post('/players/', async (request, response) => {
  const playerDetails = request.body
  const {playerName, jerseyNumber, role} = playerDetails
  const addPlayerquery = `INSERT INTO cricket_team(player_name, jersey_number, role)
  VALUES('${playerName}', '${jerseyNumber}', '${role}')`
  const dbResponse = await db.run(addPlayerquery)
  // console.log(dbResponse)
  const {playerId} = dbResponse.lastID
  response.send('Player Added to Team')
})

//get Player API 3
app.get('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const getPlayerQuery = `SELECT * FROM cricket_team WHERE player_id=${playerId};`
  const playerDetails = await db.get(getPlayerQuery)
  response.send(convertDbObjectToResponseObject(playerDetails))
  console.log('hii')
})

//Updated Player API 4
app.put('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const putPlayerDetails = request.body
  const {playerName, jerseyNumber, role} = putPlayerDetails
  const putPlayerQuery = `UPDATE cricket_team 
  SET 
  player_name ='${playerName}', 
  jersey_number =${jerseyNumber}, role ='${role}' WHERE player_id = ${playerId}`
  const playerDetails = await db.run(putPlayerQuery)
  response.send('Player Details Updated')
})

//Delete Player API 5

app.delete('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const deletplayerQuery = `DELETE FROM cricket_team WHERE player_id=${playerId}`
  const dbResponse = await db.run(deletplayerQuery)
  response.send('Player Removed')
  console.log('its fine')
})

module.exports = app

// NXTWAVE SOLUTION
// const express = require('express')
// const {open} = require('sqlite')
// const sqlite3 = require('sqlite3')
// const path = require('path')

// const databasePath = path.join(__dirname, 'cricketTeam.db')

// const app = express()

// app.use(express.json())

// let database = null

// const initializeDbAndServer = async () => {
//   try {
//     database = await open({
//       filename: databasePath,
//       driver: sqlite3.Database,
//     })
//     app.listen(3000, () =>
//       console.log('Server Running at http://localhost:3000/'),
//     )
//   } catch (error) {
//     console.log(`DB Error: ${error.message}`)
//     process.exit(1)
//   }
// }

// initializeDbAndServer()

// const convertDbObjectToResponseObject = dbObject => {
//   return {
//     playerId: dbObject.player_id,
//     playerName: dbObject.player_name,
//     jerseyNumber: dbObject.jersey_number,
//     role: dbObject.role,
//   }
// }

// app.get('/players/', async (request, response) => {
//   const getPlayersQuery = `
//     SELECT
//       *
//     FROM
//       cricket_team;`
//   const playersArray = await database.all(getPlayersQuery)
//   response.send(
//     playersArray.map(eachPlayer => convertDbObjectToResponseObject(eachPlayer)),
//   )
// })

// app.get('/players/:playerId/', async (request, response) => {
//   const {playerId} = request.params
//   const getPlayerQuery = `
//     SELECT
//       *
//     FROM
//       cricket_team
//     WHERE
//       player_id = ${playerId};`
//   const player = await database.get(getPlayerQuery)
//   response.send(convertDbObjectToResponseObject(player))
// })

// app.post('/players/', async (request, response) => {
//   const {playerName, jerseyNumber, role} = request.body
//   const postPlayerQuery = `
//   INSERT INTO
//     cricket_team (player_name, jersey_number, role)
//   VALUES
//     ('${playerName}', ${jerseyNumber}, '${role}');`
//   const player = await database.run(postPlayerQuery)
//   response.send('Player Added to Team')
// })

// app.put('/players/:playerId/', async (request, response) => {
//   const {playerName, jerseyNumber, role} = request.body
//   const {playerId} = request.params
//   const updatePlayerQuery = `
//   UPDATE
//     cricket_team
//   SET
//     player_name = '${playerName}',
//     jersey_number = ${jerseyNumber},
//     role = '${role}'
//   WHERE
//     player_id = ${playerId};`

//   await database.run(updatePlayerQuery)
//   response.send('Player Details Updated')
// })

// app.delete('/players/:playerId/', async (request, response) => {
//   const {playerId} = request.params
//   const deletePlayerQuery = `
//   DELETE FROM
//     cricket_team
//   WHERE
//     player_id = ${playerId};`
//   await database.run(deletePlayerQuery)
//   response.send('Player Removed')
// })
// module.exports = app
