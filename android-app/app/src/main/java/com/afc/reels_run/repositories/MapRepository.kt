package com.afc.reels_run.repositories

import com.afc.reels_run.store.CoordsPreferences

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