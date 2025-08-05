package com.main.netman.models.user

import com.google.gson.annotations.SerializedName

data class DataPlayersModel(
    @SerializedName("id"          ) var id         : Int?    = null,
    @SerializedName("rating"      ) var rating     : Int?    = null,
    @SerializedName("commands_id" ) var commandsId : Int?    = null,
    @SerializedName("users_id"    ) var usersId    : Int?    = null,
    @SerializedName("created_at"  ) var createdAt  : String? = null,
    @SerializedName("updated_at"  ) var updatedAt  : String? = null
)