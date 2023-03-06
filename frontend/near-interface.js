import { utils } from 'near-api-js'

export class Contract {

  constructor({ contractId, walletToUse }) {
    this.contractId = contractId;
    this.wallet = walletToUse;
  }

  async getVotings(){
    // use the wallet to query the contract's greeting
    return this.wallet.viewMethod({contractId:this.contractId, method: 'getVotings' })
  }

  async getCandidates(votingId){
    // use the wallet to query the contract's greeting
    return this.wallet.viewMethod({contractId:this.contractId, method: 'getCandidates' ,args: { votingId: votingId }})
  }

  
  async addVoting(title){
    this.wallet.callMethod({ contractId:this.contractId ,method: 'addVoting', args: { title: title } })
    
  }

  async addCandidate(votingId, name, image, description){
    // use the wallet to query the contract's greeting
    return this.wallet.viewMethod({contractId:this.contractId, method: 'addCandidate' ,
    args: { 
        votingId: votingId ,
        name: name ,
        image: image ,
        description: description 
        }
    })
  }
}