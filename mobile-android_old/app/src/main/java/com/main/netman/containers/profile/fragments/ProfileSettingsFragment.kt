package com.main.netman.containers.profile.fragments

import android.os.Bundle
import android.text.Editable
import android.text.TextWatcher
import android.util.Log
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import com.google.gson.Gson
import com.main.netman.R
import com.main.netman.containers.auth.models.AuthViewModel
import com.main.netman.containers.base.BaseFragment
import com.main.netman.containers.home.models.MapViewModel
import com.main.netman.containers.profile.models.PlayerViewModel
import com.main.netman.databinding.FragmentProfileSettingsBinding
import com.main.netman.databinding.FragmentUserProfileBinding
import com.main.netman.models.error.ErrorModel
import com.main.netman.models.user.UserInfoModel
import com.main.netman.models.user.UserInfoUpdateModel
import com.main.netman.network.Resource
import com.main.netman.network.apis.AuthApi
import com.main.netman.network.apis.PlayerApi
import com.main.netman.repositories.AuthRepository
import com.main.netman.repositories.MapRepository
import com.main.netman.repositories.PlayerRepository
import com.main.netman.utils.handleApiError
import com.main.netman.utils.handleErrorMessage
import com.main.netman.utils.handleSuccessMessage
import com.main.netman.utils.hideKeyboard
import com.main.netman.utils.navigation
import com.main.netman.utils.visible

class ProfileSettingsFragment : BaseFragment<PlayerViewModel, FragmentProfileSettingsBinding, PlayerRepository>() {

    private var _isEditForm: Boolean = false

    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)

        binding.psToolbar.setNavigationOnClickListener {
            navigation(R.id.action_profileSettingsFragment_to_userSettingsFragment)
        }

        val textWatcher = object : TextWatcher {
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {
                // Никаких действий при предварительном изменении текста
            }

            /**
             * Обработка изменения текста
             */
            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
                if(!_isEditForm) {
                    binding.psPenIcon.setBackgroundResource(R.drawable.ic_pen)
                    binding.psPenIcon.setOnClickListener {
                        playerInfoUpdate()
                    }

                    _isEditForm = true
                }
            }
            override fun afterTextChanged(s: Editable?) {
                // Никаких действий после изменения текста
            }
        }

        viewModel.playerInfoResponse.observe(viewLifecycleOwner) {
            binding.fpsProgressBar.visible(it is Resource.Loading)
            hideKeyboard()

            when (it) {
                // Обработка успешного сетевого взаимодействия
                is Resource.Success -> {
                    if (it.value.isSuccessful) {
                        val body =
                            Gson().fromJson(it.value.body()!!.string(), UserInfoModel::class.java)

                        binding.psEmail.setText(body.email)
                        binding.psNickname.setText(body.nickname)

                        binding.psEmail.addTextChangedListener(textWatcher)
                        binding.psNickname.addTextChangedListener(textWatcher)

                    } else {
                        val error = Gson().fromJson(
                            it.value.errorBody()?.string().toString(), ErrorModel::class.java
                        )
                        handleErrorMessage(
                            if (error.errors != null && error.errors!!.isNotEmpty()) error.errors?.first()!!.msg
                            else error.message!!
                        )
                    }
                }

                // Обработка ошибок связанные с сетью
                is Resource.Failure -> {
                    handleApiError(it) { viewModel.playerInfo() }
                }

                else -> {}
            }
        }

        viewModel.playerInfoUpdateResponse.observe(viewLifecycleOwner) {
            binding.fpsProgressBar.visible(it is Resource.Loading)
            hideKeyboard()

            when (it) {
                // Обработка успешного сетевого взаимодействия
                is Resource.Success -> {
                    if (it.value.isSuccessful) {
                        handleSuccessMessage("Информация успешно обновлена!")

                        binding.psPenIcon.setBackgroundResource(R.drawable.ic_none_pen)
                        binding.psPenIcon.setOnClickListener(null)

                        _isEditForm = false
                    } else {
                        val error = Gson().fromJson(
                            it.value.errorBody()?.string().toString(), ErrorModel::class.java
                        )
                        handleErrorMessage(
                            if (error.errors != null && error.errors!!.isNotEmpty()) error.errors?.first()!!.msg
                            else error.message!!
                        )
                    }
                }

                // Обработка ошибок связанные с сетью
                is Resource.Failure -> {
                    handleApiError(it) { }
                }

                else -> {}
            }
        }

        // Получение данных о пользователе
        viewModel.playerInfo()
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
    ) = FragmentProfileSettingsBinding.inflate(inflater, container, false)

    /**
     * Метод получения репозитория данного фрагмента
     */
    override fun getFragmentRepository() =
        PlayerRepository(remoteDataSource.buildApi(PlayerApi::class.java, userPreferences, cookiePreferences))

    private fun playerInfoUpdate(){
        val nickname = binding.psNickname.text.toString()

        viewModel.playerInfoUpdate(
            UserInfoUpdateModel(
                nickname = nickname
            )
        )
    }
}