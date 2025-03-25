import express from 'express'
import embeddingGeminiController from '../controllers/embedding_gemini.controller'

const embeddingGeminiRouter = express.Router()

embeddingGeminiRouter.get('/collections', embeddingGeminiController.listCollections)
embeddingGeminiRouter.get('/collections/:collection/documents', embeddingGeminiController.listDocuments)
embeddingGeminiRouter.post('/text', embeddingGeminiController.embedText)
embeddingGeminiRouter.post('/query', embeddingGeminiController.newQuery)
embeddingGeminiRouter.post('/collections', embeddingGeminiController.createCollection)

export default embeddingGeminiRouter
