import { config } from 'dotenv'
import express from 'express'
import chatGeminiRouter from './routes/chat_gemini.router'
import embeddingGeminiRouter from './routes/embedding_gemini.router'
import errorHandler from './utils/error_handler.middleware'

config()
const app = express()
app.use(express.json())

const PORT: number = (process.env.PORT != null) ? +process.env.PORT : 3000

app.get('/ping', (_req, res) => {
  console.log('someone pinged here!!')
  res.send('pong')
})

app.use('/chat-gemini', chatGeminiRouter)
app.use('/embedding-gemini', embeddingGeminiRouter)

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
})
