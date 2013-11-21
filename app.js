var express = require('express')
  , http = require('http')
  , path = require('path')
  , exec = require('child_process').exec

var app = express()

app.set('port', process.env.PORT || 3000)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')
app.use(express.urlencoded())

app.use(express.methodOverride())
app.use(express.static(path.join(__dirname, 'public')))

app.use(express.bodyParser())

app.post('/', function (req, res) {
  var options = req.body.options.split('\r\n')
    , args = []

  res.header('content-type', 'text/plain')

  options.forEach(function (option) {
    args.push('-o')
    args.push(option)
  })

  args.push(req.files.file.path)
  args.unshift('lp')

  exec(args.join(' '), function (err, stdout, stderr) {
    res.send('stdout:\n' + stdout + '\n\nstderr:\n' + stderr + '\n')
  })

})

app.get('/', function (req, res) {
  res.render('index')
})

http.createServer(app).listen(app.get('port'), function(){
  console.log('Running on http://localhost:' + app.get('port'))
})
