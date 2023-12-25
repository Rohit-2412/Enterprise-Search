// accessing google drive api using nodejs
const { google } = require("googleapis");
const path = require("path");
const fs = require("fs");
const CLIENT_ID =
    "549406432516-ljhrlophc5ltrg0e6f70ukcqob71vn2p.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = "https://developers.google.com/oauthplayground/";
const REFRESH_TOKEN =
    "1//04U7JILgNacCZCgYIARAAGAQSNwF-L9Ir0mArOflhuLxoeDUQ3iHRA6tPbGo_JpQ3lHF149Y8nug9xTZnjCZaNIp7mrpDUwDMJMI";

const oauth2client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);

oauth2client.setCredentials({ refresh_token: REFRESH_TOKEN });

const drive = google.drive({
    version: "v3",
    auth: oauth2client,
});

const filePath = path.join(__dirname, "10.jpg");

async function uploadFile() {
    try {
        const response = await drive.files.create({
            requestBody: {
                name: "Sample image.jpg",
                mimeType: "image/jpg",
            },
            media: {
                mimeType: "image/jpg",
                body: fs.createReadStream(filePath),
            },
        });

        console.log("🚀 File uploaded");
        console.log(response.data);
    } catch (err) {
        console.log(err.message);
    }
}

// uploadFile();

// list all files in google drive root folder
async function listFiles() {
    try {
        const response = await drive.files.list({
            pageSize: 100,
            fields: "nextPageToken, files(id, name)",
        });

        console.log(response.data.files);
    } catch (err) {
        console.log(err.message);
    }
}

// listFiles();

// get the history of a file
async function getFileHistory() {
    try {
        const response = await drive.revisions.list({
            fileId: "172TO6fi0_zeyaUfEXQTssZykseCmQkMY",
        });

        console.log(response.data.revisions);
    } catch (err) {
        console.log(err.message);
    }
}

// getFileHistory();

// get file details from public link
// https://drive.google.com/file/d/12Twr3OAYaopqdcFQZoyN2QLoiPUHyA1o/view?usp=sharing

async function getFileDetails() {
    try {
        const fileId = "12Twr3OAYaopqdcFQZoyN2QLoiPUHyA1o";
        const response = await drive.files.get({
            fileId,
            fields: "*",
        });

        console.log(response.data);
    } catch (err) {
        console.log(err.message);
    }
}

// getFileDetails();

// display file's content
// https://docs.google.com/document/d/1pZUQv0C43jUBBEiqt-TwkDQa9h5XQ5own_ytIVeTaJk/edit

async function getFileContent() {
    try {
        const fileId = "1pZUQv0C43jUBBEiqt-TwkDQa9h5XQ5own_ytIVeTaJk";
        const response = await drive.files.export({
            fileId,
            mimeType: "text/plain",
        });

        console.log(response.data);
    } catch (err) {
        console.log(err.message);
    }
}

// getFileContent();

// can we listen to changes in a file?

async function watchFile() {
    try {
        const fileId = "1pZUQv0C43jUBBEiqt-TwkDQa9h5XQ5own_ytIVeTaJk";
        const response = await drive.files.watch({
            fileId,
            requestBody: {
                id: "channel2",
                type: "web_hook",
                address: "https://new-dayzero.vercel.app/home",
            },
        });

        console.log(response.data);
    } catch (err) {
        console.log(err.message);
    }
}

// watchFile();
