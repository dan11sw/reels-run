package com.main.netman.containers.auth

import android.Manifest
import android.content.pm.PackageManager
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import androidx.navigation.findNavController
import com.main.netman.MainActivity
import com.main.netman.R
import com.main.netman.containers.creator.fragments.CreatorFragment
import com.main.netman.databinding.ActivityAuthBinding
import com.main.netman.utils.LocationPermissionHelper
import com.main.netman.utils.handleErrorMessage
import com.main.netman.utils.handleMessage
import com.main.netman.utils.handleWarningMessage
import com.main.netman.utils.startNewActivity
import com.mapbox.maps.extension.style.expressions.dsl.generated.any
import java.lang.ref.WeakReference
import kotlin.system.exitProcess

/**
 * Главная активность механизма авторизации пользователя
 */
class AuthActivity : AppCompatActivity() {
    private lateinit var locationPermissionHelper: LocationPermissionHelper
    private lateinit var binding: ActivityAuthBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        binding = ActivityAuthBinding.inflate(layoutInflater)
        setContentView(binding.root)
        locationPermissionHelper = LocationPermissionHelper(WeakReference(this))
        locationPermissionHelper.check()

        // Обработка получения сообщения из других активностей (или фрагментов)
        if(intent.getStringExtra("message") != null){
            if(intent.getStringExtra("type") != null){
                when(intent.getStringExtra("type").toString()){
                    "error" -> {
                        handleErrorMessage(binding.root, intent.getStringExtra("message").toString())
                    }
                    "warning" -> {
                        handleWarningMessage(binding.root, intent.getStringExtra("message").toString())
                    }
                    else -> {
                        handleMessage(binding.root, intent.getStringExtra("message").toString())
                    }
                }
            }else{
                handleMessage(binding.root, intent.getStringExtra("message").toString())
            }
        }
    }

    @Deprecated("Deprecated in Java")
    override fun onBackPressed() {
        when(binding.fragmentContainerView.findNavController().currentDestination?.id){
            R.id.signInFragment -> {
                // Обработка завершения работы Android-приложения
                finish()
                exitProcess(0)
            }
            R.id.signUpFragment -> {
                binding.fragmentContainerView.findNavController().navigate(R.id.action_signUpFragment_to_signInFragment)
            }
            else -> {
                startNewActivity(MainActivity::class.java)
            }
        }
    }
}