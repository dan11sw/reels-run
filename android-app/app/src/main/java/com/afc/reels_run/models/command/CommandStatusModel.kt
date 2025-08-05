package com.afc.reels_run.models.command

import com.google.gson.annotations.SerializedName

data class CommandStatusModel(
    @SerializedName("status") var status: Int,
    @SerializedName("commands_id") var commandsId: Int
)
