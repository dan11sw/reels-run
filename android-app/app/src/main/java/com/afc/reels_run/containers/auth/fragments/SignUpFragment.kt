package com.afc.reels_run.containers.auth.fragments

import android.os.Bundle
import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.core.widget.addTextChangedListener
import androidx.lifecycle.lifecycleScope
import com.google.gson.Gson
import com.google.gson.JsonParser
import com.afc.reels_run.MainActivity
import com.afc.reels_run.R
import com.afc.reels_run.containers.auth.models.AuthViewModel
import com.afc.reels_run.containers.base.BaseFragment
import com.afc.reels_run.databinding.FragmentSignUpBinding
import com.afc.reels_run.models.auth.AuthSignUpModel
import com.afc.reels_run.models.error.ErrorModel
import com.afc.reels_run.network.Resource
import com.afc.reels_run.network.apis.AuthApi
import com.afc.reels_run.repositories.AuthRepository
import com.afc.reels_run.utils.date.DatePickerHelper
import com.afc.reels_run.utils.enable
import com.afc.reels_run.utils.handleApiError
import com.afc.reels_run.utils.handleErrorMessage
import com.afc.reels_run.utils.hideKeyboard
import com.afc.reels_run.utils.navigation
import com.afc.reels_run.utils.startNewActivity
import com.afc.reels_run.utils.visible
import kotlinx.coroutines.launch

class SignUpFragment : BaseFragment<AuthViewModel, FragmentSignUpBinding, AuthRepository>() {
    lateinit var datePicker: DatePickerHelper

    // Обработка одного из методов жизненного цикла фрагмента,
    // который обозначает что содержащая его активность вызвала
    // метод onCreate() и полностью создалась, таким образом
    // предоставив возможность использовать данные активности
    @Deprecated("Deprecated in Java")
    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)


        // Первоначальная установка состояний компонентов
        binding.progressBar.visible(false)
        binding.btnAuth.enable(false)

        // Устанавливаем прослушивание на изменение данных loginResponse из viewModel
        // абстрактного класса (который был сгенерирован на основе переданного AuthViewModel)
        viewModel.signUpResponse.observe(viewLifecycleOwner) {
            // Состояние компонента зависит от того, находится ли ресурс
            // в состоянии загрузки или нет
            binding.progressBar.visible(it is Resource.Loading)
            hideKeyboard()

            when (it) {
                // Обработка успешного сетевого взаимодействия
                is Resource.Success -> {
                    if (it.value.isSuccessful) {
                        // Запуск в контексте жизненного цикла
                        lifecycleScope.launch {
                            // Сохранение полученных данных в формате JSON-строки
                            viewModel.saveAuth(
                                Gson().toJson(
                                    JsonParser.parseString(
                                        it.value.body()?.string()
                                    )
                                )
                            )

                            requireActivity().startNewActivity(MainActivity::class.java)
                        }
                    } else {
                        val error = Gson().fromJson(
                            it.value.errorBody()?.string().toString(),
                            ErrorModel::class.java
                        )

                        handleErrorMessage(
                            if (error.errors != null && error.errors!!.isNotEmpty())
                                error.errors?.first()!!.msg
                            else
                                error.message!!
                        )
                    }
                }

                // Обработка ошибок связанные с сетью
                is Resource.Failure -> {
                    handleApiError(it) { signUp() }
                }

                else -> {}
            }
        }

        // Установка поведения на изменения текста в элементе управления
        binding.password.addTextChangedListener {
            val email = binding.password.text.toString().trim()
            binding.btnAuth.enable(email.isNotEmpty() && it.toString().isNotEmpty())
        }

        binding.btnAuth.setOnClickListener {
            signUp()
        }

        binding.txtSignIn.setOnClickListener {
            navigation(R.id.action_signUpFragment_to_signInFragment)
        }
    }

    /**
     * Метод получения ViewModel текущего фрагмента
     */
    override fun getViewModel() = AuthViewModel::class.java

    /**
     * Метод получения экземпляра фрагмента
     */
    override fun getFragmentBinding(
        inflater: LayoutInflater,
        container: ViewGroup?
    ) = FragmentSignUpBinding.inflate(inflater, container, false)

    /**
     * Метод получения репозитория данного фрагмента
     */
    override fun getFragmentRepository() =
        AuthRepository(remoteDataSource.buildApi(AuthApi::class.java, null, cookiePreferences, false), userPreferences)

    /**
     * Функционал элемента управления, который был выведен в отдельную функцию
     */
    private fun signUp() {
        viewModel.signUp(
            AuthSignUpModel(
                nickname = binding.nickname.text.toString(),
                email = binding.email.text.toString(),
                password = binding.password.text.toString()
            )
        )
    }
}