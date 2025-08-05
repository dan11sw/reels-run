package com.main.netman.containers.game.models

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.viewModelScope
import com.main.netman.containers.base.BaseViewModel
import com.main.netman.models.command.CommandStatusModel
import com.main.netman.models.command.CommandsIdModel
import com.main.netman.models.command.TeamCreateModel
import com.main.netman.models.game.GameIdModel
import com.main.netman.network.Resource
import com.main.netman.repositories.PlayerRepository
import kotlinx.coroutines.launch
import okhttp3.ResponseBody
import retrofit2.Response

class GameTeamViewModel(
    private val repository: PlayerRepository
) : BaseViewModel(repository) {
    /* ------------ Секция для операций связанных с созданием / редактированием команды ------------ */
    // Состояние для создания новой команды в системе
    private val _createTeamResponse: MutableLiveData<Resource<Response<ResponseBody>>> =
        MutableLiveData()
    val createTeamResponse: LiveData<Resource<Response<ResponseBody>>>
        get() = _createTeamResponse

    /**
     * Создание новой команды
     */
    fun createTeam(
        body: TeamCreateModel
    ) = viewModelScope.launch {
        // Установка данных по умолчанию (загрузка)
        _createTeamResponse.value = Resource.Loading

        // Изменение значения на возвращаемый функцией добавления метки репозитория
        _createTeamResponse.value = repository.playerCommandCreate(body)
    }

    /* ------------ Секция для операций связанных с созданием / редактированием команды ------------ */
    // Информация о команде
    private val _commandStatus: MutableLiveData<CommandStatusModel?> = MutableLiveData()
    val commandStatus: LiveData<CommandStatusModel?>
        get() = _commandStatus

    /**
     * Установка новой информации о статусе в команде
     */
    fun setCommandStatus(status: CommandStatusModel?) = viewModelScope.launch {
        _commandStatus.value = status
    }

    /* ------------ Секция для операций связанных с получением информации о командах ------------ */
    // Информация о команде
    private val _commands: MutableLiveData<Resource<Response<ResponseBody>>> =
        MutableLiveData()
    val commands: LiveData<Resource<Response<ResponseBody>>>
        get() = _commands

    /**
     * Установка новой информации о статусе в команде
     */
    fun commandsList() = viewModelScope.launch {
        _commands.value = Resource.Loading
        _commands.value = repository.playerCommandsList()
    }

    private val _commandDetach: MutableLiveData<Resource<Response<ResponseBody>>> =
        MutableLiveData()
    val commandDetach: LiveData<Resource<Response<ResponseBody>>>
        get() = _commandDetach


    /**
     * Выход игрока из команды
     */
    fun commandDetach(commandsIdModel: CommandsIdModel) = viewModelScope.launch {
        _commandDetach.value = Resource.Loading
        _commandDetach.value = repository.playerCommandDetach(commandsIdModel)
    }

    private val _commandJoin: MutableLiveData<Resource<Response<ResponseBody>>> =
        MutableLiveData()
    val commandJoin: LiveData<Resource<Response<ResponseBody>>>
        get() = _commandJoin


    /**
     * Выход игрока из команды
     */
    fun commandJoin(commandsIdModel: CommandsIdModel) = viewModelScope.launch {
        _commandJoin.value = Resource.Loading
        _commandJoin.value = repository.playerCommandJoin(commandsIdModel)
    }

    private val _commandInfo: MutableLiveData<Resource<Response<ResponseBody>>> =
        MutableLiveData()
    val commandInfo: LiveData<Resource<Response<ResponseBody>>>
        get() = _commandInfo


    /**
     * Получение информации о команде
     */
    fun commandInfo(commandsIdModel: CommandsIdModel) = viewModelScope.launch {
        _commandInfo.value = Resource.Loading
        _commandInfo.value = repository.playerCommand(commandsIdModel)
    }

    private val _commandPlayers: MutableLiveData<Resource<Response<ResponseBody>>> =
        MutableLiveData()
    val commandPlayers: LiveData<Resource<Response<ResponseBody>>>
        get() = _commandPlayers


    /**
     * Получение информации о игроках в команде
     */
    fun commandPlayers(commandsIdModel: CommandsIdModel) = viewModelScope.launch {
        _commandPlayers.value = Resource.Loading
        _commandPlayers.value = repository.playerCommandPlayers(commandsIdModel)
    }

    private val _availableGames: MutableLiveData<Resource<Response<ResponseBody>>> =
        MutableLiveData()
    val availableGames: LiveData<Resource<Response<ResponseBody>>>
        get() = _availableGames


    /**
     * Получение информации о игроках в команде
     */
    fun commandAvailableGames() = viewModelScope.launch {
        _availableGames.value = Resource.Loading
        _availableGames.value = repository.playerCommandAvailableGames()
    }

    private val _registerGame: MutableLiveData<Resource<Response<ResponseBody>>> =
        MutableLiveData()
    val registerGame: LiveData<Resource<Response<ResponseBody>>>
        get() = _registerGame


    /**
     * Получение информации о игроках в команде
     */
    fun playerCommandRegisterGame(infoGamesId: GameIdModel) = viewModelScope.launch {
        _registerGame.value = Resource.Loading
        _registerGame.value = repository.playerCommandRegisterGame(infoGamesId)
    }

    private val _currentGame: MutableLiveData<Resource<Response<ResponseBody>>> =
        MutableLiveData()
    val currentGame: LiveData<Resource<Response<ResponseBody>>>
        get() = _currentGame


    /**
     * Получение информации о игроках в команде
     */
    fun playerCommandCurrentGame(commandsId: CommandsIdModel) = viewModelScope.launch {
        _currentGame.value = Resource.Loading
        _currentGame.value = repository.playerCommandCurrentGame(commandsId)
    }

    private val _commandGames: MutableLiveData<Resource<Response<ResponseBody>>> =
        MutableLiveData()
    val commandGames: LiveData<Resource<Response<ResponseBody>>>
        get() = _commandGames


    /**
     * Получение информации о игроках в команде
     */
    fun playerCommandGames(commandsId: CommandsIdModel) = viewModelScope.launch {
        _commandGames.value = Resource.Loading
        _commandGames.value = repository.playerCommandGames(commandsId)
    }
}