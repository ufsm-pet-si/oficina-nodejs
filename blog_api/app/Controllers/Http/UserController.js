'use strict'

const User = use("App/Models/User")

class UserController {
    async create ({ request }) {
        const data = request.only(["username", "email", "password"])
        const user = await User.create(data)
        return user
    }

    async index ({ request, response, view }) {
        const users = await User.all()
        return users
    }

    async store ({ request, response }) {
        const data = request.only(['username', 'password', 'email'])
        const user = await User.create(data)
        return user
    }

    async show ({ params, request, response, view }) {
        const user = await User.findOrFail(params.id)
        return user
    }

    async update ({ params, request, response }) {
        const user = await User.findOrFail(params.id)
        const data = request.only(['title', 'body'])
        user.merge(data)
        await user.save()
        return user
    }

    async destroy ({ params, request, response }) {
        const user = await User.findOrFail(params.id)
        await user.delete()
    }
}

module.exports = UserController
