package com.main.netman.models.command

import com.google.gson.annotations.SerializedName

data class CommandPlayerModel(
    @SerializedName("id") var id: Int? = null,
    @SerializedName("name") var name: String? = null,
    @SerializedName("surname") var surname: String? = null,
    @SerializedName("nickname") var nickname: String? = null,
    @SerializedName("ref_image") var refImage: String? = null,
    @SerializedName("phone_num") var phoneNum: String? = null,
    @SerializedName("date_birthday") var dateBirthday: String? = null,
    @SerializedName("location") var location: String? = null,
    @SerializedName("date_register") var dateRegister: String? = null,
    @SerializedName("created_at") var createdAt: String? = null,
    @SerializedName("updated_at") var updatedAt: String? = null,
    @SerializedName("users_id") var usersId: Int? = null,
    @SerializedName("rating") var rating: Int? = null,
    @SerializedName("creator") var creator: Boolean? = null
)
