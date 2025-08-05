package com.afc.reels_run.containers.creator.fragments

import android.Manifest
import android.annotation.SuppressLint
import android.app.Activity
import android.content.ContentValues
import android.content.Intent
import android.content.pm.PackageManager
import android.database.Cursor
import android.net.Uri
import android.os.Bundle
import android.provider.MediaStore
import android.util.Log
import android.view.LayoutInflater
import android.view.ViewGroup
import com.google.gson.Gson
import com.afc.reels_run.R
import com.afc.reels_run.containers.base.BaseFragment
import com.afc.reels_run.containers.creator.models.CreatorViewModel
import com.afc.reels_run.databinding.FragmentCreatorBinding
import com.afc.reels_run.models.CountTestMarkModel
import com.afc.reels_run.models.creator.MarkIdModel
import com.afc.reels_run.models.creator.MarkInfoModel
import com.afc.reels_run.models.error.ErrorModel
import com.afc.reels_run.models.user.UserCoordsModel
import com.afc.reels_run.network.Resource
import com.afc.reels_run.network.apis.CreatorApi
import com.afc.reels_run.repositories.CreatorRepository
import com.afc.reels_run.utils.handleApiError
import com.afc.reels_run.utils.handleErrorMessage
import com.afc.reels_run.utils.handleSuccessMessage
import com.afc.reels_run.utils.hideKeyboard
import com.afc.reels_run.utils.visible
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.runBlocking
import java.util.UUID

/**
 * Фрагмент для загрузки точек, которые можно использовать для контента
 */
