package com.afc.reels_run.containers.creator

import android.app.Activity
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.afc.reels_run.R
import com.afc.reels_run.containers.game.GameActivity
import com.afc.reels_run.containers.home.HomeActivity
import com.afc.reels_run.containers.profile.ProfileActivity
import com.afc.reels_run.databinding.ActivityCreatorBinding
import com.afc.reels_run.utils.showMessage
import com.afc.reels_run.utils.startStdActivity
import com.afc.reels_run.utils.visible
import java.util.ArrayDeque


class CreatorActivity : AppCompatActivity() {
    private var idDeque: ArrayDeque<Int> = ArrayDeque()
    private var flag: Boolean = true
    private lateinit var binding: ActivityCreatorBinding

    /*private var imageUri: Uri? = null

    companion object {
        const val PERMISSION_CODE = 1000
        const val IMAGE_CAPTURE_CODE = 1001
    }*/

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityCreatorBinding.inflate(layoutInflater)
        setContentView(binding.root)

        showMessage(binding.root)

        // Инициализация BottomNavigationView
        setupBottomNavigationView()
        // Имитация загрузки страницы
        /*binding.fcvActivityHome.addOnLayoutChangeListener { _, _, _, _, _, _, _, _, _ ->
            binding.pbActivityHome.visible(
                false
            )
        }*/

        idDeque.add(R.id.itemGameMenu)
        // Если используется, то R.id.itemCreatorMenu, вместо текущего
        binding.bnvActivityCreator.menu.findItem(R.id.itemProfileMenu).isChecked = true

        // Установка badges
        // badgeSetup(R.id.itemMessengerMenu, 100)

        /*binding.pickImage.setOnClickListener {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                if ((checkSelfPermission(Manifest.permission.CAMERA)
                            == PackageManager.PERMISSION_DENIED) ||
                    (checkSelfPermission(Manifest.permission.WRITE_EXTERNAL_STORAGE)
                            == PackageManager.PERMISSION_DENIED)
                ) {
                    // Ситуация, когда доступа к камере и записи во внешнее хранилище нет
                    var permission = arrayOf(
                        Manifest.permission.CAMERA,
                        Manifest.permission.WRITE_EXTERNAL_STORAGE
                    )
                    requestPermissions(permission, PERMISSION_CODE)
                } else {
                    // Обратная ситуация
                    openCamera()
                }
            } else {
                openCamera()
            }
        }*/
    }

    /*@Deprecated("Deprecated in Java")
    override fun onBackPressed() {
        idDeque.pop()

        if (!idDeque.isEmpty()) {
            loadActivity(getActivity(idDeque.peek()!!))
        } else {
            finish()
        }
    }*/

    private fun <A : Activity> loadActivity(activity: Class<A>?) {
        if (activity != null) {
            startStdActivity(activity)
            overridePendingTransition(0, 0)
        }
    }

    private fun getActivity(menuId: Int): Class<out Activity>? {
        binding.pbActivityCreator.visible(true)
        binding.bnvActivityCreator.menu.findItem(menuId).isChecked = true

        when (menuId) {
            /*
            R.id.itemMessengerMenu -> {
                return MessengerActivity::class.java
            }
             */

            R.id.itemGameMenu -> {
                return GameActivity::class.java
            }

            /*R.id.itemCreatorMenu -> {
                return null
            }*/

            R.id.itemMapMenu -> {
                return HomeActivity::class.java
            }

            R.id.itemProfileMenu -> {
                return ProfileActivity::class.java
            }
        }

        return null
    }

    private fun setupBottomNavigationView() {
        binding.bnvActivityCreator.setOnItemSelectedListener {
            if (idDeque.contains(it.itemId)) {
                if (it.itemId == R.id.itemMapMenu) {
                    if (idDeque.size != 1) {
                        if (flag) {
                            idDeque.addFirst(R.id.itemMapMenu)
                            flag = false
                        }
                    }
                }

                // Чтобы сохранять всю историю переходов нужно закомментировать данную строку
                idDeque.remove(it.itemId)
            }

            idDeque.push(it.itemId)
            loadActivity(getActivity(it.itemId))

            false
        }
    }

    private fun badgeSetup(id: Int, alerts: Int) {
        val badge = binding.bnvActivityCreator.getOrCreateBadge(id)
        badge.isVisible = true
        badge.number = alerts
    }

    private fun badgeClear(id: Int) {
        val badgeDrawable = binding.bnvActivityCreator.getBadge(id)
        if (badgeDrawable != null) {
            badgeDrawable.isVisible = false
            badgeDrawable.clearNumber()
        }
    }

    /**
     * Метод для открытия камеры мобильного устройства
     * и съёмки фотографии
     */
    /*private fun openCamera() {
        val values = ContentValues()
        values.put(MediaStore.Images.Media.TITLE, UUID.randomUUID().toString())
        // values.put(MediaStore.Images.Media.DESCRIPTION, "From the camera")

        imageUri = contentResolver.insert(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, values)
        val cameraIntent = Intent(MediaStore.ACTION_IMAGE_CAPTURE)
        cameraIntent.putExtra(MediaStore.EXTRA_OUTPUT, imageUri)

        startActivityForResult(cameraIntent, IMAGE_CAPTURE_CODE)
    }*/

    /**
     * Обработка согласия на работу с камерой мобильного устройства
     */
    /*override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<out String>,
        grantResults: IntArray
    ) {
        // Сравнение результирующего кода
        when (requestCode) {
            PERMISSION_CODE -> {
                // Если массив грантовых правил не пуст и первый элемент в нём PERMISSION_GRANTED
                if (grantResults.isNotEmpty() && grantResults[0] ==
                    PackageManager.PERMISSION_GRANTED
                ) {
                    // то, открываем камеру мобильного устройства
                    openCamera()
                } else {
                    // иначе возвращаем ошибку
                    handleErrorMessage(binding.root, "Для продолжения работы необходимо " +
                            "разрешение на использование камеры устройства")
                }
            }
        }

        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
    }*/

    /*override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        if(resultCode == Activity.RESULT_OK){
            binding.preview.setImageURI(imageUri)
        }
        super.onActivityResult(requestCode, resultCode, data)
    }*/
}