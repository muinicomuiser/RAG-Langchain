import { Request, Response } from 'express'
import { EmbeddingGeminiController } from '../types'
import embeddingGeminiService from '../services/embedding_gemini.service'

const embeddingGeminiController: EmbeddingGeminiController = {
  async embedText (req: Request, res: Response): Promise<void> {
    const response: string = await embeddingGeminiService.embedText(req.body.text, req.body.documentTitle)
    res.json({ message: response })
  }
}

export default embeddingGeminiController
