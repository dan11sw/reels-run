package com.main.netman.repositories

import com.google.gson.Gson
import com.main.netman.models.auth.AuthSignInModel
import com.main.netman.models.auth.AuthSignUpModel
import com.main.netman.network.apis.AuthApi
import com.main.netman.store.UserPreferences
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.RequestBody.Companion.toRequestBody

class AuthRepository(
    private val api: AuthApi,
    private val preferences: UserPreferences
) : BaseRepository(){

    /**
     * Авторизация пользователя
     */
    suspend fun signIn(body: AuthSignInModel) = safeApiCall {
        val requestBody = Gson().toJson(body).toRequestBody("application/json".toMediaTypeOrNull())
        api.signIn(requestBody)
    }

    /**
     * Регистрация нового пользователя
     */
    suspend fun signUp(body: AuthSignUpModel) = safeApiCall {
        val requestBody = Gson().toJson(body).toRequestBody("application/json".toMediaTypeOrNull())
        api.signUp(requestBody)
    }

    /**
     * Сохранение авторизационных данных пользователя
     */
    suspend fun saveAuth(authData: String){
        preferences.saveAuth(authData)
    }
}