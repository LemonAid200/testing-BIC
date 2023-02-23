import fetch from 'node-fetch'
import express from 'express'
import path from 'path'

import AdmZip from "adm-zip"


const app = express()
const port = 3000
app.use(express.json())

const response = await fetch('http://www.cbr.ru/s/newbik');
console.log(response)
// const body = await response;



app.get('*', async (req, res) => {

	res.status(200).send('Hello world)')
})

app.listen(port, () => console.log('Listening to port: ' + port + '...'))