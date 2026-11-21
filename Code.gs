
function setupFRAME() {
  const ss = SpreadsheetApp.create('FRAME Movie Review Database');

  const movies = ss.getSheets()[0];
  movies.setName('Movies');

  movies.getRange(1, 1, 1, 6).setValues([[
    'MovieID', 'Title', 'Genre', 'Year', 'Poster', 'Description'
  ]]);

  movies.getRange(1, 1, 1, 6)
    .setFontWeight('bold')
    .setBackground('#f5c518');

  const reviews = ss.insertSheet('Reviews');

  reviews.getRange(1, 1, 1, 9).setValues([[
    'ReviewID', 'MovieID', 'Name', 'Gender', 'Age',
    'District', 'Rating', 'Comment', 'Timestamp'
  ]]);

  reviews.getRange(1, 1, 1, 9)
    .setFontWeight('bold')
    .setBackground('#f5c518');

  // Store the Spreadsheet ID automatically
  PropertiesService.getScriptProperties()
    .setProperty('SPREADSHEET_ID', ss.getId());

  Logger.log('Your spreadsheet: ' + ss.getUrl());
  Logger.log('Spreadsheet ID: ' + ss.getId());

  return ss.getUrl();
}
