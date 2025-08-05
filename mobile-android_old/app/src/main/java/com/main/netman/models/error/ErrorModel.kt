package com.main.netman.models.error

import com.google.gson.annotations.SerializedName

data class ErrorModel (
    @SerializedName("errors") var errors: List<ErrorElementModel>?,
    @SerializedName("message") var message : String?
)
