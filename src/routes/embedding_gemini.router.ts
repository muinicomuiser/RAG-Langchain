import express from 'express'
import embeddingGeminiController from '../controllers/embedding_gemini.controller'

const embeddingGeminiRouter = express.Router()

/** Query over a Collection */
embeddingGeminiRouter.post('/query', embeddingGeminiController.newQuery)

/** List Collections */
embeddingGeminiRouter.get('/collections', embeddingGeminiController.listCollections)
/** List Documents in a Collection */
embeddingGeminiRouter.get('/collections/:collection/documents', embeddingGeminiController.listDocuments)
/** Create a Collection */
embeddingGeminiRouter.post('/collections', embeddingGeminiController.createCollection)

/** Embed Text from the Body */
embeddingGeminiRouter.post('/embeds/text', embeddingGeminiController.embedText)
/** Embed Text from a document */
embeddingGeminiRouter.post('/embeds/document', embeddingGeminiController.embedDocument)

export default embeddingGeminiRouter
