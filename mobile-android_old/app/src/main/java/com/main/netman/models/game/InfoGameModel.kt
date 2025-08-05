package com.main.netman.models.game

import com.google.gson.annotations.SerializedName

data class InfoGameModel(
    @SerializedName("id") var id: Int? = null,
    @SerializedName("title") var title: String? = null,
    @SerializedName("location") var location: String? = null,
    @SerializedName("users_id") var usersId: Int? = null,
    @SerializedName("created_at") var createdAt: String? = null,
    @SerializedName("updated_at") var updatedAt: String? = null,
    @SerializedName("quests") var quests: ArrayList<GameQuestModel> = arrayListOf()
)
