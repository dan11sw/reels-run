package com.main.netman.containers.home

import android.Manifest
import android.annotation.SuppressLint
import android.app.Activity
import android.content.Intent
import android.content.pm.PackageManager
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.Button
import androidx.core.app.ActivityCompat
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import com.google.android.material.dialog.MaterialAlertDialogBuilder
import com.google.android.material.snackbar.Snackbar
import com.google.gson.Gson
import com.main.netman.R
import com.main.netman.constants.game.ViewStatusConstants
import com.main.netman.constants.socket.SocketHandlerConstants
import com.main.netman.containers.game.GameActivity
import com.main.netman.containers.media.quest.ImageQuestActivity
import com.main.netman.containers.profile.ProfileActivity
import com.main.netman.databinding.ActivityHomeBinding
import com.main.netman.event.CurrentGameEvent
import com.main.netman.event.RemoveMarkEvent
import com.main.netman.event.UpdateSocketEvent
import com.main.netman.event.ViewMarkEvent
import com.main.netman.exec.exit.ExitAppActivity
import com.main.netman.models.auth.AuthModel
import com.main.netman.models.game.CurrentGameModel
import com.main.netman.models.game.GameQuestModel
import com.main.netman.network.handlers.SCSocketHandler
import com.main.netman.store.CurrentQuestPreferences
import com.main.netman.store.UserPreferences
import com.main.netman.store.currentQuestDataStore
import com.main.netman.store.userDataStore
import com.main.netman.utils.handleErrorMessage
import com.main.netman.utils.showMessage
import com.main.netman.utils.startStdActivity
import com.main.netman.utils.visible
import io.socket.client.Socket
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking
import kotlinx.coroutines.withContext
import org.greenrobot.eventbus.EventBus
import java.util.ArrayDeque
import kotlin.system.exitProcess

/**
 * Домашняя страница мобильного приложения (основная активность, которая связывает все остальные
 * фрагменты и активности между собой)
 */
class HomeActivity : AppCompatActivity() {
    // Очередь идентификаторов фрагментов или активностей, на которые нужно перейти
    private var idDeque: ArrayDeque<Int> = ArrayDeque()
    private var flag: Boolean = true
    private lateinit var binding: ActivityHomeBinding
    private lateinit var userPreferences: UserPreferences
    private lateinit var currentQuestPreferences: CurrentQuestPreferences
    private var socketConnectionJob: Job? = null

    // Socket
    private val _socket: MutableLiveData<Socket?> =
        MutableLiveData(SCSocketHandler.getInstance().getSocket())
    private val socket: LiveData<Socket?>
        get() = _socket

    // Информация о текущей игре (RAM Storage)
    private var currentGame: CurrentGameModel? = null

    @SuppressLint("SetTextI18n")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityHomeBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // Инициализация BottomNavigationView
        setupBottomNavigationView()

        // Имитация загрузки страницы
        /*binding.fcvActivityHome.addOnLayoutChangeListener { _, _, _, _, _, _, _, _, _ ->
            binding.pbActivityHome.visible(
                false
            )
        }*/

        idDeque.add(R.id.itemMapMenu)
        binding.bnvActivityHome.menu.findItem(R.id.itemMapMenu).isChecked = true

        // Установка badges
        // badgeSetup(R.id.itemMessengerMenu, 100)

        // Запрашивание разрешения для работы с файловым хранилищем
        // verifyStoragePermissions()

        // Инициализация локальных хранилищ
        userPreferences = UserPreferences(userDataStore)
        currentQuestPreferences = CurrentQuestPreferences(currentQuestDataStore)

        // Предварительная очистка всех данных о старом квесте (если таковой имеется)
        runBlocking {
            // currentQuestPreferences.clear()
        }

        val data = Gson().fromJson(runBlocking {
            userPreferences.auth.first()
        }, AuthModel::class.java)

        if (socket.value == null) {
            // Подключение к основному серверу
            socketConnectionJob = socketConnection()
        }

        binding.icArrow.setOnClickListener {
            // Поворот view элемента на 180 градусов
            binding.icArrow.rotation += 180f
            if (binding.descriptionScrollView.visibility == View.VISIBLE) {
                binding.descriptionScrollView.visibility = View.GONE
            } else {
                binding.descriptionScrollView.visibility = View.VISIBLE
            }
        }

