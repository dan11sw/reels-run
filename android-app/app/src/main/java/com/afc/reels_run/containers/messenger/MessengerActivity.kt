package com.afc.reels_run.containers.messenger

import android.app.Activity
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import com.afc.reels_run.R
import com.afc.reels_run.containers.game.GameActivity
import com.afc.reels_run.containers.home.HomeActivity
import com.afc.reels_run.containers.profile.ProfileActivity
import com.afc.reels_run.databinding.ActivityMessengerBinding
import com.afc.reels_run.utils.showMessage
import com.afc.reels_run.utils.startStdActivity
import com.afc.reels_run.utils.visible
import java.util.ArrayDeque

class MessengerActivity : AppCompatActivity() {
    private var idDeque: ArrayDeque<Int> = ArrayDeque()
    private var flag: Boolean = true
    private lateinit var binding: ActivityMessengerBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMessengerBinding.inflate(layoutInflater)
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

        /*idDeque.add(R.id.itemMessengerMenu)
        binding.bnvActivityMessenger.menu.findItem(R.id.itemMessengerMenu).isChecked = true*/

        // Установка badges
        //badgeSetup(R.id.itemMessengerMenu,100)
    }

    /*@Deprecated("Deprecated in Java")
    override fun onBackPressed() {
        idDeque.pop()

        if(!idDeque.isEmpty()){
            loadActivity(getActivity(idDeque.peek()!!))
        }else{
            finish()
        }
    }*/

    private fun <A : Activity> loadActivity(activity: Class<A>?){
        if(activity != null){
            startStdActivity(activity)
            overridePendingTransition(0,0)
        }
    }

    private fun getActivity(menuId: Int): Class<out Activity>? {
        binding.pbActivityMessenger.visible(true)
        binding.bnvActivityMessenger.menu.findItem(menuId).isChecked = true

        when(menuId){
            /*R.id.itemMessengerMenu -> {
                return null
            }*/

            R.id.itemGameMenu -> {
                return GameActivity::class.java
            }

            /*R.id.itemCreatorMenu -> {
                return CreatorActivity::class.java
            }*/

            R.id.itemMapMenu -> {
                return HomeActivity::class.java
            }

            R.id.itemProfileMenu -> {
                return ProfileActivity::class.java
            }
        }

        return null
    }

    private fun setupBottomNavigationView(){
        binding.bnvActivityMessenger.setOnItemSelectedListener {
            if(idDeque.contains(it.itemId)){
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

            idDeque.push(it.itemId)
            loadActivity(getActivity(it.itemId))

            false
        }
    }

    private fun badgeSetup(id: Int, alerts: Int) {
        val badge = binding.bnvActivityMessenger.getOrCreateBadge(id)
        badge.isVisible = true
        badge.number = alerts
    }

    private fun badgeClear(id: Int) {
        val badgeDrawable = binding.bnvActivityMessenger.getBadge(id)
        if (badgeDrawable != null) {
            badgeDrawable.isVisible = false
            badgeDrawable.clearNumber()
        }
    }
}