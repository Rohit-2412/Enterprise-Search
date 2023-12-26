// accessing gmail api using nodejs
const { google } = require("googleapis");
const CLIENT_ID =
    "549406432516-ljhrlophc5ltrg0e6f70ukcqob71vn2p.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = "https://developers.google.com/oauthplayground/";
const REFRESH_TOKEN =
    "1//04LcH_x_cAYv_CgYIARAAGAQSNwF-L9IrNq4_vafcDm9b4YQVVt1ZmCiQTe8g8mJtcJyvXr2hbDm_w0Xd9TGFPZhW7C3mMKtktSo";

const oauth2client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);

oauth2client.setCredentials({ refresh_token: REFRESH_TOKEN });

// get all mails along with the title and body
async function getMails() {
    try {
        const gmail = google.gmail({ version: "v1", auth: oauth2client });
        const response = await gmail.users.messages.list({
            userId: "me",
            maxResults: 10,
        });

        // console.log(response.data);
        const messages = response.data.messages;
        messages.forEach((message) => {
            console.log(message.id);
            gmail.users.messages.get(
                {
                    userId: "me",
                    id: message.id,
                },
                (err, res) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(res.data.snippet);
                    }
                }
            );
        });
    } catch (err) {
        console.log(err.message);
    }
}

// getMails();

// get unread mails title
async function getUnreadMails() {
    try {
        const gmail = google.gmail({ version: "v1", auth: oauth2client });
        const response = await gmail.users.messages.list({
            userId: "me",
            q: "is:unread",
            maxResults: 10,
        });

        const messages = response.data.messages;
        let idx = 1;
        messages.forEach((message) => {
            gmail.users.messages.get(
                {
                    userId: "me",
                    id: message.id,
                },
                (err, res) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(`${idx} ${res.data.snippet}\n`);
                        idx++;
                    }
                }
            );
        });
    } catch (err) {
        console.log(err.message);
    }
}

getUnreadMails();
