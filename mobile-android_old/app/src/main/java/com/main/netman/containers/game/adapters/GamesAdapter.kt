package com.main.netman.containers.game.adapters

import android.annotation.SuppressLint
import android.content.Context
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import com.main.netman.containers.base.BaseAdapter
import com.main.netman.databinding.AdapterGameItemBinding
import com.main.netman.models.command.CommandInfoModel
import com.main.netman.models.game.InfoGameModel
import com.main.netman.utils.NumberWord

/**
 * Адаптер для работы с RecycleView для игр
 */
class GamesAdapter(
    private val context: Context,
    private var games: ArrayList<InfoGameModel>,
    private var func: (id: Int) -> Unit
) : BaseAdapter<CommandInfoModel, AdapterGameItemBinding>() {

    @SuppressLint("NotifyDataSetChanged")
    fun setGames(gamesInput: ArrayList<InfoGameModel>){
        games.clear()
        games = gamesInput

        notifyDataSetChanged()
    }

    override fun getAdapterBinding(parent: ViewGroup, viewType: Int): BaseViewHolder<AdapterGameItemBinding> {
        val binding = AdapterGameItemBinding.inflate(LayoutInflater.from(context), parent, false)

        return BaseViewHolder(binding)
    }

    @SuppressLint("SetTextI18n")
    override fun onBindViewHolder(holder: BaseViewHolder<AdapterGameItemBinding>, @SuppressLint(
        "RecyclerView"
    ) position: Int) {
        val game = games[position]

        holder.binding.tvGameName.text = game.title

        holder.binding.tvGameCountMarks.text = game.quests.let {
            val text = NumberWord(it.size, arrayOf("квест", "квеста", "квестов"))
            "${it.size} $text"
        }

        game.location?.let {
            if(it.trim().isNotEmpty()) {
                holder.binding.tvGameLocation.text = it
                holder.binding.layoutLocation.visibility = View.VISIBLE
            }
        }

        // Создание обработчика для регистрации на игру
        holder.binding.btnJoin.setOnClickListener {
            game.id?.let {
                func(it)
            }
        }
    }

    override fun getItemCount(): Int {
        return games.size
    }
}