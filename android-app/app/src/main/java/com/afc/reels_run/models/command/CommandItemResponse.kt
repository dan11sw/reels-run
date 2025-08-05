package com.afc.reels_run.models.command

import com.google.gson.annotations.SerializedName

data class CommandItemResponse(
    @SerializedName("id") var id: Int? = null,
    @SerializedName("name") var name: String? = null,
    @SerializedName("date_register") var dateRegister: String? = null,
    @SerializedName("rating") var rating: Int? = null,
    @SerializedName("created_at") var createdAt: String? = null,
    @SerializedName("updated_at") var updatedAt: String? = null,
    @SerializedName("users_id") var usersId: Int? = null,
    @SerializedName("count_players") var countPlayers: Int? = null,
    @SerializedName("location") var location: String? = null
)
