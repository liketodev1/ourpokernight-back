const express = require('express')
const mongoose = require('mongoose')
const authRouter = require('./routes/authRouter')
const verifyRouter = require('./routes/verify');

const PORT = process.env.PORT || 5000

const app = express()

app.use(express.json())
app.use("/auth", authRouter)
app.use("/verify", verifyRouter);


const start = async () => {
    try {
        await mongoose.connect('mongodb+srv://gevorg:qwerty123456@cluster0.jhudk.mongodb.net/todos')
        app.listen(PORT, () => console.log(`server started on port ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}

start()

