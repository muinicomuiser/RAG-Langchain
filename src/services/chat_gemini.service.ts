import { AIMessage, HumanMessage } from '@langchain/core/messages'
import { ChatGoogleGenerativeAI } from '@langchain/google-genai'
import { config } from 'dotenv'
import { ChatService } from '../types'

config()

const conversation: HumanMessage[] | AIMessage[] = []

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
  }
}

export default chatGeminiService
