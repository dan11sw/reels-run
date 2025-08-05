package com.main.netman.models

import com.google.gson.annotations.SerializedName

data class UrlModel(
    @SerializedName("url") var url: String
)