package com.afc.reels_run

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import com.google.gson.Gson
import com.afc.reels_run.containers.auth.AuthActivity
import com.afc.reels_run.containers.home.HomeActivity
import com.afc.reels_run.databinding.ActivityMainBinding
import com.afc.reels_run.models.auth.AuthModel
import com.afc.reels_run.store.UserPreferences
import com.afc.reels_run.store.userDataStore
import com.afc.reels_run.utils.startNewActivity
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