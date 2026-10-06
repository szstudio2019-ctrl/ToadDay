// Google Apps Script backing the vote counter on the site.
// Setup: paste into the Apps Script editor, set SPREADSHEET_ID, then
// Deploy -> Manage deployments -> pencil -> Version: New version -> Deploy.
// Access: "Anyone". Execute as: Me.
//
// Sheet layout:
//   COUNT_SHEET!A1  = the running total (set it to 45351 before the first vote)
//   VOTERS_SHEET    = created automatically; column A holds salted SHA-256 hashes of
//                     voter IPs (never raw IPs), column B the vote time.

var SPREADSHEET_ID = 'PASTE_YOUR_SPREADSHEET_ID_HERE'; // between /d/ and /edit in the sheet URL
var COUNT_SHEET = 'Sheet1';                            // tab holding the total in A1
var VOTERS_SHEET = 'Voters';

function sheets_() {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  return {
    count: ss.getSheetByName(COUNT_SHEET),
    voters: ss.getSheetByName(VOTERS_SHEET) || ss.insertSheet(VOTERS_SHEET)
  };
}

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  return json_({ count: Number(sheets_().count.getRange('A1').getValue()) });
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var body = {};
    try { body = JSON.parse(e.postData.contents); } catch (err) {}
    var h = String(body.h || '');
    var s = sheets_();
    var cell = s.count.getRange('A1');
    var count = Number(cell.getValue());
    if (!/^[a-f0-9]{64}$/.test(h)) return json_({ count: count, error: 'bad id' });

    var last = s.voters.getLastRow();
    var seen = last > 0 ? s.voters.getRange(1, 1, last, 1).getValues() : [];
    for (var i = 0; i < seen.length; i++) {
      if (seen[i][0] === h) return json_({ count: count, alreadyVoted: true });
    }
    s.voters.appendRow([h, new Date()]);
    count++;
    cell.setValue(count);
    return json_({ count: count, alreadyVoted: false });
  } finally {
    lock.releaseLock();
  }
}
