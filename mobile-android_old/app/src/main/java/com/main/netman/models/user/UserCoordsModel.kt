package com.main.netman.models.user

import com.google.gson.annotations.SerializedName

data class UserCoordsModel(
    @SerializedName("lat") var lat: Double? = null,
    @SerializedName("lng") var lng: Double? = null
)
