
// require modules
var express = require('express'),
    i18n = require('i18n'),
    url = require('url'),
    hbs = require('hbs'),
    numeral = require('numeral'),
    mathjs = require('mathjs'),
    getMgr = require('./app/get').getMgr,
    hbsMgr = require('./app/hbshelpers'),
    app  = express();
    math = mathjs();
    store  = new express.session.MemoryStore;

// minimal config
i18n.configure({
  locales: ['en', 'ar'],
  cookie: 'locale',
  directory: "" + __dirname + "/locales",
});

app.configure(function () {
  // setup hbs
  app.set('views', "" + __dirname + "/views");
  app.set('view engine', 'hbs');
  app.use(express.static(__dirname + "/www"));
  app.engine('hbs', hbs.__express);
  

  // you'll need cookies
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'something', store: store }));

  // init i18n module for this loop
  app.use(i18n.init);
  app.enable("jsonp callback");

});

hbsMgr.registerAll(hbs,i18n);
app.get('/getCenters/:region', function (req, res) {
  getMgr.handleGetIndex(req.params,res,function(res){
    var region = req.params.region;
    res.send(res.locals.centers[region]);
  });
});
app.get('/getSubCons/:region/:office', function (req, res) {
  getMgr.handleGetIndex(req.params,res,function(res){
    var region = req.params.region,
        office = req.params.office;
    res.send(res.locals.centers[region].offices[office]);
  });
});

// set a cookie to requested locale
app.get('/:locale', function (req, res) {
  setdeflan(req,res);
  res.redirect("/");
});

app.get('/', function (req, res) {
  setlang(req);
  getMgr.handleGetIndex(req.params,res,function(results){
    res.render('index');
  });
});


app.getDelay = function (req, res) {
  return url.parse(req.url, true).query.delay || 0;
};
function setlang(req){
  if(!req.session.language)
    req.session.language ="ar";
  i18n.setLocale(req.session.language);
}
function setdeflan(req,res){
  i18n.setLocale(req.params.locale);
  req.session.language = req.params.locale;
  res.cookie('locale', req.params.locale);
}

// startup
app.listen(3002);
