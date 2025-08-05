package com.main.netman.containers.media.quest

import android.app.Activity
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.main.netman.R
import com.main.netman.containers.game.GameActivity
import com.main.netman.containers.home.HomeActivity
import com.main.netman.containers.profile.ProfileActivity
import com.main.netman.databinding.ActivityImageQuestBinding
import com.main.netman.utils.startStdActivity
import com.main.netman.utils.visible

/**
 * Activity for load user's image
 */
class ImageQuestActivity : AppCompatActivity() {
    // Bind with generation view
    private lateinit var binding: ActivityImageQuestBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        binding = ActivityImageQuestBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // Init bottom navigation view
        setupBottomNavigationView()

        // Checked item map
        binding.bnvActivityImageQuest.menu.findItem(R.id.itemMapMenu).isChecked = true
    }

    @Deprecated("Deprecated in Java")
    override fun onBackPressed() {
        super.onBackPressed()
        startStdActivity(HomeActivity::class.java)
    }

    private fun <A : Activity> loadActivity(activity: Class<A>?) {
        if (activity != null) {
            startStdActivity(activity)
            overridePendingTransition(0, 0)
        }
    }

    private fun getActivity(menuId: Int): Class<out Activity>? {
        if (menuId != R.id.itemMapMenu) {
            binding.pbActivityImageQuest.visible(true)
            binding.bnvActivityImageQuest.menu.findItem(menuId).isChecked = true
        } else {
            return null
        }

        // Маршрутизация
        when (menuId) {
            R.id.itemProfileMenu -> {
                return ProfileActivity::class.java
            }

            R.id.itemGameMenu -> {
                return GameActivity::class.java
            }
        }

        return null
    }

    private fun setupBottomNavigationView() {
        binding.bnvActivityImageQuest.setOnItemSelectedListener {
            loadActivity(getActivity(it.itemId))
            false
        }
    }
}