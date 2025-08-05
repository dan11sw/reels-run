package com.main.netman.store

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import com.main.netman.constants.data.store.user.UserKeyConstants
import com.main.netman.constants.data.store.user.UserStoreConstants
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.launch

val Context.testMarkDataStore: DataStore<Preferences> by preferencesDataStore(name = UserStoreConstants.TEST_MARK)

/*
* Класс для взаимодействия с локальными пользовательскими данными
* */
class TestMarkPreferences(
    private val dataStore: DataStore<Preferences>
) {
    private val scope = CoroutineScope(Dispatchers.Default)

    // Сохранение данных в виде асинхронного потока
    val count : Flow<String?>
        get() = dataStore.data.map { preferences ->
            preferences[KEY_TEST_MARK]
        }

    // Асинхронная функция сохранения авторизационных данных
    suspend fun saveCount(data: String){
        scope.launch {
            // Сохранение данных
            dataStore.edit { preferences ->
                preferences[KEY_TEST_MARK] = data
            }
        }
    }

    // Очистка локального хранилища
    suspend fun clear(){
        dataStore.edit { preferences ->
            preferences.clear()
        }
    }

    // Ключи хранилища
    companion object {
        private val KEY_TEST_MARK = stringPreferencesKey(UserKeyConstants.TEST_MARK)
    }
}