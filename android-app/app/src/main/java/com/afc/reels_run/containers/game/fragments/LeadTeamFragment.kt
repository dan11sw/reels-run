package com.afc.reels_run.containers.game.fragments

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import com.google.android.material.dialog.MaterialAlertDialogBuilder
import com.google.gson.Gson
import com.afc.reels_run.R
import com.afc.reels_run.containers.base.BaseFragment
import com.afc.reels_run.containers.game.adapters.TeamViewPagerAdapter
import com.afc.reels_run.containers.game.models.GameTeamViewModel
import com.afc.reels_run.databinding.FragmentLeadTeamBinding
import com.afc.reels_run.models.command.CommandItemResponse
import com.afc.reels_run.models.command.CommandStatusModel
import com.afc.reels_run.models.command.CommandsIdModel
import com.afc.reels_run.models.error.ErrorModel
import com.afc.reels_run.network.Resource
import com.afc.reels_run.network.apis.PlayerApi
import com.afc.reels_run.repositories.PlayerRepository
import com.afc.reels_run.utils.handleApiError
import com.afc.reels_run.utils.handleErrorMessage
import com.afc.reels_run.utils.navigation
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.runBlocking


class LeadTeamFragment :
    BaseFragment<GameTeamViewModel, FragmentLeadTeamBinding, PlayerRepository>() {
    private var _viewPagerAdapter: TeamViewPagerAdapter? = null

    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)

        // Получение информации о команде
        val args = arguments
        val commandsId = args?.getInt("commands_id")
        val status = args?.getInt("status")

        // Определение адаптера для View Pager
        _viewPagerAdapter = TeamViewPagerAdapter(
            childFragmentManager,
            commandsId,
            "",
            status,
            if (viewModel.commandStatus.value?.commandsId != null) viewModel.commandStatus.value!!.commandsId else 0
        )

        binding.fltViewPager.adapter = _viewPagerAdapter
        binding.fltTabLayout.setupWithViewPager(binding.fltViewPager)


        // Обработка нажатия на кнопку создания команды
        binding.tvLeaveTeam.setOnClickListener {
            // Создание диалогового окна
            val dialogBuilder = MaterialAlertDialogBuilder(requireContext())
            val viewDialog = layoutInflater.inflate(R.layout.dialog_leave_team, null)
            // Добавление view диалоговому окну
            dialogBuilder.setView(viewDialog)
            // Открытие диалогового окна
            val dialog: androidx.appcompat.app.AlertDialog? = dialogBuilder.show()

            // Обработка отмены создания команды
            viewDialog.findViewById<Button>(R.id.cancel_leave_command)
                .setOnClickListener(View.OnClickListener {
                    dialog?.dismiss()
                })

            // Создание команды
            viewDialog.findViewById<Button>(R.id.accept_leave_command)
                .setOnClickListener(View.OnClickListener {

                    val data = Gson().fromJson(runBlocking {
                        commandPreferences.command.first()
                    }, CommandStatusModel::class.java)

                    if (data != null) {
                        leaveTeam(data.commandsId)
                    }
                    dialog?.dismiss()
                })
        }

        viewModel.commandDetach.observe(viewLifecycleOwner) {
            when (it) {
                // Обработка успешного сетевого взаимодействия
                is Resource.Success -> {
                    navigation(R.id.action_leadTeamFragment_to_navigateGameFragment)
                }

                // Обработка ошибок связанные с сетью
                is Resource.Failure -> {
                    handleApiError(it) { }
                }

                else -> {}
            }
        }

        viewModel.commandInfo.observe(viewLifecycleOwner) {
            when (it) {
                // Обработка успешного сетевого взаимодействия
                is Resource.Success -> {
                    if (it.value.isSuccessful) {
                        val body = Gson().fromJson(
                            it.value.body()?.string(),
                            CommandItemResponse::class.java
                        )

                        binding.tvTeamName.text = body.name
                        binding.tvCountPlayers.text = "участников: ${body.countPlayers.toString()}"
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

        if (commandsId != null) {
            // Получение информации о команде
            infoTeam((commandsId))
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
    ) = FragmentLeadTeamBinding.inflate(inflater, container, false)

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
     * Выход игрока из команды
     */
    private fun leaveTeam(commandsId: Int) {
        viewModel.commandDetach(
            CommandsIdModel(
                commandsId = commandsId
            )
        )
    }

    /**
     * Получение информации о команде
     */
    private fun infoTeam(commandsId: Int) {
        viewModel.commandInfo(
            CommandsIdModel(
                commandsId = commandsId
            )
        )
    }
}