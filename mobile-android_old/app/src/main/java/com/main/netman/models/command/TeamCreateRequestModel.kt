package com.main.netman.models.command

import com.google.gson.annotations.SerializedName

data class TeamCreateRequestModel(
    @SerializedName("command_id") var commandId: Int? = null,
    @SerializedName("name") var name: String? = null
)
