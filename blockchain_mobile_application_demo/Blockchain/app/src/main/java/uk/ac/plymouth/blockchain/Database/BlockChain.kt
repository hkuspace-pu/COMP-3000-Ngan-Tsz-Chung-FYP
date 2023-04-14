package uk.ac.plymouth.blockchain.Database

import android.util.Log

class BlockChain {

    companion object {

        @JvmField var singleton: BlockChain? = null

        @JvmStatic fun singleton(): BlockChain {
            if (singleton == null) {
                synchronized(Database::class.java) {
                    if (singleton == null) {
                        singleton = BlockChain()
                    }
                }
            }
            return singleton!!
        }
    }

    @JvmField var blocks: ArrayList<Block> = ArrayList<Block>()

    fun addBlockWithData(data : String){
        if (blocks == null){
            blocks = ArrayList<Block>()
        }
        if (blocks.size == 0){
            val block = Block(
                index = 0,
                prevHash = "",
                data = data
            )
            blocks.add(block);
        }else{
            val block = Block(
                index = blocks.size,
                prevHash = blocks[blocks.size - 1].hash,
                data = data
            )
            blocks.add(block);
        }
    }

    fun clear(){
        blocks.clear()
    }


    fun isFirstBlockValid(): String {
        val firstBlock: Block = blocks[0]
        if (firstBlock.index !== 0) {
            return "firstBlock.index !== 0"
        }
        if (firstBlock.prevHash.isNotEmpty()) {
            return "firstBlock.prevHash.isNotEmpty()"
        }
        if (firstBlock.hash == null){
            return "firstBlock.hash == null"
        }
        if (Block.calculateHash(firstBlock) != firstBlock.hash){
            return "calculateHash != block.hash\n" + "block.hash  = " + firstBlock.hash + "\ncalculateHash = " + Block.calculateHash(firstBlock)
        }
        return ""
    }

    fun isValidBlock(block: Block?, previousBlock: Block?): String {
        if (block != null && previousBlock != null) {
            if (previousBlock.index + 1 !== block.index) {
                return "index not valid"
            }
            if (block.prevHash.isEmpty()){
                return "prevHash is Empty"
            }
            if (block.prevHash != previousBlock.hash
            ) {
                return "hash is not equal to next block's prevHash"
            }
            if (block.hash.isEmpty()){
                return "hash is Empty"
            }
            if (Block.calculateHash(block) != block.hash){
                return "calculateHash != block.hash \n" + "block.hash  = " + block.hash +
                        "\ncalculateHash = " + Block.calculateHash(block)
            }
        }
        return ""
    }

    fun isBlockChainValid(): String {
        if (isFirstBlockValid().isNotEmpty()) {
            return "Block#0 is not valid , " + isFirstBlockValid()
        }
        for (i in 1 until blocks.size ) {
            val currentBlock: Block = blocks[i]
            val previousBlock: Block = blocks[i - 1]
            if (isValidBlock(currentBlock, previousBlock).isNotEmpty()) {
                return "Block#$i is not valid , " + isValidBlock(currentBlock, previousBlock)
            }
        }
        return ""
    }


}