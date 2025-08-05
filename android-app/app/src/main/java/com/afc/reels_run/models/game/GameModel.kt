package com.afc.reels_run.models.game

import com.google.gson.annotations.SerializedName

data class GameModel(
    @SerializedName("id") var id: Int? = null,
    @SerializedName("title") var title: String? = null,
    @SerializedName("location") var location: String? = null,
    @SerializedName("users_id") var usersId: Int? = null,
    @SerializedName("session_id") var sessionId: String? = null,
    @SerializedName("created_at") var createdAt: String? = null,
    @SerializedName("updated_at") var updatedAt: String? = null,
    @SerializedName("quest") var quest: GameQuestModel? = null,
    @SerializedName("games") var games: ArrayList<InfoGameModel> = arrayListOf(),
    @SerializedName("status") var status: Int? = null,
    @SerializedName("joined_game") var joinedGame: Boolean = false,
)
