package com.main.netman.containers.game.fragments

import android.annotation.SuppressLint
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.TextView
import com.google.android.material.dialog.MaterialAlertDialogBuilder
import com.google.gson.Gson
import com.main.netman.R
import com.main.netman.containers.base.BaseFragment
import com.main.netman.containers.game.adapters.AvailableGameAdapter
import com.main.netman.containers.game.models.GameTeamViewModel
import com.main.netman.databinding.FragmentGameJoinBinding
import com.main.netman.models.command.CommandStatusModel
import com.main.netman.models.error.ErrorModel
import com.main.netman.models.game.GameAvailableModel
import com.main.netman.models.game.GameIdModel
import com.main.netman.network.Resource
import com.main.netman.network.apis.PlayerApi
import com.main.netman.repositories.PlayerRepository
import com.main.netman.utils.handleApiError
import com.main.netman.utils.handleErrorMessage
import com.main.netman.utils.handleSuccessMessage
import com.main.netman.utils.navigation
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.runBlocking

class GameJoinFragment :
    BaseFragment<GameTeamViewModel, FragmentGameJoinBinding, PlayerRepository>() {
    private lateinit var commandAvailableAdapter: AvailableGameAdapter

    @SuppressLint("SetTextI18n", "MissingInflatedId")
    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)

        val joinHandler: (id: Int, name: String) -> Unit = { id, name ->
            // Создание диалогового окна
            val dialogBuilder = MaterialAlertDialogBuilder(requireContext())
            val viewDialog = layoutInflater.inflate(R.layout.dialog_game_join_team, null)
            // Добавление view диалоговому окну
            dialogBuilder.setView(viewDialog)
            // Открытие диалогового окна
            val dialog: androidx.appcompat.app.AlertDialog? = dialogBuilder.show()

            viewDialog.findViewById<TextView>(R.id.tvDialogDescription).text =
                "Зарегистрироваться на игру \"${name}\" ?"

            // Обработка отмены создания команды
            viewDialog.findViewById<Button>(R.id.cancel_join_game_command)
                .setOnClickListener(View.OnClickListener {
                    dialog?.dismiss()
                })

            // Создание команды
            viewDialog.findViewById<Button>(R.id.accept_join_game_command)
                .setOnClickListener(View.OnClickListener {

                    val data = Gson().fromJson(runBlocking {
                        commandPreferences.command.first()
                    }, CommandStatusModel::class.java)

                    if (data != null) {
                        joinGame(id)
                    }
                    dialog?.dismiss()
                })
        }

        commandAvailableAdapter = AvailableGameAdapter(
            requireContext(),
            games = arrayListOf(),
            joinHandler = joinHandler
        )

        binding.rvGameJoin.adapter = commandAvailableAdapter

        // Получение информации о команде
        val args = arguments
        val commandsId = args?.getInt("commands_id")
        val status = args?.getInt("status")

        binding.toolbarGameJoin.setNavigationOnClickListener {
            navigation(R.id.action_gameJoinFragment_to_leadTeamFragment, arguments)
        }

        viewModel.availableGames.observe(viewLifecycleOwner) {
            when (it) {
                // Обработка успешного сетевого взаимодействия
                is Resource.Success -> {
                    if (it.value.isSuccessful) {
                        val body = Gson().fromJson(
                            it.value.body()?.string(),
                            Array<GameAvailableModel>::class.java
                        )

                        commandAvailableAdapter.setGames(
                            body.map { it ->
                                return@map it
                            } as ArrayList<GameAvailableModel>)
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

        viewModel.registerGame.observe(viewLifecycleOwner) {
            when (it) {
                // Обработка успешного сетевого взаимодействия
                is Resource.Success -> {
                    if (it.value.isSuccessful) {
                        navigation(R.id.action_gameJoinFragment_to_leadTeamFragment, arguments)
                        handleSuccessMessage("Успешная регистрация на игру!")
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

        getAvailableGames()
    }

    /**
     * Метод получения ViewModel текущего фрагмента
     */
    override fun getViewModel() = GameTeamViewModel::class.java

    /**
     * Метод получения экземпляра фрагмента
     */
    override fun getFragmentBinding(
        inflater: LayoutInflater,
        container: ViewGroup?
    ) = FragmentGameJoinBinding.inflate(inflater, container, false)

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

    private fun getAvailableGames() {
        viewModel.commandAvailableGames()
    }

    private fun joinGame(id: Int) {
        viewModel.playerCommandRegisterGame(
            GameIdModel(
                infoGamesId = id
            )
        )
    }
}