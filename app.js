import fetch from 'node-fetch'
import express from 'express'
import path from 'path'
import fs from 'fs'
import AdmZip from "adm-zip"
import convert from 'xml-js'

const app = express()
const port = 3000
app.use(express.json())


app.get('*', (req, res) => {
	let bicPath = path.resolve() +  '/src/20230226ED01OSBR.zip'
	const fileStream = fs.createReadStream(bicPath);
  fileStream.pipe(res);
	res.status(200)
})

app.listen(port, () => {
	console.log('Listening to port: ' + port + '...')	
	main()
})

async function main(){
	await downloadFile('http://localhost:' + port, path.resolve() + `/saved/BIC.zip`)
	await unzip()
}

const downloadFile = (async (url, path) => {
  const res = await fetch(url);
	console.log(res.status)
	
	const fileStream = fs.createWriteStream(path);
  await new Promise((resolve, reject) => {
      res.body.pipe(fileStream);
      res.body.on("error", reject);
      fileStream.on("finish", resolve);
    });
});


async function unzip(){
	var zip = new AdmZip(path.resolve() + `/saved/BIC.zip`)
	var zipEntries = zip.getEntries()
	zip.extractAllTo(path.resolve() + '/unzipped', /*overwrite*/ true)
}