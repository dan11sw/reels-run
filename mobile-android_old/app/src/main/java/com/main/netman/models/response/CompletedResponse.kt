package com.main.netman.models.response

import com.google.gson.annotations.SerializedName

data class CompletedResponse(
    @SerializedName("completed") var completed: Boolean? = null
)
