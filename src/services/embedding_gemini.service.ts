import { ChromaClient, Collection, GoogleGenerativeAiEmbeddingFunction, IncludeEnum } from 'chromadb'
import { config } from 'dotenv'
import collectionMapper from '../mappers/collection.mapper'
import { CustomError, EmbeddingService } from '../types'
import { TextLoader } from 'langchain/document_loaders/fs/text'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
// import { Chroma } from '@langchain/community/vectorstores/chroma'
// import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai'

// const embedderLangchain = new GoogleGenerativeAIEmbeddings({ apiKey: process.env.GOOGLE_API_KEY, modelName: process.env.GEMINI_EMBEDDING_MODEL })
// const chromaLangchain = new Chroma(embedderLangchain, {url: process.env.CHROMADB_PATH })

config()
const chromaClient = new ChromaClient({ path: process.env.CHROMADB_PATH })
const embedder = new GoogleGenerativeAiEmbeddingFunction({
  apiKeyEnvVar: 'GOOGLE_API_KEY',
  model: process.env.GEMINI_EMBEDDING_MODEL
})

const embeddingGeminiService: EmbeddingService = {
  /** Expects a body like {text: string, documentTitle: string, collectionName: string} */
  /** Embed a text into an existent collection. If the collection don't exists, a new one is created. */
  async embedText (text, documentTitle, collectionName) {
    try {
      const collection = await findCollection(
        collectionName,
        embedder
      )
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
  async listCollections () {
    try {
      const collections = await chromaClient.listCollectionsAndMetadata()
      return collectionMapper.collectionsToDtoArray(collections as Collection[])
    } catch (error) {
      const newError = error as Error
      const customError: CustomError = {
        message: newError.message,
        statusCode: 500,
        name: newError.name
      }
      throw customError
    }
  },

  async listDocuments (collectionName) {
    try {
      const collection = await findCollection(
        collectionName,
        embedder
      )
      const results = await collection.get({
        include: [IncludeEnum.Documents]
      })
      return results.ids
    } catch (error) {
      const newError = error as CustomError
      const customError: CustomError = {
        message: newError.message,
        statusCode: newError.statusCode ?? 400,
        name: newError.name
      }
      throw customError
    }
  },

  /** Query in a Collection */
  async newQuery (query, collectionName, resultNumber) {
    try {
      const collection: Collection = await findCollection(
        collectionName,
        embedder
      )
      // const embedQuery = await embedder.generate([query])
      // console.log(embedQuery)
      const results = await collection.query({
        // queryEmbeddings: embedQuery,
        queryTexts: query,
        nResults: resultNumber
        // whereDocument: { $contains: query }
        // include: [IncludeEnum.Documents]
      })
      console.log(results)
      return results.documents
    } catch (error) {
      const newError = error as CustomError
      const customError: CustomError = {
        message: newError.message,
        statusCode: newError.statusCode ?? 400,
        name: newError.name
      }
      throw customError
    }
  },

  /** Create a new collection */
  async createCollection (name, description) {
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
      const customError: CustomError = {
        message: newError.message,
        statusCode: 400,
        name: newError.name
      }
      throw customError
    }
  },

  /** Creates a new embedding from a document by its path. */
  async embedDocument (filePath, chunkSize = 1000, chunkOverlap = 10) {
    try {
      await splitTextDocument(filePath, chunkSize, chunkOverlap)
    } catch (error) {
      const newError = error as Error
      const customError: CustomError = {
        message: newError.message,
        statusCode: 400,
        name: newError.name
      }
      throw customError
    }
  }
}

/** Utils */
async function findCollection (
  name: string,
  embeddingFunction: GoogleGenerativeAiEmbeddingFunction
): Promise<Collection> {
  try {
    const collection = await chromaClient.getCollection({
      name,
      embeddingFunction
    })
    return collection
  } catch (error) {
    const newError = error as Error
    const customError: CustomError = {
      message: 'Collection not found',
      statusCode: 404,
      name: newError.name
    }
    throw customError
  }
}

async function splitTextDocument (path: string, chunkSize: number, chunkOverlap: number): Promise<void> {
  try {
    const loader = new TextLoader(path)
    const documents = await loader.load()
    const textSpliter = new RecursiveCharacterTextSplitter({
      chunkSize,
      chunkOverlap
    })
    const splittedText = await textSpliter.splitDocuments(documents)
    console.log(splittedText)
  } catch (error) {
    throw error as Error
  }
}

export default embeddingGeminiService
