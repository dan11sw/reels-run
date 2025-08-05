package com.afc.reels_run.constants.data.value

object PlayerStatus {
    const val PLAYER_DEFAULT:        Int = 0       // Обычный пользователь (без текущей игры)
    const val PLAYER_ACTIVE:         Int = 1       // Игрок, чья команда участвует в игре
    const val PLAYER_ACTIVE_VIDEO:   Int = 2       // Игрок, который будет записывать видео
    const val JUDGE:                 Int = 3       // Судъя
}