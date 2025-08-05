package com.afc.reels_run.containers.game.fragments

import android.os.Bundle
import android.view.LayoutInflater
import android.view.ViewGroup
import com.google.gson.Gson
import com.afc.reels_run.constants.data.value.PlayerStatus
import com.afc.reels_run.containers.base.BaseFragment
import com.afc.reels_run.containers.game.adapters.CommandPlayersAdapter
import com.afc.reels_run.containers.game.models.GameTeamViewModel
import com.afc.reels_run.databinding.FragmentPlayersTeamBinding
import com.afc.reels_run.models.command.CommandPlayerModel
import com.afc.reels_run.models.command.CommandsIdModel
import com.afc.reels_run.models.error.ErrorModel
import com.afc.reels_run.network.Resource
import com.afc.reels_run.network.apis.PlayerApi
import com.afc.reels_run.repositories.PlayerRepository
import com.afc.reels_run.utils.handleApiError
import com.afc.reels_run.utils.handleErrorMessage

class PlayersTeamFragment(
    private var commandsId: Int?,
    private var type: String,
    private var playerStatus: Int = PlayerStatus.PLAYER_DEFAULT
) : BaseFragment<GameTeamViewModel, FragmentPlayersTeamBinding, PlayerRepository>() {
    private lateinit var commandPlayersAdapter: CommandPlayersAdapter

    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)

        commandPlayersAdapter = CommandPlayersAdapter(
            requireContext(),
            players = arrayListOf()
        )

        binding.rvPlayers.adapter = commandPlayersAdapter

        viewModel.commandPlayers.observe(viewLifecycleOwner) {
            when (it) {
                // Обработка успешного сетевого взаимодействия
                is Resource.Success -> {
                    if (it.value.isSuccessful) {
                        val body = Gson().fromJson(
                            it.value.body()?.string(),
                            Array<CommandPlayerModel>::class.java
                        )

                        commandPlayersAdapter.setPlayers(
                            body.map { it ->
                            return@map it
                        } as ArrayList<CommandPlayerModel>)
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

        if(commandsId != null) {
            playersTeam((commandsId!!))
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
    ) = FragmentPlayersTeamBinding.inflate(inflater, container, false)

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
     * Получение информации об игроках в команде
     */
    private fun playersTeam(commandsId: Int) {
        viewModel.commandPlayers(
            CommandsIdModel(
                commandsId = commandsId
            )
        )
    }
}