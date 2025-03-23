import express from 'express'
import { config } from 'dotenv'
import chatGeminiRouter from './routes/chat_gemini.router'

config()
const app = express()
app.use(express.json())

const PORT: number = (process.env.PORT != null) ? +process.env.PORT : 3000

app.get('/ping', (_req, res) => {
  console.log('someone pinged here!!')
  res.send('pong')
})

app.use('/chat-gemini', chatGeminiRouter)

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
})
