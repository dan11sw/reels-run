package com.main.netman.models.user

import com.google.gson.annotations.SerializedName

data class UserInfoModel(
    @SerializedName("id") var id: Int? = null,
    @SerializedName("name") var name: String? = null,
    @SerializedName("surname") var surname: String? = null,
    @SerializedName("nickname") var nickname: String? = null,
    @SerializedName("photo") var photo: String? = null,
    @SerializedName("phone_num") var phoneNum: String? = null,
    @SerializedName("date_birthday") var dateBirthday: String? = null,
    @SerializedName("location") var location: String? = null,
    @SerializedName("date_register") var dateRegister: String? = null,
    @SerializedName("users_id") var usersId: Int? = null,
    @SerializedName("data_players") var dataPlayers: DataPlayersModel? = DataPlayersModel(),
    @SerializedName("email") var email: String? = null,
    @SerializedName("created_at") var createdAt: String? = null,
    @SerializedName("updated_at") var updatedAt: String? = null
)