// Find all our documentation at https://docs.near.org
import { NearBindgen, near, call, view ,initialize} from 'near-sdk-js';
import { Candidate, Voting } from './model';





// E-Voting contract
@NearBindgen({})
export class EVotingContract {
  votings: Voting[]

  constructor() {
    this.votings = []
  }
  // Get the list of votings
  @view({})
  getVotings() : Voting[]{
    return this.votings;
  }

  //add a voting
  @call({})
  addVoting({title}:{title: string}): void {
    const voting = new Voting(title,(this.votings.length + 1));
    this.votings.push(voting);
  }
  
  //add candidate in a voting
  @call({})
  addCandidate({votingId, name, image, description}: {votingId: number, name: string, image: string, description: string}): void {
    for (const voting of this.votings) {
      if (voting.id = votingId) {
        const candidate = new Candidate((voting.candidates.length + 1),name, image, description);
        voting.candidates.push(candidate);
      }
    }
  }

  // Get the list of candidates in a specific voting
  @view({})
  getCandidates({id}:{id: number}): Candidate[] {
    const voting = this.votings[id];
    if (voting) {
      return voting.candidates;
    }
  }

  // Check if a candidate exists in a specific voting
  @view({})
  candidateExists({id, candidateName}:{id: string, candidateName: string}): boolean {
    const voting = this.votings[id];
    if (voting) {
      return this.votings[id].candidates.some((candidate) => candidate.name === candidateName);
    }
    return false;
  }

  // Allow a user to vote for a candidate in a specific voting
  @call({})
  vote({voteId, candidateId}:{voteId: number, candidateId: number}): void {
    const accountId = near.currentAccountId();
    const voting = this.votings[voteId];
    if (voting) {
      if (voting.voted.get(accountId)) {
        // User has already voted
        return;
      }
      const candidate = voting.candidates.find((c) => c.id === candidateId);
      if (!candidate) {
        // Candidate does not exist
        return;
      }
      // Increment the candidate's vote count and mark the sender as having voted
      candidate.voteCount += 1;
      voting.voted.set(accountId, true);
      this.votings[voteId] = voting;
    }
  }

  // Get the total number of candidates in a specific voting
  @view({})
  getCandidatesCount({id}:{id: number}): number {
    const voting = this.votings[id];
    if (voting) {
      return voting.candidates.length;
    }
    return 0;
  }


  

  // Get the total number of votings
  @view({})
  getVotingsCount(): number {
    return this.votings.length;
  }


}
