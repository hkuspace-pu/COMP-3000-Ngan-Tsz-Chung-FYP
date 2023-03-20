package uk.ac.plymouth.blockchain

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ArrayAdapter
import android.widget.TextView
import uk.ac.plymouth.blockchain.Database.Block
import java.util.ArrayList

class BlockAdaptor(context: Context,
                   val blocks : ArrayList<Block>)
    : ArrayAdapter<String>(context, R.layout.list_item_block){

    private val TAG = javaClass.simpleName

    override fun getView(position: Int, convertView: View?, parent: ViewGroup): View {
        val inflater = context
            .getSystemService(Context.LAYOUT_INFLATER_SERVICE) as LayoutInflater
        val rowView: View = inflater.inflate(R.layout.list_item_block, parent, false)
        val block = blocks[position]

        val tv_index = rowView.findViewById<TextView>(R.id.tv_index)
        val tv_timestamp = rowView.findViewById<TextView>(R.id.tv_timestamp)
        val tv_hash = rowView.findViewById<TextView>(R.id.tv_hash)
        val tv_prevHash = rowView.findViewById<TextView>(R.id.tv_prevHash)
        val tv_data = rowView.findViewById<TextView>(R.id.tv_data)
        val tv_nonce = rowView.findViewById<TextView>(R.id.tv_nonce)


        tv_index.text = block.index.toString()
        tv_timestamp.text = block.timestamp.toString()
        tv_hash.text = block.hash
        tv_prevHash.text = block.prevHash
        tv_data.text = block.data
        tv_nonce.text = block.nonce.toString()
        return rowView
    }


    override fun getCount(): Int {
        return blocks.size
    }
}