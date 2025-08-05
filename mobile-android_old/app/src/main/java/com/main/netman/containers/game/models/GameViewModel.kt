package com.main.netman.containers.game.models

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.viewModelScope
import com.main.netman.containers.base.BaseViewModel
import com.main.netman.models.game.GameIdModel
import com.main.netman.models.game.GameSessionIdModel
import com.main.netman.network.Resource
import com.main.netman.repositories.PlayerRepository
import kotlinx.coroutines.launch
import okhttp3.ResponseBody
import retrofit2.Response

class GameViewModel(
    private val repository: PlayerRepository
) : BaseViewModel(repository) {
    private val _gameInfo: MutableLiveData<Resource<Response<ResponseBody>>> =
        MutableLiveData()
    val gameInfo: LiveData<Resource<Response<ResponseBody>>>
        get() = _gameInfo

    /**
     * Получение информации о текущей игре
     */
    fun gameInfo() = viewModelScope.launch {
        _gameInfo.value = Resource.Loading
        _gameInfo.value = repository.playerGameInfo()
    }

    private val _detachGame: MutableLiveData<Resource<Response<ResponseBody>>> =
        MutableLiveData()
    val detachGame: LiveData<Resource<Response<ResponseBody>>>
        get() = _detachGame

    /**
     * Выход пользователя из игры
     */
    fun detachGame(sessionId: GameSessionIdModel) = viewModelScope.launch {
        _detachGame.value = Resource.Loading
        _detachGame.value = repository.playerDetachGame(sessionId)
    }

    private val _joinGame: MutableLiveData<Resource<Response<ResponseBody>>> =
        MutableLiveData()
    val joinGame: LiveData<Resource<Response<ResponseBody>>>
        get() = _joinGame

    /**
     * Регистрация пользователя на игру
     */
    fun joinGame(gameId: GameIdModel) = viewModelScope.launch {
        _joinGame.value = Resource.Loading
        _joinGame.value = repository.playerJoinGame(gameId)
    }

    private val _completedGame: MutableLiveData<Resource<Response<ResponseBody>>> =
        MutableLiveData()
    val completedGame: LiveData<Resource<Response<ResponseBody>>>
        get() = _completedGame

    /**
     * Завершение пользователем определённой игровой сессии
     */
    fun completedGame(gameId: GameSessionIdModel) = viewModelScope.launch {
        _completedGame.value = Resource.Loading
        _completedGame.value = repository.playerCompletedGame(gameId)
    }
}