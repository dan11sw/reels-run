package com.main.netman.containers.base

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import com.main.netman.containers.auth.models.AuthViewModel
import com.main.netman.containers.creator.models.CreatorViewModel
import com.main.netman.containers.game.models.GameTeamViewModel
import com.main.netman.containers.game.models.GameViewModel
import com.main.netman.containers.home.models.MapViewModel
import com.main.netman.containers.media.quest.models.ImageQuestViewModel
import com.main.netman.containers.profile.models.PlayerViewModel
import com.main.netman.repositories.AuthRepository
import com.main.netman.repositories.BaseRepository
import com.main.netman.repositories.CreatorRepository
import com.main.netman.repositories.ImageQuestRepository
import com.main.netman.repositories.MapRepository
import com.main.netman.repositories.PlayerRepository

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