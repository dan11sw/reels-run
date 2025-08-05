package com.afc.reels_run.containers.game.fragments

import android.annotation.SuppressLint
import android.os.Build
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.annotation.RequiresApi
import androidx.constraintlayout.widget.ConstraintLayout
import androidx.core.view.updateLayoutParams
import com.google.gson.Gson
import com.afc.reels_run.R
import com.afc.reels_run.constants.data.value.CommandStatus
import com.afc.reels_run.containers.base.BaseFragment
import com.afc.reels_run.containers.game.adapters.SuccessGameAdapter
import com.afc.reels_run.containers.game.models.GameTeamViewModel
import com.afc.reels_run.databinding.FragmentGamesTeamBinding
import com.afc.reels_run.models.command.CommandsIdModel
import com.afc.reels_run.models.error.ErrorModel
import com.afc.reels_run.models.game.GameAvailableModel
import com.afc.reels_run.network.Resource
import com.afc.reels_run.network.apis.PlayerApi
import com.afc.reels_run.repositories.PlayerRepository
import com.afc.reels_run.utils.handleApiError
import com.afc.reels_run.utils.handleErrorMessage
import com.afc.reels_run.utils.navigation
import java.time.Duration
import java.time.Instant


class GamesTeamFragment(
    private var commandStatus: Int?,
    private var commandsId: Int?
) : BaseFragment<GameTeamViewModel, FragmentGamesTeamBinding, PlayerRepository>() {
    private lateinit var commandGamesAdapter: SuccessGameAdapter

    @RequiresApi(Build.VERSION_CODES.O)
    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)

        commandGamesAdapter = SuccessGameAdapter(
            requireContext(),
            games = arrayListOf()
        )

        binding.fgtGameList.adapter = commandGamesAdapter

        viewModel.currentGame.observe(viewLifecycleOwner) {
            when (it) {
                // Обработка успешного сетевого взаимодействия
                is Resource.Success -> {
                    if (it.value.isSuccessful) {
                        val currentGame = it.value.body()?.string()
                        if ((!currentGame.isNullOrEmpty()) && (currentGame != "null")) {
                            val body = Gson().fromJson(
                                currentGame,
                                GameAvailableModel::class.java
                            )

                            viewCurrentGame(body)
                        } else {
                            if (commandStatus == CommandStatus.TEAM_CREATOR) {
                                binding.constraintJoinGame.visibility = View.VISIBLE
                                binding.cardGame.visibility = View.GONE

                                binding.btnJoinGame.setOnClickListener {
                                    val args = Bundle()
                                    args.putInt("commands_id", commandsId!!)
                                    args.putInt("status", commandStatus!!)

                                    navigation(
                                        R.id.action_leadTeamFragment_to_gameJoinFragment,
                                        args
                                    )
                                }
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
                    handleApiError(it) { }
                }

                else -> {}
            }
        }

        viewModel.commandGames.observe(viewLifecycleOwner) {
            when (it) {
                // Обработка успешного сетевого взаимодействия
                is Resource.Success -> {
                    if (it.value.isSuccessful) {
                        val body = Gson().fromJson(
                            it.value.body()?.string(),
                            Array<GameAvailableModel>::class.java
                        )

                        commandGamesAdapter.setGames(
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

        commandsId?.let {
            getCommandGames(it)
            getCurrentGame(it)
        }
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
    ) = FragmentGamesTeamBinding.inflate(inflater, container, false)

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

    private fun getCurrentGame(id: Int) {
        viewModel.playerCommandCurrentGame(
            CommandsIdModel(
                commandsId = id
            )
        )
    }

    private fun getCommandGames(id: Int) {
        viewModel.playerCommandGames(
            CommandsIdModel(
                commandsId = id
            )
        )
    }

    @RequiresApi(Build.VERSION_CODES.O)
    @SuppressLint("SetTextI18n")
    private fun viewCurrentGame(game: GameAvailableModel) {
        binding.constraintJoinGame.visibility = View.GONE
        binding.cardGame.visibility = View.VISIBLE

        binding.tvGameAge.text = "${game.ageLimit}+"
        binding.tvGameLocation.text = game.location
        binding.tvGameName.text = game.name

        val dateBeginString = game.dateBegin
            ?.split("T")?.get(0)
            ?.split('-')
        val strBeginDate = (dateBeginString?.get(2) ?: "") + "." + (dateBeginString?.get(1) ?: "")

        val dateEndString = game.dateEnd
            ?.split("T")?.get(0)
            ?.split('-')
        val strEndDate = (dateEndString?.get(2) ?: "") + "." + (dateEndString?.get(1) ?: "")

        binding.tvGameTime.text = "$strBeginDate - $strEndDate"
        binding.tvGameCountMarks.text = "Количество точек: ${game.countQuests}"

        val begin = Instant.parse(game.dateBegin)
        val now = Instant.now()

        if(Duration.between(now, begin).toMinutes() <= 0) {
            binding.tvStatusGame.text = "Началась!"
        } else {
            binding.tvStatusGame.text = "Скоро"
        }

        binding.fgtGameList.updateLayoutParams<ConstraintLayout.LayoutParams> {
            topToBottom = R.id.cardGame
        }
    }
}