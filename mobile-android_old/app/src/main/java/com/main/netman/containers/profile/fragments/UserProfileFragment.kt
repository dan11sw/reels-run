package com.main.netman.containers.profile.fragments

import android.annotation.SuppressLint
import android.database.Cursor
import android.net.Uri
import android.os.Bundle
import android.provider.MediaStore
import android.util.Log
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import androidx.activity.result.contract.ActivityResultContracts
import androidx.core.widget.addTextChangedListener
import androidx.lifecycle.lifecycleScope
import com.canhub.cropper.CropImage
import com.canhub.cropper.CropImageContract
import com.canhub.cropper.CropImageContractOptions
import com.canhub.cropper.CropImageOptions
import com.canhub.cropper.CropImageView
import com.google.gson.Gson
import com.google.gson.JsonParser
import com.main.netman.MainActivity
import com.main.netman.R
import com.main.netman.containers.auth.models.AuthViewModel
import com.main.netman.containers.base.BaseFragment
import com.main.netman.containers.home.models.MapViewModel
import com.main.netman.containers.profile.models.PlayerViewModel
import com.main.netman.databinding.FragmentMapBinding
import com.main.netman.databinding.FragmentSignInBinding
import com.main.netman.databinding.FragmentUserProfileBinding
import com.main.netman.models.UrlModel
import com.main.netman.models.auth.AuthSignInModel
import com.main.netman.models.creator.MarkIdModel
import com.main.netman.models.error.ErrorModel
import com.main.netman.models.user.UserInfoModel
import com.main.netman.network.Resource
import com.main.netman.network.apis.AuthApi
import com.main.netman.network.apis.PlayerApi
import com.main.netman.repositories.AuthRepository
import com.main.netman.repositories.MapRepository
import com.main.netman.repositories.PlayerRepository
import com.main.netman.utils.enable
import com.main.netman.utils.handleApiError
import com.main.netman.utils.handleErrorMessage
import com.main.netman.utils.handleMessage
import com.main.netman.utils.handleWarningMessage
import com.main.netman.utils.hideKeyboard
import com.main.netman.utils.navigation
import com.main.netman.utils.startNewActivity
import com.main.netman.utils.visible
import com.squareup.picasso.Callback
import com.squareup.picasso.OkHttp3Downloader
import com.squareup.picasso.Picasso
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking
import okhttp3.OkHttpClient
import java.util.concurrent.TimeUnit

class UserProfileFragment : BaseFragment<PlayerViewModel, FragmentUserProfileBinding, PlayerRepository>() {
    private var outputUri: Uri? = null

    private val cropImage = registerForActivityResult(CropImageContract()) { result ->
        when {
            result.isSuccessful -> {
                val uriContent = result.uriContent
                val filepath = result.getUriFilePath(requireContext())
                viewModel.playerInfoImgUpdate(filepath!!)
                // binding.upUserIcon.setImageURI(uriContent)
            }
            result is CropImage.CancelledResult -> {
                handleWarningMessage("Загрузка изображения была отменена")
            }
            else -> {
                val exception = result.error
                handleErrorMessage(exception!!.message.toString())
            }
        }
    }

    @Deprecated("Deprecated in Java")
    @SuppressLint("SetTextI18n")
    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)

        binding.upSettingsIcon.setOnClickListener {
            navigation(R.id.action_userProfileFragment_to_userSettingsFragment)
        }

        viewModel.playerInfoResponse.observe(viewLifecycleOwner) {
            binding.fupProgressBar.visible(it is Resource.Loading)
            hideKeyboard()

            when (it) {
                // Обработка успешного сетевого взаимодействия
                is Resource.Success -> {
                    if (it.value.isSuccessful) {
                        val body =
                            Gson().fromJson(it.value.body()!!.string(), UserInfoModel::class.java)

                        binding.upNickname.text = body.nickname

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

        viewModel.playerInfoImgResponse.observe(viewLifecycleOwner) {
            binding.fupProgressBar.visible(it is Resource.Loading)
            hideKeyboard()

            when (it) {
                // Обработка успешного сетевого взаимодействия
                is Resource.Success -> {
                    if (it.value.isSuccessful) {
                        val body =
                            Gson().fromJson(it.value.body()!!.string(), UrlModel::class.java)
                        if(body.url.isNotEmpty()){
                            // Сохранение ссылки на изображение
                            runBlocking {
                                userPreferences.saveUserImage(body.url)
                            }

                            // Установка изображения
                            Picasso.get().load(body.url).into(binding.upUserIcon)
                        }
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

        viewModel.playerInfoImgUpdateResponse.observe(viewLifecycleOwner) {
            binding.fupProgressBar.visible(it is Resource.Loading)
            hideKeyboard()

            when (it) {
                // Обработка успешного сетевого взаимодействия
                is Resource.Success -> {
                    if (it.value.isSuccessful) {
                        val body =
                            Gson().fromJson(it.value.body()!!.string(), UrlModel::class.java)

                        if(body.url.isNotEmpty()){
                            // Сохранение ссылки на изображение
                            runBlocking {
                                userPreferences.saveUserImage(body.url)
                            }

                            // Установка изображения
                            Picasso.get().load(body.url).into(binding.upUserIcon)
                        }
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

        // Получение данных о пользователе
        viewModel.playerInfo()

        // Получение данных о изображении пользователя
        viewModel.playerInfoImg()

        binding.upUserIcon.setOnClickListener {
            startCameraWithUri(includeCamera = true, includeGallery = true)
        }
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
    }

    private fun startCameraWithUri(includeCamera: Boolean, includeGallery: Boolean){
        cropImage.launch(
            CropImageContractOptions(
                uri = outputUri,
                cropImageOptions = CropImageOptions(
                    imageSourceIncludeCamera = includeCamera,
                    imageSourceIncludeGallery = includeGallery,
                    cropShape = CropImageView.CropShape.OVAL,
                    aspectRatioX = 5,
                    aspectRatioY = 5,
                    fixAspectRatio = true,
                    guidelines = CropImageView.Guidelines.OFF,
                    noOutputImage = false,
                )
            )
        )
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
    ) = FragmentUserProfileBinding.inflate(inflater, container, false)

    /**
     * Метод получения репозитория данного фрагмента
     */
    override fun getFragmentRepository() =
        PlayerRepository(remoteDataSource.buildApi(PlayerApi::class.java, userPreferences, cookiePreferences,true))


}