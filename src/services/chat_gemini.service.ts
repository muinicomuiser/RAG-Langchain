import { AIMessage, AIMessageChunk, HumanMessage } from '@langchain/core/messages'
import { config } from 'dotenv'
import { ChatGeminiService } from '../types'
import { ChatGoogleGenerativeAI } from '@langchain/google-genai'

config()

const conversation: HumanMessage[] | AIMessage[] = []

const model = new ChatGoogleGenerativeAI({
  modelName: process.env.GEMINI_GENERATIVE_MODEL,
  maxOutputTokens: 2048
})

const chatGeminiService: ChatGeminiService = {
  async newMessage (message: string): Promise<string> {
    const humanMessage: HumanMessage = new HumanMessage(message)
    conversation.push(humanMessage)
    const response: AIMessageChunk = await model.invoke(conversation)
    const aiMessage: AIMessage = new AIMessage(String(response.content))
    conversation.push(aiMessage)

    const totalTokens = response.usage_metadata?.total_tokens
    console.log(`Total tokens: ${(totalTokens !== undefined) ? totalTokens : 'No info'}`)
    return String(response.content)
  }
}

export default chatGeminiService
