import express from 'express'
import chatGeminiController from '../controllers/chat_gemini.controller'

const chatGeminiRouter = express.Router()

chatGeminiRouter.post('/message', chatGeminiController.newMessage)

chatGeminiRouter.post('/rag/message', chatGeminiController.newRagMessage)

export default chatGeminiRouter
