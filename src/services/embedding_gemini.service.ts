import { config } from 'dotenv'
import { EmbeddingGeminiService } from '../types'
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai'
import { TaskType } from '@google/generative-ai'

config()

/** Expects a body like {text: string, documentTitle: string} */
const embeddingGeminiService: EmbeddingGeminiService = {
  async embedText (text: string, documentTitle: string): Promise<string> {
    const embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GOOGLE_API_KEY,
      modelName: process.env.GEMINI_EMBEDDING_MODEL,
      taskType: TaskType.RETRIEVAL_DOCUMENT,
      title: documentTitle
    })

    const res: number[] = await embeddings.embedQuery(text)
    console.log(res)
    return text
  }
}

export default embeddingGeminiService
