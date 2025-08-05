package com.afc.reels_run.models.game

import com.google.gson.annotations.SerializedName

data class GameAvailableModel(
    @SerializedName("id") var id: Int? = null,
    @SerializedName("name") var name: String? = null,
    @SerializedName("max_count_commands") var maxCountCommands: Int? = null,
    @SerializedName("date_begin") var dateBegin: String? = null,
    @SerializedName("date_end") var dateEnd: String? = null,
    @SerializedName("age_limit") var ageLimit: Int? = null,
    @SerializedName("type") var type: Boolean? = null,
    @SerializedName("rating") var rating: Int? = null,
    @SerializedName("min_score") var minScore: Int? = null,
    @SerializedName("location") var location: String? = null,
    @SerializedName("created_at") var createdAt: String? = null,
    @SerializedName("updated_at") var updatedAt: String? = null,
    @SerializedName("users_id") var usersId: Int? = null,
    @SerializedName("count_quests") var countQuests: Int? = null
)
