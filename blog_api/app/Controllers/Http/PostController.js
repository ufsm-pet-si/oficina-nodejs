'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Post = use('App/Models/Post')

/**
 * Resourceful controller for interacting with posts
 */
class PostController {
  /**
   * Show a list of all posts.
   * GET posts
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {
    const { ownerId } = request.all()
    let posts
    if (ownerId) {
      posts = await Post
        .query()
        .where('user_id', ownerId)
        .with('image')
        .fetch()
    } else {
      posts = await Post
        .query()
        .with('image')
        .fetch()
    }

    return posts
  }

  /**
   * Create/save a new post.
   * POST posts
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ auth, request, response }) {
    const id = auth.user.id
    const data = request.only(['title', 'body'])
    const post = await Post.create({ ...data, user_id: id })
    return post
  }

  /**
   * Display a single post.
   * GET posts/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
    const post = await Post.findOrFail(params.id)
    await post.load('image')
    return post
  }

  /**
   * Render a form to update an existing post.
   * GET posts/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update post details.
   * PUT or PATCH posts/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ auth, params, request, response }) {
    const post = await Post.findOrFail(params.id)
    if (auth.user.id !== post.user_id)
      return response.unauthorized("Acesso não permitido")
    const data = request.only(['title', 'body'])
    post.merge(data)
    await post.save()
    return post
  }

  /**
   * Delete a post with id.
   * DELETE posts/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ auth, params, request, response }) {
    const post = await Post.findOrFail(params.id)
    if (auth.user.id !== post.user_id)
      return response.unauthorized("Acesso não permitido")
    await post.delete()
  }
}




module.exports = PostController
