const express = require('express');
const cors = require('cors');
const app = express()


app.use(express.static('static'))
app.use(cors('*'));

app.listen(4000, () => console.log('Example app listening on port 4000!'))