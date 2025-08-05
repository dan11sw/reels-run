package com.afc.reels_run.models.user

import com.google.gson.annotations.SerializedName

data class UserIdModel(
    @SerializedName("users_id") var usersId: Int? = null
)
