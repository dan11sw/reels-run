package com.afc.reels_run.repositories

import com.google.gson.Gson
import com.afc.reels_run.models.creator.MarkIdModel
import com.afc.reels_run.models.creator.MarkInfoModel
import com.afc.reels_run.network.apis.CreatorApi
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.MultipartBody
import okhttp3.RequestBody
import okhttp3.RequestBody.Companion.toRequestBody
import java.io.File


class CreatorRepository(
    private val api: CreatorApi
) : BaseRepository() {

    /**
     * Добавление новой метки
     */
    suspend fun markAddInfo(body: MarkInfoModel) = safeApiCall {
        val requestBody = Gson().toJson(body).toRequestBody("application/json".toMediaTypeOrNull())
        api.markAddInfo(requestBody)
    }


    /**
     * Удаление метки
     */
    suspend fun markDeleteInfo(body: MarkIdModel) = safeApiCall {
        val requestBody = Gson().toJson(body).toRequestBody("application/json".toMediaTypeOrNull())
        api.markDeleteInfo(requestBody)
    }

    /**
     * Удаление изображения метки
     */
    suspend fun markDeleteImg(body: MarkIdModel) = safeApiCall {
        val requestBody = Gson().toJson(body).toRequestBody("application/json".toMediaTypeOrNull())
        api.markDeleteImage(requestBody)
    }

    /**
     * Добавление изображения для метки
     */
    suspend fun markAddImg(markId: Int, filepath: String) = safeApiCall {
        // Получение информации о файле
        val file = File(filepath)

        // Создание части запроса для файла
        val requestFile = RequestBody.create("multipart/form-data".toMediaTypeOrNull(), file)

        // Добавление данных о файле
        val body: MultipartBody.Part = MultipartBody.Part.createFormData("file", file.name, requestFile)

        // Создание части запроса для идентификатора метки
        val id = RequestBody.create("multipart/form-data".toMediaTypeOrNull(), markId.toString())

        api.markAddImage(id, body)
    }
}