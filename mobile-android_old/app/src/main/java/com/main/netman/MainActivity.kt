@file:Suppress("unused")

package com.main.netman

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import com.google.gson.Gson
import com.main.netman.containers.auth.AuthActivity
import com.main.netman.containers.home.HomeActivity
import com.main.netman.databinding.ActivityMainBinding
import com.main.netman.models.auth.AuthModel
import com.main.netman.store.UserPreferences
import com.main.netman.store.userDataStore
import com.main.netman.utils.startNewActivity
import com.mapbox.android.core.location.*
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.runBlocking

/**
 * Основная активность. Точка входа в мобильное приложение
 */
class MainActivity : AppCompatActivity() {
    // Переменная для связки с данными текущей активности
    private lateinit var binding: ActivityMainBinding
    private lateinit var userPreferences: UserPreferences

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)
        userPreferences = UserPreferences(userDataStore)

        val data = Gson().fromJson(runBlocking {
            userPreferences.auth.first()
        }, AuthModel::class.java)

        if (data?.accessToken == null){
            startNewActivity(AuthActivity::class.java)
        }else{
            startNewActivity(HomeActivity::class.java)
        }
    }
}