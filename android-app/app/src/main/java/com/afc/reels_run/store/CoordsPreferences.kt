package com.afc.reels_run.store

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.PreferenceDataStoreFactory
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import com.afc.reels_run.constants.data.store.user.UserKeyConstants
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

fun getCoordsDataStore(context: Context): DataStore<Preferences> = getCoordsDataStore(
    producePath = { context.filesDir.resolve(coordsDataStoreFileName).absolutePath }
)

fun getCoordsDataStore(producePath: () -> String): DataStore<Preferences> =
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
class CoordsPreferences(
    private val dataStore: DataStore<Preferences>
) {
    private val scope = CoroutineScope(Dispatchers.Default)

    // Сохранение данных в виде асинхронного потока
    val coords : Flow<String?>
        get() = dataStore.data.map { preferences ->
            preferences[KEY_COORDS]
        }

    // Асинхронная функция сохранения авторизационных данных
    suspend fun saveCoords(data: String){
        scope.launch {
            // Сохранение данных
            dataStore.edit { preferences ->
                preferences[KEY_COORDS] = data
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
        private val KEY_COORDS = stringPreferencesKey(UserKeyConstants.USER_COORDS)
    }
}

internal const val coordsDataStoreFileName = "coords.preferences_pb"