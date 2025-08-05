package com.afc.reels_run.models.auth

import com.google.gson.annotations.SerializedName

data class AuthSignUpModel(
    @SerializedName("nickname") var nickname : String,
    @SerializedName("email") var email : String,
    @SerializedName("password") var password: String
)
