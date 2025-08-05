package com.afc.reels_run.containers.game.fragments

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.EditText
import com.google.android.material.dialog.MaterialAlertDialogBuilder
import com.google.gson.Gson
import com.afc.reels_run.R
import com.afc.reels_run.containers.base.BaseFragment
import com.afc.reels_run.containers.game.adapters.CommandAdapter
import com.afc.reels_run.containers.game.models.GameTeamViewModel
import com.afc.reels_run.databinding.FragmentFindTeamBinding
import com.afc.reels_run.models.command.CommandInfoModel
import com.afc.reels_run.models.command.CommandItemResponse
import com.afc.reels_run.models.command.TeamCreateModel
import com.afc.reels_run.models.command.TeamCreateRequestModel
import com.afc.reels_run.models.error.ErrorModel
import com.afc.reels_run.network.Resource
import com.afc.reels_run.network.apis.PlayerApi
import com.afc.reels_run.repositories.PlayerRepository
import com.afc.reels_run.utils.handleApiError
import com.afc.reels_run.utils.handleErrorMessage
import com.afc.reels_run.utils.hideKeyboard
import com.afc.reels_run.utils.navigation
import com.afc.reels_run.utils.visible

class FindTeamFragment :
    BaseFragment<GameTeamViewModel, FragmentFindTeamBinding, PlayerRepository>() {
    private lateinit var commandAdapter: CommandAdapter

    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)

        val nav: (id: Int) -> Unit = {
            val args = Bundle()
            args.putInt("commands_id", it)

            navigation(R.id.action_findTeamFragment_to_viewTeamFragment, args)
        }

        commandAdapter = CommandAdapter(
            requireContext(),
            commands = arrayListOf(),
            nav = nav
        )

        binding.rvFindCommand.adapter = commandAdapter

        // Обработка нажатия на кнопку создания команды
        binding.btnCreateTeam.setOnClickListener {
            // Создание диалогового окна
            val dialogBuilder = MaterialAlertDialogBuilder(requireContext())
            val viewDialog = layoutInflater.inflate(R.layout.dialog_create_team, null)
            // Добавление view диалоговому окну
            dialogBuilder.setView(viewDialog)
            // Открытие диалогового окна
            val dialog: androidx.appcompat.app.AlertDialog? = dialogBuilder.show()

            // Обработка отмены создания команды
            viewDialog.findViewById<Button>(R.id.cancel_create_command)
                .setOnClickListener(View.OnClickListener {
                    dialog?.dismiss()
                })

            // Название команды
            val commandName = viewDialog.findViewById<EditText>(R.id.create_command_name)

            // Создание команды
            viewDialog.findViewById<Button>(R.id.accept_create_command)
                .setOnClickListener(View.OnClickListener {
                    // Валидация
                    if (commandName.text.toString().length < 3) {
                        handleErrorMessage("Название команды должно состоять из трёх и более символов")
                        dialog?.dismiss()
                        return@OnClickListener
                    }

                    // Вызов функции для создания нового окна
                    createTeam(commandName.text.toString())
                    dialog?.dismiss()
                })
        }

        // Обработка результата запроса на создание новой команды
        viewModel.createTeamResponse.observe(viewLifecycleOwner) {
            binding.progressBar.visible(it is Resource.Loading)
            hideKeyboard()

            when (it) {
                // Обработка успешного сетевого взаимодействия
                is Resource.Success -> {
                    if (it.value.isSuccessful) {
                        val body = Gson().fromJson(
                            it.value.body()?.string(),
                            TeamCreateRequestModel::class.java
                        )
                        navigation(R.id.action_findTeamFragment_to_navigateGameFragment)
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

        viewModel.commands.observe(viewLifecycleOwner) {
            binding.progressBar.visible(it is Resource.Loading)
            hideKeyboard()

            when (it) {
                // Обработка успешного сетевого взаимодействия
                is Resource.Success -> {
                    if (it.value.isSuccessful) {
                        val body = Gson().fromJson(
                            it.value.body()?.string(),
                            Array<CommandItemResponse>::class.java
                        )

                        // Добавление новых команд в список
                        commandAdapter.setCommands(
                            body.map { it ->
                                return@map CommandInfoModel(
                                    id = it.id,
                                    name = it.name,
                                    countMembers = it.countPlayers
                                )
                            } as ArrayList<CommandInfoModel>
                        )

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

        // Получение списка команд
        commandsList()
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
    ) = FragmentFindTeamBinding.inflate(inflater, container, false)

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

    private fun createTeam(name: String) {
        viewModel.createTeam(
            TeamCreateModel(
                name = name
            )
        )
    }

    private fun commandsList() {
        viewModel.commandsList()
    }
}