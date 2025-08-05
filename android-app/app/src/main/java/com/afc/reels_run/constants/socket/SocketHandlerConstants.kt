package com.afc.reels_run.constants.socket

object SocketHandlerConstants {
    // Standard events:
    const val CONNECT = "connect"
    const val DISCONNECT = "disconnect"

    // Custom events:
    const val AUTH = "authentication"
    const val AUTH_FAILED = "authentication_failed"
    const val AUTH_SUCCESS = "authentication_success"

    const val STATUS = "status"
    const val STATUS_ON = "status_on"
    const val STATUS_OFF = "status_off"
    const val STATUS_COMPLETED = "status_completed"

    const val COMMAND_STATUS = "command_status"
    const val COMMAND_STATUS_ON = "command_status_on"

    const val SET_CURRENT_COORDINATES = "set_current_coordinates"
    const val GET_PLAYER_COORDINATES = "get_player_coordinates"
    const val SET_PLAYER_COORDINATES = "set_player_coordinates"
    const val CLEAR_GAMES_MARKS = "clear_games_marks"
    const val SET_VIEW_CURRENT_QUEST =  "set_view_current_quest"
    const val SET_VIEW_CURRENT_ACTION = "set_view_current_action"
    const val ADD_PLAYER_COORDINATES = "add_player_coordinates"
    const val COORDINATES_PLAYERS = "coordinates_players"

    const val TEAM_PLAYER_DISCONNECT = "team_player_disconnect"
    const val SET_VIDEO_TEAM_LEAD = "set_video_team_lead"

    const val FINISHED_QUEST = "finished_quest"
    const val FINISHED_QUEST_SUCCESS = "finished_quest_success"

    const val REPEAT_STATUS_REQUEST = "repeat_status_request"
    const val GAME_OVER = "game_over"
    const val GAME_OVER_DISCONNECT = "game_over_disconnect"
    const val GAME_OVER_DISCONNECT_SUCCESS = "game_over_disconnect_success"

    const val VIEW_CURRENT_QUEST = "view_current_quest"
}