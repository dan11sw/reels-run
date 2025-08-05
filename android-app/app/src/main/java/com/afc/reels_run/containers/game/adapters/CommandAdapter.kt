package com.afc.reels_run.containers.game.adapters

import android.annotation.SuppressLint
import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import com.afc.reels_run.containers.base.BaseAdapter
import com.afc.reels_run.databinding.AdapterCommandItemEasyBinding
import com.afc.reels_run.models.command.CommandInfoModel

class CommandAdapter(
    private val context: Context,
    private var commands: ArrayList<CommandInfoModel>,
    private var nav: (id: Int) -> Unit
) : BaseAdapter<CommandInfoModel, AdapterCommandItemEasyBinding>() {

    @SuppressLint("NotifyDataSetChanged")
    fun setCommands(commandsInput: ArrayList<CommandInfoModel>){
        commands.clear()
        commands = commandsInput
        notifyDataSetChanged()
    }

    override fun getAdapterBinding(parent: ViewGroup, viewType: Int): BaseViewHolder<AdapterCommandItemEasyBinding> {
        val binding = AdapterCommandItemEasyBinding.inflate(LayoutInflater.from(context), parent, false)

        return BaseViewHolder(binding)
    }

    @SuppressLint("SetTextI18n")
    override fun onBindViewHolder(holder: BaseViewHolder<AdapterCommandItemEasyBinding>, @SuppressLint(
        "RecyclerView"
    ) position: Int) {
        val command = commands[position]
        holder.binding.teamName.text = command.name
        holder.binding.countMembers.text = command.countMembers.toString()
        holder.binding.pgBarItem.visibility = View.GONE

        holder.binding.cardView.setOnClickListener {
            command.id?.let { it1 -> nav(it1) }
        }
    }

    override fun getItemCount(): Int {
        return commands.size
    }
}