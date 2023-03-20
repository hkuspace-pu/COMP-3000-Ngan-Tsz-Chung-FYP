package uk.ac.plymouth.blockchain.Database

import java.security.MessageDigest
import java.security.NoSuchAlgorithmException

class Block {

    var index = 0;
    var timestamp : Long = 0;
    var hash = "";
    var prevHash = "";
    var data = "";
    var nonce = 0;

    constructor(
        index: Int = 0,
        timestamp: Long = 0,
        hash: String = "",
        prevHash: String = "",
        data: String = "",
        nonce: Int = 0
    ) {
        this.index = index
        this.timestamp = timestamp
        this.hash = hash
        this.prevHash = prevHash
        this.data = data
        this.nonce = nonce
    }

    constructor(index: Int = 0,prevHash: String = "",data: String = "") {
        this.index = index
        this.timestamp = System.currentTimeMillis()
        this.prevHash = prevHash
        this.data = data
        this.nonce = 0;
        this.hash = calculateHash(this);
    }

    fun str():String{
        return index.toString() + timestamp.toString() + prevHash + data + nonce.toString();
    }

    companion object {
        fun calculateHash(block:Block): String {
            if (block != null) {
                var digest: MessageDigest? = null
                digest = try {
                    MessageDigest.getInstance("SHA-256")
                } catch (e: NoSuchAlgorithmException) {
                    return ""
                }
                if (digest == null){
                    return ""
                }
                val txt = block.str()
                val bytes = digest.digest(txt.toByteArray())
                val builder = StringBuilder()
                for (b in bytes) {
                    val hex = Integer.toHexString(0xff and b.toInt())
                    if (hex.length == 1) {
                        builder.append('0')
                    }
                    builder.append(hex)
                }
                return builder.toString()
            }
            return ""
        }
    }

}