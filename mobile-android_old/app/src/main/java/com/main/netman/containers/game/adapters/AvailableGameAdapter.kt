package com.main.netman.containers.game.adapters

import android.annotation.SuppressLint
import android.content.Context
import android.view.LayoutInflater
import android.view.ViewGroup
import com.main.netman.containers.base.BaseAdapter
import com.main.netman.databinding.AdapterAvailableGameItemBinding
import com.main.netman.models.game.GameAvailableModel

class AvailableGameAdapter(
    private val context: Context,
    private var games: ArrayList<GameAvailableModel>,
    private var joinHandler: (id: Int, name: String) -> Unit
) : BaseAdapter<GameAvailableModel, AdapterAvailableGameItemBinding>() {

    @SuppressLint("NotifyDataSetChanged")
    fun setGames(playersInput: ArrayList<GameAvailableModel>){
        games.clear()
        games = playersInput
        notifyDataSetChanged()
    }

    override fun getAdapterBinding(parent: ViewGroup, viewType: Int): BaseViewHolder<AdapterAvailableGameItemBinding> {
        val binding = AdapterAvailableGameItemBinding.inflate(LayoutInflater.from(context), parent, false)

        return BaseViewHolder(binding)
    }

    @SuppressLint("SetTextI18n")
    override fun onBindViewHolder(holder: BaseViewHolder<AdapterAvailableGameItemBinding>, @SuppressLint(
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

        holder.binding.btnJoin.setOnClickListener {
            if(game.id != null && game.name != null) {
                joinHandler(game.id!!, game.name!!)
            }
        }
    }

    override fun getItemCount(): Int {
        return games.size
    }
}