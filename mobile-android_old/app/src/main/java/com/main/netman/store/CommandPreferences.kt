package com.main.netman.store

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.PreferenceDataStoreFactory
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import com.main.netman.constants.data.store.user.UserKeyConstants
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.launch
import okio.Path.Companion.toPath
import kotlinx.atomicfu.locks.SynchronizedObject

// val Context.coordsDataStore: DataStore<Preferences> by preferencesDataStore(name = UserStoreConstants.COORDS)
private lateinit var localDataStore: DataStore<Preferences>
private val lock = SynchronizedObject()

fun getCommandDataStore(context: Context): DataStore<Preferences> = getCommandDataStore(
    producePath = { context.filesDir.resolve(commandDataStoreFileName).absolutePath }
)

fun getCommandDataStore(producePath: () -> String): DataStore<Preferences> =
    kotlinx.atomicfu.locks.synchronized(lock) {
        if (::localDataStore.isInitialized) {
            localDataStore
        } else {
            PreferenceDataStoreFactory.createWithPath(produceFile = { producePath().toPath() })
                .also {
                    localDataStore = it
                }
        }
    }

/*
* Класс для взаимодействия с локальными пользовательскими данными
* */
class CommandPreferences(
    private val dataStore: DataStore<Preferences>
) {
    private val scope = CoroutineScope(Dispatchers.Default)

    // Сохранение данных в виде асинхронного потока
    val command : Flow<String?>
        get() = dataStore.data.map { preferences ->
            preferences[KEY_COMMAND]
        }

    // Асинхронная функция сохранения авторизационных данных
    suspend fun saveCommand(data: String){
        scope.launch {
            // Сохранение данных
            dataStore.edit { preferences ->
                preferences[KEY_COMMAND] = data
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
        private val KEY_COMMAND = stringPreferencesKey(UserKeyConstants.USER_COMMAND)
    }
}

internal const val commandDataStoreFileName = "command.preferences_pb"