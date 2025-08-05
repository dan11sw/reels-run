package com.main.netman.event

import com.main.netman.models.game.QuestMarkModel

data class RemoveMarkEvent(
    var questId: Int? = null,
    var mark: QuestMarkModel? = null
)
