import { NextFunction } from 'express'
import embeddingGeminiService from '../services/embedding_gemini.service'
import { EmbeddingGeminiController } from '../types'

const embeddingGeminiController: EmbeddingGeminiController = {
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
  async newQuery (req, res): Promise<void> {
    const { query, collectionName, resultNumber } = req.body
    const queryResults: Array<Array<string | null>> = await embeddingGeminiService.newQuery(query, collectionName, resultNumber)
    res.json({ results: queryResults })
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
