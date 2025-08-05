package com.main.netman.network.apis

import com.main.netman.constants.network.creator.CreatorApiConstants
import okhttp3.MultipartBody
import okhttp3.RequestBody
import okhttp3.ResponseBody
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.Multipart
import retrofit2.http.POST
import retrofit2.http.Part
import retrofit2.http.PartMap

/**
* Интерфейс предоставляющий API-запросы для функционального модуля "Создатель"
*/
interface CreatorApi {
    /**
     * Добавление информации о метке
     */
    @POST(CreatorApiConstants.MARK_ADD_INFO)
    suspend fun markAddInfo(@Body requestBody: RequestBody): Response<ResponseBody>

    /**
     * Добавление информации о изображении метки
     */
    @Multipart
    @POST(CreatorApiConstants.MARK_ADD_IMAGE)
    suspend fun markAddImage(@Part("test_marks_id") markId: RequestBody, @Part file: MultipartBody.Part): Response<ResponseBody>

    /**
     * Удаление информации о метке
     */
    @POST(CreatorApiConstants.MARK_DELETE_INFO)
    suspend fun markDeleteInfo(@Body requestBody: RequestBody): Response<ResponseBody>

    /**
     * Удаление информации о изображении метки
     */
    @POST(CreatorApiConstants.MARK_DELETE_IMAGE)
    suspend fun markDeleteImage(@Body requestBody: RequestBody): Response<ResponseBody>
}