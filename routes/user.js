const { Router } = require("express");
const User = require("../schema/user");
const Log = require("../schema/log");
const { checkSchema, validationResult, matchedData } = require("express-validator");
const exerciseDataValidationSchema = require("../schema/validationSchema");
const router = Router()

const getMilliseconds = (date) => {
  return new Date(date).getTime()
}

const formatDate = (date) => {
  return  new Date(new Date(date).toISOString().split('Z')[0])
  // removes the timezone information information on the UTC value
  // to make sure that the date value returned in the request
  // body lines up with what was posted in the form.
}

router.post('/api/users', async (req, res) => {
  const { body: { username } } = req
  
  if (!username) return res.sendStatus(401)
  
  const existingUser = await User.findOne({ username })
  if (existingUser) return res.status(201).json(existingUser)
  
  const newUser = await User({ username }).save()
  return res.status(201).json(newUser)
})

router.get('/api/users', async (req, res) => {
  let allUsers = await User.find({})
  allUsers = allUsers.map(({username, _id}) => ({username, _id}))
  return res.json(allUsers)
})



router.post('/api/users/:_id/exercises', checkSchema(exerciseDataValidationSchema), async (req, res) => {
  const {
    body: {  date },
    params: { _id }
  } = req
  
  const result = validationResult(req)
  if (!result.isEmpty()) return res.status(400).send(result.array())
  
  const { description, duration } = matchedData(req)
  let exerciseDate = date ? new Date(date) : new Date()
  exerciseDate = formatDate(exerciseDate)
  const exerciseData = { description, duration: Number(duration), date: exerciseDate.toLocaleDateString() }
  

  const existingUser = await User.findById(_id)
  if (!existingUser) return res.status(404).json({ msg: "No user exists for that id"})
  const { username } = existingUser


  const existingLog = await Log.findById(_id)
  if (existingLog) {
    existingLog.log.push(exerciseData)
    existingLog.count += 1
    existingLog.save()
    console.log("Log Updated")
  }

  else {
    const newLog = await Log({
      count: 1, _id,
      log: [exerciseData]
    }).save()
    console.log("Log Created")
  }

  return res.status(201).json({ username, ...exerciseData, date: exerciseDate.toDateString(), _id })  
})


router.get('/api/users/:_id/logs', async (req, res) => {
  const {
    params: { _id },
    query: { from, to, limit}
  } = req

  const existingUser = await User.findById(_id)
  if (!existingUser) return res.status(404).json({ msg: "No user exists for that id"})

  const { username } = (existingUser)

  const existingLog = await Log.findById(_id)
  if (!existingLog) return res.sendStatus(404)
  const { log } = existingLog


  const filteredLog = log.filter(({ date }) => {
    if(from && !to) return getMilliseconds(date) >= getMilliseconds(from)
    if(!from && to) return getMilliseconds(date) <= getMilliseconds(to)
    if (from && to) return getMilliseconds(date) >= getMilliseconds(from) && getMilliseconds(date) <= getMilliseconds(to)
    else return true
  }).map(({ duration, description, date}) => ({ description, duration, date: new Date(date).toDateString()}))

  if (limit) filteredLog.splice(Number(limit)).sort((a, b) => getMilliseconds(b.date) - getMilliseconds(a.date))
  
  const returnLog = {
    username, _id, count: filteredLog.length, log:filteredLog, 
  }

  if(from) returnLog.from = from
  if(to) returnLog.to = to
  if (limit) returnLog.limit = limit
  
  return res.status(201).json(returnLog)
})

module.exports = router

