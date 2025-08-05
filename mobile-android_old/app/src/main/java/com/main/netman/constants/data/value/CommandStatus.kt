package com.main.netman.constants.data.value

object CommandStatus {
    const val WITHOUT_TEAM:  Int = 0;    // Игрок без команды
    const val TEAM_MEMBER:   Int = 1;    // Игрок находится в определённой команде
    const val TEAM_CREATOR:  Int = 2;    // Игрок является создателем команды
}