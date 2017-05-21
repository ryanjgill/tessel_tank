var express = require('express')
  , app = express()
  , path = require('path')
  , os = require('os')
  , http = require('http').Server(app)
  , socketIO = require('socket.io')(http)
  , five = require('johnny-five')
  , tessel = require('tessel-io')
  , address = os.networkInterfaces()['wlan0'][0].address
  , PORT = 3000
  , board = new five.Board({
      io: new tessel()
    })
  ;

function emitUserCount(socketIO) {
  socketIO.sockets.emit('user:count', socketIO.engine.clientsCount);
  console.log('Total users: ', socketIO.engine.clientsCount);
}

app.use(express.static(path.join(__dirname + '/public')));

// index route
app.get('/', function (req, res, next) {
  res.sendFile(path.join(__dirname + '/public/index.html'))
});
// variable input controller route
app.get('/controller', function (req, res, next) {
  res.sendFile(path.join(__dirname + '/public/controller.html'))
});

// board ready event
board.on('ready', function (err) {
  if (err) {
    console.log(err);
    board.reset();
    return;
  }

  function checkForZeroUsers(socketIO) {
    if (socketIO.engine.clientsCount === 0) {
      stop();
    }
  }

  console.log('board connected! Johnny-Five ready to go.')

  // setup motors 
  var motor1 = new five.Motor({
    pins: {
      pwm: 'A5',
      dir: 'A6'
    },
    invertPWM: true
  })
  , motor2 = new five.Motor({
    pins: {
      pwm: 'B5',
      dir: 'B6'
    },
    invertPWM: true
  });

  function forward(_speed) {
    var speed = _speed ? _speed : 255;

    console.log('forward: ' + _speed);
    motor1.forward(speed);
    motor2.forward(speed);
  }

  function reverse(_speed) {
    var speed = _speed ? _speed : 255;

    console.log('reverse: ' + _speed);

    motor1.reverse(speed);
    motor2.reverse(speed);
  }

  function spinLeft(_speed) {
    var speed = _speed ? _speed : 255 * .8;

    motor1.forward(speed);
    motor2.reverse(speed);
  }

  function spinRight(_speed) {
    var speed = _speed ? _speed : 255 * .8;

    motor1.reverse(speed);
    motor2.forward(speed);
  }

  function stop() {
    console.log('stop');
    motor1.stop();
    motor2.stop();
  }

  // SocketIO events
  socketIO.on('connection', function (socket) {
    console.log('New connection!');

    emitUserCount(socketIO);

    socket.on('forward', forward);

    socket.on('reverse', reverse);

    socket.on('spinLeft', spinLeft);

    socket.on('spinRight', spinRight);

    // nipplejs variable input events
    socket.on('leftMotor', function (input) {
      if (input.direction === 'forward') {
        console.log('motor1:forward(' + input.force + ')');
        motor1.forward(input.force);
      } else {
        console.log('motor1:reverse(' + input.force + ')');
        motor1.reverse(input.force);
      }
    });

    socket.on('rightMotor', function (input) {
      if (input.direction === 'forward') {
        console.log('motor2:forward(' + input.force + ')');
        motor2.forward(input.force);
      } else {
        console.log('motor2:reverse(' + input.force + ')');
        motor2.reverse(input.force);
      }
    });

    socket.on('stop', function (motor) {
      if (!motor) {
        stop();
      } else if (motor === 'leftMotor') {
        console.log('motor1:stop');
        motor1.stop();
      } else {
        console.log('motor2:stop');
        motor2.stop();
      }
    });

    socket.on('disconnect', function() {
      checkForZeroUsers(socketIO);
      emitUserCount(socketIO);
    });
  });

  // set the app to listen on PORT
  http.listen(PORT);

  // log the address and port
  console.log('Up and running on ' + address + ':' + PORT);
});



