package com.main.netman.models.quest

import com.google.gson.annotations.SerializedName

data class QuestActionModel(
    @SerializedName("games_id") var gamesId: Int? = null,
    @SerializedName("action") var action: String? = null,
)