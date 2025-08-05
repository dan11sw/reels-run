package com.afc.reels_run.network.apis

import com.afc.reels_run.constants.network.player.PlayerApiConstants
import okhttp3.MultipartBody
import okhttp3.RequestBody
import okhttp3.ResponseBody
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.Multipart
import retrofit2.http.POST
import retrofit2.http.Part

/**
 * Интерфейс предоставляющий API-запросы для функционального модуля "Игрок"
 */
interface PlayerApi {
    /**
     * Получение информации о пользователе
     */
    @GET(PlayerApiConstants.PLAYER_INFO)
    suspend fun playerInfo(): Response<ResponseBody>

    /**
     * Обновление информации о пользователе
     */
    @POST(PlayerApiConstants.PLAYER_INFO_UPDATE)
    suspend fun playerInfoUpdate(@Body requestBody: RequestBody): Response<ResponseBody>

    /**
     * Получение ссылки на изображение пользователя
     */
    @GET(PlayerApiConstants.PLAYER_INFO_IMG)
    suspend fun playerInfoImg(): Response<ResponseBody>

    /**
     * Добавление информации о изображении пользователя
     */
    @Multipart
    @POST(PlayerApiConstants.PLAYER_INFO_IMG_UPDATE)
    suspend fun playerInfoImgUpdate(@Part file: MultipartBody.Part): Response<ResponseBody>

    /**
     * Создание новой команды
     */
    @POST(PlayerApiConstants.PLAYER_COMMAND_CREATE)
    suspend fun playerCommandCreate(@Body requestBody: RequestBody): Response<ResponseBody>

    /**
     * Вступление игрока в команду
     */
    @POST(PlayerApiConstants.PLAYER_COMMAND_JOIN)
    suspend fun playerCommandJoin(@Body requestBody: RequestBody): Response<ResponseBody>

    /**
     * Получение списка всех команд
     */
    @GET(PlayerApiConstants.PLAYER_COMMANDS_LIST)
    suspend fun playerCommandsList(): Response<ResponseBody>

    /**
     * Выход игрока из команды
     */
    @POST(PlayerApiConstants.PLAYER_COMMAND_DETACH)
    suspend fun playerCommandDetach(@Body requestBody: RequestBody): Response<ResponseBody>

    /**
     * Получение информации о команде
     */
    @POST(PlayerApiConstants.PLAYER_COMMAND)
    suspend fun playerCommand(@Body requestBody: RequestBody): Response<ResponseBody>

    /**
     * Получение информации о игроках в команде
     */
    @POST(PlayerApiConstants.PLAYER_COMMAND_PLAYERS)
    suspend fun playerCommandPlayers(@Body requestBody: RequestBody): Response<ResponseBody>

    /**
     * Получение информации о доступных играх для командного участия
     */
    @GET(PlayerApiConstants.PLAYER_COMMAND_AVAILABLE_GAMES)
    suspend fun playerCommandAvailableGames(): Response<ResponseBody>

    /**
     * Регистрация команды на игру
     */
    @POST(PlayerApiConstants.PLAYER_COMMAND_REGISTER_GAME)
    suspend fun playerCommandRegisterGame(@Body requestBody: RequestBody): Response<ResponseBody>

    /**
     * Получение информации о текущей игре
     */
    @POST(PlayerApiConstants.PLAYER_COMMAND_CURRENT_GAME)
    suspend fun playerCommandCurrentGame(@Body requestBody: RequestBody): Response<ResponseBody>

    /**
     * Получение информации о всех пройденных командой играх
     */
    @POST(PlayerApiConstants.PLAYER_COMMAND_GAMES)
    suspend fun playerCommandGames(@Body requestBody: RequestBody): Response<ResponseBody>

    /**
     * Получение информации о текущей игре, к которой присоединился пользователь
     */
    @GET(PlayerApiConstants.PLAYER_GAME_INFO)
    suspend fun playerGameInfo(): Response<ResponseBody>

    /**
     * Выход из текущей игры пользователя
     */
    @POST(PlayerApiConstants.PLAYER_DETACH_GAME)
    suspend fun playerDetachGame(@Body requestBody: RequestBody): Response<ResponseBody>

    /**
     * Присоединение к определённой игре
     */
    @POST(PlayerApiConstants.PLAYER_JOIN_GAME)
    suspend fun playerJoinGame(@Body requestBody: RequestBody): Response<ResponseBody>

    /**
     * Завершение игровой сессии
     */
    @POST(PlayerApiConstants.PLAYER_COMPLETED_GAME)
    suspend fun playerCompletedGame(@Body requestBody: RequestBody): Response<ResponseBody>
}