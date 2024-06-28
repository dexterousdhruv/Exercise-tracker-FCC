const express = require('express')
const app = express()
const cors = require('cors')
const connectDB = require('./connect')
require('dotenv').config()
const bodyParser = require('body-parser')
const userRouter = require('./routes/user.js')


connectDB()
.then(() => console.log('MongoDB connected!'))
.catch((err) => console.log(err))

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))
app.use(express.json())

app.use(userRouter)

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
