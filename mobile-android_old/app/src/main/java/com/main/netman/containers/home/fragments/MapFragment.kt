package com.main.netman.containers.home.fragments

import android.annotation.SuppressLint
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.annotation.DrawableRes
import androidx.appcompat.content.res.AppCompatResources
import androidx.lifecycle.MutableLiveData
import com.google.gson.Gson
import com.main.netman.R
import com.main.netman.constants.game.ViewStatusConstants
import com.main.netman.constants.socket.SocketHandlerConstants
import com.main.netman.containers.base.BaseFragment
import com.main.netman.containers.home.models.MapViewModel
import com.main.netman.databinding.FragmentMapBinding
import com.main.netman.event.CurrentGameEvent
import com.main.netman.event.CurrentQuestEvent
import com.main.netman.event.RemoveMarkEvent
import com.main.netman.event.UpdateMoveType
import com.main.netman.event.UpdateSocketEvent
import com.main.netman.event.ViewMarkEvent
import com.main.netman.models.CountTestMarkModel
import com.main.netman.models.PointD
import com.main.netman.models.game.GameQuestModel
import com.main.netman.models.game.QuestMarkModel
import com.main.netman.models.quest.QuestDataModel
import com.main.netman.models.user.GamePlayerCoordinatesModel
import com.main.netman.models.user.UserCoordsModel
import com.main.netman.models.user.UserIdModel
import com.main.netman.network.handlers.SCSocketHandler
import com.main.netman.repositories.MapRepository
import com.main.netman.store.CurrentQuestPreferences
import com.main.netman.store.currentQuestDataStore
import com.main.netman.utils.DrawableToBitmap
import com.main.netman.utils.GeoMath
import com.main.netman.utils.LocationPermissionHelper
import com.main.netman.utils.handleSuccessMessage
import com.mapbox.android.gestures.MoveGestureDetector
import com.mapbox.geojson.Point
import com.mapbox.maps.CameraOptions
import com.mapbox.maps.Event
import com.mapbox.maps.Observer
import com.mapbox.maps.Style
import com.mapbox.maps.extension.observable.subscribeMapLoaded
import com.mapbox.maps.extension.style.expressions.dsl.generated.interpolate
import com.mapbox.maps.plugin.LocationPuck2D
import com.mapbox.maps.plugin.annotation.annotations
import com.mapbox.maps.plugin.annotation.generated.PointAnnotation
import com.mapbox.maps.plugin.annotation.generated.PointAnnotationManager
import com.mapbox.maps.plugin.annotation.generated.PointAnnotationOptions
import com.mapbox.maps.plugin.annotation.generated.createPointAnnotationManager
import com.mapbox.maps.plugin.gestures.OnMoveListener
import com.mapbox.maps.plugin.gestures.gestures
import com.mapbox.maps.plugin.gestures.getGesturesSettings
import com.mapbox.maps.plugin.locationcomponent.OnIndicatorBearingChangedListener
import com.mapbox.maps.plugin.locationcomponent.OnIndicatorPositionChangedListener
import com.mapbox.maps.plugin.locationcomponent.location
import io.socket.client.Socket
import kotlinx.coroutines.CancellationException
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.launchIn
import kotlinx.coroutines.flow.subscribe
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking
import kotlinx.coroutines.withContext
import org.greenrobot.eventbus.EventBus
import org.greenrobot.eventbus.Subscribe
import org.greenrobot.eventbus.ThreadMode
import java.lang.ref.WeakReference

/**
 * Фрагмент с игровой картой
 */
class MapFragment : BaseFragment<MapViewModel, FragmentMapBinding, MapRepository>(), Observer {
    // Локальное хранилище текущего квеста
    private lateinit var currentQuestPreferences: CurrentQuestPreferences

    // Mock point
    private lateinit var point: PointD

    // Флаг характеризующий инициализацию карты (загрузка карты)
    private var isInit: Boolean = false

