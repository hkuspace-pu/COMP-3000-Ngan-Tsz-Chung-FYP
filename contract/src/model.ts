// Candidate data structure
export class Candidate {
    cid:number
  name: string;
  image: string;
  description: string;
  voteCount: number;

  constructor(cid:number,name: string, image: string, description: string) {
    this.cid = cid;
    this.name = name;
    this.image = image;
    this.description = description;
    this.voteCount = 0;
  }
}

// Voting data structure
export class Voting {
    vid: number;
  title: string;
  candidates: Candidate[];
  votedAccountId:string[];
  constructor(title: string,vid:number) {
    this.title = title;
    this.vid = vid;
    this.candidates = [];
    this.votedAccountId = []
  }
}