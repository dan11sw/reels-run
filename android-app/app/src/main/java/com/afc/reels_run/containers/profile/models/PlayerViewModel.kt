package com.afc.reels_run.containers.profile.models

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.viewModelScope
import com.afc.reels_run.containers.base.BaseViewModel
import com.afc.reels_run.models.user.UserInfoUpdateModel
import com.afc.reels_run.network.Resource
import com.afc.reels_run.repositories.PlayerRepository
import kotlinx.coroutines.launch
import okhttp3.ResponseBody
import retrofit2.Response

class PlayerViewModel(
    private val repository: PlayerRepository
) : BaseViewModel(repository) {
    private val _playerInfoResponse : MutableLiveData<Resource<Response<ResponseBody>>> = MutableLiveData()
    val playerInfoResponse : LiveData<Resource<Response<ResponseBody>>>
        get() = _playerInfoResponse

    private val _playerInfoImgResponse : MutableLiveData<Resource<Response<ResponseBody>>> = MutableLiveData()
    val playerInfoImgResponse : LiveData<Resource<Response<ResponseBody>>>
        get() = _playerInfoImgResponse

    private val _playerInfoImgUpdateResponse : MutableLiveData<Resource<Response<ResponseBody>>> = MutableLiveData()
    val playerInfoImgUpdateResponse : LiveData<Resource<Response<ResponseBody>>>
        get() = _playerInfoImgUpdateResponse

    private val _playerInfoUpdateResponse : MutableLiveData<Resource<Response<ResponseBody>>> = MutableLiveData()
    val playerInfoUpdateResponse : LiveData<Resource<Response<ResponseBody>>>
        get() = _playerInfoUpdateResponse

    /**
     * Получение информации о пользователе
     */
    fun playerInfo() = viewModelScope.launch {
        // Установка данных по умолчанию (загрузка)
        _playerInfoResponse.value = Resource.Loading

        // Изменение значения на возвращаемый функцией добавления метки репозитория
        _playerInfoResponse.value = repository.playerInfo()
    }

    /**
     * Получение информации о изображении пользователе
     */
    fun playerInfoImg() = viewModelScope.launch {
        _playerInfoImgResponse.value = Resource.Loading
        _playerInfoImgResponse.value = repository.playerInfoImg()
    }

    /**
     * Обновление изображения пользователя
     */
    fun playerInfoImgUpdate(filepath: String) = viewModelScope.launch {
        _playerInfoImgUpdateResponse.value = Resource.Loading
        _playerInfoImgUpdateResponse.value = repository.playerInfoImgUpdate(filepath)
    }

    /**
     * Обновление изображения пользователя
     */
    fun playerInfoUpdate(body: UserInfoUpdateModel) = viewModelScope.launch {
        _playerInfoUpdateResponse.value = Resource.Loading
        _playerInfoUpdateResponse.value = repository.playerInfoUpdate(body)
    }
}