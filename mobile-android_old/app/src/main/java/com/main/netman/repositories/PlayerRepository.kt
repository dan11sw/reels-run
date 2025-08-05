package com.main.netman.repositories

import com.google.gson.Gson
import com.main.netman.models.command.CommandInfoModel
import com.main.netman.models.command.CommandsIdModel
import com.main.netman.models.command.TeamCreateModel
import com.main.netman.models.game.GameIdModel
import com.main.netman.models.game.GameSessionIdModel
import com.main.netman.models.user.UserInfoUpdateModel
import com.main.netman.network.apis.PlayerApi
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.MultipartBody
import okhttp3.RequestBody
import okhttp3.RequestBody.Companion.toRequestBody
import java.io.File

class PlayerRepository(
    private val api: PlayerApi
) : BaseRepository() {

    /**
     * Получение информации о пользователе
     */
    suspend fun playerInfo() = safeApiCall {
        api.playerInfo()
    }

    /**
     * Получение информации о изображении пользователя
     */
    suspend fun playerInfoImg() = safeApiCall {
        api.playerInfoImg()
    }

    /**
     * Обновление информации о пользователях
     */
    suspend fun playerInfoUpdate(body: UserInfoUpdateModel) = safeApiCall {
        val requestBody = Gson().toJson(body).toRequestBody("application/json".toMediaTypeOrNull())

        api.playerInfoUpdate(requestBody)
    }

    /**
     * Загрузка информации о новом изображении пользователя
     */
    suspend fun playerInfoImgUpdate(filepath: String) = safeApiCall {
        // Получение информации о файле
        val file = File(filepath)

        // Создание части запроса для файла
        val requestFile = RequestBody.create("multipart/form-data".toMediaTypeOrNull(), file)

        // Добавление данных о файле
        val body: MultipartBody.Part =
            MultipartBody.Part.createFormData("file", file.name, requestFile)

        api.playerInfoImgUpdate(body)
    }

    /**
     * Создание новой команды
     */
    suspend fun playerCommandCreate(body: TeamCreateModel) = safeApiCall {
        val requestBody = Gson().toJson(body).toRequestBody("application/json".toMediaTypeOrNull())

        api.playerCommandCreate(requestBody)
    }

    /**
     * Вступление в команду
     */
    suspend fun playerCommandJoin(body: CommandsIdModel) = safeApiCall {
        val requestBody = Gson().toJson(body).toRequestBody("application/json".toMediaTypeOrNull())

        api.playerCommandJoin(requestBody)
    }

    /**
     * Получение списка всех комманд
     */
    suspend fun playerCommandsList() = safeApiCall {
        api.playerCommandsList()
    }

    /**
     * Выход игрока из команды
     */
    suspend fun playerCommandDetach(body: CommandsIdModel) = safeApiCall {
        val requestBody = Gson().toJson(body).toRequestBody("application/json".toMediaTypeOrNull())

        api.playerCommandDetach(requestBody)
    }

    /**
     * Просмотр информации о команде
     */
    suspend fun playerCommand(body: CommandsIdModel) = safeApiCall {
        val requestBody = Gson().toJson(body).toRequestBody("application/json".toMediaTypeOrNull())

        api.playerCommand(requestBody)
    }

    /**
     * Получени информации о игроках в команде
     */
    suspend fun playerCommandPlayers(body: CommandsIdModel) = safeApiCall {
        val requestBody = Gson().toJson(body).toRequestBody("application/json".toMediaTypeOrNull())

        api.playerCommandPlayers(requestBody)
    }

    /**
     * Получение списка доступных игр
     */
    suspend fun playerCommandAvailableGames() = safeApiCall {
        api.playerCommandAvailableGames()
    }

    /**
     * Получение информации о текущей игре
     */
    suspend fun playerGameInfo() = safeApiCall {
        api.playerGameInfo()
    }

    /**
     * Регистрация команды на игру
     */
    suspend fun playerCommandRegisterGame(body: GameIdModel) = safeApiCall {
        val requestBody = Gson().toJson(body).toRequestBody("application/json".toMediaTypeOrNull())

        api.playerCommandRegisterGame(requestBody)
    }

    /**
     * Получение информации о текущей игре
     */
    suspend fun playerCommandCurrentGame(body: CommandsIdModel) = safeApiCall {
        val requestBody = Gson().toJson(body).toRequestBody("application/json".toMediaTypeOrNull())

        api.playerCommandCurrentGame(requestBody)
    }

    /**
     * Получение информации о пройденных играх
     */
    suspend fun playerCommandGames(body: CommandsIdModel) = safeApiCall {
        val requestBody = Gson().toJson(body).toRequestBody("application/json".toMediaTypeOrNull())

        api.playerCommandGames(requestBody)
    }

    /**
     * Выход пользователя из определённой игры
     */
    suspend fun playerDetachGame(body: GameSessionIdModel) = safeApiCall {
        val requestBody = Gson().toJson(body).toRequestBody("application/json".toMediaTypeOrNull())

        api.playerDetachGame(requestBody)
    }

    /**
     * Регистрация пользователя на определённую игру
     */
    suspend fun playerJoinGame(body: GameIdModel) = safeApiCall {
        val requestBody = Gson().toJson(body).toRequestBody("application/json".toMediaTypeOrNull())

        api.playerJoinGame(requestBody)
    }

    /**
     * Завершение игровой сессии
     */
    suspend fun playerCompletedGame(body: GameSessionIdModel) = safeApiCall {
        val requestBody = Gson().toJson(body).toRequestBody("application/json".toMediaTypeOrNull())
        api.playerCompletedGame(requestBody)
    }
}