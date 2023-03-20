package uk.ac.plymouth.blockchain.Database

class DBIdentifier {

    companion object {
        val DATABASE_NAME = "blockchain.db"

        val INTEGER = "INTEGER"
        val TEXT = "TEXT"

        //Block
        val BLOCK_TABLE_NAME = "block"
        val BLOCK_INDEX = "b_index"
        val BLOCK_TIMESTAMP = "b_timestamp"
        val BLOCK_HASH = "b_hash"
        val BLOCK_PREV_HASH = "b_prev_hash"
        val BLOCK_DATA = "b_data"
        val BLOCK_NONCE = "b_nonce"
    }

}