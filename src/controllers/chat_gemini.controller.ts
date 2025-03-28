import { Request, Response } from 'express'
import { ChatGeminiController } from '../types'
import chatGeminiService from '../services/chat_gemini.service'

const chatGeminiController: ChatGeminiController = {
  async newMessage (req: Request, res: Response): Promise<void> {
    const response: string = await chatGeminiService.newMessage(req.body.message)
    res.json({ message: response })
  }
}

export default chatGeminiController
