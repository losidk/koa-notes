const Koa = require('koa');
const Router = require('koa-router')
const mongoose = require('mongoose')
const keys = require('./config/keys')
const mongooseURI = keys.mongooseURI

mongoose.connect(mongooseURI, () => {
    console.log('mongoose connected...')
})

const router = new Router()
const app = new Koa();

app.use(router.routes)

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`server is running at ${port}`)
})