        // Определение обработчиков для сокета после подключения
        socket.observe(this) {
            // Отправка на шину событий сообщения об обновлении данных подключения
            EventBus.getDefault().post(
                UpdateSocketEvent(SCSocketHandler.getInstance().getSocket())
            )

            if (it == null) {
                return@observe
            }

            // Обработка сообщения об отключении сокета
            it.on(SocketHandlerConstants.DISCONNECT) {
                CoroutineScope(Dispatchers.Main).launch {
                    binding.cardTask.visibility = View.GONE
                    binding.icCameraOn.visibility = View.GONE
                    binding.icCameraOff.visibility = View.GONE
                    binding.tvTaskDescription.text = ""

                    showMessage(binding.root, "Соединение с сервером потеряно", "error")

                    // Отключаем адаптер сокета явно
                    _socket.value = null

                    socketConnectionJob = socketConnection {
                        showMessage(binding.root, "Соединение с сервером восстановлено", "success")
                    }
                }
            }

            // Обработка сообщения об успешной авторизации пользователя
            if (it.hasListeners(SocketHandlerConstants.AUTH_SUCCESS)) {
                it.off(SocketHandlerConstants.AUTH_SUCCESS)
            }

            it.on(SocketHandlerConstants.AUTH_SUCCESS) { _ ->
                SCSocketHandler.getInstance().setAuth(true)
                it.emit(SocketHandlerConstants.STATUS)
            }

            // Обработка сообщения о новом игровом статусе
            if (it.hasListeners(SocketHandlerConstants.STATUS_ON)) {
                it.off(SocketHandlerConstants.STATUS_ON)
            }

            it.on(SocketHandlerConstants.STATUS_ON) { itLocal ->
                if (itLocal.isEmpty()) {
                    return@on
                }

                // Данные о статусе в виде строке
                val statusStr = itLocal.first() as String

                // Получение статуса игрока в текущий момент времени
                val status = Gson().fromJson(statusStr, GameQuestModel::class.java)

                // Запуск инструкций в UI-потоке
                runOnUiThread {
                    binding.cardTask.visibility = View.VISIBLE
                    binding.tvTaskDescription.text = status.task
                    binding.tvNumberQuest.text = "Задача"

                    binding.icCameraOn.visibility = View.GONE
                    binding.icCameraOff.visibility = View.GONE

                    binding.icArrow.rotation = 180f
                    binding.descriptionScrollView.visibility = View.VISIBLE

                    if (status.view == ViewStatusConstants.VISIBLE) {
                        binding.icCameraOn.visibility = View.VISIBLE

                        binding.tvNumberQuest.text = "Действие"
                        binding.tvTaskDescription.text = status.action

                        // Отправляем на шину данных информацию о текущем квесте для визуализации
                        EventBus.getDefault().post(
                            ViewMarkEvent(
                                questId = status.id,
                                mark = status.mark
                            )
                        )
                    }

                    // Сохранение данных о квесте в локальном хранилище
                    runBlocking {
                        currentQuestPreferences.saveData(statusStr)
                    }
                }
            }

            // Обработка сообщения "Отправь запрос на обновление статуса"
            if (it.hasListeners(SocketHandlerConstants.REPEAT_STATUS_REQUEST)) {
                it.off(SocketHandlerConstants.REPEAT_STATUS_REQUEST)
            }

            it.on(SocketHandlerConstants.REPEAT_STATUS_REQUEST) { _ ->
                it.emit(SocketHandlerConstants.STATUS)
            }

            // Обработка сообщения "Все квесты текущей игры завершены"
            if (it.hasListeners(SocketHandlerConstants.STATUS_COMPLETED)) {
                it.off(SocketHandlerConstants.STATUS_COMPLETED)
            }

            it.on(SocketHandlerConstants.STATUS_COMPLETED) { _ ->
                runOnUiThread {
                    binding.cardTask.visibility = View.GONE
                    binding.icCameraOn.visibility = View.GONE
                    binding.icCameraOff.visibility = View.GONE

                    binding.cardStatusSuccess.visibility = View.VISIBLE
                    binding.tvStatus.text = "Все квесты пройдены!"
                }
            }

            // Если пользователь не авторизован
            if (!SCSocketHandler.getInstance().getAuth()) {
                // Отправить запрос на авторизацию
                it.emit(SocketHandlerConstants.AUTH, Gson().toJson(data))
            }

            // Иначе - отправить запрос о получении статуса
            if (SCSocketHandler.getInstance().getAuth()) {
                it.emit(SocketHandlerConstants.STATUS)
            }
        }

