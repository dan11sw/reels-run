package com.main.netman.containers.home.models

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.viewModelScope
import com.google.gson.Gson
import com.main.netman.containers.base.BaseViewModel
import com.main.netman.models.user.UserCoordsModel
import com.main.netman.network.Resource
import com.main.netman.repositories.MapRepository
import kotlinx.coroutines.launch
import okhttp3.ResponseBody
import retrofit2.Response

class MapViewModel(
    private val repository: MapRepository
) : BaseViewModel(repository) {
    private val _coords: MutableLiveData<Pair<Double, Double>> = MutableLiveData()
    val coords: LiveData<Pair<Double, Double>>
        get() = _coords

    /**
     * Установка новых координат
     */
    fun setCoords(lat: Double, lng: Double) = viewModelScope.launch {
        val pair = lat to lng
        if(_coords.value == null || _coords.value != pair){
            _coords.value = pair
        }
    }

    /**
     * Сохранение координат пользователя во внутреннее хранилище
     */
    fun saveCoords(lat: Double, lng: Double) = viewModelScope.launch {
        val data = Gson().toJson(
            UserCoordsModel(
                lat = lat,
                lng = lng
            )
        )

        repository.saveCoords(data)
    }
}