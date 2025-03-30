import embeddingGeminiService from '../services/embedding_gemini.service'
import { EmbeddingController } from '../types'

const embeddingGeminiController: EmbeddingController = {
  async embedText (req, res, next) {
    try {
      const { text, documentTitle, collectionName } = req.body
      const response = await embeddingGeminiService.embedText(
        text,
        documentTitle,
        collectionName
      )
      res.status(201).json({ message: response })
    } catch (error) {
      next(error)
    }
  },
  async listCollections (_req, res, next) {
    try {
      const list = await embeddingGeminiService.listCollections()
      res.json({ collections: list })
    } catch (error) {
      next(error)
    }
  },
  async listDocuments (req, res, next) {
    try {
      const { collection } = req.params
      const list = await embeddingGeminiService.listDocuments(collection)
      res.json({ documents: list })
    } catch (error) {
      next(error)
    }
  },
  async newQuery (req, res, next) {
    try {
      const { query, collectionName, resultNumber } = req.body
      const queryResults = await embeddingGeminiService.newQuery(
        query,
        collectionName,
        resultNumber
      )
      res.json({ results: queryResults })
    } catch (error) {
      next(error)
    }
  },
  async createCollection (req, res, next) {
    try {
      const { name, description } = req.body
      await embeddingGeminiService.createCollection(name, description)
      res.status(201).json({ message: 'Created' })
    } catch (error) {
      next(error)
    }
  }
}

export default embeddingGeminiController
