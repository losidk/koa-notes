const { makeExecutableSchema } = require('@graphql-tools/schema')
const { applyMiddleware } = require('graphql-middleware')

const app = require('./app')
const { startApolloServer } = require('./graphql')
const typeDefs = require('./graphql/schema/index.js')
const resolvers = require('./graphql/resolvers/index.js')
const { registerMiddleware, loginMiddleware, updatePasswordMiddleware } = require('./graphql/middleware/user')

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})

const schemaWithMiddleware = applyMiddleware(
  schema,
  ...registerMiddleware,
  ...loginMiddleware,
  ...updatePasswordMiddleware
)

startApolloServer({ app, schema: schemaWithMiddleware })
