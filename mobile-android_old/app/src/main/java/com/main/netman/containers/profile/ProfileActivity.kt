package com.main.netman.containers.profile

import android.Manifest
import android.app.Activity
import android.content.Context
import android.content.pm.PackageManager
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.preferencesDataStore
import com.main.netman.R
import com.main.netman.constants.data.store.user.UserStoreConstants
import com.main.netman.containers.creator.CreatorActivity
import com.main.netman.containers.creator.fragments.CreatorFragment
import com.main.netman.containers.game.GameActivity
import com.main.netman.containers.home.HomeActivity
import com.main.netman.containers.messenger.MessengerActivity
import com.main.netman.databinding.ActivityHomeBinding
import com.main.netman.databinding.ActivityProfileBinding
import com.main.netman.store.CoordsPreferences
import com.main.netman.utils.handleWarningMessage
import com.main.netman.utils.showMessage
import com.main.netman.utils.startNewActivity
import com.main.netman.utils.startStdActivity
import com.main.netman.utils.visible
import java.util.ArrayDeque
import kotlin.system.exitProcess

class ProfileActivity : AppCompatActivity() {
    private var idDeque: ArrayDeque<Int> = ArrayDeque()
    private var flag: Boolean = true
    private lateinit var binding: ActivityProfileBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityProfileBinding.inflate(layoutInflater)
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

        idDeque.add(R.id.itemProfileMenu)
        binding.bnvActivityProfile.menu.findItem(R.id.itemProfileMenu).isChecked = true

        // Установка badges
        // badgeSetup(R.id.itemMessengerMenu,100)

        if ((checkSelfPermission(Manifest.permission.CAMERA) == PackageManager.PERMISSION_DENIED) || (checkSelfPermission(
                Manifest.permission.WRITE_EXTERNAL_STORAGE
            ) == PackageManager.PERMISSION_DENIED)
        ) {
            // Ситуация, когда доступа к камере и записи во внешнее хранилище нет
            val permission = arrayOf(
                Manifest.permission.CAMERA, Manifest.permission.WRITE_EXTERNAL_STORAGE
            )
            requestPermissions(permission, CreatorFragment.PERMISSION_CODE)
        }
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
        if (menuId != R.id.itemProfileMenu) {
            binding.pbActivityProfile.visible(true)
            binding.bnvActivityProfile.menu.findItem(menuId).isChecked = true
        } else {
            return null
        }

        when (menuId) {
            R.id.itemGameMenu -> {
                return GameActivity::class.java
            }

            R.id.itemMapMenu -> {
                return HomeActivity::class.java
            }
        }

        return null
    }

    private fun setupBottomNavigationView() {
        binding.bnvActivityProfile.setOnItemSelectedListener {
            /*if (idDeque.contains(it.itemId)) {
                if (it.itemId == R.id.itemMapMenu) {
                    if (idDeque.size != 1) {
                        if (flag) {
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
        val badge = binding.bnvActivityProfile.getOrCreateBadge(id)
        badge.isVisible = true
        badge.number = alerts
    }

    private fun badgeClear(id: Int) {
        val badgeDrawable = binding.bnvActivityProfile.getBadge(id)
        if (badgeDrawable != null) {
            badgeDrawable.isVisible = false
            badgeDrawable.clearNumber()
        }
    }

    /**
     * Обработка согласия на работу с камерой мобильного устройства
     */
    override fun onRequestPermissionsResult(
        requestCode: Int, permissions: Array<out String>, grantResults: IntArray
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
    }
}