const express = require('express');
const path = require('path');
const routeRoutes = require('./routes/routeRoutes');
const cors = require('cors');

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(cors());

app.use(express.static('public'));
app.use(express.json({ limit: '50mb' }));

app.listen(7070, function () {
  console.log('Translation Application running on port 7070!');
});

// To recognize the incoming request object as strings or arrays
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
// Application routes
app.use(routeRoutes);
