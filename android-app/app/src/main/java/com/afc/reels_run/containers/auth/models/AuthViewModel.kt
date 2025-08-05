package com.afc.reels_run.containers.auth.models

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.viewModelScope
import com.afc.reels_run.containers.base.BaseViewModel
import com.afc.reels_run.models.auth.AuthSignInModel
import com.afc.reels_run.models.auth.AuthSignUpModel
import com.afc.reels_run.network.Resource
import com.afc.reels_run.repositories.AuthRepository
import kotlinx.coroutines.launch
import okhttp3.ResponseBody
import retrofit2.Response


/**
 * ViewModel для фрагментов авторизации и регистрации.
 * Содержит в себе определённые данные и методы,
 * позволяющие эти данные модифицировать
 */
class AuthViewModel(
    private val repository: AuthRepository
) : BaseViewModel(repository) {

    private val _signInResponse : MutableLiveData<Resource<Response<ResponseBody>>> = MutableLiveData()
    val signInResponse : LiveData<Resource<Response<ResponseBody>>>
        get() = _signInResponse

    private val _signUpResponse : MutableLiveData<Resource<Response<ResponseBody>>> = MutableLiveData()
    val signUpResponse : LiveData<Resource<Response<ResponseBody>>>
        get() = _signUpResponse

    /**
     * Функция авторизации пользователя, запускаемая в контексте viewModel
     * (это позволяет осуществлять работу в зависимости от состояния ViewModel)
     */
    fun signIn(
        body: AuthSignInModel
    ) = viewModelScope.launch {
        // Установка данных по умолчанию (загрузка ресурсов)
        _signInResponse.value = Resource.Loading

        // Изменение значения на возвращаемый функциоей авторизации из репозитория
        _signInResponse.value = repository.signIn(body)
    }

    /**
     * Функция авторизации пользователя
     */
    fun signUp(
        body: AuthSignUpModel
    ) = viewModelScope.launch {
        _signUpResponse.value = Resource.Loading
        _signUpResponse.value = repository.signUp(body)
    }

    /**
     * Сохранение данных пользователя
     */
    suspend fun saveAuth(authData: String){
        repository.saveAuth(authData)
    }
}