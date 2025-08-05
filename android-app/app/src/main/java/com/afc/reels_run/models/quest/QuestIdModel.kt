package com.afc.reels_run.models.quest

import com.google.gson.annotations.SerializedName

data class QuestIdModel(
    @SerializedName("quest_id") var questId: Int? = null,
)
