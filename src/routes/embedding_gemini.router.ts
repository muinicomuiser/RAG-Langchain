import express from 'express'
import embeddingGeminiController from '../controllers/embedding_gemini.controller'

const embeddingGeminiRouter = express.Router()

embeddingGeminiRouter.post('/text', embeddingGeminiController.embedText)

export default embeddingGeminiRouter
