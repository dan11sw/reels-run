package com.main.netman.containers.game

import android.app.Activity
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import com.main.netman.R
import com.main.netman.containers.creator.CreatorActivity
import com.main.netman.containers.home.HomeActivity
import com.main.netman.containers.messenger.MessengerActivity
import com.main.netman.containers.profile.ProfileActivity
import com.main.netman.databinding.ActivityGameBinding
import com.main.netman.utils.handleWarningMessage
import com.main.netman.utils.showMessage
import com.main.netman.utils.startNewActivity
import com.main.netman.utils.startStdActivity
import com.main.netman.utils.visible
import java.util.ArrayDeque

class GameActivity : AppCompatActivity() {
    private var idDeque: ArrayDeque<Int> = ArrayDeque()
    private var flag: Boolean = true
    private lateinit var binding: ActivityGameBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityGameBinding.inflate(layoutInflater)
        setContentView(binding.root)
        showMessage(binding.root)

        // Инициализация BottomNavigationView
        setupBottomNavigationView()

        // Имитация загрузки страницы
        /*binding.fcvActivityHome.addOnLayoutChangeListener { _, _, _, _, _, _, _, _, _ ->
            binding.pbActivityHome.visible(
                false
            )
        }*/

        idDeque.add(R.id.itemGameMenu)
        binding.bnvActivityGame.menu.findItem(R.id.itemGameMenu).isChecked = true

        // Установка badges
        // badgeSetup(R.id.itemMessengerMenu,100)
    }

    @Deprecated("Deprecated in Java")
    override fun onBackPressed() {
        startStdActivity(HomeActivity::class.java)
    }

    private fun <A : Activity> loadActivity(activity: Class<A>?) {
        if (activity != null) {
            startStdActivity(activity)
            overridePendingTransition(0, 0)
        }
    }

    private fun getActivity(menuId: Int): Class<out Activity>? {
        if (menuId != R.id.itemGameMenu) {
            binding.pbActivityGame.visible(true)
            binding.bnvActivityGame.menu.findItem(menuId).isChecked = true
        } else {
            return null
        }

        // Маршрутизация
        when (menuId) {
            R.id.itemMapMenu -> {
                return HomeActivity::class.java
            }

            R.id.itemProfileMenu -> {
                return ProfileActivity::class.java
            }
        }

        return null
    }

    private fun setupBottomNavigationView() {
        binding.bnvActivityGame.setOnItemSelectedListener {
            /*if(idDeque.contains(it.itemId)){
                if(it.itemId == R.id.itemMapMenu){
                    if(idDeque.size != 1){
                        if(flag){
                            idDeque.addFirst(R.id.itemMapMenu)
                            flag = false
                        }
                    }
                }

                // Чтобы сохранять всю историю переходов нужно закомментировать данную строку
                idDeque.remove(it.itemId)
            }

            idDeque.push(it.itemId)*/
            loadActivity(getActivity(it.itemId))

            false
        }
    }

    private fun badgeSetup(id: Int, alerts: Int) {
        val badge = binding.bnvActivityGame.getOrCreateBadge(id)
        badge.isVisible = true
        badge.number = alerts
    }

    private fun badgeClear(id: Int) {
        val badgeDrawable = binding.bnvActivityGame.getBadge(id)
        if (badgeDrawable != null) {
            badgeDrawable.isVisible = false
            badgeDrawable.clearNumber()
        }
    }
}