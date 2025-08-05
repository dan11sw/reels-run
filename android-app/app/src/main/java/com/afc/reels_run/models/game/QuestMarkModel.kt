package com.afc.reels_run.models.game

import com.google.gson.annotations.SerializedName

data class QuestMarkModel(
    @SerializedName("id") var id: Int? = null,
    @SerializedName("users_id") var usersId: Int? = null,
    @SerializedName("lat") var lat: Double? = null,
    @SerializedName("lng") var lng: Double? = null,
    @SerializedName("location") var location: String? = null,
    @SerializedName("created_at") var createdAt: String? = null,
    @SerializedName("updated_at") var updatedAt: String? = null
)
