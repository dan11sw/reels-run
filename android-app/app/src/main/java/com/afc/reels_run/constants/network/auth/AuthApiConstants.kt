package com.afc.reels_run.constants.network.auth

object AuthApiConstants {
    private const val BASE = "/api/auth"
    const val SIGN_UP = "${BASE}/sign-up"
    const val SIGN_IN = "${BASE}/sign-in"
    const val LOGOUT = "${BASE}/logout"
    const val REFRESH_TOKEN = "${BASE}/refresh/token"
    const val OAUTH = "${BASE}/oauth"
    const val VERIFICATION = "${BASE}/verification"
}