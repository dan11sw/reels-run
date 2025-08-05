package com.main.netman.repositories

import com.main.netman.store.CoordsPreferences
import com.main.netman.store.UserPreferences

class MapRepository(
    private val preferences: CoordsPreferences
) : BaseRepository(){
    /**
     * Сохранение координат пользователя
     */
    suspend fun saveCoords(coords: String){
        preferences.saveCoords(coords)
    }
}