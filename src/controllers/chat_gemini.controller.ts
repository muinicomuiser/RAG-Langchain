import chatGeminiService from '../services/chat_gemini.service'
import { ChatController } from '../types'

const chatGeminiController: ChatController = {
  async newMessage (req, res, next) {
    try {
      const { message } = req.body
      const response = await chatGeminiService.newMessage(message)
      res.json({ message: response })
    } catch (error) {
      next(error)
    }
  }
}

export default chatGeminiController
