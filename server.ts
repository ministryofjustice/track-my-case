import express from 'express'

const app = express()
const port = process.env.PORT || 9999

// Serve static files (optional)
app.use(express.static('public'))

// Basic route
app.get('/', (req, res) => {
  res.send('✅ Hello from Track My Case UI!' + new Date().toISOString())
})

// Health checks
app.get('/health', (_req, res) => {
  res.status(200).send('OK - health' + new Date().toISOString())
})


app.get('/healthz', (_req, res) => {
  res.status(200).send('healthz probe OK' + new Date().toISOString())
})


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}\nhealth: http://localhost:${port}/health\nhealthz running on http://localhost:${port}/healthz`)
})
