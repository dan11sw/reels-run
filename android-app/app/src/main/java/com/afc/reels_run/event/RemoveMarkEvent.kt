package com.afc.reels_run.event

import com.afc.reels_run.models.game.QuestMarkModel

data class RemoveMarkEvent(
    var questId: Int? = null,
    var mark: QuestMarkModel? = null
)
