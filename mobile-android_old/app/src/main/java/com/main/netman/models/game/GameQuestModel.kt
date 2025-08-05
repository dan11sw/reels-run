package com.main.netman.models.game

import com.google.gson.annotations.SerializedName

data class GameQuestModel(
    @SerializedName("id") var id: Int? = null,
    @SerializedName("task") var task: String? = null,
    @SerializedName("hint") var hint: String? = null,
    @SerializedName("action") var action: String? = null,
    @SerializedName("radius") var radius: Int? = null,
    @SerializedName("marks_id") var marksId: Int? = null,
    @SerializedName("created_at") var createdAt: String? = null,
    @SerializedName("updated_at") var updatedAt: String? = null,
    @SerializedName("status") var status: Int? = null,
    @SerializedName("view") var view: Int? = null,
    @SerializedName("mark") var mark: QuestMarkModel? = null,
    @SerializedName("users_games_id") var usersGamesId: Int? = null
)
