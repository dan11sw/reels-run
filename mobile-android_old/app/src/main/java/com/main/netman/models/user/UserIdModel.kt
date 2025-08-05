package com.main.netman.models.user

import com.google.gson.annotations.SerializedName

data class UserIdModel(
    @SerializedName("users_id") var usersId: Int? = null
)
