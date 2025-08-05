package com.afc.reels_run.repositories

import com.google.gson.Gson
import com.afc.reels_run.models.auth.AuthSignInModel
import com.afc.reels_run.models.auth.AuthSignUpModel
import com.afc.reels_run.network.apis.AuthApi
import com.afc.reels_run.store.UserPreferences
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.RequestBody.Companion.toRequestBody

class ProfileRepository(
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