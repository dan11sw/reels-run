package com.main.netman.models.user

import com.google.gson.annotations.SerializedName

data class UserInfoUpdateModel(
    @SerializedName("old_email"     ) var oldEmail     : String? = null,
    @SerializedName("new_email"     ) var newEmail     : String? = null,
    @SerializedName("name"          ) var name         : String? = null,
    @SerializedName("surname"       ) var surname      : String? = null,
    @SerializedName("nickname"      ) var nickname     : String? = null,
    @SerializedName("phone_num"     ) var phoneNum     : String? = null,
    @SerializedName("location"      ) var location     : String? = null,
    @SerializedName("date_birthday" ) var dateBirthday : String? = null
)
