import { ChromaClient, Collection, GoogleGenerativeAiEmbeddingFunction, IncludeEnum } from 'chromadb'
import { config } from 'dotenv'
import collectionMapper from '../mappers/collection.mapper'
import { CustomError, EmbeddingService } from '../types'

config()
const chromaClient: ChromaClient = new ChromaClient({ path: process.env.CHROMADB_PATH })
const embedder = new GoogleGenerativeAiEmbeddingFunction({
  apiKeyEnvVar: 'GOOGLE_API_KEY',
  model: process.env.GEMINI_EMBEDDING_MODEL
})
/** Expects a body like {text: string, documentTitle: string, collectionName: string} */
const embeddingGeminiService: EmbeddingService = {

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
    try {
      const collections = await chromaClient.listCollectionsAndMetadata()
      return collectionMapper.collectionsToDtoArray(collections as Collection[])
    } catch (error) {
      const newError = error as Error
      const customError: CustomError = { message: newError.message, statusCode: 500, name: newError.name }
      throw customError
    }
  },

  async listDocuments (collectionName: string): Promise<string[]> {
    try {
      const collection = await findCollection(collectionName, embedder)
      const results = await collection.get({
        include: [IncludeEnum.Documents]
      })
      return results.ids
    } catch (error) {
      const newError = error as CustomError
      const customError: CustomError = { message: newError.message, statusCode: newError.statusCode ?? 400, name: newError.name }
      throw customError
    }
  },

  /** Query in a Collection */
  async newQuery (query: string, collectionName: string, resultNumber: number): Promise<Array<Array<string | null>>> {
    try {
      const collection: Collection = await findCollection(collectionName, embedder)
      const results = await collection.query({
        queryTexts: query,
        nResults: resultNumber
      })
      return results.documents
    } catch (error) {
      const newError = error as CustomError
      const customError: CustomError = { message: newError.message, statusCode: newError.statusCode ?? 400, name: newError.name }
      throw customError
    }
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
      const newError = error as Error
      const customError: CustomError = { message: newError.message, statusCode: 400, name: newError.name }
      throw customError
    }
  }
}

async function findCollection (name: string, embeddingFunction: GoogleGenerativeAiEmbeddingFunction): Promise<Collection> {
  try {
    const collection = await chromaClient.getCollection({ name, embeddingFunction })
    return collection
  } catch (error) {
    const newError = error as Error
    const customError: CustomError = { message: 'Collection not found', statusCode: 404, name: newError.name }
    throw customError
  }
}

// async function splitTextDocument (path: string): Promise<void> {
//   try {
//     const loader = new TextLoader(path)
//     const documents = await loader.load()
//     const textSpliter = new RecursiveCharacterTextSplitter({ chunkSize: 1000, chunkOverlap: 10 })
//     const splittedText = await textSpliter.splitDocuments(documents)
//     console.log(splittedText)
//   } catch (error) {
//     throw error as Error
//   }
// }

export default embeddingGeminiService
