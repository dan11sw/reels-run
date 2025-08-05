package com.afc.reels_run.models.auth

import com.google.gson.annotations.SerializedName

data class RoleModel(
    @SerializedName("id") var id: Int? = null,
    @SerializedName("value") var value: String? = null,
    @SerializedName("priority") var priority: Int? = null
)
