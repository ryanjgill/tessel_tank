$(function () {
    var socket = io()

    if (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0)) {
        // use touchstart and touchend events
        $('#forward').on('touchstart', function () {
            socket.emit('forward');
        })

        $('#forward').on('touchend', function () {
            socket.emit('stop')
        })

        $('#reverse').on('touchstart', function () {
            socket.emit('reverse')
        })

        $('#reverse').on('touchend', function () {
            socket.emit('stop')
        })

        $('#left').on('touchstart', function () {
            socket.emit('spinLeft')
        })

        $('#left').on('touchend', function () {
            socket.emit('stop')
        })

        $('#right').on('touchstart', function () {
            socket.emit('spinRight')
        })

        $('#right').on('touchend', function () {
            socket.emit('stop')
        })
    } else {
        // use mousedown and mouseup events
        $('#forward').mousedown(function () {
            socket.emit('forward')
        })

        $('#forward').mouseup(function () {
            socket.emit('stop')
        })

        $('#reverse').mousedown(function () {
            socket.emit('reverse')
        })

        $('#reverse').mouseup(function () {
            socket.emit('stop')
        })

        $('#left').mousedown(function () {
            socket.emit('spinLeft')
        })

        $('#left').mouseup(function () {
            socket.emit('stop')
        })

        $('#right').mousedown(function () {
            socket.emit('spinRight')
        })

        $('#right').mouseup(function () {
            socket.emit('stop')
        })
    }
})