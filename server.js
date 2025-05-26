const express = require('express')
const app = express()
const port = 3000

app.use(express.static('public')) //serve our files in public statically

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
