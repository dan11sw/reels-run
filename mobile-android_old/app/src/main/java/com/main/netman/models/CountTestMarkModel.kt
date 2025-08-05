package com.main.netman.models

import com.google.gson.annotations.SerializedName

data class CountTestMarkModel(
    @SerializedName("count") var count: Int = 0,
)
