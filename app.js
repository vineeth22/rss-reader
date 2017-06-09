const express = require('express');
const app = express();
var Feed = require('rss-to-json');
var bodyParser = require('body-parser')
var pgp = require('pg-promise')();
var cn = {
  host: 'localhost',
  port: 5432,
  database: 'rss',
  user: 'vineeth',
  password: ''
};
var db = pgp(cn);

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json({ type: "application/json" }));
app.use(express.static('public'));

app.get('/getFeeds', function (req, res) {
  Feed.load(req.query.url, function (err, rss) {
    if (err) {
      console.log(err);
      res.send("error");
    }
    res.send(rss);
  });
})

app.post('/saveFeeds', function (req, res) {
  var feeds = req.body;
  db.tx(t => {
    var queries = feeds.map(u => {
      return t.none('INSERT INTO feeds(data) VALUES($1)', feeds);
    });
    return t.batch(queries);
  })
    .then(data => {
      console.log("save success");
      res.send("success");
    })
    .catch(error => {
      console.log(error);
      res.send("error");
    });
})

app.listen(3000, function () {
  console.log('Listening on port 3000')
})
