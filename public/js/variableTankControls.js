window.onload = function () {
  socket = io();

  let joystickL = nipplejs.create({
    zone: document.getElementById('left'),
    mode: 'static',
    position: { left: '50%', top: '50%' },
    color: 'green',
    size: 200,
    name: 'LEFT'
  });

  let joystickR = nipplejs.create({
    zone: document.getElementById('right'),
    mode: 'static',
    position: { left: '50%', top: '50%' },
    color: 'red',
    size: 200
  });

  joystickL.on('end', function (joystick, data) {
    socket.emit('stop', 'leftMotor');
    document.getElementById('leftMotor').innerHTML = 'stop()';
  });

  joystickR.on('end', function (joystick, data) {
    socket.emit('stop', 'rightMotor');
    document.getElementById('rightMotor').innerHTML = 'stop()';
  });

  joystickL.on('move', _.throttle(function (joystick, data) {
    if (!data.hasOwnProperty('direction')) { return; }
    let direction = data.direction.y === 'up'
      ? 'forward'
      : 'reverse';
    let force = data.force * 255;
  
    force = force > 255 ? 255 : force.toFixed(0);

    socket.emit('leftMotor', {direction, force});
    document.getElementById('leftMotor').innerHTML = `${direction}(${force})`;
  }, 75, {}));

  joystickR.on('move', _.throttle(function (joystick, data) {
    if (!data.hasOwnProperty('direction')) { return; }
    let direction = data.direction.y === 'up'
      ? 'forward'
      : 'reverse';
    let force = data.force * 255;
    
    force = force > 255 ? 255 : force.toFixed(0);
    
    document.getElementById('rightMotor').innerHTML = `${direction}(${force})`;
  }, 75, {}));
};
