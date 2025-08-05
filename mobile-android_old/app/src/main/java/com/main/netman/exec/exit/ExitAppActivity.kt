package com.main.netman.exec.exit

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.main.netman.R
import kotlin.system.exitProcess

/**
 * Activity to initiate exit from the application
 */
class ExitAppActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_exit_app)

        finishAndRemoveTask()
        exitProcess(0)
    }
}