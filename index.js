var express = require('express');

var app = express();
app.set('view engine','ejs');
app.use( express.static( "public" ) );

app.get('/', function (req, res) {

  const mascots = [
    { name: 'Sammy', organization: "DigitalOcean", birth_year: 2012},
    { name: 'Tux', organization: "Linux", birth_year: 1996},
    { name: 'Moby Dock', organization: "Docker", birth_year: 2013}
  ];
  const tagline = "No programming concept is complete without a cute animal mascot.";

  //res.send('Simple Web Application is UP 2');
  res.render('index', {
    mascots: mascots,
    tagline: tagline
  });

});

app.listen(7070, function () {

console.log('Simple Web Application running on port 7070!');

});