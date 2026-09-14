import 'dotenv/config'
import express from 'express'
import cors from 'cors'


const app = express()
const PORT = process.env.PORT ?? 4000

// Middleware

app.use(express.json())


exports default app



