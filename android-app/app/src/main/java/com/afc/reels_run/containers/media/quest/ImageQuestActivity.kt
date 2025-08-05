package com.afc.reels_run.containers.media.quest

import android.annotation.SuppressLint
import android.app.Activity
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.afc.reels_run.R
import com.afc.reels_run.containers.game.GameActivity
import com.afc.reels_run.containers.home.HomeActivity
import com.afc.reels_run.containers.profile.ProfileActivity
import com.afc.reels_run.databinding.ActivityImageQuestBinding
import com.afc.reels_run.utils.startStdActivity
import com.afc.reels_run.utils.visible

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