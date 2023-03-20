package uk.ac.plymouth.blockchain

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.AdapterView
import android.widget.Button
import android.widget.EditText
import android.widget.ListView
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import uk.ac.plymouth.blockchain.Database.BlockChain


class MainActivity : AppCompatActivity() {

    lateinit var blockchain : BlockChain
    lateinit var listView : ListView
    lateinit var adapter : BlockAdaptor
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        blockchain = BlockChain.singleton()
        listView = findViewById(R.id.listView)
        adapter = BlockAdaptor(this,blockchain.blocks)
        listView.adapter = adapter
        listView.onItemClickListener = AdapterView.OnItemClickListener { _, _, i, _ ->
            val intent = Intent(this@MainActivity, EditActivity::class.java)
            val b = Bundle()
            b.putInt("index", i) //Your id
            intent.putExtras(b) //Put your id to your next Intent
            startActivity(intent)
        }
        val btn_add : Button = findViewById(R.id.btn_add)
        val et_add : EditText = findViewById(R.id.et_add)

        btn_add.setOnClickListener {
            if (et_add.text.isEmpty()){
                return@setOnClickListener
            }
            blockchain.addBlockWithData(et_add.text.toString())
            reload()
        }
        val btn_clear : Button = findViewById(R.id.btn_clear)
        btn_clear.setOnClickListener {

            blockchain.clear()
            reload()
        }
    }

    override fun onResume() {
        super.onResume()
        reload()
    }

    private fun reload(){
        adapter.notifyDataSetChanged()
        if (blockchain.blocks.size == 0){
            return
        }
        if (blockchain.isBlockChainValid().isNotEmpty()){
            val tv_error_message : TextView = findViewById(R.id.tv_error_message)
            tv_error_message.text = blockchain.isBlockChainValid();
            tv_error_message.visibility = View.VISIBLE
        }else{
            val tv_error_message : TextView = findViewById(R.id.tv_error_message)
            tv_error_message.visibility = View.GONE
        }
    }
}