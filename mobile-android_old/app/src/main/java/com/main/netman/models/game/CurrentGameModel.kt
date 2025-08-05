package com.main.netman.models.game

import com.google.gson.annotations.SerializedName

data class CurrentGameModel(
    @SerializedName("task") var task: String? = null,
    @SerializedName("action") var action: String? = null,
    @SerializedName("hint") var hint: String? = null,
    @SerializedName("number") var number: Int? = null,
    @SerializedName("id") var id: Int? = null,
    @SerializedName("view") var view: Boolean? = null,
    @SerializedName("created_at") var createdAt: String? = null,
    @SerializedName("updated_at") var updatedAt: String? = null,
    @SerializedName("commands_id") var commandsId: Int? = null,
    @SerializedName("register_commands_id") var registerCommandsId: Int? = null,
    @SerializedName("quests_id") var questsId: Int? = null,
    @SerializedName("current_games_id") var currentGamesId: Int? = null
)
