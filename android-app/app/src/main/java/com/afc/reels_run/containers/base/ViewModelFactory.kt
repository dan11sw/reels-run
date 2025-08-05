package com.afc.reels_run.containers.base

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import com.afc.reels_run.containers.auth.models.AuthViewModel
import com.afc.reels_run.containers.creator.models.CreatorViewModel
import com.afc.reels_run.containers.game.models.GameTeamViewModel
import com.afc.reels_run.containers.game.models.GameViewModel
import com.afc.reels_run.containers.home.models.MapViewModel
import com.afc.reels_run.containers.media.quest.models.ImageQuestViewModel
import com.afc.reels_run.containers.profile.models.PlayerViewModel
import com.afc.reels_run.repositories.AuthRepository
import com.afc.reels_run.repositories.BaseRepository
import com.afc.reels_run.repositories.CreatorRepository
import com.afc.reels_run.repositories.ImageQuestRepository
import com.afc.reels_run.repositories.MapRepository
import com.afc.reels_run.repositories.PlayerRepository

/**
 * Элемент ViewModelFactory используется для возможности передавать ViewModel,
 * которые закреплены за различными фрагментами и активностями определённые
 * данные, которые могут быть переданны в виде аргументов
 */
class ViewModelFactory(
    private val repository: BaseRepository
) : ViewModelProvider.NewInstanceFactory(){
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        return when {
            modelClass.isAssignableFrom(AuthViewModel::class.java) -> AuthViewModel(repository as AuthRepository) as T
            modelClass.isAssignableFrom(MapViewModel::class.java) -> MapViewModel(repository as MapRepository) as T
            modelClass.isAssignableFrom(CreatorViewModel::class.java) -> CreatorViewModel(repository as CreatorRepository) as T
            modelClass.isAssignableFrom(PlayerViewModel::class.java) -> PlayerViewModel(repository as PlayerRepository) as T
            modelClass.isAssignableFrom(GameTeamViewModel::class.java) -> GameTeamViewModel(repository as PlayerRepository) as T
            modelClass.isAssignableFrom(GameViewModel::class.java) -> GameViewModel(repository as PlayerRepository) as T
            modelClass.isAssignableFrom(ImageQuestViewModel::class.java) -> ImageQuestViewModel(repository as ImageQuestRepository) as T
            else -> throw IllegalArgumentException("ViewModelClass Not Found")
        }
    }
}