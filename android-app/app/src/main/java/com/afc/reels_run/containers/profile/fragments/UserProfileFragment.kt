package com.afc.reels_run.containers.profile.fragments

import android.annotation.SuppressLint
import android.net.Uri
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import com.canhub.cropper.CropImage
import com.canhub.cropper.CropImageContract
import com.canhub.cropper.CropImageContractOptions
import com.canhub.cropper.CropImageOptions
import com.canhub.cropper.CropImageView
import com.google.gson.Gson
import com.afc.reels_run.R
import com.afc.reels_run.containers.base.BaseFragment
import com.afc.reels_run.containers.profile.models.PlayerViewModel
import com.afc.reels_run.databinding.FragmentUserProfileBinding
import com.afc.reels_run.models.UrlModel
import com.afc.reels_run.models.error.ErrorModel
import com.afc.reels_run.models.user.UserInfoModel
import com.afc.reels_run.network.Resource
import com.afc.reels_run.network.apis.PlayerApi
import com.afc.reels_run.repositories.PlayerRepository
import com.afc.reels_run.utils.handleApiError
import com.afc.reels_run.utils.handleErrorMessage
import com.afc.reels_run.utils.handleWarningMessage
import com.afc.reels_run.utils.hideKeyboard
import com.afc.reels_run.utils.navigation
import com.afc.reels_run.utils.visible
import com.squareup.picasso.Picasso
import kotlinx.coroutines.runBlocking

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