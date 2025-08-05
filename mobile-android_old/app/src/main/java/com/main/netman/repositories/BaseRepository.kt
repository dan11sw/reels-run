package com.main.netman.repositories

import com.google.gson.Gson
import com.main.netman.models.auth.AuthLogoutModel
import com.main.netman.network.Resource
import com.main.netman.network.apis.AuthApi
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.RequestBody.Companion.toRequestBody
import retrofit2.HttpException

/**
 * Абстрактный класс репозитория.
 * Используется в BaseFragment, BaseViewModel и ViewModelFactory.
 * С его помощью создаются репозитории, активно использующиеся в проекте.
 */
abstract class BaseRepository {
    /**
     * Метод для защищённой обработки API-запроса
     */
    suspend fun <T> safeApiCall(
        apiCall: suspend () -> T
    ) : Resource<T>{
        // Используется контекст IO
        return withContext(Dispatchers.IO){
            // Возвращаемое значение будет представлять собой
            // либо Resource.Success, либо Resource.Failure
            try{
                Resource.Success(apiCall.invoke())
            }catch (throwable: Throwable){
                // Обработка ошибок
                when(throwable){
                    is HttpException -> {
                        Resource.Failure(false, throwable.code(),
                            throwable.response()?.errorBody()
                        )
                    }
                    else -> {
                        Resource.Failure(true, null, null)
                    }
                }
            }
        }
    }

    /**
     * Выход пользователя из системы
     */
    suspend fun logout(accessToken: String,
                       refreshToken: String,
                       typeAuth: Int,
                       api: AuthApi
    ) = safeApiCall {
        // Формирование запроса
        val requestBody = Gson().toJson(
            AuthLogoutModel(
                accessToken = accessToken,
                refreshToken = refreshToken,
                typeAuth = typeAuth
            )
        ).toRequestBody("application/json".toMediaTypeOrNull())

        // Выход из системы
        api.logout(requestBody)
    }
}