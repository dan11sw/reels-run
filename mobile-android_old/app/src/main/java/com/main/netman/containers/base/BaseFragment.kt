package com.main.netman.containers.base

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.lifecycleScope
import androidx.viewbinding.ViewBinding
import com.google.gson.Gson
import com.main.netman.MainActivity
import com.main.netman.containers.auth.AuthActivity
import com.main.netman.models.auth.AuthModel
import com.main.netman.models.error.ErrorModel
import com.main.netman.network.RemoteDataSource
import com.main.netman.network.apis.AuthApi
import com.main.netman.network.handlers.SCSocketHandler
import com.main.netman.repositories.BaseRepository
import com.main.netman.store.CommandPreferences
import com.main.netman.store.CookiePreferences
import com.main.netman.store.CoordsPreferences
import com.main.netman.store.TestMarkPreferences
import com.main.netman.store.UserPreferences
import com.main.netman.store.cookieDataStore
import com.main.netman.store.getCommandDataStore
import com.main.netman.store.getCoordsDataStore
import com.main.netman.store.testMarkDataStore
import com.main.netman.store.userDataStore
import com.main.netman.utils.handleErrorMessage
import com.main.netman.utils.startNewActivity
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking

/**
 * Абстрактный класс для фрагментов (для поддержки архитектуры MVVM)
 */
abstract class BaseFragment<VM: BaseViewModel, B: ViewBinding, R: BaseRepository> : Fragment() {

    // Локальное хранилище пользовательских данных
    protected lateinit var userPreferences: UserPreferences

    // Локальное хранилище для куки
    protected lateinit var cookiePreferences: CookiePreferences

    // Локальное хранилище для координат пользователя
    protected lateinit var coordsPreferences: CoordsPreferences

    // Локальное хранилище для информации о команде пользователя
    protected lateinit var commandPreferences: CommandPreferences

    // Локальное хранилище для количества отправленных меток пользователя
    protected lateinit var testMarkPreferences: TestMarkPreferences

    // Класс ViewBinding, с помощью которого можно
    // осуществлять быстрый доступ к элементам вёрстки
    protected lateinit var binding : B

    // Ссылка на ViewModel, которая будет использована
    // для связывания данных и вёрстки
    protected lateinit var viewModel : VM

    // Инструмент для взаимодействия с сетью (формирует объект Retrofit)
    protected val remoteDataSource = RemoteDataSource()

    /**
     * Обработка жизненного цикла фрагмента - "Создание вида"
     */
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Связывание пользовательских данных с экземплярами объектов
        userPreferences = UserPreferences(requireContext().userDataStore)
        cookiePreferences = CookiePreferences(requireContext().cookieDataStore)
        coordsPreferences = CoordsPreferences(getCoordsDataStore(requireContext().applicationContext))
        commandPreferences = CommandPreferences(getCommandDataStore(requireContext().applicationContext))
        testMarkPreferences = TestMarkPreferences(requireContext().testMarkDataStore)

        // Связывание класса ViewBinding с конкретным экземпляром
        binding = getFragmentBinding(inflater, container)

        // Получение ViewModelFactory по определённому репозиторию
        val factory = ViewModelFactory(getFragmentRepository())

        // Получение ViewModel с помощью ViewModelFactory
        viewModel = ViewModelProvider(this, factory)[getViewModel()]

        // Запуск в рамках жизненного цикла получения
        // первого объекта из потока объектов Flow
        lifecycleScope.launch {
            userPreferences.auth.first()
        }

        // Возврат вида фрагмента
        return binding.root
    }

    abstract fun getViewModel() : Class<VM>
    abstract fun getFragmentBinding(inflater: LayoutInflater, container: ViewGroup?) : B
    abstract fun getFragmentRepository() : R

    // Реализация функции logout, для использования в других фрагментах
    // Запуск осуществляется в рамках жизненного цикла фрагмента
    // (иначе - в контексте жизненного цикла фрагмента)
    fun logout() = lifecycleScope.launch {
        // Получение первых данных из потока данных
        val data = userPreferences.auth.first()

        // Преобразование данных из JSON-формата в объект
        val dataObj = Gson().fromJson(data, AuthModel::class.java)

        // Формирование API для взаимодействия с сервером
        val api = remoteDataSource.buildApi(AuthApi::class.java, userPreferences, cookiePreferences)

        // Вызов модели фрагмента (заранее установленного)
        // и передача ему созданного API
        viewModel.logout(
            dataObj.accessToken!!,
            dataObj.refreshToken!!,
            0,
            api
        )

        // Очистка пользовательских данных
        userPreferences.clear()

        // Прерывание подключения по веб-сокету
        SCSocketHandler.getInstance().disconnection()

        // Открытие новой активности авторизации
        // requireActivity().startNewActivity(AuthActivity::class.java)
        requireActivity().startNewActivity(
            MainActivity::class.java,
            "Вы вышли из своего аккаунта",
            "warning"
        )
    }

    fun checkAuth(message: String? = null, openAuthActivity: Boolean = true): Boolean{
        // Проверка на авторизацию пользователя
        val authDataModel = runBlocking {
            userPreferences.auth.first()
        }

        if((authDataModel == null) && openAuthActivity){
            requireActivity().startNewActivity(
                AuthActivity::class.java,
                message,
                "warning"
            )

            return false
        }

        return checkAuthDeep(message, openAuthActivity)
    }

    private fun checkAuthDeep(message: String? = null, openAuthActivity: Boolean = true): Boolean{
        // Получение первых данных из потока данных
        val data = runBlocking {
            userPreferences.auth.first()
        } ?: return false

        // Формирование API для взаимодействия с сервером
        val api = remoteDataSource.buildApi(AuthApi::class.java, userPreferences, cookiePreferences)

        val response = runBlocking {
            api.verification()
        }

        if(response.code() == 401){
            if(openAuthActivity){
                requireActivity().startNewActivity(
                    AuthActivity::class.java,
                    message,
                    "warning"
                )
            }

            return false
        }

        return true
    }

    fun toAuth(message: String? = null){
        requireActivity().startNewActivity(
            AuthActivity::class.java,
            message,
            "warning"
        )
    }

    fun toHome(message: String? = null){
        requireActivity().startNewActivity(
            MainActivity::class.java,
            message,
            "warning"
        )
    }

    fun getAuth(): AuthModel?{
        if(!checkAuth(null, false)){
            return null
        }

        val data = runBlocking {
            userPreferences.auth.first()
        }

        return Gson().fromJson(
            data,
            AuthModel::class.java
        )
    }
}