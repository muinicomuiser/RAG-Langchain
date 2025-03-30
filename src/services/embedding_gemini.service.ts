import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf'
import { ChromaClient, Collection, GoogleGenerativeAiEmbeddingFunction, IncludeEnum } from 'chromadb'
import { config } from 'dotenv'
import { Document } from 'langchain/document'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import collectionMapper from '../mappers/collection.mapper'
import { CustomError, EmbeddingService } from '../types'

config()
const chromaClient = new ChromaClient({ path: process.env.CHROMADB_PATH })
const embedder = new GoogleGenerativeAiEmbeddingFunction({
  apiKeyEnvVar: 'GOOGLE_API_KEY',
  model: process.env.GEMINI_EMBEDDING_MODEL
})

const embeddingGeminiService: EmbeddingService = {
  /** Query in a Collection */
  async newQuery (query, collectionName, resultNumber) {
    try {
      const collection: Collection = await findCollection(
        collectionName,
        embedder
      )
      const results = await collection.query({
        queryTexts: query,
        nResults: resultNumber
      })
      return results.documents[0]
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
  async deleteCollection (collectionName) {
    try {
      await findCollection(collectionName, embedder)
      await chromaClient.deleteCollection({ name: collectionName })
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
  /** Creates a new embedding from a document by its path. */
  async embedDocument (collectionName, file, chunkSize = 1000, chunkOverlap = 10) {
    try {
      const collection = await findCollection(collectionName, embedder)
      const documents = await splitTextDocument(file, chunkSize, chunkOverlap)
      await collection.add({
        ids: documents.map(doc => doc.id as string),
        documents: documents.map(doc => doc.pageContent),
        metadatas: documents.map(doc => { return { source: doc.metadata.source } })
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
  async deleteDocument (collectionName, documentName) {
    try {
      const collection = await findCollection(collectionName, embedder)
      await collection.delete({
        ids: documentName
      })
    } catch (error) {
      const newError = error as CustomError
      const customError: CustomError = {
        message: newError.message,
        statusCode: newError.statusCode ?? 400,
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

async function splitTextDocument (file: Express.Multer.File, chunkSize: number, chunkOverlap: number): Promise<Array<Document<Record<string, any>>>> {
  try {
    // const loader = new TextLoader(path)
    const pdfLoader = new PDFLoader(new Blob([file.buffer]))
    const documents = await pdfLoader.load()
    // console.log(documents)
    const pdfSplitter = new RecursiveCharacterTextSplitter({
      chunkSize,
      chunkOverlap
    })
    // const textSpliter = new RecursiveCharacterTextSplitter({
    //   chunkSize,
    //   chunkOverlap
    // })
    // const splittedText = await textSpliter.splitDocuments(documents)
    // console.log(splittedText)
    const splitted = await pdfSplitter.splitDocuments(documents)
    return splitted.map((doc, idx) => {
      doc.id = `${file.originalname}-${idx + 1}`
      doc.metadata.source = file.originalname
      return doc
    })
    // return await textSpliter.splitDocuments(documents)
  } catch (error) {
    throw error as Error
  }
}

export default embeddingGeminiService
