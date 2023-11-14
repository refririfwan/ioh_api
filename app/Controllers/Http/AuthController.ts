import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import RegisterValidator from 'App/Validators/RegisterValidator'

export default class AuthController {
  public async register({ auth, request, response }: HttpContextContract) {
    try {
      const validateData = await request.validate(RegisterValidator)
      const user = await User.create(validateData)
      const token = await auth.login(user)

      return response.status(201).json({
        user,
        token,
      })
    } catch (error) {
      return response.status(400).json({
        message: error.messages,
      })
    }
  }
}
