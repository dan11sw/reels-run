package com.afc.reels_run.containers.base

import androidx.lifecycle.ViewModel
import com.afc.reels_run.network.apis.AuthApi
import com.afc.reels_run.repositories.BaseRepository
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

/**
 * Базовая ViewModel, которая используется BaseFragment для связи видов с данными.
 * ViewModel - класс, позволяющий Activity и фрагментам сохранять
 * необходимые им объекты живыми при повороте экрана
 */
abstract class BaseViewModel(
    private val repository: BaseRepository
) : ViewModel() {

    /**
     * Метод для выхода из системы
     */
    suspend fun logout(
        accessToken: String,
        refreshToken: String,
        typeAuth: Int,
        api: AuthApi
    ) = withContext(Dispatchers.IO) {
        repository.logout(accessToken, refreshToken, typeAuth, api)
    }
}