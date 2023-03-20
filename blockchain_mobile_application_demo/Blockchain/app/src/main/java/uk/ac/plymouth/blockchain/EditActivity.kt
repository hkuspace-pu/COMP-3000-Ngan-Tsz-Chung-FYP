package uk.ac.plymouth.blockchain

import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import androidx.appcompat.app.AppCompatActivity
import uk.ac.plymouth.blockchain.Database.Block
import uk.ac.plymouth.blockchain.Database.BlockChain

class EditActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_edit)

        val b = intent.extras
        var index = 0
        if (b != null) index = b.getInt("index")





        val blockchain = BlockChain.singleton()


        val et_index : EditText = findViewById(R.id.et_index)
        val et_timestamp : EditText = findViewById(R.id.et_timestamp)
        val et_hash : EditText = findViewById(R.id.et_hash)
        val et_prevHash : EditText = findViewById(R.id.et_prevHash)
        val et_data : EditText = findViewById(R.id.et_data)
        val et_nonce : EditText = findViewById(R.id.et_nonce)

        et_index.setText(blockchain.blocks[index].index.toString())
        et_timestamp.setText(blockchain.blocks[index].timestamp.toString())
        et_hash.setText(blockchain.blocks[index].hash.toString())
        et_prevHash.setText(blockchain.blocks[index].prevHash.toString())
        et_data.setText(blockchain.blocks[index].data.toString())
        et_nonce.setText(blockchain.blocks[index].nonce.toString())

        val btn_edit : Button = findViewById(R.id.btn_edit)
        btn_edit.setOnClickListener {

            val block = Block(
                index = et_index.text.toString().toInt(),
                timestamp = et_timestamp.text.toString().toLong(),
                hash = et_hash.text.toString(),
                prevHash = et_prevHash.text.toString(),
                data = et_data.text.toString(),
                nonce = et_nonce.text.toString().toInt(),
            )
            blockchain.blocks[index] = block
            finish()
        }
    }
}