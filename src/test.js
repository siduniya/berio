var MAGNET = "magnet:?xt=urn:btih:6a9759bffd5c0af65319979fb7832189f4f3c35d&dn=sintel.mp4&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&tr=wss%3A%2F%2Ftracker.webtorrent.io&ws=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2Fsintel-1024-surround.mp4"
var OK = {
  'log': false,
  'client': false
}

function logTestModule(module){
  console.log('\n==========\n' + module + '\n==========\n')
}
function logTestProto(proto){
  console.log('==> ' + proto)
}
function finishTest(){
  var end = true
  for (var m in OK){
    end = end && OK[m]
  }
  if(end){
    process.exit(0)
  }
}

/*
* TEST LOG
*/
function testLog(cb){
  logTestModule('Log')
  var Log = require('./log.js')

  logTestProto('print')
  Log.print('Print ok')

  logTestProto('echo')
  Log.echo('Echo ok')

  setTimeout(function(){
    delete Log
    cb(true)
  }, 1000)
}

testLog(function(value){
  OK.log = value
  finishTest()
})

/*
* TEST CLIENT
*/
function testClient(cb){
  logTestModule('Client')
  var Client = require('./client.js')
  var c = new Client()

  logTestProto('on start')
  c.on('start', function(hash){
    console.log('Client start trigger')
    console.log('Hash: ' + hash)

    logTestProto('getTorrent')
    var torrent = c.getTorrent()
    console.log('Torrent: ')
    console.log(torrent)
  })

  logTestProto('on download')
  c.on('download', function(torrent){
    console.log('Client download trigger')
    console.log('Torrent: ')
    console.log(torrent)

    logTestProto('stop')
    c.stop()
  })

  logTestProto('on done')
  c.on('done', function(hash, name){
    console.log('Client done trigger')
    console.log('Hash: ' + hash + '\nName: ' + name)

    cb(true)
    delete Client
    delete c
  })

  c.download(MAGNET)
}

testClient(function(value){
  OK.client = value
  finishTest()
})