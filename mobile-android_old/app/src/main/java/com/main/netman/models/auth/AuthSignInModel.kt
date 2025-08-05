package com.main.netman.models.auth

import com.google.gson.annotations.SerializedName

data class AuthSignInModel(
    @SerializedName("email") var email : String,
    @SerializedName("password") var password : String
)
