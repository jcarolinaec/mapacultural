
const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');

const c_nombre = 0;
const c_area = 1;
const c_categoria = 2;
const c_tag = 3;
const c_links = 4;
const c_descripcion = 5;
const c_icono = 6;
const c_imagen = 7;
const c_longitud = 8;
const c_latitud = 9;
const c_id = 10;
const c_type = 11;

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

// Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
    if (err) {
        console.log('credentials.json and token.json would be inside cultural_data_generator');
        return console.log('Error loading client secret file:', err);
    }
    // Authorize a client with credentials, then call the Google Sheets API.
    authorize(JSON.parse(content), listMajors);
});


/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) return getNewToken(oAuth2Client, callback);
        oAuth2Client.setCredentials(JSON.parse(token));
        callback(oAuth2Client);
    });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) return console.error('Error while trying to retrieve access token', err);
            oAuth2Client.setCredentials(token);
            // Store the token to disk for later program executions
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err) console.error(err);
                console.log('Token stored to', TOKEN_PATH);
            });
            callback(oAuth2Client);
        });
    });
}

function toLonLat(val) {
    let res = undefined;
    if(val){
        res = parseFloat(val.replace(/,/g, '.'));
    }
    return res;
}

/**
 * Prints the names and majors of students in a sample spreadsheet:
 * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
function listMajors(auth) {
    const sheets = google.sheets({ version: 'v4', auth });
    sheets.spreadsheets.values.get({
        spreadsheetId: '1zsG84c4nY666sicwFExwJ0hv4O2anj7Ey3SfSGyuB-0',
        range: 'A2:N400',
    }, (err, res) => {
        if (err) {
            console.log('Error generating all.json');
            console.log('credentials.json and token.json would be inside cultural_data_generator');
            return console.log('The API returned an error: ' + err);
        }
        const rows = res.data.values;
        global.console.log(`Length: ${rows.length}`);
        if (rows.length) {
            const data = [];
            rows
                .filter(row => row[c_type]==='punto')
                .map((row, idx) => {
                /*
                if (!data[row[c_area]]) {
                    data[row[c_area]] = {};
                }
                if (!data[row[c_area]][row[c_categoria]]) {
                    data[row[c_area]][row[c_categoria]] = [];
                }
                */
                const obj = {

                    type: "Feature",
                    properties: {
                        nombre: row[c_nombre],
                        area: row[c_area],
                        categoria: row[c_categoria],
                        tags: row[c_tag],
                        links: row[c_links],
                        descripcion: row[c_descripcion],
                        icono: row[c_icono].replace(/:/g, '_'),
                        imagen: row[c_imagen],
                        latitud:  toLonLat(row[c_latitud]),
                        longitud: toLonLat(row[c_longitud]),
                        id: row[c_id],
                        type: row[c_type]
                    },
                    geometry: {
                        type: "Point",
                        coordinates: [
                            toLonLat(row[c_latitud]),
                            toLonLat(row[c_longitud])
                        ]
                    }
                };
                const nFinal = {
                    "type": "FeatureCollection",
                    "name": row[c_nombre],
                    "crs": { "type": "name", "properties": { "name": `urn:ogc:def:crs:OGC:1.3:CRS${idx+1}` } },
                    "features": [obj]
                };
                data.push(nFinal);
            });
            fs.writeFileSync('../public/data/all.json', JSON.stringify(data, null, 2));
        } else {
            console.log('No data found.');
        }
    });
}