package com.afc.reels_run.constants.network.player

object PlayerApiConstants {
    private const val BASE = "/api/player"
    const val PLAYER_INFO = "${BASE}/info"
    const val PLAYER_INFO_UPDATE = "${BASE}/info/update"
    const val PLAYER_INFO_IMG = "${BASE}/info/img"
    const val PLAYER_INFO_IMG_UPDATE = "${BASE}/info/img/update"
    const val PLAYER_COMMAND = "${BASE}/command"
    const val PLAYER_COMMAND_PLAYERS = "${BASE}/command/players"
    const val PLAYER_COMMAND_CREATE = "${BASE}/command/create"
    const val PLAYER_COMMAND_JOIN = "${BASE}/command/join"
    const val PLAYER_COMMAND_DETACH = "${BASE}/command/detach"
    const val PLAYER_COMMANDS_LIST = "${BASE}/commands/list"
    const val PLAYER_COMMAND_AVAILABLE_GAMES = "${BASE}/command/available/games"
    const val PLAYER_COMMAND_REGISTER_GAME = "${BASE}/command/register/game"
    const val PLAYER_COMMAND_CURRENT_GAME = "${BASE}/command/current/game"
    const val PLAYER_COMMAND_GAMES = "${BASE}/command/games"

    const val PLAYER_GAME_INFO = "${BASE}/game/info"
    const val PLAYER_DETACH_GAME = "${BASE}/detach/game"
    const val PLAYER_JOIN_GAME = "${BASE}/join/game"
    const val PLAYER_COMPLETED_GAME = "${BASE}/completed/game"
}