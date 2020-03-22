const express = require("express");
const GoogleSpreadsheet = require("google-spreadsheet");
const creds = require("./creds.json");
const cors = require("cors");
const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());


app.get("/", (req, res) => {
  return res.json({
    message: "backend working!"
  });
});

app.get("/anns", (req, res) => {
  //   let doc = new GoogleSpreadsheet(SHEET_ID);

  var doc = new GoogleSpreadsheet(
    "1EPEuHZFWShFejTWfKmRWXoLDEOaox9jfR1jynEdMB1c"
  );

  // Authenticate with the Google Spreadsheets API.
  doc.useServiceAccountAuth(creds, function(err) {
    // Get all of the rows from the spreadsheet.
    doc.getRows(1, function(err, rows) {
        if (rows.length === 0) return res.json({ error: 'no data' });
        
        let sheet_data = [];
        let keys = Object.keys(rows[0]);
        let useful_keys = keys.slice(6, -2); // discarding the useless keys in response
        for (let row of rows) {
          let row_data = {};
          for (let key of useful_keys) {
            row_data[key] = row[key];
          }
          sheet_data.push(row_data);
        }
        let response_data = JSON.stringify(sheet_data);
        console.log('respnonse .data is ',response_data);
        return res.json(response_data);


    });
  });
});

app.listen(PORT, () => console.log("listening to ", PORT));
