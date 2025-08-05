package com.afc.reels_run.utils

import kotlin.math.abs

/**
 * Склонение числительных
 */
fun NumberWord(value: Int, words: Array<String>): String {
    val localVal = abs(value) % 100
    val number = localVal % 10

    if(value in 11..19) {
        return words[2]
    }else if(number in 2..4) {
        return words[1]
    } else if(number == 1) {
        return words[0]
    }

    return words[2]
}