package com.main.netman.containers.creator.models

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.viewModelScope
import com.main.netman.containers.base.BaseViewModel
import com.main.netman.models.creator.MarkIdModel
import com.main.netman.models.creator.MarkInfoModel
import com.main.netman.network.Resource
import com.main.netman.repositories.CreatorRepository
import kotlinx.coroutines.launch
import okhttp3.ResponseBody
import retrofit2.Response

class CreatorViewModel(
    private val repository: CreatorRepository
) : BaseViewModel(repository) {
    // Состояния для добавления информации о метке
    private val _markAddInfoResponse : MutableLiveData<Resource<Response<ResponseBody>>> = MutableLiveData()
    val markAddInfoResponse : LiveData<Resource<Response<ResponseBody>>>
        get() = _markAddInfoResponse

    // Состояния для добавления информации о изображении метки
    private val _markAddImgResponse : MutableLiveData<Resource<Response<ResponseBody>>> = MutableLiveData()
    val markAddImgResponse : LiveData<Resource<Response<ResponseBody>>>
        get() = _markAddImgResponse

    // Состояния для удаления информации о метке
    private val _markDeleteInfoResponse : MutableLiveData<Resource<Response<ResponseBody>>> = MutableLiveData()
    val markDeleteInfoResponse : LiveData<Resource<Response<ResponseBody>>>
        get() = _markDeleteInfoResponse

    /**
     * Добавление информации о метке
     */
    fun markAddInfo(
        body: MarkInfoModel
    ) = viewModelScope.launch {
        // Установка данных по умолчанию (загрузка)
        _markAddInfoResponse.value = Resource.Loading

        // Изменение значения на возвращаемый функцией добавления метки репозитория
        _markAddInfoResponse.value = repository.markAddInfo(body)
    }

    /**
     * Добавление информации о изображении метки
     */
    fun markAddImg(
        markId: Int,
        filepath: String
    ) = viewModelScope.launch {
        _markAddImgResponse.value = Resource.Loading

        _markAddImgResponse.value = repository.markAddImg(markId, filepath)
    }

    /**
     * Удаление информации о метке
     */
    fun markDeleteInfo(
        body: MarkIdModel
    ) = viewModelScope.launch {
        _markDeleteInfoResponse.value = Resource.Loading

        _markDeleteInfoResponse.value = repository.markDeleteInfo(body)
    }
}