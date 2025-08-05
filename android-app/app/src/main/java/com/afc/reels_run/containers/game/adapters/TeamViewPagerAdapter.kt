package com.afc.reels_run.containers.game.adapters

import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentManager
import androidx.fragment.app.FragmentStatePagerAdapter
import com.afc.reels_run.constants.data.value.PlayerStatus
import com.afc.reels_run.containers.game.fragments.GamesTeamFragment
import com.afc.reels_run.containers.game.fragments.PlayersTeamFragment

class TeamViewPagerAdapter(
    fm: FragmentManager,
    private var commandsId: Int? = null,
    private var listType: String,
    private var commandStatus: Int? = null,
    private var playerStatus: Int = PlayerStatus.PLAYER_DEFAULT
) : FragmentStatePagerAdapter(fm) {

    // Возвращает определённый элемент в зависимости от позиции, на которой он находится
    override fun getItem(position: Int): Fragment {
        if (position == 1) {
            // Список игр команды (пройденных, зарегистрированных и текущих)
            return GamesTeamFragment(commandStatus, commandsId)
        }

        // Список игроков в команде
        return PlayersTeamFragment(
            commandsId,
            listType,
            playerStatus
        )
    }

    override fun getCount(): Int {
        return 2
    }

    override fun getPageTitle(position: Int): CharSequence? {
        if (position == 0) {
            return "Игроки"
        }

        return "Игры"
    }
}