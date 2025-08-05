package com.afc.reels_run.utils

import android.app.Activity
import android.content.Intent
import android.view.View
import android.view.ViewGroup
import androidx.core.content.ContextCompat
import com.google.android.material.snackbar.Snackbar
import com.afc.reels_run.R
import com.afc.reels_run.components.snackbar.CustomSnackBar
import com.afc.reels_run.containers.auth.AuthActivity
import com.afc.reels_run.network.RemoteDataSource
import com.afc.reels_run.network.apis.AuthApi
import com.afc.reels_run.store.CookiePreferences
import com.afc.reels_run.store.UserPreferences
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.runBlocking

/**
 * Запуск новой активности с определёнными параметрами (с чисткой задач предыдущей активности)
 * @property activity Активность, переход в которую будет осуществлён
 * @property message Сообщение, которое будет отправлено активности
 * @property type Тип сообщения
 */
fun <A : Activity> Activity.startNewActivity(
    activity: Class<A>,
    message: String? = null,
    type: String? = null
) {
    Intent(this, activity).also {
        it.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK or Intent.FLAG_ACTIVITY_NO_HISTORY
        if (message != null) {
            it.putExtra("message", message)
        }
        if (type != null) {
            it.putExtra("type", type)
        }

        startActivity(it)
    }
}

/**
 * Запуск новой активности с определёнными параметрами (без чистки предыдущих задач активностей)
 * @property activity Активность, переход в которую будет осуществлён
 * @property message Сообщение, которое будет отправлено активности
 * @property type Тип сообщения
 */
fun <A : Activity> Activity.startStdActivity(
    activity: Class<A>,
    message: String? = null,
    type: String? = null
) {
    Intent(this, activity).also {
        it.flags = Intent.FLAG_ACTIVITY_NEW_TASK
        if (message != null) {
            it.putExtra("message", message)
        }
        if (type != null) {
            it.putExtra("type", type)
        }

        startActivity(it)
    }
}

fun Activity.handleMessage(
    root: View,
    message: String,
    duration: Int = Snackbar.LENGTH_SHORT
) {
    Snackbar.make(root, message, duration).show()
}

fun Activity.handleErrorMessage(
    root: View,
    message: String,
    duration: Int = Snackbar.LENGTH_LONG
) {
    CustomSnackBar.make(
        root.parent as ViewGroup, message, duration, null,
        R.drawable.ic_error_polygon, null, ContextCompat.getColor(this, R.color.red_color)
    )?.show()
}


fun Activity.handleWarningMessage(
    root: View,
    message: String
) {
    CustomSnackBar.make(
        root.parent as ViewGroup, message, Snackbar.LENGTH_SHORT, null,
        R.drawable.ic_warning_polygon, null, ContextCompat.getColor(this, R.color.warning_color)
    )?.show()
}

fun Activity.handleSuccessMessage(
    root: View,
    message: String,
    duration: Int = Snackbar.LENGTH_SHORT
) {
    CustomSnackBar.make(
        root.parent as ViewGroup, message, duration, null,
        R.drawable.ic_success, null, ContextCompat.getColor(this, R.color.blue),
    )?.show()
}

fun Activity.checkAuth(
    userPreferences: UserPreferences,
    cookiePreferences: CookiePreferences,
    message: String? = null
): Boolean {
    // Проверка на авторизацию пользователя
    val authDataModel = runBlocking {
        userPreferences.auth.first()
    }

    if (authDataModel == null) {
        startNewActivity(
            AuthActivity::class.java,
            message,
            "warning"
        )

        return false
    }

    val remoteDataSource = RemoteDataSource()

    // Формирование API для взаимодействия с сервером
    val api = remoteDataSource.buildApi(AuthApi::class.java, userPreferences, cookiePreferences)

    val response = runBlocking {
        api.verification()
    }

    if (response.code() == 401) {
        startNewActivity(
            AuthActivity::class.java,
            message,
            "warning"
        )

        return false
    }

    return true
}

/**
 * Вывод сообщения в конкретный вид с помощью Intent активности
 * @property view Конкретный родительский вид, в котором будет происходить вывод сообщения
 */
fun Activity.showMessage(view: View) {
    val message = intent.getStringExtra("message")
    val type = intent.getStringExtra("type")

    if ((message != null) && (type != null) && (type != "data")) {
        when (intent.getStringExtra("type").toString()) {
            "error" -> {
                handleErrorMessage(view, intent.getStringExtra("message").toString())
            }

            "warning" -> {
                handleWarningMessage(view, intent.getStringExtra("message").toString())
            }

            else -> {
                handleMessage(view, intent.getStringExtra("message").toString())
            }
        }
    }
}

/**
 * Вывод сообщения в конкретный вид
 * @property view Конкретный родительский вид, в котором будет происходить вывод сообщения
 * @property message Сообщение
 * @property type Тип сообщения
 */
fun Activity.showMessage(
    view: View,
    message: String? = null,
    type: String? = null,
    duration: Int = Snackbar.LENGTH_SHORT
) {
    if (message != null) {
        if (type != null) {
            when (type.toString()) {
                "error" -> {
                    handleErrorMessage(view, message.toString())
                }

                "warning" -> {
                    handleWarningMessage(view, message.toString())
                }

                "success" -> {
                    handleSuccessMessage(view, message.toString(), duration)
                }

                else -> {
                    handleMessage(view, message.toString())
                }
            }
        } else {
            handleMessage(view, message.toString())
        }
    }
}