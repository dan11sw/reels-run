package com.main.netman.models.creator

import com.google.gson.annotations.SerializedName

data class MarkInfoModel(
    @SerializedName("title") var title: String? = null,
    @SerializedName("description") var description: String? = null,
    @SerializedName("lat") var lat: Double? = null,
    @SerializedName("lng") var lng: Double? = null
)