class CreatorFragment :
    BaseFragment<CreatorViewModel, FragmentCreatorBinding, CreatorRepository>() {
    private var imageUri: Uri? = null

    companion object {
        const val PERMISSION_CODE = 1000
        const val IMAGE_CAPTURE_CODE = 1001
    }

    /**
     * Метод для получения полного пути к файлу через Uri
     */
    private fun getRealPathFromURI(uri: Uri?): String? {
        val projection = arrayOf(MediaStore.Images.Media.DATA)
        val cursor: Cursor? =
            requireActivity().contentResolver.query(uri!!, projection, null, null, null)
        val columnIndex = cursor?.getColumnIndexOrThrow(MediaStore.Images.Media.DATA)
        cursor?.moveToFirst()
        val path = cursor?.getString(columnIndex!!)
        cursor?.close()

        return path
    }

    @SuppressLint("SetTextI18n")
    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)

        binding.pickImage.setOnClickListener {
            openCameraWrapper()
        }

        binding.crossIcon.setOnClickListener {
            binding.preview.setImageResource(R.drawable.ic_user_icon_default)
        }

        binding.refreshIcon.setOnClickListener {
            openCameraWrapper()
        }

        binding.addMark.setOnClickListener {
            markAddInfo()
        }

        viewModel.markAddInfoResponse.observe(viewLifecycleOwner) {
            binding.fcProgressBar.visible(it is Resource.Loading)
            hideKeyboard()

            when (it) {
                // Обработка успешного сетевого взаимодействия
                is Resource.Success -> {
                    if (it.value.isSuccessful) {
                        val body =
                            Gson().fromJson(it.value.body()!!.string(), MarkIdModel::class.java)
                        if (body != null) {
                            val path = getRealPathFromURI(imageUri)
                            if (path == null) {
                                // Удаление предыдущей информации о метке
                                viewModel.markDeleteInfo(MarkIdModel(id = body.id!!))

                                handleErrorMessage(
                                    "Изображения не найдено! Убедитесь, что установлено " +
                                            "разрешение для приложения на доступ к внешнему хранилищу"
                                )
                            } else {
                                viewModel.markAddImg(body.id!!, filepath = path)
                            }
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
                    handleApiError(it) { markAddInfo() }
                }

                else -> {}
            }
        }

        viewModel.markAddImgResponse.observe(viewLifecycleOwner) {
            binding.fcProgressBar.visible(it is Resource.Loading)
            hideKeyboard()

            when (it) {
                // Обработка успешного сетевого взаимодействия
                is Resource.Success -> {
                    if (it.value.isSuccessful) {
                        handleSuccessMessage("Метка успешно добавлена!")

                        val body = Gson().fromJson(runBlocking {
                            testMarkPreferences.count.first()
                        }, CountTestMarkModel::class.java)

                        if(body == null){
                            runBlocking {
                                testMarkPreferences.saveCount(Gson().toJson(CountTestMarkModel(count = 1)))
                            }
                        }else {
                            body.count++
                            runBlocking {
                                testMarkPreferences.saveCount(Gson().toJson(body))
                            }
                        }

                    } else {
                        handleErrorMessage(
                            Gson().fromJson(
                                it.value.errorBody()?.string().toString(), ErrorModel::class.java
                            ).message!!
                        )
                    }
                }

                // Обработка ошибок связанные с сетью
                is Resource.Failure -> {
                    Log.w("HTTP", it.toString())
                    handleApiError(it) { markAddInfo() }
                }

                else -> {}
            }
        }

        val strCoords = runBlocking {
            coordsPreferences.coords.first()
        }

        if (strCoords == null) {
            handleErrorMessage(
                "Невозможно прочитать координаты устройства. Пожалуйста, " + "проверьте разрешение на использование геолокации устройства и повторите попытку"
            )
        } else {
            val coords = Gson().fromJson(strCoords, UserCoordsModel::class.java)
            binding.coordMark.setText("${coords.lat.toString()};${coords.lng.toString()}")
        }

    }

    /**
     * Метод получения ViewModel текущего фрагмента
     */
    override fun getViewModel() = CreatorViewModel::class.java

    /**
     * Метод получения экземпляра фрагмента
     */
    override fun getFragmentBinding(
        inflater: LayoutInflater, container: ViewGroup?
    ) = FragmentCreatorBinding.inflate(inflater, container, false)

    /**
     * Метод получения репозитория данного фрагмента
     */
    override fun getFragmentRepository() = CreatorRepository(
        remoteDataSource.buildApi(
            CreatorApi::class.java, userPreferences, cookiePreferences, true
        )
    )

    /**
     * Обёртка над функцией открытия камеры телефона
     */
    private fun openCameraWrapper() {
        if ((requireActivity().checkSelfPermission(Manifest.permission.CAMERA) == PackageManager.PERMISSION_DENIED) || (requireActivity().checkSelfPermission(
                Manifest.permission.WRITE_EXTERNAL_STORAGE
            ) == PackageManager.PERMISSION_DENIED)
        ) {
            // Ситуация, когда доступа к камере и записи во внешнее хранилище нет
            val permission = arrayOf(
                Manifest.permission.CAMERA, Manifest.permission.WRITE_EXTERNAL_STORAGE
            )
            requestPermissions(permission, PERMISSION_CODE)
        } else {
            // Обратная ситуация
            openCamera()
        }
    }

    /**
     * Метод для открытия камеры мобильного устройства
     * и съёмки фотографии
     */
    private fun openCamera() {
        val values = ContentValues()
        values.put(MediaStore.Images.Media.TITLE, UUID.randomUUID().toString())
        // values.put(MediaStore.Images.Media.DESCRIPTION, "From the camera")

        imageUri = requireActivity().contentResolver.insert(
            MediaStore.Images.Media.EXTERNAL_CONTENT_URI, values
        )
        val cameraIntent = Intent(MediaStore.ACTION_IMAGE_CAPTURE)
        cameraIntent.putExtra(MediaStore.EXTRA_OUTPUT, imageUri)

        startActivityForResult(cameraIntent, IMAGE_CAPTURE_CODE)
    }

    /**
     * Обработка согласия на работу с камерой мобильного устройства
     */
    override fun onRequestPermissionsResult(
        requestCode: Int, permissions: Array<out String>, grantResults: IntArray
    ) {
        // Сравнение результирующего кода
        when (requestCode) {
            PERMISSION_CODE -> {
                // Если массив грантовых правил не пуст и первый элемент в нём PERMISSION_GRANTED
                if (grantResults.isNotEmpty() && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                    // то, открываем камеру мобильного устройства
                    openCamera()
                } else {
                    // иначе возвращаем ошибку
                    handleErrorMessage(
                        "Для продолжения работы необходимо " + "разрешение на использование камеры устройства"
                    )
                }
            }
        }

        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        if (resultCode == Activity.RESULT_OK) {
            binding.preview.setImageURI(imageUri)
        }
        super.onActivityResult(requestCode, resultCode, data)
    }

    /**
     * Метод для загрузки информации о метке
     */
    private fun markAddInfo() {
        val body = Gson().fromJson(runBlocking {
            testMarkPreferences.count.first()
        }, CountTestMarkModel::class.java)

        if((body != null) && (body.count >= 10)){
            handleErrorMessage("Вы уже создали 10 меток")
            return
        }

        val title = binding.nameMark.text.toString()
        val description = binding.descriptionMark.text.toString()

        if (imageUri == null) {
            handleErrorMessage(
                "Нельзя добавить метку без изображения. Пожалуйста, сфотографируйте" + " местность, в которой расположена метка"
            )
            return
        }

        if (title.length < 3) {
            handleErrorMessage("Название метки должно состоять из 3 и более символов")
            return
        }

        if (description.length < 3) {
            handleErrorMessage("Описание метки должно состоять из 3 и более символов")
            return
        }

        val strCoords = runBlocking {
            coordsPreferences.coords.first()
        }

        if (strCoords == null) {
            handleErrorMessage(
                "Невозможно прочитать координаты устройства. Пожалуйста, " + "проверьте разрешение на использование геолокации устройства и повторите попытку"
            )
            return
        }

        val coords = Gson().fromJson(strCoords, UserCoordsModel::class.java)

        viewModel.markAddInfo(
            MarkInfoModel(
                title = title, description = description, lat = coords.lat, lng = coords.lng
            )
        )
    }
}