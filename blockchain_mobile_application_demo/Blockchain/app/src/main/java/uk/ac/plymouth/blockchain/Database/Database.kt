package uk.ac.plymouth.blockchain.Database

import android.content.ContentValues
import android.content.Context
import android.database.sqlite.SQLiteDatabase
import android.database.sqlite.SQLiteOpenHelper
import android.util.Log
import uk.ac.plymouth.blockchain.Database.DBIdentifier.Companion.BLOCK_DATA
import uk.ac.plymouth.blockchain.Database.DBIdentifier.Companion.BLOCK_HASH
import uk.ac.plymouth.blockchain.Database.DBIdentifier.Companion.BLOCK_INDEX
import uk.ac.plymouth.blockchain.Database.DBIdentifier.Companion.BLOCK_NONCE
import uk.ac.plymouth.blockchain.Database.DBIdentifier.Companion.BLOCK_PREV_HASH
import uk.ac.plymouth.blockchain.Database.DBIdentifier.Companion.BLOCK_TABLE_NAME
import uk.ac.plymouth.blockchain.Database.DBIdentifier.Companion.BLOCK_TIMESTAMP
import uk.ac.plymouth.blockchain.Database.DBIdentifier.Companion.DATABASE_NAME
import uk.ac.plymouth.blockchain.Database.DBIdentifier.Companion.INTEGER
import uk.ac.plymouth.blockchain.Database.DBIdentifier.Companion.TEXT

class Database (val context: Context,
                val DATA_BASE_VERSION : Int = 1)
    : SQLiteOpenHelper(context,DATABASE_NAME, null, DATA_BASE_VERSION){

//    val TAG: String = Database::class.java.name
//    val RESULT_FAILED = -1
//    @JvmField var blocks: ArrayList<Block> = ArrayList<Block>()
//    private var sqLiteDatabase: SQLiteDatabase? = null
//    companion object {
//
//        @JvmField var singleton: Database? = null
//
//        @JvmStatic fun singleton(context: Context): Database {
//            if (singleton == null) {
//                synchronized(Database::class.java) {
//                    if (singleton == null) {
//                        singleton = Database(context)
//                    }
//                }
//            }
//            return singleton!!
//        }
//    }
//
//    init {
//        sqLiteDatabase = this.getWritableDatabase()
//        val dbfile = context.getDatabasePath(DATABASE_NAME)
//        if (dbfile.exists()) {
//            loadBlock()
//        }
//    }

    override fun onCreate(db: SQLiteDatabase?) {
        db?.execSQL(
            "CREATE TABLE IF NOT EXISTS " + BLOCK_TABLE_NAME + "(" +
                    BLOCK_INDEX + " " + INTEGER + " " + "PRIMARY KEY" + "," +
                    BLOCK_TIMESTAMP + " " + INTEGER + "," +
                    BLOCK_HASH + " " + TEXT + "," +
                    BLOCK_PREV_HASH + " " + TEXT + "," +
                    BLOCK_DATA + " " + TEXT + "," +
                    BLOCK_NONCE + " " + INTEGER + ")"
        )
    }

    override fun onUpgrade(db: SQLiteDatabase?, p1: Int, p2: Int) {
        onCreate(db)
    }

//
//    fun loadBlock() {
//        blocks = ArrayList()
//        val res = sqLiteDatabase!!.rawQuery("SELECT * FROM $BLOCK_TABLE_NAME", null)
//            ?: return
//        if (res.moveToFirst()) {
//            do {
//                val block = Block(
//                    index = res.getInt(res.getColumnIndex(BLOCK_INDEX)),
//                    timestamp = res.getLong(res.getColumnIndex(BLOCK_TIMESTAMP)),
//                    hash = res.getString(res.getColumnIndex(BLOCK_HASH)),
//                    prevHash = res.getString(res.getColumnIndex(BLOCK_PREV_HASH)),
//                    data = res.getString(res.getColumnIndex(BLOCK_DATA)),
//                    nonce = res.getInt(res.getColumnIndex(BLOCK_NONCE))
//                )
//                blocks.add(block)
//            } while (res.moveToNext())
//        }
//        Log.i(TAG,"loadBlock : " + blocks.size.toString())
//        res.close()
//    }
//    fun insertBlock(block: Block): Boolean {
//        val contentValues = ContentValues()
//
////        contentValues.put(VibranceDateBaseTable.VIBRANCE_SHOW_KEY, shows[key].key);
//        contentValues.put(BLOCK_INDEX, block.index)
//        contentValues.put(BLOCK_TIMESTAMP, block.timestamp)
//        contentValues.put(BLOCK_HASH, block.hash)
//        contentValues.put(BLOCK_PREV_HASH, block.prevHash)
//        contentValues.put(BLOCK_DATA, block.data)
//        contentValues.put(BLOCK_NONCE, block.nonce)
//        val result = sqLiteDatabase!!.insert(BLOCK_TABLE_NAME, null, contentValues)
//        Log.i(TAG,"inserting block ")
//        return getResult(result)
//    }
//    fun editBlock(block: Block): Boolean {
//        val contentValues = ContentValues()
//        contentValues.put(BLOCK_INDEX, block.index)
//        contentValues.put(BLOCK_TIMESTAMP, block.timestamp)
//        contentValues.put(BLOCK_HASH, block.hash)
//        contentValues.put(BLOCK_PREV_HASH, block.prevHash)
//        contentValues.put(BLOCK_DATA, block.data)
//        contentValues.put(BLOCK_NONCE, block.nonce)
//        val result = sqLiteDatabase!!.update(BLOCK_TABLE_NAME, contentValues,
//            BLOCK_INDEX + " = ? ", arrayOf(block.index.toString())).toLong()
//        Log.i(TAG,"editing Block : " + blocks.size.toString())
//        return getResult(result)
//    }
//
//    fun deleteBlock(block: Block) {
//        sqLiteDatabase!!.delete(BLOCK_TABLE_NAME,
//            BLOCK_INDEX + " = ? ", arrayOf(block.index.toString()))
//        loadBlock()
//        Log.i(TAG,"deleting Block : " + blocks.size.toString())
//    }
//
//    private fun getResult(result: Long): Boolean {
//        if (result == RESULT_FAILED.toLong()) {
//            Log.e(TAG,"fail to save")
//            return false
//        }
//        Log.i(TAG,"success to save")
//        return true
//    }
}