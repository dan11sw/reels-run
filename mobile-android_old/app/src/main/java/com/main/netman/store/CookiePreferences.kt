package com.main.netman.store

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import com.main.netman.constants.data.store.user.UserKeyConstants
import com.main.netman.constants.data.store.user.UserStoreConstants
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

val Context.cookieDataStore: DataStore<Preferences> by preferencesDataStore(name = UserStoreConstants.COORDS)

/*
* Класс для взаимодействия с локальными пользовательскими данными
* */
class CookiePreferences(
    private val dataStore: DataStore<Preferences>
) {
    val cookie : Flow<String?>
        get() = dataStore.data.map { preferences ->
            preferences[KEY_COOKIE]
        }

    suspend fun saveCookie(data: String){
        dataStore.edit { preferences ->
            preferences[KEY_COOKIE] = data
        }
    }

    suspend fun clear(){
        dataStore.edit { preferences ->
            preferences.clear()
        }
    }

    // Ключи, для доступа к данным
    companion object {
        private val KEY_COOKIE = stringPreferencesKey(UserKeyConstants.COOKIE)
    }
}