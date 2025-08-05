package com.afc.reels_run.store

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import com.afc.reels_run.constants.data.store.user.UserKeyConstants
import com.afc.reels_run.constants.data.store.user.UserStoreConstants
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.launch

// Добавление в контекст новой переменной (ссылки на хранилище)
val Context.currentQuestDataStore: DataStore<Preferences> by preferencesDataStore(name = UserStoreConstants.CURRENT_GAME_QUEST)

/*
* Класс для взаимодействия с локальными пользовательскими данными
* */
class CurrentQuestPreferences(
    private val dataStore: DataStore<Preferences>
) {
    private val scope = CoroutineScope(Dispatchers.Default)

    // Сохранение данных в виде асинхронного потока
    val data : Flow<String?>
        get() = dataStore.data.map { preferences ->
            preferences[KEY_CURRENT_QUEST]
        }

    // Асинхронная функция сохранения данных
    suspend fun saveData(data: String){
        scope.launch {
            // Сохранение данных
            dataStore.edit { preferences ->
                preferences[KEY_CURRENT_QUEST] = data
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
        private val KEY_CURRENT_QUEST = stringPreferencesKey(UserKeyConstants.CURRENT_GAME_QUEST)
    }
}