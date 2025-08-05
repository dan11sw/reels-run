package com.main.netman.event

import io.socket.client.Socket

data class UpdateSocketEvent(
    var socket: Socket? = null
)
