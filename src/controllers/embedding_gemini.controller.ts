import { NextFunction } from 'express'
import embeddingGeminiService from '../services/embedding_gemini.service'
import { EmbeddingController } from '../types'

const embeddingGeminiController: EmbeddingController = {
  async embedText (req, res, next: NextFunction): Promise<void> {
    try {
      const response: string = await embeddingGeminiService.embedText(req.body.text, req.body.documentTitle, req.body.collectionName)
      res.status(201).json({ message: response })
    } catch (error) {
      next(error)
    }
  },
  async listCollections (_req, res): Promise<void> {
    const list: Array<{ name: string, description: string }> = await embeddingGeminiService.listCollections()
    res.json({ collections: list })
  },
  async listDocuments (req, res, _next) {
    const { collection } = req.params
    const list: string[] = await embeddingGeminiService.listDocuments(collection)
    res.json({ documents: list })
  },
  async newQuery (req, res, next): Promise<void> {
    try {
      const { query, collectionName, resultNumber } = req.body
      const queryResults: Array<Array<string | null>> = await embeddingGeminiService.newQuery(query, collectionName, resultNumber)
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
