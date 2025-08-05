package com.afc.reels_run.containers.profile.fragments

import android.os.Bundle
import android.view.LayoutInflater
import android.view.ViewGroup
import com.afc.reels_run.R
import com.afc.reels_run.containers.base.BaseFragment
import com.afc.reels_run.containers.profile.models.PlayerViewModel
import com.afc.reels_run.databinding.FragmentUserSettingsBinding
import com.afc.reels_run.network.apis.PlayerApi
import com.afc.reels_run.repositories.PlayerRepository
import com.afc.reels_run.utils.navigation

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