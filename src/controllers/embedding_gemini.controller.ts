import embeddingGeminiService from '../services/embedding_gemini.service'
import { CustomError, EmbeddingController } from '../types'

const embeddingGeminiController: EmbeddingController = {
  async newQuery (req, res, next) {
    try {
      const { query, resultNumber } = req.body
      const { collection } = req.params
      const queryResults = await embeddingGeminiService.newQuery(
        query,
        collection,
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
      res.status(201).json({ message: 'Collection created' })
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
  async deleteCollection (req, res, next) {
    try {
      const { collection } = req.params
      await embeddingGeminiService.deleteCollection(collection)
      res.status(200).json({ message: 'Collection deleted' })
    } catch (error) {
      next(error)
    }
  },
  async embedText (req, res, next) {
    try {
      const { text, documentTitle } = req.body
      const { collection } = req.params
      await embeddingGeminiService.embedText(
        text,
        documentTitle,
        collection
      )
      res.status(201).json({ message: 'Text embedded' })
    } catch (error) {
      next(error)
    }
  },
  async embedDocument (req, res, next) {
    try {
      const { file } = req
      if (file === undefined) {
        const error: CustomError = { message: 'Empty file', statusCode: 400, name: 'BadRequest' }
        throw error
      }
      const { chunkSize, chunkOverlap } = req.body
      const { collection } = req.params
      await embeddingGeminiService.embedDocument(collection, file, chunkSize, chunkOverlap)
      res.status(201).json({ message: 'File embedded' })
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
  async deleteDocument (req, res, next) {
    try {
      const { collection, documentName } = req.params
      await embeddingGeminiService.deleteDocument(collection, documentName)
      res.json({ message: 'Document deleted' })
    } catch (error) {
      next(error)
    }
  }
}

export default embeddingGeminiController
