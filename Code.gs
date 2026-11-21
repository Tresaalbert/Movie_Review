
const SHEET_NAME = "Reviews";

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    const required = [
      "username", "district", "gender",
      "movie", "rating", "comment"
    ];

    for (const field of required) {
      if (!data[field] || !String(data[field]).trim()) {
        throw new Error("Missing required field: " + field);
      }
    }

    const rating = Number(data.rating);

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      throw new Error("Invalid rating");
    }

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);

    try {
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      let sheet = ss.getSheetByName(SHEET_NAME);

      if (!sheet) {
        sheet = ss.insertSheet(SHEET_NAME);
        sheet.appendRow([
          "Review ID",
          "Date",
          "User Name",
          "District",
          "Gender",
          "Movie Name",
          "Rating",
          "Review"
        ]);
      }

      function safe(value) {
        const text = String(value).trim();
        return /^[=+\-@]/.test(text) ? "'" + text : text;
      }

      sheet.appendRow([
        Utilities.getUuid(),
        new Date(),
        safe(data.username),
        safe(data.district),
        safe(data.gender),
        safe(data.movie),
        rating,
        safe(data.comment)
      ]);

    } finally {
      lock.releaseLock();
    }

    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: "Review saved"
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        message: error.message
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
