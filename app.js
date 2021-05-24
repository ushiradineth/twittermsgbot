const fs = require("fs");
const { google } = require("googleapis");
const sheets = google.sheets("v4");
const { TwitterClient } = require("twitter-api-client");
const credentials = require("./credentials.json");
const data = require("./data.json");

// Configure twitter auth client
const twitterClient = new TwitterClient({
    apiKey: credentials.apiKey,
    apiSecret: credentials.apiSecret,
    accessToken: credentials.accessToken,
    accessTokenSecret: credentials.accessTokenSecret,
});

// Configure google auth client
const authClient = new google.auth.JWT(
    credentials.client_email,
    null,
    credentials.private_key,
    ["https://www.googleapis.com/auth/spreadsheets"]
);
google.options({ auth: authClient }); // !!
const token = authClient.authorize();
authClient.setCredentials(token);

setInterval(async function () {
    // All of the data from the form
    const formData = [];

    try {
        // Get the rows
        var res = await sheets.spreadsheets.values.get({
            auth: authClient,
            spreadsheetId: credentials.spreadsheetId,
            range: "B" + data.rows+1 + ":E",
        });

        // Set rows to equal the rows
        const rows = res.data.values;

        // Check if we have any data and if we do add it to our formData array
        if (typeof rows !== "undefined") {

            // Remove the headers
            rows.shift();

            // For each row
            for (i = data.rows; i < rows.length; i++) {
                    formData.push({ msg: rows[i][0], receiverHandle: rows[i][1], anonChoice: rows[i][2], senderHandle: rows[i][3] });
                    
                    // Delete the used data
                    res = sheets.spreadsheets.values.batchClear({
                        spreadsheetId: credentials.spreadsheetId,
                        requestBody: {
                            ranges: "A" + i + ":E" + i, // !! might fail here
                        },
                    });
                }

        } else {
            console.log("No data found.");
        }

        for (i = data.row; i < formData.length && i >= data.rows; i++) {
            if (formData[i].anonChoice == "No") {
                formData[i].senderHandle = "[anon]";
            }
    
            if (typeof formData[i].receiverHandle !== "undefined" || typeof formData[i].msg !== "undefined") {
                const status = "from: " + formData[i].senderHandle + "\n to: " + formData[i].receiverHandle + "\n\n" + formData[i].msg;
                console.log(i + " >= " + data.rows);
                //   const tweet = await twitterClient.tweets.statusesUpdate({
                //     status: status
                //   });
            }
        }

        // Storing the rows to a json file so the program can be restared at anytime
        if (typeof rows !== "undefined") {
            fs.writeFileSync('data.json', JSON.stringify({rows: rows.length}),
                function (err, file) {
                    if (err) throw err;
                }
            );
        }

    } catch (error) {
        // Log the error
        console.log(error);
    }
    console.log("run");
}, 10000); // 10 * 60 * 1000 Function repeats every ten minutes