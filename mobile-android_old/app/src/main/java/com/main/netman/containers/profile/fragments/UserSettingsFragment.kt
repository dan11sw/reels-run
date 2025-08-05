package com.main.netman.containers.profile.fragments

import android.os.Bundle
import android.view.LayoutInflater
import android.view.ViewGroup
import com.main.netman.R
import com.main.netman.containers.auth.models.AuthViewModel
import com.main.netman.containers.base.BaseFragment
import com.main.netman.containers.home.models.MapViewModel
import com.main.netman.containers.profile.models.PlayerViewModel
import com.main.netman.databinding.FragmentUserSettingsBinding
import com.main.netman.network.apis.AuthApi
import com.main.netman.network.apis.PlayerApi
import com.main.netman.repositories.AuthRepository
import com.main.netman.repositories.MapRepository
import com.main.netman.repositories.PlayerRepository
import com.main.netman.utils.navigation

class UserSettingsFragment : BaseFragment<PlayerViewModel, FragmentUserSettingsBinding, PlayerRepository>() {

    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)

        binding.usToolbar.setNavigationOnClickListener {
            navigation(R.id.action_userSettingsFragment_to_userProfileFragment)
        }

        binding.usAccountText.setOnClickListener {
            navigation(R.id.action_userSettingsFragment_to_profileSettingsFragment)
        }

        binding.usExitText.setOnClickListener {
            logout()
        }
    }

    /**
     * Метод получения ViewModel текущего фрагмента
     */
    override fun getViewModel() = PlayerViewModel::class.java

    /**
     * Метод получения экземпляра фрагмента
     */
    override fun getFragmentBinding(
        inflater: LayoutInflater,
        container: ViewGroup?
    ) = FragmentUserSettingsBinding.inflate(inflater, container, false)

    /**
     * Метод получения репозитория данного фрагмента
     */
    override fun getFragmentRepository() =
        PlayerRepository(remoteDataSource.buildApi(PlayerApi::class.java, userPreferences, cookiePreferences))

}