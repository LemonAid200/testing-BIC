import fetch from 'node-fetch'
import express from 'express'
import path from 'path'
import fs from 'fs'
import AdmZip from "adm-zip"
import xml2js from 'xml2js';
import convert from 'xml-js';

import encoding  from 'encoding';

import iconv from 'iconv-lite';







const parser = new xml2js.Parser({ attrkey: "ATTR" });
const app = express()
const port = 3000
app.use(express.json())

let bicPath = path.resolve() +  '/src/20230226ED01OSBR.zip'

app.get('*', (req, res) => {
	
	const fileStream = fs.createReadStream(bicPath);
  fileStream.pipe(res);
	res.status(200)
})

app.listen(port, () => {
	console.log('Listening to port: ' + port + '...')	
	main()
})

async function main(){
	await downloadFile('http://localhost:3000', path.resolve() + `/saved/BIC.zip`)
	await unzip()

	let jsonResult
	let xml_string = fs.readFileSync(path.resolve() + '/unzipped/20230226_ED807_full.xml', 'utf-8');
	
	parser.parseString(xml_string, function(error, result) {
    if(error === null) {
			console.log('Got base');
			jsonResult = result

    }
    else {
      console.log(error);
    }
});

	let parsingResultForBase = parseForBase(jsonResult.ED807.BICDirectoryEntry)	
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


async function unzip(){
	var zip = new AdmZip(path.resolve() + `/saved/BIC.zip`)
	var zipEntries = zip.getEntries()
	zip.extractAllTo(path.resolve() + '/unzipped', /*overwrite*/ true)
}


function parseForBase(data){

	console.log(data[0].ParticipantInfo)
	let res = [
	// {bic:123, name: 'банк1', corrAccount: '001'},
  ]

	let i = true

	// data.forEach(e => {

		// if (i){
		// 	console.log(e.ParticipantInfo)
			
		// }
		// i = false
	// 	res.push({
	// 		bic: e.ATTR.BIC,
	// 		name: e.ParticipantInfo[0].ATTR.NameP,
	// 		corrAccount: '123'

	// 	})		
	// });


	// console.log(res[0])


	// another parser which also doesnt support kirilica
	// console.log(convert.xml2json( fs.readFileSync(path.resolve() + '/unzipped/20230226_ED807_full.xml') ,{compact: false, spaces: 4}))
	return res
}