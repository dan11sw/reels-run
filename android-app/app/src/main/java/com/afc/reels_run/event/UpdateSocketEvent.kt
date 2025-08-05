package com.afc.reels_run.event

import io.socket.client.Socket

data class UpdateSocketEvent(
    var socket: Socket? = null
)
