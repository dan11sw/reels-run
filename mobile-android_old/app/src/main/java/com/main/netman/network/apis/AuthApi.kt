package com.main.netman.network.apis

import com.main.netman.constants.network.auth.AuthApiConstants
import okhttp3.RequestBody
import okhttp3.ResponseBody
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.POST

/**
 * Интерфейс предоставляющий API-запросы для авторизации
 */
interface AuthApi {

    /**
     * Авторизация пользователя
     */
    @POST(AuthApiConstants.SIGN_IN)
    suspend fun signIn(@Body requestBody: RequestBody): Response<ResponseBody>

    /**
     * Регистрация нового пользователя
     */
    @POST(AuthApiConstants.SIGN_UP)
    suspend fun signUp(@Body requestBody: RequestBody): Response<ResponseBody>

    /**
     * Выход из системы пользователя
     */
    @POST(AuthApiConstants.LOGOUT)
    suspend fun logout(@Body requestBody: RequestBody): Response<ResponseBody>

    /**
     * Верификация пользователя
     */
    @POST(AuthApiConstants.VERIFICATION)
    suspend fun verification(): Response<ResponseBody>
}