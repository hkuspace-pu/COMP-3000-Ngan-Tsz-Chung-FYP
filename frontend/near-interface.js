import { utils } from 'near-api-js'

export class Contract {

  constructor({ contractId, walletToUse }) {
    this.contractId = contractId;
    this.wallet = walletToUse;
  }

  async addAdmin(aid){
    return this.wallet.callMethod({ contractId:this.contractId ,method: 'addAdmin', args: { aid: aid } })
  }

  async deleteAdmin(aid){
    return this.wallet.callMethod({ contractId:this.contractId ,method: 'deleteAdmin', args: { aid: aid } })
  }

  async isAdmin(aid){
    return this.wallet.viewMethod({contractId:this.contractId, method: 'isAdmin' , args: { aid: aid }})
  }

  async getAdmins(){
    return this.wallet.viewMethod({contractId:this.contractId, method: 'getAdmins' })
  }

  async getVotings(){
    // use the wallet to query the contract's greeting
    return this.wallet.viewMethod({contractId:this.contractId, method: 'getVotings' })
  }

  async getCandidates(votingId){
    // use the wallet to query the contract's greeting
    return this.wallet.viewMethod({contractId:this.contractId, method: 'getCandidates' ,args: { votingId: votingId }})
  }

  
  async addVoting(title,description){
    return this.wallet.callMethod({ contractId:this.contractId ,method: 'addVoting', args: { title: title,description:description } })
  }

  async deleteVoting(votingId){
    return this.wallet.callMethod({ contractId:this.contractId ,method: 'deleteVoting', args: { votingId: votingId } })
  }

  async addCandidate(votingId, name, image, description){
    // use the wallet to query the contract's greeting
    return this.wallet.callMethod({contractId:this.contractId, method: 'addCandidate' ,
    args: {votingId:votingId ,name:name ,image:image ,description:description }
    })
  }

  async deleteCandidate(votingId, candidateId){
    // use the wallet to query the contract's greeting
    return this.wallet.callMethod({contractId:this.contractId, method: 'deleteCandidate' ,
    args: {votingId:votingId ,candidateId:candidateId}
    })
  }


  async vote(votingId,candidateId){
     return this.wallet.callMethod({ contractId:this.contractId ,method: 'vote', args: { votingId: votingId, candidateId:candidateId} })
  }

  async isVoted(votingId){
    return this.wallet.viewMethod({contractId:this.contractId, method: 'isVoted' , args: { votingId: votingId }})
  }

  check(){
    // use the wallet to query the contract's greeting
    return true;
  }
}