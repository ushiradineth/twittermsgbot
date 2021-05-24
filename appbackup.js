// Import dependencies
const fs = require("fs");
const { google } = require("googleapis");

const servic// Import dependencies
const fs = require("fs");
const { google } = require("googleapis");

const service = google.sheets("v4");
const credentials = require("./credentials.json");

// Configure auth client
const authClient = new google.auth.JWT(
    credentials.client_email,
    null,
    credentials.private_key, ["https://www.googleapis.com/auth/spreadsheets"]
);

(async function() {
    try {

        // Authorize the client
        const token = await authClient.authorize();

        // Set the client credentials
        authClient.setCredentials(token);

        // Get the rows
        const res = await service.spreadsheets.values.get({
            auth: authClient,
            spreadsheetId: "1CyH_hg8wG239mt_8VY3qMQ6ud51sLyqqyaB1y58h-c4",
            range: "B:E",
        });

        // All of the answers
        const answers = [];

        // Set rows to equal the rows
        const rows = res.data.values;

        // Check if we have any data and if we do add it to our answers array
        if (rows.length) {

            // Remove the headers
            rows.shift()

            // For each row
            for (const row of rows) {
                answers.push({ msg: row[0], receiverHandle: row[1], senderHandle: row[3] });
            }

        } else {
            console.log("No data found.");
        }

        // Saved the answers
        fs.writeFileSync("answers.json", JSON.stringify(answers), function(err, file) {
            if (err) throw err;
            console.log("Saved!");
        });

    } catch (error) {

        // Log the error
        console.log(error);

        // Exit the process with error
        process.exit(1);

    }

})();e = google.sheets("v4");
const credentials = require("./credentials.json");

// Configure auth client
const authClient = new google.auth.JWT(
    credentials.client_email,
    null,
    credentials.private_key, ["https://www.googleapis.com/auth/spreadsheets"]
);

(async function() {
    try {

        // Authorize the client
        const token = await authClient.authorize();

        // Set the client credentials
        authClient.setCredentials(token);

        // Get the rows
        const res = await service.spreadsheets.values.get({
            auth: authClient,
            spreadsheetId: "1CyH_hg8wG239mt_8VY3qMQ6ud51sLyqqyaB1y58h-c4",
            range: "B:E",
        });

        // All of the answers
        const answers = [];

        // Set rows to equal the rows
        const rows = res.data.values;

        // Check if we have any data and if we do add it to our answers array
        if (rows.length) {

            // Remove the headers
            rows.shift()

            // For each row
            for (const row of rows) {
                answers.push({ msg: row[0], receiverHandle: row[1], senderHandle: row[3] });
            }

        } else {
            console.log("No data found.");
        }

        // Saved the answers
        fs.writeFileSync("answers.json", JSON.stringify(answers), function(err, file) {
            if (err) throw err;
            console.log("Saved!");
        });

    } catch (error) {

        // Log the error
        console.log(error);

        // Exit the process with error
        process.exit(1);

    }

})();