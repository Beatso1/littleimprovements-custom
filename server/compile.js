// requirements
const Nanoid = require("nanoid");
const fs = require("fs");
const Dropbox = require("dropbox").Dropbox;
require("isomorphic-fetch");
require("dotenv").config();

// setup Dropbox
const dbx = new Dropbox ({ fetch: fetch, accessToken: process.env.DBXACCESSTOKEN });

// get availableModules object
const availableModules = JSON.parse(fs.readFileSync('availableModules.json'))

function uploadFiles ( storageFilePaths, packFilePaths, packRoot ) {
	for (i in storageFilePaths) {
		fs.readFile(storageFilePaths[i], function (err, contents){
			dbx.filesUpload({ path: packRoot+packFilePaths[i], contents: contents })
			.then(function (response) {
			  console.log(response);
			})
			.catch(function (err) {
			  console.log(err);
			});
		});
	}
}

// compilePack function that gets exported to app.js
module.exports.compilePack  = function(requestBody) {

	// generate id and create pack path
    const id = Nanoid.nanoid(5)	
	const packPath = `/packs/${id}`
	console.log("pack path = "+packPath)

	// go through every available module, and if it is included in the request body, run the function to add it
	for (i in availableModules) {
		if (requestBody.modules.includes (availableModules[i].id)) {
			for (x in availableModules[i].storageFilePaths) {
				uploadFiles(availableModules[i].storageFiles[x],availableModules[i].storageFiles[x],packPath)
			}
		}
	}

	/*
	// test sharing link gen
	dbx.sharingCreateSharedLink({path: "/modules"})
	.then(function(response) {
		console.log(response);
	  })
	  .catch(function(error) {
		console.log(error);
	  });
	*/
}

