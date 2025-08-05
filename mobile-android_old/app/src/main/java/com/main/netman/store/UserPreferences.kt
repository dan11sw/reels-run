package com.main.netman.store

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.*
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import com.main.netman.constants.data.store.user.UserKeyConstants
import com.main.netman.constants.data.store.user.UserStoreConstants
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

val Context.userDataStore: DataStore<Preferences> by preferencesDataStore(name = UserStoreConstants.MAIN)

/*
* Класс для взаимодействия с локальными пользовательскими данными
* */
class UserPreferences(
    private val dataStore: DataStore<Preferences>
) {
    val auth : Flow<String?>
        get() = dataStore.data.map { preferences ->
            preferences[KEY_AUTH]
        }

    val profileImage : Flow<String?>
        get() = dataStore.data.map { preferences ->
            preferences[KEY_USER_IMAGE]
        }

    val userInfo : Flow<String?>
        get() = dataStore.data.map { preferences ->
            preferences[KEY_USER_INFO]
        }

    // Асинхронная функция сохранения авторизационных данных
    suspend fun saveAuth(authData: String){
        // Сохранение данных
        dataStore.edit { preferences ->
            preferences[KEY_AUTH] = authData
        }
    }

    // Асинхронная функция сохранения данных пользователя
    suspend fun saveUserInfo(userInfo: String){
        dataStore.edit { preferences ->
            preferences[KEY_USER_INFO] = userInfo
        }
    }

    suspend fun saveUserImage(filepath: String){
        dataStore.edit { preferences ->
            preferences[KEY_USER_IMAGE] = filepath
        }
    }

    // Очистка локального хранилища
    suspend fun clear(){
        dataStore.edit { preferences ->
            preferences.clear()
        }
    }

    // Ключи, для доступа к данным
    companion object {
        private val KEY_AUTH = stringPreferencesKey(UserKeyConstants.AUTH)
        private val KEY_USER_INFO = stringPreferencesKey(UserKeyConstants.USER_INFO)
        private val KEY_USER_IMAGE = stringPreferencesKey(UserKeyConstants.USER_IMAGE)
    }
}