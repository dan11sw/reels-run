package com.main.netman.models.game

import com.google.gson.annotations.SerializedName

data class GameIdModel(
    @SerializedName("info_games_id") var infoGamesId: Int? = null
)
