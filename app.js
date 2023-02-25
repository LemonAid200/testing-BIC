import fetch from 'node-fetch'
import express from 'express'
import path from 'path'
import fs from 'fs'

import AdmZip from "adm-zip"


const app = express()
const port = 3000
app.use(express.json())


app.listen(port, () => {
	console.log('Listening to port: ' + port + '...')
	
	main()
})

async function main(){
	await downloadFile('http://www.cbr.ru/s/newbik', path.resolve() + `/saved/BIC.zip`)
	await unzipp()
	
}

async function unzipp(){
	var zip = new AdmZip(path.resolve() + `/saved/BIC.zip`)
	var zipEntries = zip.getEntries()
	console.log(zipEntries)
	zip.extractAllTo(/*target path*/ path.resolve() + '/unzipped', /*overwrite*/ true);

}

const downloadFile = (async (url, path) => {
  const res = await fetch(url);
  const fileStream = fs.createWriteStream(path);
  await new Promise((resolve, reject) => {
      res.body.pipe(fileStream);
      res.body.on("error", reject);
      fileStream.on("finish", resolve);
    });
});