    // Socket
    private val _socket: MutableLiveData<Socket?> =
        MutableLiveData(SCSocketHandler.getInstance().getSocket())

    // Помощник для определения разрешения на получения доступа к геолокации пользователя
    private lateinit var locationPermissionHelper: LocationPermissionHelper

    // Задача на получение координат других игроков
    private var _coroutineGetCoordinates: Job? = null
    private var _coroutineIO: Job? = null

    private var _coroutineTestCoords: Job? = null

    // Менеджер управления аннотациями
    private var pointAnnotationManager: PointAnnotationManager? = null

    // -> [RESOURCES]
    // Координаты игрока
    private var coordPlayer: PointAnnotation? = null

    // Координаты игроков в команде
    private var commandPlayers: MutableMap<Int, PointAnnotation> = mutableMapOf()

    // Координаты определённых игровых точек
    private var coordTasks: MutableMap<Int, PointAnnotation> = mutableMapOf()
    // <-

    private val onIndicatorBearingChangedListener = OnIndicatorBearingChangedListener {
        // [Отключено, т.к. вызывает слишком большие изменения экрана, что нежелательно]
        // binding.mapView.getMapboxMap().setCamera(CameraOptions.Builder().bearing(it).build())
    }

    /**
     * Обработка изменения позиции пользователя в окружающем мире (определение точных координат пользователя)
     */
    private val onIndicatorPositionChangedListener = OnIndicatorPositionChangedListener {
        // Point.fromLngLat(104.287895, 52.288865)
        val point = /*it*/
            Point.fromLngLat(104.281385, 52.285909) // Point.fromLngLat(104.287895, 52.282865)

        if (!isInit) {
            binding.mapView.getMapboxMap().setCamera(CameraOptions.Builder().center(point).build())
            binding.mapView.gestures.focalPoint =
                binding.mapView.getMapboxMap().pixelForCoordinate(point)

            isInit = true
        }

        // Сохранение текущих координат пользователя
        // viewModel.setCoords(it.latitude(), it.longitude())
        // viewModel.setCoords(point.latitude(), point.longitude())

        // Log.w("HELLO", "onIndicatorPositionChangedListener: ${point.latitude()}; ${point.longitude()}")
    }

    /**
     * Переопределённый объект OnMoveListener.
     * Обрабатывает перемещения пользователя по карте.
     */
    private val onMoveListener = object : OnMoveListener {
        override fun onMoveBegin(detector: MoveGestureDetector) {
            // onCameraTrackingDismissed()
        }

        override fun onMove(detector: MoveGestureDetector): Boolean {
            return false
        }

        override fun onMoveEnd(detector: MoveGestureDetector) {
        }
    }

    private var latitude: Double = 52.283865

