// data/attributions.ts

export interface Attribution {
  title: string;
  artist: string;
  source: string;
  license: string;
  path: string;
}


// data/attributions.ts

export const attributions: Attribution[] = [
  {
    title: "Burning Castles",
    artist: "Conquest",
    source: "https://freetouse.com/music",
    license: "Free No Copyright Music Download",
    path: "/sounds/Burning Castles.mp3",
  },
  {
    title: "Breton",
    artist: "Pufino",
    source: "https://freetouse.com/music",
    license: "Royalty Free Background Music",
    path: "/sounds/Breton.mp3",
  },
  {
    title: "Jester Dance",
    artist: "Conquest",
    source: "https://freetouse.com/music",
    license: "Vlog Music for Videos (Free Download)",
    path: "/sounds/Jester Dance.mp3",
  },
  {
    title: "Heritage",
    artist: "Pufino",
    source: "https://freetouse.com/music",
    license: "Royalty Free Music (Free Download)",
    path: "/sounds/Heritage.mp3",
  },  
];
