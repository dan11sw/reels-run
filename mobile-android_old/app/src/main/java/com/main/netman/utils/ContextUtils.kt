package com.main.netman.utils

import android.content.Context
import android.content.Intent

// Старт новой активности с определёнными флагами
fun<A : Context> Context.startStdActivity(
    activity: Class<A>,
    data: String? = null
){
    Intent(this, activity).also {
        it.flags = Intent.FLAG_ACTIVITY_NEW_TASK
        if(data != null){
            it.putExtra("data", data)
        }

        startActivity(it)
    }
}