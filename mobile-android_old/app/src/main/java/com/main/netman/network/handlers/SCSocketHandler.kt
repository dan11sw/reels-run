package com.main.netman.network.handlers

import android.util.Log
import com.main.netman.constants.network.main.MainNetworkConstants
import com.main.netman.constants.socket.SocketHandlerConstants
import io.socket.client.IO
import io.socket.client.Socket

/**
 * Описание глобального Singleton для работы с сокетом,
 * который взаимодействует с основным сервером
 */
class SCSocketHandler private constructor() {
    @Volatile
    private var mSocket: Socket? = null

    // Идентификатор авторизации пользователя в рамках системы
    @Volatile
    private var auth: Boolean = false

    @Synchronized
    fun setSocket(cb: (() -> Unit)? = null) {
        disconnection()

        try {
            mSocket = IO.socket(MainNetworkConstants.MAIN_API)

            // Обработка ситуации подключения к серверу
            mSocket?.on(SocketHandlerConstants.CONNECT) {
                if(cb != null) {
                    cb()
                }
            }

            // Обработка ситуации отключения от сервера
            mSocket?.on(SocketHandlerConstants.DISCONNECT) {
                disconnection()
            }
        } catch (e: Exception) {
            Log.e("SOCKET", e.message.toString())
        }
    }

    @Synchronized
    fun getSocket(): Socket? {
        return mSocket
    }

    @Synchronized
    fun connection() {
        mSocket?.connect()
    }

    @Synchronized
    fun disconnection() {
        mSocket?.disconnect()
        mSocket?.close()
        mSocket = null
        auth = false
    }

    @Synchronized
    fun setAuth(auth: Boolean) {
        this.auth = auth
    }

    @Synchronized
    fun getAuth(): Boolean {
        return auth
    }

    companion object {
        @Volatile
        private var instance: SCSocketHandler? = null

        fun getInstance(): SCSocketHandler {
            if (instance == null) {
                synchronized(this) {
                    if (instance == null) {
                        instance = SCSocketHandler()
                    }
                }
            }

            return instance!!
        }
    }
}