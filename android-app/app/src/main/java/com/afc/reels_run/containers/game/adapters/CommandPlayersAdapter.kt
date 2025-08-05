package com.afc.reels_run.containers.game.adapters

import android.annotation.SuppressLint
import android.content.Context
import android.view.LayoutInflater
import android.view.ViewGroup
import com.afc.reels_run.containers.base.BaseAdapter
import com.afc.reels_run.databinding.AdapterCommandPlayerItemBinding
import com.afc.reels_run.models.command.CommandPlayerModel
import com.squareup.picasso.Picasso

class CommandPlayersAdapter(
    private val context: Context,
    private var players: ArrayList<CommandPlayerModel>
) : BaseAdapter<CommandPlayerModel, AdapterCommandPlayerItemBinding>() {

    @SuppressLint("NotifyDataSetChanged")
    fun setPlayers(playersInput: ArrayList<CommandPlayerModel>){
        players.clear()
        players = playersInput
        notifyDataSetChanged()
    }

    override fun getAdapterBinding(parent: ViewGroup, viewType: Int): BaseViewHolder<AdapterCommandPlayerItemBinding> {
        val binding = AdapterCommandPlayerItemBinding.inflate(LayoutInflater.from(context), parent, false)

        return BaseViewHolder(binding)
    }

    @SuppressLint("SetTextI18n")
    override fun onBindViewHolder(holder: BaseViewHolder<AdapterCommandPlayerItemBinding>, @SuppressLint(
        "RecyclerView"
    ) position: Int) {
        val player = players[position]
        holder.binding.tvNickname.text = "${player.nickname}"
        holder.binding.tvFullname.text = "${player.surname} ${player.name}"
        if(player.creator == true) {
            holder.binding.tvPlayerStatus.text = "Создатель"
        } else {
            holder.binding.tvPlayerStatus.text = "Игрок"
        }

        holder.binding.tvRating.text = "${player.rating}"
        player.refImage?.let {
            if(it.isNotEmpty()) {
                Picasso.get().load(it).into(holder.binding.avatarPlayerItem)
            }
        }
    }

    override fun getItemCount(): Int {
        return players.size
    }
}