    @Deprecated("Deprecated in Java")
    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)
        point = PointD(52.290365, 104.287895)

        // Проведение доступа к локальному хранилищу данных текущего квеста
        currentQuestPreferences = CurrentQuestPreferences(requireContext().currentQuestDataStore)

        // Регистрация подписчика для шины данных
        EventBus.getDefault().register(this@MapFragment)

        binding.mapView.getMapboxMap().loadStyleUri(Style.MAPBOX_STREETS)
        binding.mapView.getMapboxMap().subscribeMapLoaded(this@MapFragment)

        locationPermissionHelper = LocationPermissionHelper(WeakReference(requireActivity()))
        locationPermissionHelper.checkPermissions {
            onMapReady()
        }

        /* Обработка изменения значения координат текущего пользователя */
        viewModel.coords.observe(viewLifecycleOwner) {
            if (it == null) {
                return@observe
            }

            if (_socket.value != null && SCSocketHandler.getInstance().getAuth()) {
                _socket.value?.emit(
                    SocketHandlerConstants.SET_CURRENT_COORDINATES,
                    Gson().toJson(UserCoordsModel(lat = it.first, lng = it.second))
                )
            }

            if (binding.mapView.getMapboxMap().getStyle()?.isStyleLoaded == true) {
                Log.w("HELLO", "UPDATE coords ${it.first}; ${it.second}")
                coordPlayer = if (coordPlayer != null) {
                    // Обновление элемента на карте
                    updateMapElement(coordPlayer!!, PointD(it.first, it.second))
                } else {
                    // Добавление нового элемента на карту
                    addElementToMap(R.drawable.mapbox_user_puck_icon, PointD(it.first, it.second))
                }
            }

            val data = runBlocking {
                currentQuestPreferences.data.first()
            }

            data?.let { it1 ->
                val quest = Gson().fromJson(it1, GameQuestModel::class.java)

                quest.mark?.let { it2 ->
                    val lat = it2.lat
                    val lng = it2.lng
                    val radius = quest.radius

                    if ((lat != null && lng != null && radius != null && quest.view != null)
                        && quest.view == ViewStatusConstants.INVISIBLE
                    ) {
                        if (GeoMath.intersectionCircles(
                                it.first,
                                it.second,
                                lat,
                                lng,
                                GeoMath.radiusLatLng(100.0),
                                GeoMath.radiusLatLng(radius.toDouble() + 100)
                            )
                        ) {
                            // Отправка сообщения на сервер о том, что необходимо отобразить текущий квест
                            _socket.value?.emit(SocketHandlerConstants.VIEW_CURRENT_QUEST, it1)
                        }
                    }
                }
            }
        }

        if ((_coroutineTestCoords != null) && (_coroutineTestCoords?.isActive == true)) {
            _coroutineIO!!.cancel()
        } else {
            _coroutineTestCoords = CoroutineScope(Dispatchers.IO).launch {
                try {
                    var i: Int = 0
                    var item: Double = 52.285909

                    while (i++ < 100) {
                        item += 0.02
                        viewModel.setCoords(item, 104.281385)

                        if(i == 1) {
                            delay(15000)
                        } else {
                            Log.w("HELLO", "${i}")
                            delay(1000)
                        }
                    }


                } catch (_: CancellationException) {
                }
            }
        }

        // Обработка изменения данных полнодуплексного подключения
        _socket.observe(viewLifecycleOwner) {
            if (it == null) {
                return@observe
            }

            // Если корутина IO уже инициализирована, то сначала её останавливаем
            if ((_coroutineIO != null) && (_coroutineIO?.isActive == true)) {
                _coroutineIO!!.cancel()
            }

            // Обработка события "передача своих координат другим членам команды (only online)"
            if (it.hasListeners(SocketHandlerConstants.GET_PLAYER_COORDINATES)) {
                it.off(SocketHandlerConstants.GET_PLAYER_COORDINATES)
            }

            it.on(SocketHandlerConstants.GET_PLAYER_COORDINATES) { _ ->
                //latitude += 0.0001

                // ---------------
                // [DEBUG SECTION]
                /*it.emit(
                    SocketHandlerConstants.SET_PLAYER_COORDINATES, Gson().toJson(
                        UserCoordsModel(
                            lat = latitude,
                            lng = 104.287895
                        )
                    )
                )

                it.emit(
                    SocketHandlerConstants.SET_CURRENT_COORDINATES,
                    Gson().toJson(UserCoordsModel(lat = latitude, lng = 104.287895))
                )*/
                // ---------------

                // ---------------
                // [PRODUCTION SECTION]

                // Передача текущих координат игрока
                it.emit(
                    SocketHandlerConstants.SET_PLAYER_COORDINATES, Gson().toJson(
                        UserCoordsModel(
                            lat = viewModel.coords.value?.first,
                            lng = viewModel.coords.value?.second
                        )
                    )
                )

                // ---------------
            }

            // Обработка события "очистить все изображения на карте"
            if (it.hasListeners(SocketHandlerConstants.CLEAR_GAMES_MARKS)) {
                it.off(SocketHandlerConstants.CLEAR_GAMES_MARKS)
            }

            it.on(SocketHandlerConstants.CLEAR_GAMES_MARKS) {
                // Добавление координат игрока
                activity?.runOnUiThread {
                    cleanUp()

                    if (binding.mapView.getMapboxMap().getStyle()?.isStyleLoaded == true
                        && viewModel.coords.isInitialized
                        && viewModel.coords != null
                    ) {
                        Log.w("HELLO", "CLEAR_GAMES_MARKS")
                        coordPlayer = if (coordPlayer != null) {
                            // Обновление элемента на карте
                            updateMapElement(
                                coordPlayer!!,
                                PointD(
                                    viewModel.coords.value!!.first,
                                    viewModel.coords.value!!.second
                                )
                            )
                        } else {
                            // Добавление нового элемента на карту
                            addElementToMap(
                                R.drawable.mapbox_user_puck_icon,
                                PointD(
                                    viewModel.coords.value!!.first,
                                    viewModel.coords.value!!.second
                                )
                            )
                        }
                    }
                }
            }

            if (it.hasListeners(SocketHandlerConstants.ADD_PLAYER_COORDINATES)) {
                it.off(SocketHandlerConstants.ADD_PLAYER_COORDINATES)
            }

            // Обработка добавления другого пользователя на карту
            it.on(SocketHandlerConstants.ADD_PLAYER_COORDINATES) { args ->
                if (args[0] != null) {
                    val data = Gson().fromJson(
                        (args[0] as String),
                        GamePlayerCoordinatesModel::class.java
                    )

                    activity?.runOnUiThread {
                        if (!(commandPlayers.contains(data.usersId))) {
                            val value = addElementToMap(
                                R.drawable.mapbox_user_command_icon,
                                PointD(data.lat, data.lng)
                            )

                            if (value != null) {
                                commandPlayers[data.usersId] = value
                            }
                        } else {
                            val annotation = commandPlayers[data.usersId]
                            if (annotation != null) {
                                val value = updateMapElement(annotation, PointD(data.lat, data.lng))
                                if (value != null) {
                                    commandPlayers[data.usersId] = value
                                }
                            }
                        }
                    }
                }
            }

            if (it.hasListeners(SocketHandlerConstants.TEAM_PLAYER_DISCONNECT)) {
                it.off(SocketHandlerConstants.TEAM_PLAYER_DISCONNECT)
            }

            // Удаление координат игроков, которые отключились от игрового процесса
            it.on(SocketHandlerConstants.TEAM_PLAYER_DISCONNECT) { args ->
                if (args[0] != null) {
                    val obj = Gson().fromJson((args[0] as String), UserIdModel::class.java)

                    activity?.runOnUiThread {
                        if (commandPlayers.containsKey(obj.usersId)) {
                            deleteMapElement(commandPlayers[obj.usersId]!!)
                            commandPlayers.remove(obj.usersId)
                        }
                    }
                }
            }

            // Обработка визуализации игрового квеста на карте
            if (it.hasListeners(SocketHandlerConstants.SET_VIEW_CURRENT_QUEST)) {
                it.off(SocketHandlerConstants.SET_VIEW_CURRENT_QUEST)
            }

            it.on(SocketHandlerConstants.SET_VIEW_CURRENT_QUEST) { args ->
                if (args[0] != null) {
                    val obj = Gson().fromJson((args[0] as String), QuestDataModel::class.java)

                    activity?.runOnUiThread {
                        if (obj?.lat != null && obj.lng != null) {
                            if (!(coordTasks.contains(obj.gamesId))) {
                                val value = addElementToMap(
                                    R.drawable.ic_camera,
                                    PointD(obj.lat!!, obj.lng!!)
                                )

                                if (value != null) {
                                    coordTasks[obj.gamesId!!] = value
                                }
                            } else {
                                val annotation = coordTasks[obj.gamesId]
                                if (annotation != null) {
                                    val value =
                                        updateMapElement(annotation, PointD(obj.lat!!, obj.lng!!))
                                    if (value != null) {
                                        coordTasks[obj.gamesId!!] = value
                                    }
                                }
                            }
                        }
                    }
                }
            }

            // Запуск корутины для постоянного опроса игроков о их новых координатах
            _coroutineIO = CoroutineScope(Dispatchers.IO).launch {
                try {
                    if ((_coroutineGetCoordinates != null) && (_coroutineGetCoordinates?.isActive == true)) {
                        _coroutineGetCoordinates!!.cancel()
                    }

                    _coroutineGetCoordinates = CoroutineScope(Dispatchers.IO).launch {
                        try {
                            while (true) {
                                // Запрос всех координат пользователей, которые находятся в
                                // команде текущего пользователя и online
                                it.emit(SocketHandlerConstants.COORDINATES_PLAYERS)
                                delay(1000)
                            }
                        } catch (_: CancellationException) {
                        }
                    }

                    _coroutineGetCoordinates?.join()
                } catch (e: CancellationException) {
                    _coroutineGetCoordinates?.cancel()
                }
            }
        }
    }

    /**
     * Метод получения ViewModel текущего фрагмента
     */
    override fun getViewModel() = MapViewModel::class.java

    /**
     * Метод получения экземпляра фрагмента
     */
    override fun getFragmentBinding(
        inflater: LayoutInflater,
        container: ViewGroup?
    ) = FragmentMapBinding.inflate(inflater, container, false)

    /**
     * Метод получения репозитория данного фрагмента
     */
    override fun getFragmentRepository() =
        MapRepository(coordsPreferences)

    @SuppressLint("Lifecycle")
    override fun onStart() {
        super.onStart()
        binding.mapView.onStart()
    }

    @SuppressLint("Lifecycle")
    override fun onStop() {
        super.onStop()
        EventBus.getDefault().unregister(this@MapFragment)
        binding.mapView.onStop()
        _coroutineGetCoordinates?.cancel()
        _coroutineIO?.cancel()
    }

    @SuppressLint("Lifecycle")
    override fun onLowMemory() {
        super.onLowMemory()
        binding.mapView.onLowMemory()
    }

    private fun onMapReady() {
        // Первоначальная установка камеры
        binding.mapView.getMapboxMap().setCamera(
            CameraOptions.Builder()
                .zoom(14.0)
                .build()
        )

        // Отмена скролла пользователем по карте
        // binding.mapView.gestures.scrollEnabled = false

        // Визуализация карты
        viewMap()
    }

    /**
     * Визуализация карты на экране мобильного устройства
     */
    private fun viewMap() {
        // Добавление стилей для карты
        binding.mapView.getMapboxMap().loadStyleUri(Style.MAPBOX_STREETS) {
            // Инициализация компонента локации
            initLocationComponent()
        }

        // Добавление маркеров на карту
        /*coroutineScope {
            launch {
                for(i in 0..10){
                    var newPoint = PointD(point.x, point.y + (i.toDouble() / 10000))
                    addElementToMap(R.drawable.mapbox_user_command_icon, newPoint)
                }
            }
        }*/
    }

    /**
     * Добавление слушателя перемещений
     */
    private fun setupGesturesListener() {
        binding.mapView.gestures.addOnMoveListener(onMoveListener)
    }

    /**
     * Инициализация компонента локации
     */
    private fun initLocationComponent() {
        val locationComponentPlugin = binding.mapView.location

        locationComponentPlugin.updateSettings {
            this.enabled = true
            this.locationPuck = LocationPuck2D(
                // Активное изображение
                /*bearingImage = AppCompatResources.getDrawable(
                    requireContext(),
                    R.drawable.mapbox_user_puck_icon,
                ),*/

                // Скрытое изображение
                shadowImage = AppCompatResources.getDrawable(
                    requireContext(),
                    R.drawable.mapbox_user_icon_shadow,
                ),

                // Масштабирование
                scaleExpression = interpolate {
                    linear()
                    zoom()
                    stop {
                        literal(0.0)
                        literal(0.6)
                    }
                    stop {
                        literal(20.0)
                        literal(1.0)
                    }
                }.toJson()
            )
        }

        // Добавление индикаторов
        locationComponentPlugin.addOnIndicatorPositionChangedListener(
            onIndicatorPositionChangedListener
        )
        locationComponentPlugin.addOnIndicatorBearingChangedListener(
            onIndicatorBearingChangedListener
        )

        // Запрет на скролл внутри окна карты
        /*binding.mapView.gestures.scrollEnabled = false
        binding.mapView.gestures.pitchEnabled = false*/

        // Полный запрет за zoom в рамках карты
        /*binding.mapView.gestures.quickZoomEnabled = false
        binding.mapView.gestures.doubleTapToZoomInEnabled = false*/
        binding.mapView.gestures.pinchToZoomEnabled = false
    }

    /**
     * Прекращение движения за камерой
     */
    private fun onCameraTrackingDismissed() {
        binding.mapView.location
            .removeOnIndicatorPositionChangedListener(onIndicatorPositionChangedListener)
        binding.mapView.location
            .removeOnIndicatorBearingChangedListener(onIndicatorBearingChangedListener)
        // binding.mapView.gestures.removeOnMoveListener(onMoveListener)
    }

    override fun onDestroy() {
        super.onDestroy()
        binding.mapView.location
            .removeOnIndicatorBearingChangedListener(onIndicatorBearingChangedListener)
        binding.mapView.location
            .removeOnIndicatorPositionChangedListener(onIndicatorPositionChangedListener)
        //binding.mapView.gestures.removeOnMoveListener(onMoveListener)

        _coroutineGetCoordinates?.cancel()
        _coroutineIO?.cancel()

    }

    @Deprecated("Deprecated in Java")
    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<String>,
        grantResults: IntArray
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        locationPermissionHelper.onRequestPermissionsResult(requestCode, permissions, grantResults)
    }

    /**
     * Очистка карты от всех аннотаций
     */
    private fun cleanUp() {
        // Удаление маркера игрока
        if (coordPlayer != null) {
            deleteMapElement(coordPlayer!!)
            coordPlayer = null
        }

        // Удаление маркеров всех задач
        coordTasks.forEach { entry ->
            run {
                deleteMapElement(entry.value)
            }
        }
        coordTasks.clear()

        // Удаление всех игроков
        commandPlayers.forEach { entry ->
            run {
                deleteMapElement(entry.value)
            }
        }
        commandPlayers.clear()
    }

    /**
     * Добавление элемента на карту
     */
    private fun addElementToMap(@DrawableRes resourceId: Int, point: PointD): PointAnnotation? {
        if (pointAnnotationManager == null) {
            return null
        }

        val resource = DrawableToBitmap.bitmapFromDrawableRes(
            requireContext(),
            resourceId
        ) ?: return null

        // Устанавливаем параметры для результирующего слоя символов.
        val pointAnnotationOptions: PointAnnotationOptions = PointAnnotationOptions()
            // Определяем географические координаты маркера.
            .withPoint(Point.fromLngLat(point.y, point.x))
            // Указываем растровое изображение, которое присваиваем точечной аннотации
            // Растровое изображение будет автоматически добавлено в стиль карты
            .withIconImage(resource)

        // Добавление результирующего pointAnnotation на карту
        return pointAnnotationManager?.create(pointAnnotationOptions)
    }

    /**
     * Изменение элемента на карте
     */
    private fun updateMapElement(annotation: PointAnnotation, point: PointD): PointAnnotation? {
        if (pointAnnotationManager == null) {
            return null
        }

        val index = pointAnnotationManager!!.annotations.indexOf(annotation)

        // Обновление координат аннотации
        pointAnnotationManager!!.annotations[index].point = Point.fromLngLat(point.y, point.x)
        pointAnnotationManager!!.update(pointAnnotationManager!!.annotations[index])

        return pointAnnotationManager!!.annotations[index]
    }

    /**
     * Удаление элемента с карты
     */
    private fun deleteMapElement(annotation: PointAnnotation) {
        if (pointAnnotationManager == null) {
            return
        }

        // Обновление координат аннотации
        pointAnnotationManager!!.delete(annotation)
    }

    /**
     * Обработка события "Загрузка карты"
     */
    override fun notify(event: Event) {
        if (event.type == "map-loaded") {
            // Создание нового менеджера добавления точечных аннотаций
            pointAnnotationManager = binding.mapView.annotations.createPointAnnotationManager()

            if (viewModel.coords.isInitialized && viewModel.coords != null) {
                Log.w("HELLO", "notify map-loaded")
                coordPlayer = if (coordPlayer != null) {
                    // Обновление элемента на карте
                    updateMapElement(
                        coordPlayer!!,
                        PointD(
                            viewModel.coords.value!!.first,
                            viewModel.coords.value!!.second
                        )
                    )
                } else {
                    // Добавление нового элемента на карту
                    addElementToMap(
                        R.drawable.mapbox_user_puck_icon,
                        PointD(
                            viewModel.coords.value!!.first,
                            viewModel.coords.value!!.second
                        )
                    )
                }
            }

            for (item in commandPlayers) {
                addElementToMap(
                    R.drawable.mapbox_user_command_icon,
                    PointD(item.value.point.latitude(), item.value.point.longitude())
                )
            }

            // Получение состояния игрока
            if (SCSocketHandler.getInstance()
                    .getAuth() && _socket.isInitialized && _socket.value != null
            ) {
                _socket.value?.emit(SocketHandlerConstants.STATUS)
            }
        }
    }

    /**
     * Обработка события удаления маркера с карты
     */
    @Subscribe(threadMode = ThreadMode.MAIN)
    fun onRemoveMarkEvent(event: RemoveMarkEvent) {
        event.mark?.let {
            val questId = event.questId

            if (questId != null && coordTasks.containsKey(questId)) {
                coordTasks[questId]?.let { it1 ->
                    deleteMapElement(it1)
                }

                coordTasks.remove(questId)
            }
        }
    }

    /**
     * Обработка события отрисовки маркера на карте
     */
    @Subscribe(threadMode = ThreadMode.MAIN)
    fun onViewMarkEvent(event: ViewMarkEvent) {
        event.mark?.let {
            val questId = event.questId
            val lat = it.lat
            val lng = it.lng

            if (lat != null && lng != null && questId !== null) {
                if (!(coordTasks.contains(questId))) {
                    val value = addElementToMap(
                        R.drawable.ic_map_icon,
                        PointD(lat, lng)
                    )

                    if (value != null) {
                        coordTasks[questId] = value
                    }
                } else {
                    val annotation = coordTasks[questId]

                    if (annotation != null) {
                        val value =
                            updateMapElement(annotation, PointD(lat, lng))

                        if (value != null) {
                            coordTasks[questId] = value
                        }
                    }
                }
            }
        }
    }

    /**
     * Обработка события обновления сокета подключения
     */
    @Subscribe(threadMode = ThreadMode.MAIN)
    fun onUpdateSocket(event: UpdateSocketEvent) {
        _socket.value = event.socket

        // Очистка карты, в случае, если подключение к серверу отсутствует
        if (_socket.value == null) {
            for (item in coordTasks) {
                deleteMapElement(item.value)
            }

            coordTasks.clear()
        }
    }

    /**
     * Обработка события изменения типа управления
     */
    @Subscribe(threadMode = ThreadMode.MAIN)
    fun onUpdateMoveType(event: UpdateMoveType) {
        binding.mapView.gestures.scrollEnabled = !binding.mapView.gestures.scrollEnabled
    }
}