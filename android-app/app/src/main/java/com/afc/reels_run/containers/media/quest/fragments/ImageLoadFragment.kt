package com.afc.reels_run.containers.media.quest.fragments

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
import android.view.LayoutInflater
import android.view.ViewGroup
import com.afc.reels_run.containers.base.BaseFragment
import com.afc.reels_run.containers.creator.fragments.CreatorFragment
import com.afc.reels_run.containers.home.HomeActivity
import com.afc.reels_run.containers.media.quest.models.ImageQuestViewModel
import com.afc.reels_run.databinding.FragmentImageLoadBinding
import com.afc.reels_run.network.apis.PlayerApi
import com.afc.reels_run.repositories.ImageQuestRepository
import com.afc.reels_run.utils.handleErrorMessage
import com.afc.reels_run.utils.startStdActivity
import java.util.UUID

class ImageLoadFragment :
    BaseFragment<ImageQuestViewModel, FragmentImageLoadBinding, ImageQuestRepository>() {

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

        binding.btnCancel.setOnClickListener {
            requireActivity().startStdActivity(HomeActivity::class.java)
        }

        binding.btnPickImage.setOnClickListener {
            openCameraWrapper()
        }

        binding.btnRequest.setOnClickListener {

        }
    }

    // Получение ViewModel текущего фрагмента
    override fun getViewModel() = ImageQuestViewModel::class.java

    // Получение экземпляра фрагмента
    override fun getFragmentBinding(
        inflater: LayoutInflater, container: ViewGroup?
    ) = FragmentImageLoadBinding.inflate(inflater, container, false)

    // Получение репозитория
    override fun getFragmentRepository() = ImageQuestRepository(
        remoteDataSource.buildApi(
            PlayerApi::class.java,
            userPreferences,
            cookiePreferences
        )
    )

    /**
     * Обёртка над функцией открытия камеры телефона
     */
    private fun openCameraWrapper() {
        if ((requireActivity().checkSelfPermission(Manifest.permission.CAMERA) == PackageManager.PERMISSION_DENIED) ||
            (requireActivity().checkSelfPermission(Manifest.permission.WRITE_EXTERNAL_STORAGE) == PackageManager.PERMISSION_DENIED)
        ) {
            // Ситуация, когда доступа к камере и записи во внешнее хранилище нет
            val permission = arrayOf(
                Manifest.permission.CAMERA, Manifest.permission.WRITE_EXTERNAL_STORAGE
            )

            requestPermissions(permission, CreatorFragment.PERMISSION_CODE)
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

        startActivityForResult(cameraIntent, CreatorFragment.IMAGE_CAPTURE_CODE)
    }

    /**
     * Обработка согласия на работу с камерой мобильного устройства
     */
    @Deprecated("Deprecated in Java")
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

    @Deprecated("Deprecated in Java")
    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        if (resultCode == Activity.RESULT_OK) {
            binding.image.setImageURI(imageUri)
        }
        super.onActivityResult(requestCode, resultCode, data)
    }
}