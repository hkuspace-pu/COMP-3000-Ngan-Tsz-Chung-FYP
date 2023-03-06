// Candidate data structure
export class Candidate {
    id:number
  name: string;
  image: string;
  description: string;
  voteCount: number;

  constructor(id:number,name: string, image: string, description: string) {
    this.id = id;
    this.name = name;
    this.image = image;
    this.description = description;
    this.voteCount = 0;
  }
}

// Voting data structure
export class Voting {
    id: number;
  title: string;
  candidates: Candidate[] = [];
  voted: Map<string, boolean> = new Map<string, boolean>();
  constructor(title: string,id:number) {
    this.title = title;
    this.id = id;
  }
}