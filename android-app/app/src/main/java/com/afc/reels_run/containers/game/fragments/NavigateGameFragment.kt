package com.afc.reels_run.containers.game.fragments

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import com.google.gson.Gson
import com.afc.reels_run.R
import com.afc.reels_run.constants.keys.GameRouterKeys
import com.afc.reels_run.containers.base.BaseFragment
import com.afc.reels_run.containers.game.models.GameViewModel
import com.afc.reels_run.databinding.FragmentNavigateGameBinding
import com.afc.reels_run.models.error.ErrorModel
import com.afc.reels_run.models.game.GameModel
import com.afc.reels_run.network.Resource
import com.afc.reels_run.network.apis.PlayerApi
import com.afc.reels_run.network.handlers.SCSocketHandler
import com.afc.reels_run.repositories.PlayerRepository
import com.afc.reels_run.utils.handleApiError
import com.afc.reels_run.utils.handleErrorMessage
import com.afc.reels_run.utils.navigation
import io.socket.client.Socket

/**
 * Фрагмент для навигации между другими фрагментами, которые связаны с игрой
 */
class NavigateGameFragment :
    BaseFragment<GameViewModel, FragmentNavigateGameBinding, PlayerRepository>() {
    // Socket
    private val _socket: MutableLiveData<Socket?> = MutableLiveData(SCSocketHandler.getInstance().getSocket())
    private val socket: LiveData<Socket?>
        get() = _socket

    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)

        binding.nftProgressBar.visibility = View.VISIBLE

        viewModel.gameInfo.observe(viewLifecycleOwner) {
            when (it) {
                is Resource.Success -> {
                    val response = it.value.body()

                    if (it.value.isSuccessful && response !== null) {
                        val body = Gson().fromJson(
                            response.string(),
                            GameModel::class.java
                        )

                        val args = Bundle()
                        args.putString(GameRouterKeys.GAME_INFO, Gson().toJson(body))

                        binding.nftProgressBar.visibility = View.GONE

                        // Информация о текущей игре присутствует
                        if(body.joinedGame) {
                            navigation(R.id.action_navigateGameFragment_to_gameFragment, args)
                        } else {
                            // Информации о текущей игре нет
                            navigation(R.id.action_navigateGameFragment_to_searchGameFragment, args)
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
                    handleApiError(it) { }
                }

                else -> {}
            }
        }

        _socket.observe(viewLifecycleOwner) {
            /*if (it == null) {
                return@observe
            }

            // Добавляем обработчик получения статуса о команде, если его нет
            if (it.hasListeners(SocketHandlerConstants.COMMAND_STATUS_ON)) {
                it.off(SocketHandlerConstants.COMMAND_STATUS_ON)
            }

            // Создание обработчика, который отработает при получении информации о команде
            it.on(SocketHandlerConstants.COMMAND_STATUS_ON) { itLocal ->
                if ((itLocal != null) && (itLocal.isNotEmpty()) && (itLocal.first() != null)) {
                    val data = itLocal.first() as String
                    val result = Gson().fromJson(data, CommandStatusModel::class.java)
                    viewModel.setCommandStatus(result)
                }
            }

            viewModel.setCommandStatus(null)
            // Отправка запроса на получение статуса команды
            it.emit(SocketHandlerConstants.COMMAND_STATUS)*/
        }

        /*viewModel.commandStatus.observe(viewLifecycleOwner) {
            if (it == null) {
                runBlocking {
                    commandPreferences.saveCommand("")
                }
                return@observe
            }

            // Сохранение статуса о команде пользователя в локальное хранилище
            val status = Gson().toJson(it)
            runBlocking {
                commandPreferences.saveCommand(status)
            }

            if (it.status == CommandStatus.WITHOUT_TEAM) {
                // Если у пользователя нет команды, то отправляем его её искать или создавать новую
                navigation(R.id.action_navigateGameFragment_to_gameFragment)
            } else if (it.status == CommandStatus.TEAM_CREATOR) {
                // Если пользователь создатель команды, то отправляем его на страницу создателя команы
                val args = Bundle()
                args.putInt("commands_id", it.commandsId)
                args.putInt("status", it.status)

                navigation(R.id.action_navigateGameFragment_to_leadTeamFragment, args)
            } else if (it.status == CommandStatus.TEAM_MEMBER) {
                // Если у пользователя есть команда, то отправляем его на страницу его команды
                val args = Bundle()
                args.putInt("commands_id", it.commandsId)
                args.putInt("status", it.status)

                navigation(R.id.action_navigateGameFragment_to_memberTeamFragment, args)
            }
        }*/

        gameInfo()
    }

    /**
     * Метод получения ViewModel текущего фрагмента
     */
    override fun getViewModel() = GameViewModel::class.java

    /**
     * Метод получения экземпляра фрагмента
     */
    override fun getFragmentBinding(
        inflater: LayoutInflater,
        container: ViewGroup?
    ) = FragmentNavigateGameBinding.inflate(inflater, container, false)

    /**
     * Метод получения репозитория данного фрагмента
     */
    override fun getFragmentRepository() =
        PlayerRepository(
            remoteDataSource.buildApi(
                PlayerApi::class.java,
                userPreferences,
                cookiePreferences
            )
        )

    /**
     * Получение информации о текущей игре
     */
    private fun gameInfo() {
        viewModel.gameInfo()
    }
}