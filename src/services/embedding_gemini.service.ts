import { ChromaClient, Collection, GoogleGenerativeAiEmbeddingFunction } from 'chromadb'
import { config } from 'dotenv'
import { EmbeddingGeminiService } from '../types'

config()
const chromaClient: ChromaClient = new ChromaClient({ path: process.env.CHROMADB_PATH })
const embedder = new GoogleGenerativeAiEmbeddingFunction({
  apiKeyEnvVar: 'GOOGLE_API_KEY',
  model: process.env.GEMINI_EMBEDDING_MODEL
})
/** Expects a body like {text: string, documentTitle: string, collectionName: string} */
const embeddingGeminiService: EmbeddingGeminiService = {

  /** Embed a text into an existent collection. If the collection don't exists, a new one is created. */
  async embedText (text: string, documentTitle: string, collectionName: string): Promise<string> {
    try {
      const collection = await findCollection(collectionName, embedder)

      await collection.add({
        ids: [documentTitle],
        documents: [text]
      })
      return text
    } catch (error) {
      throw new Error((error as Error).message)
    }
  },

  /** Get a list of the Collections in the DB */
  async listCollections (): Promise<Array<{ name: string, description: string }>> {
    const collections = await chromaClient.listCollectionsAndMetadata()
    return collections.map(collection =>
      ({
        name: collection.name,
        description: (collection.metadata !== undefined) ? ((collection.metadata.description !== undefined) ? collection.metadata.description as string : 'No info') : 'No info'
      })
    )
  },

  /** Query in a Collection */
  async newQuery (query: string, collectionName: string, resultNumber: number): Promise<Array<Array<string | null>>> {
    const collection: Collection = await findCollection(collectionName, embedder)
    const results = await collection.query({
      queryTexts: query,
      nResults: resultNumber
    })
    console.log(results)
    return results.documents
  },

  /** Create a new collection */
  async createCollection (name: string, description: string): Promise<void> {
    try {
      await chromaClient.createCollection({
        embeddingFunction: embedder,
        name,
        metadata: {
          description
        }
      })
    } catch (error) {
      throw new Error((error as Error).message)
    }
  }
}

async function findCollection (name: string, embeddingFunction: GoogleGenerativeAiEmbeddingFunction): Promise<Collection> {
  try {
    const collection = await chromaClient.getCollection({ name, embeddingFunction })
    return collection
  } catch (error) {
    throw new Error('Collection not found')
  }
}

export default embeddingGeminiService
