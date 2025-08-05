package com.main.netman.models.command

import com.google.gson.annotations.SerializedName

data class TeamCreateModel(
    @SerializedName("name") var name: String? = null
)