        binding.icCameraOn.setOnClickListener {
            // Создание диалогового окна
            val dialogBuilder = MaterialAlertDialogBuilder(this)
            val viewDialog = layoutInflater.inflate(R.layout.dialog_captured_video, null)

            // Добавление view диалоговому окну
            dialogBuilder.setView(viewDialog)

            // Открытие диалогового окна
            val dialog: androidx.appcompat.app.AlertDialog? = dialogBuilder.show()

            // Обработка отмены выполнения квеста
            viewDialog.findViewById<Button>(R.id.cancel_captured_video)
                .setOnClickListener(View.OnClickListener {
                    dialog?.dismiss()
                })

            // Отправка результата на прохождение квеста
            viewDialog.findViewById<Button>(R.id.accept_captured_video)
                .setOnClickListener(View.OnClickListener {
                    /*startStdActivity(ImageQuestActivity::class.java)*/

                    val strQuest = runBlocking {
                        currentQuestPreferences.data.first()
                    }

                    if (strQuest == null) {
                        return@OnClickListener
                    }

                    val dataQuest = Gson().fromJson(strQuest, GameQuestModel::class.java)
                    socket.value?.emit(SocketHandlerConstants.FINISHED_QUEST, strQuest)

                    // Удаляем маркер текущего квеста
                    EventBus.getDefault().post(
                        RemoveMarkEvent(
                            questId = dataQuest.id,
                            mark = dataQuest.mark
                        )
                    )

                    showMessage(
                        binding.root,
                        "Вы успешно прошли квест!",
                        "success",
                        Snackbar.LENGTH_LONG
                    )

                    dialog?.dismiss()
                })
        }

        binding.icMoveIcon.setOnClickListener {
            showMessage(
                binding.root,
                "Изменение управления",
                "success",
                Snackbar.LENGTH_LONG
            )
        }
    }

    override fun onStop() {
        super.onStop()
    }

    override fun onDestroy() {
        super.onDestroy()

        // Остановка выполнения всех корутин и фоновых задач
        socketConnectionJob?.cancel()
    }

    private fun <A : Activity> loadActivity(activity: Class<A>?) {
        if (activity != null) {
            startStdActivity(activity)
            overridePendingTransition(0, 0)
        }
    }

    private fun getActivity(menuId: Int): Class<out Activity>? {
        if (menuId != R.id.itemMapMenu) {
            binding.pbActivityHome.visible(true)
            binding.bnvActivityHome.menu.findItem(menuId).isChecked = true
        } else {
            return null
        }

        // Маршрутизация
        when (menuId) {
            R.id.itemGameMenu -> {
                return GameActivity::class.java
            }

            R.id.itemProfileMenu -> {
                return ProfileActivity::class.java
            }
        }

        return null
    }

    private fun setupBottomNavigationView() {
        binding.bnvActivityHome.setOnItemSelectedListener {
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

    private fun verifyStoragePermissions() {
        val permission = ActivityCompat.checkSelfPermission(
            this, Manifest.permission.WRITE_EXTERNAL_STORAGE
        )

        if (permission != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(
                this,
                arrayOf(Manifest.permission.WRITE_EXTERNAL_STORAGE),
                REQUEST_EXTERNAL_STORAGE_CODE
            )
        }
    }

    private fun badgeSetup(id: Int, alerts: Int) {
        val badge = binding.bnvActivityHome.getOrCreateBadge(id)
        badge.isVisible = true
        badge.number = alerts
    }

    private fun badgeClear(id: Int) {
        val badgeDrawable = binding.bnvActivityHome.getBadge(id)
        if (badgeDrawable != null) {
            badgeDrawable.isVisible = false
            badgeDrawable.clearNumber()
        }
    }

    private fun socketConnection(cb: (() -> Unit)? = null) = CoroutineScope(Dispatchers.IO).launch {
        withContext(Dispatchers.Main) {
            _socket.value = null
        }

        SCSocketHandler.getInstance().setSocket(cb)
        SCSocketHandler.getInstance().connection()

        withContext(Dispatchers.Main) {
            _socket.value = SCSocketHandler.getInstance().getSocket()
        }
    }

    override fun onBackPressed() {
        super.onBackPressed()

        startActivity(Intent(applicationContext, ExitAppActivity::class.java).also {
            it.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
        })
    }

    companion object {
        const val REQUEST_EXTERNAL_STORAGE_CODE = 1
    }
}