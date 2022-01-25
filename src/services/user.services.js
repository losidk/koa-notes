const User = require('../models/user.model')
const R = require('ramda')

class UserServices {
    async createUser({email, password, name}) {
        const user = await User.create({
            email,
            password,
            name,
        })
        return user?.dataValues
    }

    async getUserInfo({email, name, password = '', isAdmin = ''}) {
        let searchOpt = {
            email,
            name,
            password,
            isAdmin
        }
        const res = await User.findOne({
            attributes: ['email', 'name', 'password', 'isAdmin'],
            where: R.pickBy((item) => !R.not(item), searchOpt)
        })
        return res?.dataValues || null
    }
}

module.exports = new UserServices()