package com.main.netman.models.auth

import com.google.gson.annotations.SerializedName

data class AuthRefreshModel(
    @SerializedName("refresh_token") var refreshToken: String
)
