const crypt = require('bcryptjs')

const { mapCallbackFn } = require('../../utils/mapCallbackFn')
const { auth } = require('./auth')
const { SCHEMA_TYPES } = require('../constant')
const { REGISTER, LOGIN, UPDATE_PASSWORD } = require('../constant/user')

const { showInfo } = require('../../utils/showLog')
const { USER_ERRORS } = require('../../constants/user')

const userValidator = async (resolve, parent, args, context, info) => {
  const { user: { email, password } } = args
  if (!email || !password) {
    throw USER_ERRORS.USER_MISSING_REQUIRE_WORDS
  }

  return resolve(parent, args, context, info)
}

const userExistenceVerify = async (resolve, parent, args, context, info) => {
  const { user: { email } } = args
  const { dataSources: { userAPI } } = context

  const res = await userAPI.getUserByParams({ email })

  if (res?.dataValues) {
    throw USER_ERRORS.USER_ALREADY_EXIST
  }
  return resolve(parent, args, context, info)
}

const cryptPassword = async (resolve, parent, args, context, info) => {
  const { user: { password }, user } = args
  const salt = crypt.genSaltSync(10)
  showInfo('Success: password is encrypt successful')
  return resolve(parent, { ...args, user: { ...user, password: crypt.hashSync(String(password), salt) } }, context, info)
}

const verifyLogin = async (resolve, parent, args, context, info) => {
  const { user: { email, password } } = args
  const { dataSources: { userAPI } } = context
  const res = await userAPI.getUserByParams({ email })
  if (!res) {
    // user doesn't exist
    throw USER_ERRORS.USER_NOT_EXIST
  }
  const userInfo = res?.dataValues
  const compareRes = crypt.compareSync(password, userInfo?.password)
  if (!compareRes) {
    throw USER_ERRORS.USER_NOT_EXIST
  }
  return resolve(parent, { ...args, user: userInfo }, context, info)
}

const registerMiddleware = [userValidator, userExistenceVerify, cryptPassword].map(mapCallbackFn(SCHEMA_TYPES.MUTATION, REGISTER))

const loginMiddleware = [userValidator, verifyLogin].map(mapCallbackFn(SCHEMA_TYPES.MUTATION, LOGIN))

const updatePasswordMiddleware = [auth, cryptPassword].map(mapCallbackFn(SCHEMA_TYPES.MUTATION, UPDATE_PASSWORD))

module.exports = {
  registerMiddleware,
  loginMiddleware,
  updatePasswordMiddleware
}
