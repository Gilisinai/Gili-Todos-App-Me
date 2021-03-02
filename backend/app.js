const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const todoRoutes = require('./routes/todos')
const userRoutes = require('./routes/user')
const app = express()

mongoose.connect(`mongodb+srv://GiliSinai:${process.env.MONGO_ATLAS_PW}@gili.hmiah.mongodb.net/testtodo?w=majority`, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(() => {
    console.log('connected to db')
})
.catch(()=> {
    console.log('Connection failed')
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false}))

app.use((req,res,next) => {
    res.setHeader('Access-Control-Allow-Origin' , "*")
    res.setHeader(
        'Access-Control-Allow-Headers' ,
         "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    )
    res.setHeader('Access-Control-Allow-Methods' ,
        "GET, POST, PATCH, DELETE, PUT,  OPTIONS"
    )

    next()
})

app.use('/api/todos', todoRoutes)
app.use('/api/users', userRoutes)



module.exports = app;