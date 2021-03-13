const {google} = require('googleapis')
const dotenv = require('dotenv')
const fs = require('fs')

dotenv.config()


// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly']
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json'

const credentials = {
    "web": {
        "client_id":process.env.CLIENT_ID,
        "project_id":"pdf-edit-1615113808913",
        "auth_uri":"https://accounts.google.com/o/oauth2/auth",
        "token_uri":"https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs",
        "client_secret":process.env.CLIENT_SECRET,
        "redirect_uris":["https://pdf-edit.vercel.app/api/authcallback"],
        "javascript_origins":["https://pdf-edit.vercel.app"]
    }
}

function main(req, res) {
	if(!req.query || !req.query.code) {
		console.log("Couldn't find code on request query")
		res.writeHeader(200, {"Content-Type": "text/html"})
		res.write('<body>Couldnt find code on request query</body>')
		res.end()
		return
	}
	console.log("Found code to create token")
	const {client_secret, client_id, redirect_uris} = credentials.web;
  	const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    oAuth2Client.getToken(req.query.code, (err, token) => {
    	oAuth2Client.setCredentials(token)
    	req.app.set('token', token)
    	res.redirect("api/index")
	    // Store the token to disk for later program executions
	  //   fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
	  //       if (err) return console.error(err)
	  //       console.log('Token stored to', TOKEN_PATH)
		 //    res.writeHeader(200, {"Content-Type": "text/html"})
			// res.write('<body>Successfully authenticated!</body>')
			// res.end()
	  //   	// res.redirect("/api/index")
	  //   })
    })
}

module.exports = main