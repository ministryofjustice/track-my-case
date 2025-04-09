import express from 'express'

const app = express()
const port = process.env.PORT || 3000

// Serve static files (optional)
app.use(express.static('public'))

// Basic route
app.get('/', (req, res) => {
  res.send('✅ Hello from Track My Case UI!')
})

// Health checks
app.get('/health', (_req, res) => {
  res.status(200).send('OK - health')
})


app.get('/healthz', (_req, res) => {
  res.status(200).send('healthz probe OK')
})


app.get('/healthz111', (_req, res) => {
  res.status(200).send('healthz111 to  probe OK')
})



app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
