package com.afc.reels_run.models.command

import com.google.gson.annotations.SerializedName

data class TeamCreateModel(
    @SerializedName("name") var name: String? = null
)
