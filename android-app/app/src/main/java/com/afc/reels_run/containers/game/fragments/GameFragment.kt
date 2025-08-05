package com.afc.reels_run.containers.game.fragments

import android.graphics.Color
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import com.google.android.material.dialog.MaterialAlertDialogBuilder
import com.google.gson.Gson
import com.afc.reels_run.R
import com.afc.reels_run.constants.game.GameStatusConstants
import com.afc.reels_run.constants.keys.GameRouterKeys
import com.afc.reels_run.containers.base.BaseFragment
import com.afc.reels_run.containers.game.models.GameViewModel
import com.afc.reels_run.databinding.FragmentGameBinding
import com.afc.reels_run.models.error.ErrorModel
import com.afc.reels_run.models.game.GameModel
import com.afc.reels_run.models.game.GameSessionIdModel
import com.afc.reels_run.models.response.CompletedResponse
import com.afc.reels_run.network.Resource
import com.afc.reels_run.network.apis.PlayerApi
import com.afc.reels_run.repositories.PlayerRepository
import com.afc.reels_run.utils.handleApiError
import com.afc.reels_run.utils.handleErrorMessage
import com.afc.reels_run.utils.handleSuccessMessage
import com.afc.reels_run.utils.navigation

class GameFragment :
    BaseFragment<GameViewModel, FragmentGameBinding, PlayerRepository>() {

    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)

        // Получение информации об игре
        val args = arguments
        val gameInfo = args?.getString(GameRouterKeys.GAME_INFO)

        gameInfo?.let { item ->
            val game = Gson().fromJson(
                item,
                GameModel::class.java
            )

            if(!game.joinedGame) {
                return@let
            }

            binding.txtTitleGame.text = game.title
            binding.txtLocationGame.text = game.location

            game.status?.let { it1 ->
                if(it1 == GameStatusConstants.ACTIVE) {
                    game.quest?.let { quest ->
                        binding.layoutCurrentQuest.visibility = View.VISIBLE
                        binding.txtTask.text = quest.task
                        binding.txtHint.text = quest.hint
                        binding.txtAction.text = quest.action
                    }

                    binding.txtStatusGame.text = "Выполняется"
                    binding.txtStatusGame.setTextColor(Color.parseColor("#FFFF00"))
                } else {
                    binding.layoutCurrentQuest.visibility = View.GONE
                    binding.btnGameOver.visibility = View.VISIBLE

                    binding.txtStatusGame.text = "Все квесты пройдены"
                    binding.txtStatusGame.setTextColor(Color.parseColor("#00FF00"))

                    game.sessionId?.let { it2 ->
                        binding.btnGameOver.setOnClickListener {
                            binding.progressBar.visibility = View.VISIBLE
                            completedGame(it2)
                        }
                    }
                }
            }

            // Обработка нажатия на кнопку выхода из игры
            binding.btnLeaveGame.setOnClickListener {
                // Создание диалогового окна
                val dialogBuilder = MaterialAlertDialogBuilder(requireContext())
                val viewDialog = layoutInflater.inflate(R.layout.dialog_game_leave, null)

                // Добавление view диалоговому окну
                dialogBuilder.setView(viewDialog)
                // Открытие диалогового окна
                val dialog: androidx.appcompat.app.AlertDialog? = dialogBuilder.show()

                // Обработка отмены создания команды
                viewDialog.findViewById<Button>(R.id.cancel_join_game_command)
                    .setOnClickListener(View.OnClickListener {
                        dialog?.dismiss()
                    })

                // Создание команды
                viewDialog.findViewById<Button>(R.id.accept_join_game_command)
                    .setOnClickListener(View.OnClickListener {
                        game.sessionId?.let { value ->
                            detachGame(value)
                        }

                        dialog?.dismiss()
                    })
            }

            viewModel.detachGame.observe(viewLifecycleOwner) {
                when (it) {
                    // Обработка успешного сетевого взаимодействия
                    is Resource.Success -> {
                        val response = it.value.body()?.string()

                        if (it.value.isSuccessful && response !== null) {
                            val body = Gson().fromJson(
                                response,
                                CompletedResponse::class.java
                            )

                            if(body.completed !== null && body.completed == true) {
                                handleSuccessMessage("Вы успешно покинули игру")
                                navigation(R.id.action_gameFragment_to_navigateGameFragment)
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

            viewModel.completedGame.observe(viewLifecycleOwner) {
                when (it) {
                    // Обработка успешного сетевого взаимодействия
                    is Resource.Success -> {
                        val response = it.value.body()?.string()

                        if (it.value.isSuccessful && response !== null) {
                            val body = Gson().fromJson(
                                response,
                                CompletedResponse::class.java
                            )

                            if(body.completed !== null && body.completed == true) {
                                handleSuccessMessage("Вы успешно завершили игру!")
                                navigation(R.id.action_gameFragment_to_navigateGameFragment)
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
        }
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
    ) = FragmentGameBinding.inflate(inflater, container, false)

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

    private fun detachGame(sessionId: String) {
        val data = GameSessionIdModel(sessionId)
        viewModel.detachGame(data)
    }

    private fun completedGame(sessionId: String) {
        val data = GameSessionIdModel(sessionId)
        viewModel.completedGame(data)
    }
}