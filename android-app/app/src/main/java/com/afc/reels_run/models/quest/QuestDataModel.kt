package com.afc.reels_run.models.quest

import com.google.gson.annotations.SerializedName

data class QuestDataModel(
    @SerializedName("games_id") var gamesId: Int? = null,
    @SerializedName("radius") var radius: Double? = null,
    @SerializedName("lat") var lat: Double? = null,
    @SerializedName("lng") var lng: Double? = null
)
