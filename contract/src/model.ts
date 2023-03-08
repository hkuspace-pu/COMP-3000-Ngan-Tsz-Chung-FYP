// Candidate data structure
export class Candidate {
    cid:number = 0
  name: string = '';
  image: string = '';
  description: string = '';
  voteCount: number = 0;

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
    vid: number = 0;
  title: string = '';
  description: string = '';
  candidates: Candidate[] = [];
  votedAccountId:string[] = [];
  constructor(vid:number,title: string,description:string) {
    this.vid = vid;
    this.title = title;
    this.description = description;
  }
}

// Admin data structure
export class Admin {
    aid: string = '';
  constructor(aid:string) {
    this.aid = aid;
  }
}