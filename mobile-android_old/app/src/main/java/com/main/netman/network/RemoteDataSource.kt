package com.main.netman.network

import android.util.Log
import com.google.gson.Gson
import com.google.gson.JsonParser
import com.google.gson.reflect.TypeToken
import com.main.netman.config.BuildConfigApp
import com.main.netman.constants.network.auth.AuthApiConstants
import com.main.netman.constants.network.main.MainNetworkConstants
import com.main.netman.models.auth.AuthModel
import com.main.netman.models.auth.AuthRefreshModel
import com.main.netman.store.CookiePreferences
import com.main.netman.store.UserPreferences
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.runBlocking
import okhttp3.Interceptor
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import okhttp3.Response
import okhttp3.logging.HttpLoggingInterceptor
import org.koin.android.BuildConfig
import retrofit2.Retrofit
import java.io.IOException


/**
 * DataSource для работы с HTTP-запросами
 */
class RemoteDataSource {

    /**
     * Метод для сборки экземлпяра API
     */
    fun <Api> buildApi(
        api: Class<Api>,                        // Класс API
        userPreferences: UserPreferences?,      // Локальное хранилище данных пользователя
        cookiePreferences: CookiePreferences?,  // Локальное хранилище для Cookie
        authInterceptor: Boolean = true         // Добавление интерцептора в запрос
    ): Api {
        // Создание экземпляра Retrofit
        return Retrofit.Builder()
            .baseUrl(MainNetworkConstants.MAIN_API)
            .client(
                // Создание нового клиента
                OkHttpClient.Builder()
                    // .addInterceptor(AddCookiesInterceptor(cookiePreferences))
                    // .addInterceptor(ReceivedCookiesInterceptor(cookiePreferences))
                    .addInterceptor(AuthorizationInterceptor(userPreferences, authInterceptor))
                    .also { client ->
                        // При режиме debug, происходит логирование интерцептора
                        if (BuildConfigApp.DEBUG) {
                            val logging = HttpLoggingInterceptor()
                            logging.setLevel(HttpLoggingInterceptor.Level.BASIC)
                            client.addInterceptor(logging)
                        }
                    }.build()
            )
            .build()
            .create(api)
    }

    /**
     * Интерцептор для обработки ошибки 401.
     * Статус-код 401 возникает при невалидности токена доступа,
     * потому, чтобы не просить пользователя об повторной авторизации необходимо
     * автоматическо обновлять токен доступа, что и делает данный интерцептор
     */
    internal class AuthorizationInterceptor(
        private val userPreferences: UserPreferences?,
        private val authInterceptor: Boolean = true
    ) : Interceptor {
        @Throws(IOException::class)
        override fun intercept(chain: Interceptor.Chain): Response {
            val original: Request = chain.request()

            // Если флаг authInterceptor равен false, то не добавляем интерцептор в цепочку
            if (!authInterceptor) {
                return chain.proceed(original)
            }

            // Получение локальных авторизационных данных
            val auth = Gson().fromJson(
                runBlocking {
                    userPreferences?.auth?.first()
                },
                AuthModel::class.java
            )

            // Добавление в текущий запрос токена доступа (в Authorization Bearer)
            var originalRequest: Request = original.newBuilder()
                .addHeader("Authorization", "Bearer ${auth.accessToken}")
                .build()

            // Выполнение нового запроса и получение ответа
            var responseBody = chain.proceed(originalRequest)

            // Обработка ситуации, когда был получен статус-код 401
            if (responseBody.code == 401) {
                // Закрываем тело запроса
                responseBody.close()

                // Формируем данные для отправки запроса (берём их из локального хранилища)
                val requestBody = Gson().toJson(
                    AuthRefreshModel(
                        refreshToken = auth.refreshToken!!
                    )
                ).toRequestBody("application/json".toMediaTypeOrNull())

                // Log.w("HELLO", auth.refreshToken!!)

                // Отправляем запрос на обновление токена доступа
                val request: Request = Request.Builder()
                    .url(MainNetworkConstants.MAIN_API + AuthApiConstants.REFRESH_TOKEN)
                    .method("POST", requestBody)
                    .build()

                responseBody = chain.proceed(request)

                // Если в результате запроса был статус-код 201
                if (responseBody.code == 201) {
                    // То сохраняем авторизационные данные и повторяем оригинальный запрос
                    val newAuth = Gson().fromJson(
                        Gson().toJson(
                            JsonParser.parseString(
                                responseBody.body?.string()
                            )
                        ),
                        AuthModel::class.java
                    )

                    // Сохранение новых авторизационных дданных
                    runBlocking {
                        userPreferences?.saveAuth(
                            Gson().toJson(newAuth)
                        )
                    }

                    // Повтор оригинального запроса
                    originalRequest = original.newBuilder()
                        .addHeader("Authorization", "Bearer ${newAuth.accessToken}")
                        .build()

                    responseBody.close()
                    responseBody = chain.proceed(originalRequest)
                }
            }

            return responseBody
        }
    }

    /**
     * Класс, перехватывающий полученные куки после осуществления HTTP-запроса
     */
    internal class ReceivedCookiesInterceptor(
        private val cookiePreferences: CookiePreferences?
    ) : Interceptor {
        override fun intercept(chain: Interceptor.Chain): Response {
            val originalResponse = chain.proceed(chain.request())

            if(originalResponse.headers("Set-Cookie").isNotEmpty()){
                val cookies = HashSet<String>()

                for (header in originalResponse.headers("Set-Cookie")) {
                    cookies.add(header)
                }

                // Сохранение Cookie в локальное хранилище
                runBlocking {
                    cookiePreferences?.saveCookie(Gson().toJson(cookies))
                }
            }

            return originalResponse
        }
    }

    /**
     * Класс, перехватывающий функцию для добавления новых куки в каждый запрос
     */
    internal class AddCookiesInterceptor(
        private val cookiePreferences: CookiePreferences?
    ) : Interceptor {
        override fun intercept(chain: Interceptor.Chain): Response {
            val builder = chain.request().newBuilder()
            val cookies = Gson().fromJson(runBlocking {
                cookiePreferences!!.cookie.first()
            }, object : TypeToken<HashSet<String>>() {})

            if(cookies != null){
                for(cookie in cookies){
                    builder.addHeader("Cookie", cookie)
                }
            }

            return chain.proceed(builder.build())
        }
    }
}