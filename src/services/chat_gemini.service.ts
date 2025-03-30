import { AIMessage, HumanMessage, SystemMessage } from '@langchain/core/messages'
import { ChatGoogleGenerativeAI } from '@langchain/google-genai'
import { config } from 'dotenv'
import { ChatService } from '../types'
import embeddingGeminiService from './embedding_gemini.service'

config()

const conversation: HumanMessage[] | AIMessage[] | SystemMessage[] = []

const SystemRagPrompt = (concatenatedDocuments: string): SystemMessage => {
  return new SystemMessage(`
  You are a virtual avatar of a person. You have information about your represented person's biography. You will receive querys and you have to act like that person.
  Always answer with 50 words as much.
  Always answer in spanish.
  Use the next information to answer: ${concatenatedDocuments}
`)
}

const model = new ChatGoogleGenerativeAI({
  modelName: process.env.GEMINI_GENERATIVE_MODEL,
  maxOutputTokens: 2048
})

const chatGeminiService: ChatService = {
  async newMessage (message) {
    const humanMessage = new HumanMessage(message)
    conversation.push(humanMessage)
    const response = await model.invoke(conversation)
    const aiMessage = new AIMessage(String(response.content))
    conversation.push(aiMessage)

    const totalTokens = response.usage_metadata?.total_tokens
    console.log(`Total tokens: ${(totalTokens !== undefined) ? totalTokens : 'No info'}`)
    return String(response.content)
  },
  async newRagMessage (message, collectionName, resultNumber) {
    const documents = await embeddingGeminiService.newQuery(message, collectionName, resultNumber)
    const documentsString: string[] = documents.filter((document: string | null) => document !== null)
    const systemMessage = SystemRagPrompt(documentsString.toString())
    const humanMessage = new HumanMessage(message)
    const response = await model.invoke([systemMessage, humanMessage])

    const totalTokens = response.usage_metadata?.total_tokens
    console.log(`Total tokens: ${(totalTokens !== undefined) ? totalTokens : 'No info'}`)
    return String(response.content)

    // if (documents !== null) {
    //   const SystemMessage = SystemRagPrompt(documents[0])
    // }
  }
}

export default chatGeminiService
