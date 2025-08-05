package com.afc.reels_run.models.auth

import com.google.gson.annotations.SerializedName

data class AuthModel(
    @SerializedName("access_token") var accessToken: String? = null,
    @SerializedName("refresh_token") var refreshToken: String? = null,
    @SerializedName("roles") var roles: ArrayList<RoleModel> = arrayListOf()
)
