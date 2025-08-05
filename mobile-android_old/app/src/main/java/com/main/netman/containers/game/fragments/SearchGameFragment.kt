package com.main.netman.containers.game.fragments

import android.os.Bundle
import android.util.Log
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import com.google.android.material.dialog.MaterialAlertDialogBuilder
import com.google.gson.Gson
import com.main.netman.R
import com.main.netman.constants.keys.GameRouterKeys
import com.main.netman.containers.base.BaseFragment
import com.main.netman.containers.game.adapters.AvailableGameAdapter
import com.main.netman.containers.game.adapters.GamesAdapter
import com.main.netman.containers.game.adapters.SuccessGameAdapter
import com.main.netman.containers.game.models.GameViewModel
import com.main.netman.databinding.FragmentGameBinding
import com.main.netman.databinding.FragmentSearchGameBinding
import com.main.netman.models.error.ErrorModel
import com.main.netman.models.game.GameIdModel
import com.main.netman.models.game.GameModel
import com.main.netman.models.game.GameSessionIdModel
import com.main.netman.models.response.CompletedResponse
import com.main.netman.network.Resource
import com.main.netman.network.apis.PlayerApi
import com.main.netman.repositories.PlayerRepository
import com.main.netman.utils.handleApiError
import com.main.netman.utils.handleErrorMessage
import com.main.netman.utils.handleMessage
import com.main.netman.utils.handleSuccessMessage
import com.main.netman.utils.navigation


class SearchGameFragment :
    BaseFragment<GameViewModel, FragmentSearchGameBinding, PlayerRepository>() {

    // Адаптер для списка игр
    private lateinit var gamesAdapter: GamesAdapter

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

            if (game.joinedGame) {
                return@let
            }

            gamesAdapter = GamesAdapter(
                requireContext(),
                games = game.games
            ) {
                // Обработка присоединения игрока к выбранной игре
                if (binding.progressBar.visibility == View.GONE) {
                    binding.progressBar.visibility = View.VISIBLE

                    // Присоединение пользователя к игре
                    joinGame(it)
                }
            }

            binding.rvGameSearch.adapter = gamesAdapter

            viewModel.joinGame.observe(viewLifecycleOwner) {
                when (it) {
                    // Обработка успешного сетевого взаимодействия
                    is Resource.Success -> {
                        val response = it.value.body()?.string()

                        if (it.value.isSuccessful && response !== null) {
                            handleSuccessMessage("Вы успешно присоединились к игре!")
                            navigation(R.id.action_searchGameFragment_to_navigateGameFragment)
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

                binding.progressBar.visibility = View.GONE
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
    ) = FragmentSearchGameBinding.inflate(inflater, container, false)

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

    private fun joinGame(gameId: Int) {
        val data = GameIdModel(gameId)
        viewModel.joinGame(data)
    }
}