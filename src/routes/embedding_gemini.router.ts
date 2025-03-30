import express from 'express'
import embeddingGeminiController from '../controllers/embedding_gemini.controller'
import multer from 'multer'

const embeddingGeminiRouter = express.Router()

/** Query over a Collection */
embeddingGeminiRouter.post('/collections/:collection/query', embeddingGeminiController.newQuery)

/** List Collections */
embeddingGeminiRouter.get('/collections', embeddingGeminiController.listCollections)
/** List Documents in a Collection */
embeddingGeminiRouter.get('/collections/:collection/documents', embeddingGeminiController.listDocuments)
/** Create a Collection */
embeddingGeminiRouter.post('/collections', embeddingGeminiController.createCollection)
/** Delete a collection by its name */
embeddingGeminiRouter.delete('/collections/:collection', embeddingGeminiController.deleteCollection)

/** Embed Text from the Body */
embeddingGeminiRouter.post('/collections/:collection/text', embeddingGeminiController.embedText)
/** Embed Text from a document */
embeddingGeminiRouter.post('/collections/:collection/file', multer().single('file'), embeddingGeminiController.embedDocument)
/** Delete a document in a collection by its name */
embeddingGeminiRouter.delete('/collections/:collection/documents/:documentName', embeddingGeminiController.deleteDocument)

export default embeddingGeminiRouter
