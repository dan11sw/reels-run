package com.afc.reels_run.containers.game.adapters

import android.annotation.SuppressLint
import android.content.Context
import android.view.LayoutInflater
import android.view.ViewGroup
import com.afc.reels_run.containers.base.BaseAdapter
import com.afc.reels_run.databinding.AdapterSuccessGameItemBinding
import com.afc.reels_run.models.game.GameAvailableModel

class SuccessGameAdapter(
    private val context: Context,
    private var games: ArrayList<GameAvailableModel>
) : BaseAdapter<GameAvailableModel, AdapterSuccessGameItemBinding>() {

    @SuppressLint("NotifyDataSetChanged")
    fun setGames(gamesInput: ArrayList<GameAvailableModel>){
        games.clear()
        games = gamesInput
        notifyDataSetChanged()
    }

    override fun getAdapterBinding(parent: ViewGroup, viewType: Int): BaseViewHolder<AdapterSuccessGameItemBinding> {
        val binding = AdapterSuccessGameItemBinding.inflate(LayoutInflater.from(context), parent, false)

        return BaseViewHolder(binding)
    }

    @SuppressLint("SetTextI18n")
    override fun onBindViewHolder(holder: BaseViewHolder<AdapterSuccessGameItemBinding>, @SuppressLint(
        "RecyclerView"
    ) position: Int) {
        val game = games[position]
        holder.binding.tvGameAge.text = "${game.ageLimit}+"
        holder.binding.tvGameLocation.text = game.location
        holder.binding.tvGameName.text = game.name

        val dateBeginString = game.dateBegin
            ?.split("T")?.get(0)
            ?.split('-')
        val strBeginDate = (dateBeginString?.get(2) ?: "") + "." + (dateBeginString?.get(1) ?: "")

        val dateEndString = game.dateEnd
            ?.split("T")?.get(0)
            ?.split('-')
        val strEndDate = (dateEndString?.get(2) ?: "") + "." + (dateEndString?.get(1) ?: "")

        holder.binding.tvGameTime.text = "$strBeginDate - $strEndDate"
        holder.binding.tvGameCountMarks.text = "Количество точек: ${game.countQuests}"
    }

    override fun getItemCount(): Int {
        return games.size
    }
}