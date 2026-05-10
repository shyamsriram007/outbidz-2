export interface PlayerStats {
  matches: number;
  runs: number;
  wickets: number;
}

export interface Player {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  role: string;
  basePrice: number;
  category: string;
  team2026: string | null;
  isCapped: boolean;
  stats: PlayerStats;
}

export const PLAYERS: Player[] = [
  {
    "id": "p1",
    "name": "Ruturaj Gaikwad",
    "country": "India",
    "countryCode": "IN",
    "role": "batsman",
    "basePrice": 200,
    "category": "marquee",
    "team2026": "csk",
    "isCapped": true,
    "stats": {
      "matches": 100,
      "runs": 3200,
      "wickets": 0
    }
  },
  {
    "id": "p2",
    "name": "MS Dhoni",
    "country": "India",
    "countryCode": "IN",
    "role": "wicket-keeper",
    "basePrice": 200,
    "category": "marquee",
    "team2026": "csk",
    "isCapped": false,
    "stats": {
      "matches": 370,
      "runs": 7400,
      "wickets": 0
    }
  },
  {
    "id": "p3",
    "name": "Sanju Samson",
    "country": "India",
    "countryCode": "IN",
    "role": "wicket-keeper",
    "basePrice": 200,
    "category": "marquee",
    "team2026": "csk",
    "isCapped": true,
    "stats": {
      "matches": 195,
      "runs": 5200,
      "wickets": 0
    }
  },
  {
    "id": "p4",
    "name": "Shivam Dube",
    "country": "India",
    "countryCode": "IN",
    "role": "all-rounder",
    "basePrice": 150,
    "category": "all-rounder",
    "team2026": "csk",
    "isCapped": true,
    "stats": {
      "matches": 90,
      "runs": 2000,
      "wickets": 15
    }
  },
  {
    "id": "p5",
    "name": "Jamie Overton",
    "country": "England",
    "countryCode": "GB",
    "role": "all-rounder",
    "basePrice": 150,
    "category": "all-rounder",
    "team2026": "csk",
    "isCapped": true,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p6",
    "name": "Khaleel Ahmed",
    "country": "India",
    "countryCode": "IN",
    "role": "bowler",
    "basePrice": 100,
    "category": "bowler",
    "team2026": "csk",
    "isCapped": true,
    "stats": {
      "matches": 40,
      "runs": 10,
      "wickets": 45
    }
  },
  {
    "id": "p7",
    "name": "Noor Ahmad",
    "country": "Afghanistan",
    "countryCode": "AF",
    "role": "bowler",
    "basePrice": 75,
    "category": "bowler",
    "team2026": "csk",
    "isCapped": true,
    "stats": {
      "matches": 45,
      "runs": 10,
      "wickets": 55
    }
  },
  {
    "id": "p8",
    "name": "Nathan Ellis",
    "country": "Australia",
    "countryCode": "AU",
    "role": "bowler",
    "basePrice": 100,
    "category": "bowler",
    "team2026": "csk",
    "isCapped": true,
    "stats": {
      "matches": 55,
      "runs": 30,
      "wickets": 65
    }
  },
  {
    "id": "p9",
    "name": "Mukesh Choudhary",
    "country": "India",
    "countryCode": "IN",
    "role": "bowler",
    "basePrice": 50,
    "category": "bowler",
    "team2026": "csk",
    "isCapped": false,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p10",
    "name": "Anshul Kamboj",
    "country": "India",
    "countryCode": "IN",
    "role": "bowler",
    "basePrice": 30,
    "category": "uncapped",
    "team2026": "csk",
    "isCapped": false,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p11",
    "name": "Shreyas Gopal",
    "country": "India",
    "countryCode": "IN",
    "role": "bowler",
    "basePrice": 50,
    "category": "bowler",
    "team2026": "csk",
    "isCapped": false,
    "stats": {
      "matches": 50,
      "runs": 200,
      "wickets": 50
    }
  },
  {
    "id": "p12",
    "name": "Gurjapneet Singh",
    "country": "India",
    "countryCode": "IN",
    "role": "bowler",
    "basePrice": 30,
    "category": "uncapped",
    "team2026": "csk",
    "isCapped": false,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p13",
    "name": "Akeal Hosein",
    "country": "West Indies",
    "countryCode": "WI",
    "role": "bowler",
    "basePrice": 75,
    "category": "bowler",
    "team2026": "csk",
    "isCapped": true,
    "stats": {
      "matches": 80,
      "runs": 200,
      "wickets": 95
    }
  },
  {
    "id": "p14",
    "name": "Matt Henry",
    "country": "New Zealand",
    "countryCode": "NZ",
    "role": "bowler",
    "basePrice": 100,
    "category": "bowler",
    "team2026": "csk",
    "isCapped": true,
    "stats": {
      "matches": 60,
      "runs": 30,
      "wickets": 75
    }
  },
  {
    "id": "p15",
    "name": "Rahul Chahar",
    "country": "India",
    "countryCode": "IN",
    "role": "bowler",
    "basePrice": 75,
    "category": "bowler",
    "team2026": "csk",
    "isCapped": true,
    "stats": {
      "matches": 75,
      "runs": 30,
      "wickets": 85
    }
  },
  {
    "id": "p16",
    "name": "Dewald Brevis",
    "country": "South Africa",
    "countryCode": "ZA",
    "role": "batsman",
    "basePrice": 100,
    "category": "batsman",
    "team2026": "csk",
    "isCapped": true,
    "stats": {
      "matches": 50,
      "runs": 1000,
      "wickets": 5
    }
  },
  {
    "id": "p17",
    "name": "Ayush Mhatre",
    "country": "India",
    "countryCode": "IN",
    "role": "batsman",
    "basePrice": 30,
    "category": "uncapped",
    "team2026": "csk",
    "isCapped": false,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p18",
    "name": "Sarfaraz Khan",
    "country": "India",
    "countryCode": "IN",
    "role": "batsman",
    "basePrice": 75,
    "category": "batsman",
    "team2026": "csk",
    "isCapped": true,
    "stats": {
      "matches": 20,
      "runs": 300,
      "wickets": 0
    }
  },
  {
    "id": "p19",
    "name": "Kartik Sharma",
    "country": "India",
    "countryCode": "IN",
    "role": "wicket-keeper",
    "basePrice": 30,
    "category": "uncapped",
    "team2026": "csk",
    "isCapped": false,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p20",
    "name": "Urvil Patel",
    "country": "India",
    "countryCode": "IN",
    "role": "wicket-keeper",
    "basePrice": 30,
    "category": "uncapped",
    "team2026": "csk",
    "isCapped": false,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p21",
    "name": "Ramakrishna Ghosh",
    "country": "India",
    "countryCode": "IN",
    "role": "all-rounder",
    "basePrice": 30,
    "category": "uncapped",
    "team2026": "csk",
    "isCapped": false,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p22",
    "name": "Prashant Veer",
    "country": "India",
    "countryCode": "IN",
    "role": "all-rounder",
    "basePrice": 30,
    "category": "uncapped",
    "team2026": "csk",
    "isCapped": false,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p23",
    "name": "Matthew Short",
    "country": "Australia",
    "countryCode": "AU",
    "role": "all-rounder",
    "basePrice": 75,
    "category": "all-rounder",
    "team2026": "csk",
    "isCapped": true,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p24",
    "name": "Aman Khan",
    "country": "India",
    "countryCode": "IN",
    "role": "all-rounder",
    "basePrice": 30,
    "category": "uncapped",
    "team2026": "csk",
    "isCapped": false,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p25",
    "name": "Zak Foulkes",
    "country": "Australia",
    "countryCode": "AU",
    "role": "bowler",
    "basePrice": 50,
    "category": "bowler",
    "team2026": "csk",
    "isCapped": true,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p26",
    "name": "Axar Patel",
    "country": "India",
    "countryCode": "IN",
    "role": "all-rounder",
    "basePrice": 150,
    "category": "marquee",
    "team2026": "dc",
    "isCapped": true,
    "stats": {
      "matches": 195,
      "runs": 2200,
      "wickets": 200
    }
  },
  {
    "id": "p27",
    "name": "KL Rahul",
    "country": "India",
    "countryCode": "IN",
    "role": "wicket-keeper",
    "basePrice": 200,
    "category": "marquee",
    "team2026": "dc",
    "isCapped": true,
    "stats": {
      "matches": 240,
      "runs": 7200,
      "wickets": 0
    }
  },
  {
    "id": "p28",
    "name": "Kuldeep Yadav",
    "country": "India",
    "countryCode": "IN",
    "role": "bowler",
    "basePrice": 150,
    "category": "bowler",
    "team2026": "dc",
    "isCapped": true,
    "stats": {
      "matches": 120,
      "runs": 100,
      "wickets": 155
    }
  },
  {
    "id": "p29",
    "name": "Tristan Stubbs",
    "country": "South Africa",
    "countryCode": "ZA",
    "role": "wicket-keeper",
    "basePrice": 150,
    "category": "wicket-keeper",
    "team2026": "dc",
    "isCapped": true,
    "stats": {
      "matches": 80,
      "runs": 1800,
      "wickets": 0
    }
  },
  {
    "id": "p30",
    "name": "Abishek Porel",
    "country": "India",
    "countryCode": "IN",
    "role": "wicket-keeper",
    "basePrice": 50,
    "category": "wicket-keeper",
    "team2026": "dc",
    "isCapped": false,
    "stats": {
      "matches": 15,
      "runs": 200,
      "wickets": 0
    }
  },
  {
    "id": "p31",
    "name": "Mitchell Starc",
    "country": "Australia",
    "countryCode": "AU",
    "role": "bowler",
    "basePrice": 200,
    "category": "marquee",
    "team2026": "dc",
    "isCapped": true,
    "stats": {
      "matches": 95,
      "runs": 180,
      "wickets": 125
    }
  },
  {
    "id": "p32",
    "name": "T. Natarajan",
    "country": "India",
    "countryCode": "IN",
    "role": "bowler",
    "basePrice": 100,
    "category": "bowler",
    "team2026": "dc",
    "isCapped": true,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p33",
    "name": "Karun Nair",
    "country": "India",
    "countryCode": "IN",
    "role": "batsman",
    "basePrice": 50,
    "category": "batsman",
    "team2026": "dc",
    "isCapped": true,
    "stats": {
      "matches": 70,
      "runs": 1500,
      "wickets": 0
    }
  },
  {
    "id": "p34",
    "name": "David Miller",
    "country": "South Africa",
    "countryCode": "ZA",
    "role": "batsman",
    "basePrice": 150,
    "category": "batsman",
    "team2026": "dc",
    "isCapped": true,
    "stats": {
      "matches": 370,
      "runs": 7200,
      "wickets": 6
    }
  },
  {
    "id": "p35",
    "name": "Mukesh Kumar",
    "country": "India",
    "countryCode": "IN",
    "role": "bowler",
    "basePrice": 100,
    "category": "bowler",
    "team2026": "dc",
    "isCapped": true,
    "stats": {
      "matches": 30,
      "runs": 5,
      "wickets": 30
    }
  },
  {
    "id": "p36",
    "name": "Dushmantha Chameera",
    "country": "Sri Lanka",
    "countryCode": "LK",
    "role": "bowler",
    "basePrice": 75,
    "category": "bowler",
    "team2026": "dc",
    "isCapped": true,
    "stats": {
      "matches": 60,
      "runs": 20,
      "wickets": 75
    }
  },
  {
    "id": "p37",
    "name": "Lungi Ngidi",
    "country": "South Africa",
    "countryCode": "ZA",
    "role": "bowler",
    "basePrice": 75,
    "category": "bowler",
    "team2026": "dc",
    "isCapped": true,
    "stats": {
      "matches": 90,
      "runs": 50,
      "wickets": 115
    }
  },
  {
    "id": "p38",
    "name": "Kyle Jamieson",
    "country": "New Zealand",
    "countryCode": "NZ",
    "role": "bowler",
    "basePrice": 100,
    "category": "bowler",
    "team2026": "dc",
    "isCapped": true,
    "stats": {
      "matches": 40,
      "runs": 80,
      "wickets": 45
    }
  },
  {
    "id": "p39",
    "name": "Sameer Rizvi",
    "country": "India",
    "countryCode": "IN",
    "role": "batsman",
    "basePrice": 50,
    "category": "batsman",
    "team2026": "dc",
    "isCapped": false,
    "stats": {
      "matches": 8,
      "runs": 120,
      "wickets": 0
    }
  },
  {
    "id": "p40",
    "name": "Ashutosh Sharma",
    "country": "India",
    "countryCode": "IN",
    "role": "batsman",
    "basePrice": 50,
    "category": "batsman",
    "team2026": "dc",
    "isCapped": false,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p41",
    "name": "Vipraj Nigam",
    "country": "India",
    "countryCode": "IN",
    "role": "all-rounder",
    "basePrice": 20,
    "category": "uncapped",
    "team2026": "dc",
    "isCapped": false,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p42",
    "name": "Ajay Mandal",
    "country": "India",
    "countryCode": "IN",
    "role": "all-rounder",
    "basePrice": 20,
    "category": "uncapped",
    "team2026": "dc",
    "isCapped": false,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p43",
    "name": "Tripurana Vijay",
    "country": "India",
    "countryCode": "IN",
    "role": "all-rounder",
    "basePrice": 20,
    "category": "uncapped",
    "team2026": "dc",
    "isCapped": false,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p44",
    "name": "Madhav Tiwari",
    "country": "India",
    "countryCode": "IN",
    "role": "all-rounder",
    "basePrice": 20,
    "category": "uncapped",
    "team2026": "dc",
    "isCapped": false,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p45",
    "name": "Ben Duckett",
    "country": "England",
    "countryCode": "GB",
    "role": "batsman",
    "basePrice": 100,
    "category": "batsman",
    "team2026": "dc",
    "isCapped": true,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p46",
    "name": "Pathum Nissanka",
    "country": "Sri Lanka",
    "countryCode": "LK",
    "role": "batsman",
    "basePrice": 75,
    "category": "batsman",
    "team2026": "dc",
    "isCapped": true,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p47",
    "name": "Prithvi Shaw",
    "country": "India",
    "countryCode": "IN",
    "role": "batsman",
    "basePrice": 75,
    "category": "batsman",
    "team2026": "dc",
    "isCapped": true,
    "stats": {
      "matches": 80,
      "runs": 2200,
      "wickets": 0
    }
  },
  {
    "id": "p48",
    "name": "Nitish Rana",
    "country": "India",
    "countryCode": "IN",
    "role": "all-rounder",
    "basePrice": 75,
    "category": "all-rounder",
    "team2026": "dc",
    "isCapped": true,
    "stats": {
      "matches": 120,
      "runs": 3000,
      "wickets": 5
    }
  },
  {
    "id": "p49",
    "name": "Sahil Parakh",
    "country": "India",
    "countryCode": "IN",
    "role": "batsman",
    "basePrice": 20,
    "category": "uncapped",
    "team2026": "dc",
    "isCapped": false,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p50",
    "name": "Auqib Nabi Dar",
    "country": "India",
    "countryCode": "IN",
    "role": "all-rounder",
    "basePrice": 20,
    "category": "uncapped",
    "team2026": "dc",
    "isCapped": false,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p51",
    "name": "Shubman Gill",
    "country": "India",
    "countryCode": "IN",
    "role": "batsman",
    "basePrice": 200,
    "category": "marquee",
    "team2026": "gt",
    "isCapped": true,
    "stats": {
      "matches": 130,
      "runs": 4000,
      "wickets": 0
    }
  },
  {
    "id": "p52",
    "name": "Rashid Khan",
    "country": "Afghanistan",
    "countryCode": "AF",
    "role": "bowler",
    "basePrice": 200,
    "category": "marquee",
    "team2026": "gt",
    "isCapped": true,
    "stats": {
      "matches": 400,
      "runs": 1200,
      "wickets": 500
    }
  },
  {
    "id": "p53",
    "name": "Jos Buttler",
    "country": "England",
    "countryCode": "GB",
    "role": "wicket-keeper",
    "basePrice": 200,
    "category": "marquee",
    "team2026": "gt",
    "isCapped": true,
    "stats": {
      "matches": 340,
      "runs": 10200,
      "wickets": 0
    }
  },
  {
    "id": "p54",
    "name": "Mohammed Siraj",
    "country": "India",
    "countryCode": "IN",
    "role": "bowler",
    "basePrice": 200,
    "category": "marquee",
    "team2026": "gt",
    "isCapped": true,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p55",
    "name": "Kagiso Rabada",
    "country": "South Africa",
    "countryCode": "ZA",
    "role": "bowler",
    "basePrice": 200,
    "category": "marquee",
    "team2026": "gt",
    "isCapped": true,
    "stats": {
      "matches": 195,
      "runs": 280,
      "wickets": 255
    }
  },
  {
    "id": "p56",
    "name": "Sai Sudharsan",
    "country": "India",
    "countryCode": "IN",
    "role": "batsman",
    "basePrice": 150,
    "category": "batsman",
    "team2026": "gt",
    "isCapped": true,
    "stats": {
      "matches": 45,
      "runs": 1100,
      "wickets": 0
    }
  },
  {
    "id": "p57",
    "name": "Rahul Tewatia",
    "country": "India",
    "countryCode": "IN",
    "role": "all-rounder",
    "basePrice": 100,
    "category": "all-rounder",
    "team2026": "gt",
    "isCapped": true,
    "stats": {
      "matches": 100,
      "runs": 1600,
      "wickets": 30
    }
  },
  {
    "id": "p58",
    "name": "Washington Sundar",
    "country": "India",
    "countryCode": "IN",
    "role": "all-rounder",
    "basePrice": 150,
    "category": "all-rounder",
    "team2026": "gt",
    "isCapped": true,
    "stats": {
      "matches": 100,
      "runs": 1000,
      "wickets": 90
    }
  },
  {
    "id": "p59",
    "name": "Prasidh Krishna",
    "country": "India",
    "countryCode": "IN",
    "role": "bowler",
    "basePrice": 100,
    "category": "bowler",
    "team2026": "gt",
    "isCapped": true,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p60",
    "name": "Shahrukh Khan",
    "country": "India",
    "countryCode": "IN",
    "role": "all-rounder",
    "basePrice": 75,
    "category": "all-rounder",
    "team2026": "gt",
    "isCapped": false,
    "stats": {
      "matches": 55,
      "runs": 1000,
      "wickets": 2
    }
  },
  {
    "id": "p61",
    "name": "Ishant Sharma",
    "country": "India",
    "countryCode": "IN",
    "role": "bowler",
    "basePrice": 100,
    "category": "bowler",
    "team2026": "gt",
    "isCapped": true,
    "stats": {
      "matches": 60,
      "runs": 40,
      "wickets": 60
    }
  },
  {
    "id": "p62",
    "name": "Jason Holder",
    "country": "West Indies",
    "countryCode": "WI",
    "role": "all-rounder",
    "basePrice": 150,
    "category": "all-rounder",
    "team2026": "gt",
    "isCapped": true,
    "stats": {
      "matches": 200,
      "runs": 2200,
      "wickets": 230
    }
  },
  {
    "id": "p63",
    "name": "Tom Banton",
    "country": "England",
    "countryCode": "GB",
    "role": "wicket-keeper",
    "basePrice": 100,
    "category": "wicket-keeper",
    "team2026": "gt",
    "isCapped": true,
    "stats": {
      "matches": 60,
      "runs": 1200,
      "wickets": 0
    }
  },
  {
    "id": "p64",
    "name": "Sai Kishore",
    "country": "India",
    "countryCode": "IN",
    "role": "bowler",
    "basePrice": 75,
    "category": "bowler",
    "team2026": "gt",
    "isCapped": true,
    "stats": {
      "matches": 45,
      "runs": 30,
      "wickets": 50
    }
  },
  {
    "id": "p65",
    "name": "Glenn Phillips",
    "country": "New Zealand",
    "countryCode": "NZ",
    "role": "batsman",
    "basePrice": 150,
    "category": "batsman",
    "team2026": "gt",
    "isCapped": true,
    "stats": {
      "matches": 170,
      "runs": 3800,
      "wickets": 20
    }
  },
  {
    "id": "p66",
    "name": "Anuj Rawat",
    "country": "India",
    "countryCode": "IN",
    "role": "wicket-keeper",
    "basePrice": 50,
    "category": "wicket-keeper",
    "team2026": "gt",
    "isCapped": false,
    "stats": {
      "matches": 20,
      "runs": 250,
      "wickets": 0
    }
  },
  {
    "id": "p67",
    "name": "Kumar Kushagra",
    "country": "India",
    "countryCode": "IN",
    "role": "wicket-keeper",
    "basePrice": 50,
    "category": "wicket-keeper",
    "team2026": "gt",
    "isCapped": false,
    "stats": {
      "matches": 10,
      "runs": 100,
      "wickets": 0
    }
  },
  {
    "id": "p68",
    "name": "Arshad Khan",
    "country": "India",
    "countryCode": "IN",
    "role": "all-rounder",
    "basePrice": 30,
    "category": "uncapped",
    "team2026": "gt",
    "isCapped": false,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p69",
    "name": "Jayant Yadav",
    "country": "India",
    "countryCode": "IN",
    "role": "all-rounder",
    "basePrice": 50,
    "category": "all-rounder",
    "team2026": "gt",
    "isCapped": true,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p70",
    "name": "Nishant Sindhu",
    "country": "India",
    "countryCode": "IN",
    "role": "all-rounder",
    "basePrice": 30,
    "category": "uncapped",
    "team2026": "gt",
    "isCapped": false,
    "stats": {
      "matches": 10,
      "runs": 60,
      "wickets": 5
    }
  },
  {
    "id": "p71",
    "name": "Manav Suthar",
    "country": "India",
    "countryCode": "IN",
    "role": "bowler",
    "basePrice": 30,
    "category": "uncapped",
    "team2026": "gt",
    "isCapped": false,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p72",
    "name": "Gurnoor Singh Brar",
    "country": "India",
    "countryCode": "IN",
    "role": "bowler",
    "basePrice": 30,
    "category": "uncapped",
    "team2026": "gt",
    "isCapped": false,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p73",
    "name": "Luke Wood",
    "country": "England",
    "countryCode": "GB",
    "role": "bowler",
    "basePrice": 75,
    "category": "bowler",
    "team2026": "gt",
    "isCapped": true,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p74",
    "name": "Ashok Sharma",
    "country": "India",
    "countryCode": "IN",
    "role": "bowler",
    "basePrice": 20,
    "category": "uncapped",
    "team2026": "gt",
    "isCapped": false,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p75",
    "name": "Prithviraj Yarra",
    "country": "India",
    "countryCode": "IN",
    "role": "bowler",
    "basePrice": 20,
    "category": "uncapped",
    "team2026": "gt",
    "isCapped": false,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p76",
    "name": "Ajinkya Rahane",
    "country": "India",
    "countryCode": "IN",
    "role": "batsman",
    "basePrice": 150,
    "category": "marquee",
    "team2026": "kkr",
    "isCapped": true,
    "stats": {
      "matches": 200,
      "runs": 4700,
      "wickets": 0
    }
  },
  {
    "id": "p77",
    "name": "Rinku Singh",
    "country": "India",
    "countryCode": "IN",
    "role": "batsman",
    "basePrice": 150,
    "category": "batsman",
    "team2026": "kkr",
    "isCapped": false,
    "stats": {
      "matches": 55,
      "runs": 1200,
      "wickets": 0
    }
  },
  {
    "id": "p78",
    "name": "Sunil Narine",
    "country": "West Indies",
    "countryCode": "WI",
    "role": "all-rounder",
    "basePrice": 150,
    "category": "all-rounder",
    "team2026": "kkr",
    "isCapped": true,
    "stats": {
      "matches": 440,
      "runs": 4200,
      "wickets": 490
    }
  },
  {
    "id": "p79",
    "name": "Varun Chakaravarthy",
    "country": "India",
    "countryCode": "IN",
    "role": "bowler",
    "basePrice": 100,
    "category": "bowler",
    "team2026": "kkr",
    "isCapped": true,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p80",
    "name": "Harshit Rana",
    "country": "India",
    "countryCode": "IN",
    "role": "bowler",
    "basePrice": 50,
    "category": "bowler",
    "team2026": "kkr",
    "isCapped": true,
    "stats": {
      "matches": 20,
      "runs": 30,
      "wickets": 25
    }
  },
  {
    "id": "p81",
    "name": "Ramandeep Singh",
    "country": "India",
    "countryCode": "IN",
    "role": "all-rounder",
    "basePrice": 50,
    "category": "all-rounder",
    "team2026": "kkr",
    "isCapped": false,
    "stats": {
      "matches": 20,
      "runs": 200,
      "wickets": 5
    }
  },
  {
    "id": "p82",
    "name": "Cameron Green",
    "country": "Australia",
    "countryCode": "AU",
    "role": "all-rounder",
    "basePrice": 200,
    "category": "marquee",
    "team2026": "kkr",
    "isCapped": true,
    "stats": {
      "matches": 75,
      "runs": 1100,
      "wickets": 35
    }
  },
  {
    "id": "p83",
    "name": "Matheesha Pathirana",
    "country": "Sri Lanka",
    "countryCode": "LK",
    "role": "bowler",
    "basePrice": 150,
    "category": "bowler",
    "team2026": "kkr",
    "isCapped": true,
    "stats": {
      "matches": 50,
      "runs": 15,
      "wickets": 70
    }
  },
  {
    "id": "p84",
    "name": "Rachin Ravindra",
    "country": "New Zealand",
    "countryCode": "NZ",
    "role": "all-rounder",
    "basePrice": 150,
    "category": "all-rounder",
    "team2026": "kkr",
    "isCapped": true,
    "stats": {
      "matches": 30,
      "runs": 600,
      "wickets": 10
    }
  },
  {
    "id": "p85",
    "name": "Angkrish Raghuvanshi",
    "country": "India",
    "countryCode": "IN",
    "role": "batsman",
    "basePrice": 30,
    "category": "uncapped",
    "team2026": "kkr",
    "isCapped": false,
    "stats": {
      "matches": 8,
      "runs": 80,
      "wickets": 0
    }
  },
  {
    "id": "p86",
    "name": "Rovman Powell",
    "country": "West Indies",
    "countryCode": "WI",
    "role": "batsman",
    "basePrice": 100,
    "category": "batsman",
    "team2026": "kkr",
    "isCapped": true,
    "stats": {
      "matches": 200,
      "runs": 3800,
      "wickets": 15
    }
  },
  {
    "id": "p87",
    "name": "Manish Pandey",
    "country": "India",
    "countryCode": "IN",
    "role": "batsman",
    "basePrice": 50,
    "category": "batsman",
    "team2026": "kkr",
    "isCapped": true,
    "stats": {
      "matches": 180,
      "runs": 4200,
      "wickets": 0
    }
  },
  {
    "id": "p88",
    "name": "Rahul Tripathi",
    "country": "India",
    "countryCode": "IN",
    "role": "batsman",
    "basePrice": 75,
    "category": "batsman",
    "team2026": "kkr",
    "isCapped": true,
    "stats": {
      "matches": 110,
      "runs": 2800,
      "wickets": 0
    }
  },
  {
    "id": "p89",
    "name": "Finn Allen",
    "country": "New Zealand",
    "countryCode": "NZ",
    "role": "wicket-keeper",
    "basePrice": 75,
    "category": "wicket-keeper",
    "team2026": "kkr",
    "isCapped": true,
    "stats": {
      "matches": 80,
      "runs": 2000,
      "wickets": 0
    }
  },
  {
    "id": "p90",
    "name": "Anukul Roy",
    "country": "India",
    "countryCode": "IN",
    "role": "all-rounder",
    "basePrice": 30,
    "category": "uncapped",
    "team2026": "kkr",
    "isCapped": false,
    "stats": {
      "matches": 20,
      "runs": 100,
      "wickets": 18
    }
  },
  {
    "id": "p91",
    "name": "Umran Malik",
    "country": "India",
    "countryCode": "IN",
    "role": "bowler",
    "basePrice": 75,
    "category": "bowler",
    "team2026": "kkr",
    "isCapped": true,
    "stats": {
      "matches": 35,
      "runs": 10,
      "wickets": 40
    }
  },
  {
    "id": "p92",
    "name": "Vaibhav Arora",
    "country": "India",
    "countryCode": "IN",
    "role": "bowler",
    "basePrice": 50,
    "category": "bowler",
    "team2026": "kkr",
    "isCapped": false,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p93",
    "name": "Akash Deep",
    "country": "India",
    "countryCode": "IN",
    "role": "bowler",
    "basePrice": 75,
    "category": "bowler",
    "team2026": "kkr",
    "isCapped": true,
    "stats": {
      "matches": 25,
      "runs": 10,
      "wickets": 30
    }
  },
  {
    "id": "p94",
    "name": "Kartik Tyagi",
    "country": "India",
    "countryCode": "IN",
    "role": "bowler",
    "basePrice": 50,
    "category": "bowler",
    "team2026": "kkr",
    "isCapped": true,
    "stats": {
      "matches": 25,
      "runs": 10,
      "wickets": 30
    }
  },
  {
    "id": "p95",
    "name": "Prashant Solanki",
    "country": "India",
    "countryCode": "IN",
    "role": "bowler",
    "basePrice": 30,
    "category": "uncapped",
    "team2026": "kkr",
    "isCapped": false,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p96",
    "name": "Tim Seifert",
    "country": "New Zealand",
    "countryCode": "NZ",
    "role": "wicket-keeper",
    "basePrice": 50,
    "category": "wicket-keeper",
    "team2026": "kkr",
    "isCapped": true,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p97",
    "name": "Sarthak Ranjan",
    "country": "India",
    "countryCode": "IN",
    "role": "all-rounder",
    "basePrice": 20,
    "category": "uncapped",
    "team2026": "kkr",
    "isCapped": false,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p98",
    "name": "Daksh Kamra",
    "country": "India",
    "countryCode": "IN",
    "role": "all-rounder",
    "basePrice": 20,
    "category": "uncapped",
    "team2026": "kkr",
    "isCapped": false,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p99",
    "name": "Tejasvi Singh",
    "country": "India",
    "countryCode": "IN",
    "role": "wicket-keeper",
    "basePrice": 20,
    "category": "uncapped",
    "team2026": "kkr",
    "isCapped": false,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p100",
    "name": "Rishabh Pant",
    "country": "India",
    "countryCode": "IN",
    "role": "wicket-keeper",
    "basePrice": 200,
    "category": "marquee",
    "team2026": "lsg",
    "isCapped": true,
    "stats": {
      "matches": 190,
      "runs": 4300,
      "wickets": 0
    }
  },
  {
    "id": "p101",
    "name": "Nicholas Pooran",
    "country": "West Indies",
    "countryCode": "WI",
    "role": "wicket-keeper",
    "basePrice": 200,
    "category": "marquee",
    "team2026": "lsg",
    "isCapped": true,
    "stats": {
      "matches": 290,
      "runs": 5300,
      "wickets": 0
    }
  },
  {
    "id": "p102",
    "name": "Mayank Yadav",
    "country": "India",
    "countryCode": "IN",
    "role": "bowler",
    "basePrice": 150,
    "category": "bowler",
    "team2026": "lsg",
    "isCapped": true,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p103",
    "name": "Avesh Khan",
    "country": "India",
    "countryCode": "IN",
    "role": "bowler",
    "basePrice": 150,
    "category": "bowler",
    "team2026": "lsg",
    "isCapped": true,
    "stats": {
      "matches": 75,
      "runs": 40,
      "wickets": 90
    }
  },
  {
    "id": "p104",
    "name": "Mitchell Marsh",
    "country": "Australia",
    "countryCode": "AU",
    "role": "all-rounder",
    "basePrice": 200,
    "category": "marquee",
    "team2026": "lsg",
    "isCapped": true,
    "stats": {
      "matches": 180,
      "runs": 4000,
      "wickets": 30
    }
  },
  {
    "id": "p105",
    "name": "Aiden Markram",
    "country": "South Africa",
    "countryCode": "ZA",
    "role": "batsman",
    "basePrice": 150,
    "category": "batsman",
    "team2026": "lsg",
    "isCapped": true,
    "stats": {
      "matches": 180,
      "runs": 4200,
      "wickets": 10
    }
  },
  {
    "id": "p106",
    "name": "Mohammed Shami",
    "country": "India",
    "countryCode": "IN",
    "role": "bowler",
    "basePrice": 200,
    "category": "marquee",
    "team2026": "lsg",
    "isCapped": true,
    "stats": {
      "matches": 95,
      "runs": 45,
      "wickets": 110
    }
  },
  {
    "id": "p107",
    "name": "Josh Inglis",
    "country": "Australia",
    "countryCode": "AU",
    "role": "wicket-keeper",
    "basePrice": 150,
    "category": "wicket-keeper",
    "team2026": "lsg",
    "isCapped": true,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p108",
    "name": "Wanindu Hasaranga",
    "country": "Sri Lanka",
    "countryCode": "LK",
    "role": "all-rounder",
    "basePrice": 150,
    "category": "all-rounder",
    "team2026": "lsg",
    "isCapped": true,
    "stats": {
      "matches": 120,
      "runs": 600,
      "wickets": 155
    }
  },
  {
    "id": "p109",
    "name": "Anrich Nortje",
    "country": "South Africa",
    "countryCode": "ZA",
    "role": "bowler",
    "basePrice": 150,
    "category": "bowler",
    "team2026": "lsg",
    "isCapped": true,
    "stats": {
      "matches": 85,
      "runs": 35,
      "wickets": 110
    }
  },
  {
    "id": "p110",
    "name": "Ayush Badoni",
    "country": "India",
    "countryCode": "IN",
    "role": "batsman",
    "basePrice": 50,
    "category": "batsman",
    "team2026": "lsg",
    "isCapped": false,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p111",
    "name": "Abdul Samad",
    "country": "India",
    "countryCode": "IN",
    "role": "all-rounder",
    "basePrice": 50,
    "category": "all-rounder",
    "team2026": "lsg",
    "isCapped": false,
    "stats": {
      "matches": 45,
      "runs": 700,
      "wickets": 5
    }
  },
  {
    "id": "p112",
    "name": "Shahbaz Ahmed",
    "country": "India",
    "countryCode": "IN",
    "role": "all-rounder",
    "basePrice": 100,
    "category": "all-rounder",
    "team2026": "lsg",
    "isCapped": true,
    "stats": {
      "matches": 50,
      "runs": 600,
      "wickets": 30
    }
  },
  {
    "id": "p113",
    "name": "Mohsin Khan",
    "country": "India",
    "countryCode": "IN",
    "role": "bowler",
    "basePrice": 75,
    "category": "bowler",
    "team2026": "lsg",
    "isCapped": false,
    "stats": {
      "matches": 20,
      "runs": 5,
      "wickets": 25
    }
  },
  {
    "id": "p114",
    "name": "Manimaran Siddharth",
    "country": "India",
    "countryCode": "IN",
    "role": "bowler",
    "basePrice": 30,
    "category": "uncapped",
    "team2026": "lsg",
    "isCapped": false,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p115",
    "name": "Arshin Kulkarni",
    "country": "India",
    "countryCode": "IN",
    "role": "all-rounder",
    "basePrice": 30,
    "category": "uncapped",
    "team2026": "lsg",
    "isCapped": false,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p116",
    "name": "Arjun Tendulkar",
    "country": "India",
    "countryCode": "IN",
    "role": "all-rounder",
    "basePrice": 30,
    "category": "uncapped",
    "team2026": "lsg",
    "isCapped": false,
    "stats": {
      "matches": 10,
      "runs": 30,
      "wickets": 10
    }
  },
  {
    "id": "p117",
    "name": "Naman Tiwari",
    "country": "India",
    "countryCode": "IN",
    "role": "bowler",
    "basePrice": 20,
    "category": "uncapped",
    "team2026": "lsg",
    "isCapped": false,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p118",
    "name": "Akshat Raghuwanshi",
    "country": "India",
    "countryCode": "IN",
    "role": "batsman",
    "basePrice": 20,
    "category": "uncapped",
    "team2026": "lsg",
    "isCapped": false,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p119",
    "name": "Himmat Singh",
    "country": "India",
    "countryCode": "IN",
    "role": "batsman",
    "basePrice": 30,
    "category": "uncapped",
    "team2026": "lsg",
    "isCapped": false,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p120",
    "name": "Matthew Breetzke",
    "country": "South Africa",
    "countryCode": "ZA",
    "role": "wicket-keeper",
    "basePrice": 50,
    "category": "wicket-keeper",
    "team2026": "lsg",
    "isCapped": true,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p121",
    "name": "Digvesh Rathi",
    "country": "India",
    "countryCode": "IN",
    "role": "all-rounder",
    "basePrice": 20,
    "category": "uncapped",
    "team2026": "lsg",
    "isCapped": false,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p122",
    "name": "Prince Yadav",
    "country": "India",
    "countryCode": "IN",
    "role": "bowler",
    "basePrice": 20,
    "category": "uncapped",
    "team2026": "lsg",
    "isCapped": false,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p123",
    "name": "Akash Singh",
    "country": "India",
    "countryCode": "IN",
    "role": "bowler",
    "basePrice": 30,
    "category": "uncapped",
    "team2026": "lsg",
    "isCapped": false,
    "stats": {
      "matches": 10,
      "runs": 5,
      "wickets": 12
    }
  },
  {
    "id": "p124",
    "name": "Mukul Choudhary",
    "country": "India",
    "countryCode": "IN",
    "role": "bowler",
    "basePrice": 20,
    "category": "uncapped",
    "team2026": "lsg",
    "isCapped": false,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p125",
    "name": "Hardik Pandya",
    "country": "India",
    "countryCode": "IN",
    "role": "all-rounder",
    "basePrice": 200,
    "category": "marquee",
    "team2026": "mi",
    "isCapped": true,
    "stats": {
      "matches": 280,
      "runs": 4800,
      "wickets": 145
    }
  },
  {
    "id": "p126",
    "name": "Rohit Sharma",
    "country": "India",
    "countryCode": "IN",
    "role": "batsman",
    "basePrice": 200,
    "category": "marquee",
    "team2026": "mi",
    "isCapped": true,
    "stats": {
      "matches": 400,
      "runs": 11500,
      "wickets": 15
    }
  },
  {
    "id": "p127",
    "name": "Suryakumar Yadav",
    "country": "India",
    "countryCode": "IN",
    "role": "batsman",
    "basePrice": 200,
    "category": "marquee",
    "team2026": "mi",
    "isCapped": true,
    "stats": {
      "matches": 260,
      "runs": 7200,
      "wickets": 2
    }
  },
  {
    "id": "p128",
    "name": "Tilak Varma",
    "country": "India",
    "countryCode": "IN",
    "role": "batsman",
    "basePrice": 150,
    "category": "batsman",
    "team2026": "mi",
    "isCapped": true,
    "stats": {
      "matches": 60,
      "runs": 1500,
      "wickets": 2
    }
  },
  {
    "id": "p129",
    "name": "Jasprit Bumrah",
    "country": "India",
    "countryCode": "IN",
    "role": "bowler",
    "basePrice": 200,
    "category": "marquee",
    "team2026": "mi",
    "isCapped": true,
    "stats": {
      "matches": 175,
      "runs": 56,
      "wickets": 250
    }
  },
  {
    "id": "p130",
    "name": "Trent Boult",
    "country": "New Zealand",
    "countryCode": "NZ",
    "role": "bowler",
    "basePrice": 150,
    "category": "bowler",
    "team2026": "mi",
    "isCapped": true,
    "stats": {
      "matches": 240,
      "runs": 180,
      "wickets": 310
    }
  },
  {
    "id": "p131",
    "name": "Quinton de Kock",
    "country": "South Africa",
    "countryCode": "ZA",
    "role": "wicket-keeper",
    "basePrice": 150,
    "category": "wicket-keeper",
    "team2026": "mi",
    "isCapped": true,
    "stats": {
      "matches": 290,
      "runs": 8400,
      "wickets": 0
    }
  },
  {
    "id": "p132",
    "name": "Will Jacks",
    "country": "England",
    "countryCode": "GB",
    "role": "all-rounder",
    "basePrice": 150,
    "category": "all-rounder",
    "team2026": "mi",
    "isCapped": true,
    "stats": {
      "matches": 50,
      "runs": 1200,
      "wickets": 20
    }
  },
  {
    "id": "p133",
    "name": "Deepak Chahar",
    "country": "India",
    "countryCode": "IN",
    "role": "bowler",
    "basePrice": 100,
    "category": "bowler",
    "team2026": "mi",
    "isCapped": true,
    "stats": {
      "matches": 90,
      "runs": 200,
      "wickets": 100
    }
  },
  {
    "id": "p134",
    "name": "Naman Dhir",
    "country": "India",
    "countryCode": "IN",
    "role": "all-rounder",
    "basePrice": 30,
    "category": "uncapped",
    "team2026": "mi",
    "isCapped": false,
    "stats": {
      "matches": 5,
      "runs": 40,
      "wickets": 2
    }
  },
  {
    "id": "p135",
    "name": "Robin Minz",
    "country": "India",
    "countryCode": "IN",
    "role": "wicket-keeper",
    "basePrice": 30,
    "category": "uncapped",
    "team2026": "mi",
    "isCapped": false,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p136",
    "name": "Ryan Rickelton",
    "country": "South Africa",
    "countryCode": "ZA",
    "role": "batsman",
    "basePrice": 75,
    "category": "batsman",
    "team2026": "mi",
    "isCapped": true,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p137",
    "name": "Mitchell Santner",
    "country": "New Zealand",
    "countryCode": "NZ",
    "role": "all-rounder",
    "basePrice": 100,
    "category": "all-rounder",
    "team2026": "mi",
    "isCapped": true,
    "stats": {
      "matches": 140,
      "runs": 1200,
      "wickets": 130
    }
  },
  {
    "id": "p138",
    "name": "Mayank Markande",
    "country": "India",
    "countryCode": "IN",
    "role": "bowler",
    "basePrice": 30,
    "category": "uncapped",
    "team2026": "mi",
    "isCapped": false,
    "stats": {
      "matches": 25,
      "runs": 5,
      "wickets": 25
    }
  },
  {
    "id": "p139",
    "name": "Shardul Thakur",
    "country": "India",
    "countryCode": "IN",
    "role": "all-rounder",
    "basePrice": 100,
    "category": "all-rounder",
    "team2026": "mi",
    "isCapped": true,
    "stats": {
      "matches": 100,
      "runs": 400,
      "wickets": 120
    }
  },
  {
    "id": "p140",
    "name": "Allah Ghazanfar",
    "country": "Afghanistan",
    "countryCode": "AF",
    "role": "bowler",
    "basePrice": 50,
    "category": "bowler",
    "team2026": "mi",
    "isCapped": true,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p141",
    "name": "Sherfane Rutherford",
    "country": "West Indies",
    "countryCode": "WI",
    "role": "batsman",
    "basePrice": 75,
    "category": "batsman",
    "team2026": "mi",
    "isCapped": true,
    "stats": {
      "matches": 120,
      "runs": 2500,
      "wickets": 5
    }
  },
  {
    "id": "p142",
    "name": "Corbin Bosch",
    "country": "South Africa",
    "countryCode": "ZA",
    "role": "all-rounder",
    "basePrice": 50,
    "category": "all-rounder",
    "team2026": "mi",
    "isCapped": true,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p143",
    "name": "Raj Angad Bawa",
    "country": "India",
    "countryCode": "IN",
    "role": "all-rounder",
    "basePrice": 30,
    "category": "uncapped",
    "team2026": "mi",
    "isCapped": false,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p144",
    "name": "Ashwani Kumar",
    "country": "India",
    "countryCode": "IN",
    "role": "bowler",
    "basePrice": 20,
    "category": "uncapped",
    "team2026": "mi",
    "isCapped": false,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p145",
    "name": "Danish Malewar",
    "country": "India",
    "countryCode": "IN",
    "role": "batsman",
    "basePrice": 20,
    "category": "uncapped",
    "team2026": "mi",
    "isCapped": false,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p146",
    "name": "Mohammad Izhar",
    "country": "India",
    "countryCode": "IN",
    "role": "bowler",
    "basePrice": 20,
    "category": "uncapped",
    "team2026": "mi",
    "isCapped": false,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p147",
    "name": "Atharva Ankolekar",
    "country": "India",
    "countryCode": "IN",
    "role": "all-rounder",
    "basePrice": 20,
    "category": "uncapped",
    "team2026": "mi",
    "isCapped": false,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p148",
    "name": "Raghu Sharma",
    "country": "India",
    "countryCode": "IN",
    "role": "all-rounder",
    "basePrice": 20,
    "category": "uncapped",
    "team2026": "mi",
    "isCapped": false,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p149",
    "name": "Mayank Rawat",
    "country": "India",
    "countryCode": "IN",
    "role": "batsman",
    "basePrice": 20,
    "category": "uncapped",
    "team2026": "mi",
    "isCapped": false,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p150",
    "name": "Shreyas Iyer",
    "country": "India",
    "countryCode": "IN",
    "role": "batsman",
    "basePrice": 200,
    "category": "marquee",
    "team2026": "pbks",
    "isCapped": true,
    "stats": {
      "matches": 185,
      "runs": 5200,
      "wickets": 0
    }
  },
  {
    "id": "p151",
    "name": "Arshdeep Singh",
    "country": "India",
    "countryCode": "IN",
    "role": "bowler",
    "basePrice": 150,
    "category": "bowler",
    "team2026": "pbks",
    "isCapped": true,
    "stats": {
      "matches": 85,
      "runs": 30,
      "wickets": 105
    }
  },
  {
    "id": "p152",
    "name": "Yuzvendra Chahal",
    "country": "India",
    "countryCode": "IN",
    "role": "bowler",
    "basePrice": 150,
    "category": "bowler",
    "team2026": "pbks",
    "isCapped": true,
    "stats": {
      "matches": 200,
      "runs": 80,
      "wickets": 280
    }
  },
  {
    "id": "p153",
    "name": "Marcus Stoinis",
    "country": "Australia",
    "countryCode": "AU",
    "role": "all-rounder",
    "basePrice": 200,
    "category": "marquee",
    "team2026": "pbks",
    "isCapped": true,
    "stats": {
      "matches": 220,
      "runs": 5000,
      "wickets": 65
    }
  },
  {
    "id": "p154",
    "name": "Marco Jansen",
    "country": "South Africa",
    "countryCode": "ZA",
    "role": "all-rounder",
    "basePrice": 150,
    "category": "all-rounder",
    "team2026": "pbks",
    "isCapped": true,
    "stats": {
      "matches": 55,
      "runs": 400,
      "wickets": 65
    }
  },
  {
    "id": "p155",
    "name": "Shashank Singh",
    "country": "India",
    "countryCode": "IN",
    "role": "batsman",
    "basePrice": 50,
    "category": "batsman",
    "team2026": "pbks",
    "isCapped": false,
    "stats": {
      "matches": 35,
      "runs": 600,
      "wickets": 0
    }
  },
  {
    "id": "p156",
    "name": "Nehal Wadhera",
    "country": "India",
    "countryCode": "IN",
    "role": "batsman",
    "basePrice": 50,
    "category": "batsman",
    "team2026": "pbks",
    "isCapped": false,
    "stats": {
      "matches": 15,
      "runs": 200,
      "wickets": 0
    }
  },
  {
    "id": "p157",
    "name": "Prabhsimran Singh",
    "country": "India",
    "countryCode": "IN",
    "role": "wicket-keeper",
    "basePrice": 50,
    "category": "wicket-keeper",
    "team2026": "pbks",
    "isCapped": false,
    "stats": {
      "matches": 20,
      "runs": 350,
      "wickets": 0
    }
  },
  {
    "id": "p158",
    "name": "Priyansh Arya",
    "country": "India",
    "countryCode": "IN",
    "role": "batsman",
    "basePrice": 20,
    "category": "uncapped",
    "team2026": "pbks",
    "isCapped": false,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p159",
    "name": "Azmatullah Omarzai",
    "country": "Afghanistan",
    "countryCode": "AF",
    "role": "all-rounder",
    "basePrice": 100,
    "category": "all-rounder",
    "team2026": "pbks",
    "isCapped": true,
    "stats": {
      "matches": 45,
      "runs": 450,
      "wickets": 40
    }
  },
  {
    "id": "p160",
    "name": "Lockie Ferguson",
    "country": "New Zealand",
    "countryCode": "NZ",
    "role": "bowler",
    "basePrice": 150,
    "category": "bowler",
    "team2026": "pbks",
    "isCapped": true,
    "stats": {
      "matches": 120,
      "runs": 100,
      "wickets": 155
    }
  },
  {
    "id": "p161",
    "name": "Vijaykumar Vyshak",
    "country": "India",
    "countryCode": "IN",
    "role": "bowler",
    "basePrice": 50,
    "category": "bowler",
    "team2026": "pbks",
    "isCapped": false,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p162",
    "name": "Yash Thakur",
    "country": "India",
    "countryCode": "IN",
    "role": "bowler",
    "basePrice": 50,
    "category": "bowler",
    "team2026": "pbks",
    "isCapped": false,
    "stats": {
      "matches": 15,
      "runs": 10,
      "wickets": 18
    }
  },
  {
    "id": "p163",
    "name": "Harpreet Brar",
    "country": "India",
    "countryCode": "IN",
    "role": "all-rounder",
    "basePrice": 50,
    "category": "all-rounder",
    "team2026": "pbks",
    "isCapped": false,
    "stats": {
      "matches": 50,
      "runs": 200,
      "wickets": 55
    }
  },
  {
    "id": "p164",
    "name": "Vishnu Vinod",
    "country": "India",
    "countryCode": "IN",
    "role": "wicket-keeper",
    "basePrice": 30,
    "category": "uncapped",
    "team2026": "pbks",
    "isCapped": false,
    "stats": {
      "matches": 10,
      "runs": 120,
      "wickets": 0
    }
  },
  {
    "id": "p165",
    "name": "Xavier Bartlett",
    "country": "Australia",
    "countryCode": "AU",
    "role": "bowler",
    "basePrice": 75,
    "category": "bowler",
    "team2026": "pbks",
    "isCapped": true,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p166",
    "name": "Suryansh Shedge",
    "country": "India",
    "countryCode": "IN",
    "role": "all-rounder",
    "basePrice": 20,
    "category": "uncapped",
    "team2026": "pbks",
    "isCapped": false,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p167",
    "name": "Musheer Khan",
    "country": "India",
    "countryCode": "IN",
    "role": "all-rounder",
    "basePrice": 30,
    "category": "uncapped",
    "team2026": "pbks",
    "isCapped": false,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p168",
    "name": "Harnoor Singh",
    "country": "India",
    "countryCode": "IN",
    "role": "batsman",
    "basePrice": 20,
    "category": "uncapped",
    "team2026": "pbks",
    "isCapped": false,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p169",
    "name": "Mitchell Owen",
    "country": "Australia",
    "countryCode": "AU",
    "role": "all-rounder",
    "basePrice": 50,
    "category": "all-rounder",
    "team2026": "pbks",
    "isCapped": true,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p170",
    "name": "Cooper Connolly",
    "country": "Australia",
    "countryCode": "AU",
    "role": "all-rounder",
    "basePrice": 50,
    "category": "all-rounder",
    "team2026": "pbks",
    "isCapped": true,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p171",
    "name": "Ben Dwarshuis",
    "country": "Australia",
    "countryCode": "AU",
    "role": "bowler",
    "basePrice": 50,
    "category": "bowler",
    "team2026": "pbks",
    "isCapped": true,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p172",
    "name": "Praveen Dubey",
    "country": "India",
    "countryCode": "IN",
    "role": "all-rounder",
    "basePrice": 30,
    "category": "uncapped",
    "team2026": "pbks",
    "isCapped": false,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p173",
    "name": "Pyla Avinash",
    "country": "India",
    "countryCode": "IN",
    "role": "all-rounder",
    "basePrice": 20,
    "category": "uncapped",
    "team2026": "pbks",
    "isCapped": false,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p174",
    "name": "Vishal Nishad",
    "country": "India",
    "countryCode": "IN",
    "role": "bowler",
    "basePrice": 20,
    "category": "uncapped",
    "team2026": "pbks",
    "isCapped": false,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p175",
    "name": "Steve Smith",
    "country": "Australia",
    "countryCode": "AU",
    "role": "batsman",
    "basePrice": 200,
    "category": "marquee",
    "team2026": null,
    "isCapped": true,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p176",
    "name": "Joe Root",
    "country": "England",
    "countryCode": "GB",
    "role": "batsman",
    "basePrice": 150,
    "category": "marquee",
    "team2026": null,
    "isCapped": true,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p177",
    "name": "Kane Williamson",
    "country": "New Zealand",
    "countryCode": "NZ",
    "role": "batsman",
    "basePrice": 200,
    "category": "marquee",
    "team2026": null,
    "isCapped": true,
    "stats": {
      "matches": 220,
      "runs": 5400,
      "wickets": 3
    }
  },
  {
    "id": "p178",
    "name": "Marnus Labuschagne",
    "country": "Australia",
    "countryCode": "AU",
    "role": "batsman",
    "basePrice": 100,
    "category": "batsman",
    "team2026": null,
    "isCapped": true,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p179",
    "name": "Jason Roy",
    "country": "England",
    "countryCode": "GB",
    "role": "batsman",
    "basePrice": 150,
    "category": "batsman",
    "team2026": null,
    "isCapped": true,
    "stats": {
      "matches": 200,
      "runs": 5500,
      "wickets": 0
    }
  },
  {
    "id": "p180",
    "name": "Martin Guptill",
    "country": "New Zealand",
    "countryCode": "NZ",
    "role": "batsman",
    "basePrice": 100,
    "category": "batsman",
    "team2026": null,
    "isCapped": true,
    "stats": {
      "matches": 200,
      "runs": 5400,
      "wickets": 5
    }
  },
  {
    "id": "p181",
    "name": "Aaron Finch",
    "country": "Australia",
    "countryCode": "AU",
    "role": "batsman",
    "basePrice": 150,
    "category": "batsman",
    "team2026": null,
    "isCapped": true,
    "stats": {
      "matches": 220,
      "runs": 6200,
      "wickets": 5
    }
  },
  {
    "id": "p182",
    "name": "Alex Hales",
    "country": "England",
    "countryCode": "GB",
    "role": "batsman",
    "basePrice": 150,
    "category": "batsman",
    "team2026": null,
    "isCapped": true,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p183",
    "name": "Dawid Malan",
    "country": "England",
    "countryCode": "GB",
    "role": "batsman",
    "basePrice": 150,
    "category": "batsman",
    "team2026": null,
    "isCapped": true,
    "stats": {
      "matches": 180,
      "runs": 4500,
      "wickets": 2
    }
  },
  {
    "id": "p184",
    "name": "Colin Munro",
    "country": "New Zealand",
    "countryCode": "NZ",
    "role": "batsman",
    "basePrice": 100,
    "category": "batsman",
    "team2026": null,
    "isCapped": true,
    "stats": {
      "matches": 170,
      "runs": 4200,
      "wickets": 5
    }
  },
  {
    "id": "p185",
    "name": "Rassie van der Dussen",
    "country": "South Africa",
    "countryCode": "ZA",
    "role": "batsman",
    "basePrice": 100,
    "category": "batsman",
    "team2026": null,
    "isCapped": true,
    "stats": {
      "matches": 100,
      "runs": 2200,
      "wickets": 0
    }
  },
  {
    "id": "p186",
    "name": "Temba Bavuma",
    "country": "South Africa",
    "countryCode": "ZA",
    "role": "batsman",
    "basePrice": 50,
    "category": "batsman",
    "team2026": null,
    "isCapped": true,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p187",
    "name": "Paul Stirling",
    "country": "Ireland",
    "countryCode": "IE",
    "role": "batsman",
    "basePrice": 50,
    "category": "batsman",
    "team2026": null,
    "isCapped": true,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p188",
    "name": "Litton Das",
    "country": "Bangladesh",
    "countryCode": "BD",
    "role": "wicket-keeper",
    "basePrice": 50,
    "category": "wicket-keeper",
    "team2026": null,
    "isCapped": true,
    "stats": {
      "matches": 120,
      "runs": 2800,
      "wickets": 0
    }
  },
  {
    "id": "p189",
    "name": "Mushfiqur Rahim",
    "country": "Bangladesh",
    "countryCode": "BD",
    "role": "wicket-keeper",
    "basePrice": 50,
    "category": "wicket-keeper",
    "team2026": null,
    "isCapped": true,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p190",
    "name": "Kusal Mendis",
    "country": "Sri Lanka",
    "countryCode": "LK",
    "role": "wicket-keeper",
    "basePrice": 50,
    "category": "wicket-keeper",
    "team2026": null,
    "isCapped": true,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p191",
    "name": "Shai Hope",
    "country": "West Indies",
    "countryCode": "WI",
    "role": "wicket-keeper",
    "basePrice": 75,
    "category": "wicket-keeper",
    "team2026": null,
    "isCapped": true,
    "stats": {
      "matches": 60,
      "runs": 1200,
      "wickets": 0
    }
  },
  {
    "id": "p192",
    "name": "Sam Billings",
    "country": "England",
    "countryCode": "GB",
    "role": "wicket-keeper",
    "basePrice": 100,
    "category": "wicket-keeper",
    "team2026": null,
    "isCapped": true,
    "stats": {
      "matches": 120,
      "runs": 2500,
      "wickets": 0
    }
  },
  {
    "id": "p193",
    "name": "Ben McDermott",
    "country": "Australia",
    "countryCode": "AU",
    "role": "wicket-keeper",
    "basePrice": 50,
    "category": "wicket-keeper",
    "team2026": null,
    "isCapped": true,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p194",
    "name": "Alex Carey",
    "country": "Australia",
    "countryCode": "AU",
    "role": "wicket-keeper",
    "basePrice": 100,
    "category": "wicket-keeper",
    "team2026": null,
    "isCapped": true,
    "stats": {
      "matches": 70,
      "runs": 1300,
      "wickets": 0
    }
  },
  {
    "id": "p195",
    "name": "Shakib Al Hasan",
    "country": "Bangladesh",
    "countryCode": "BD",
    "role": "all-rounder",
    "basePrice": 150,
    "category": "all-rounder",
    "team2026": null,
    "isCapped": true,
    "stats": {
      "matches": 350,
      "runs": 5500,
      "wickets": 350
    }
  },
  {
    "id": "p196",
    "name": "Mohammad Nabi",
    "country": "Afghanistan",
    "countryCode": "AF",
    "role": "all-rounder",
    "basePrice": 100,
    "category": "all-rounder",
    "team2026": null,
    "isCapped": true,
    "stats": {
      "matches": 350,
      "runs": 4200,
      "wickets": 350
    }
  },
  {
    "id": "p197",
    "name": "Colin de Grandhomme",
    "country": "New Zealand",
    "countryCode": "NZ",
    "role": "all-rounder",
    "basePrice": 75,
    "category": "all-rounder",
    "team2026": null,
    "isCapped": true,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p198",
    "name": "Jimmy Neesham",
    "country": "New Zealand",
    "countryCode": "NZ",
    "role": "all-rounder",
    "basePrice": 100,
    "category": "all-rounder",
    "team2026": null,
    "isCapped": true,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p199",
    "name": "Daryl Mitchell",
    "country": "New Zealand",
    "countryCode": "NZ",
    "role": "all-rounder",
    "basePrice": 150,
    "category": "all-rounder",
    "team2026": null,
    "isCapped": true,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p200",
    "name": "Ben Stokes",
    "country": "England",
    "countryCode": "GB",
    "role": "all-rounder",
    "basePrice": 200,
    "category": "marquee",
    "team2026": null,
    "isCapped": true,
    "stats": {
      "matches": 190,
      "runs": 3600,
      "wickets": 55
    }
  },
  {
    "id": "p201",
    "name": "Chris Woakes",
    "country": "England",
    "countryCode": "GB",
    "role": "all-rounder",
    "basePrice": 150,
    "category": "all-rounder",
    "team2026": null,
    "isCapped": true,
    "stats": {
      "matches": 80,
      "runs": 400,
      "wickets": 80
    }
  },
  {
    "id": "p202",
    "name": "David Willey",
    "country": "England",
    "countryCode": "GB",
    "role": "all-rounder",
    "basePrice": 100,
    "category": "all-rounder",
    "team2026": null,
    "isCapped": true,
    "stats": {
      "matches": 150,
      "runs": 1500,
      "wickets": 160
    }
  },
  {
    "id": "p203",
    "name": "Moeen Ali",
    "country": "England",
    "countryCode": "GB",
    "role": "all-rounder",
    "basePrice": 150,
    "category": "all-rounder",
    "team2026": null,
    "isCapped": true,
    "stats": {
      "matches": 280,
      "runs": 5500,
      "wickets": 130
    }
  },
  {
    "id": "p204",
    "name": "Sam Hain",
    "country": "England",
    "countryCode": "GB",
    "role": "batsman",
    "basePrice": 50,
    "category": "batsman",
    "team2026": null,
    "isCapped": true,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p205",
    "name": "Tom Curran",
    "country": "England",
    "countryCode": "GB",
    "role": "all-rounder",
    "basePrice": 75,
    "category": "all-rounder",
    "team2026": null,
    "isCapped": true,
    "stats": {
      "matches": 130,
      "runs": 1000,
      "wickets": 140
    }
  },
  {
    "id": "p206",
    "name": "Odean Smith",
    "country": "West Indies",
    "countryCode": "WI",
    "role": "all-rounder",
    "basePrice": 50,
    "category": "all-rounder",
    "team2026": null,
    "isCapped": true,
    "stats": {
      "matches": 60,
      "runs": 400,
      "wickets": 65
    }
  },
  {
    "id": "p207",
    "name": "Alzarri Joseph",
    "country": "West Indies",
    "countryCode": "WI",
    "role": "bowler",
    "basePrice": 100,
    "category": "bowler",
    "team2026": null,
    "isCapped": true,
    "stats": {
      "matches": 120,
      "runs": 200,
      "wickets": 155
    }
  },
  {
    "id": "p208",
    "name": "Obed McCoy",
    "country": "West Indies",
    "countryCode": "WI",
    "role": "bowler",
    "basePrice": 75,
    "category": "bowler",
    "team2026": null,
    "isCapped": true,
    "stats": {
      "matches": 60,
      "runs": 20,
      "wickets": 75
    }
  },
  {
    "id": "p209",
    "name": "Wayne Parnell",
    "country": "South Africa",
    "countryCode": "ZA",
    "role": "bowler",
    "basePrice": 75,
    "category": "bowler",
    "team2026": null,
    "isCapped": true,
    "stats": {
      "matches": 150,
      "runs": 1200,
      "wickets": 155
    }
  },
  {
    "id": "p210",
    "name": "Tabraiz Shamsi",
    "country": "South Africa",
    "countryCode": "ZA",
    "role": "bowler",
    "basePrice": 100,
    "category": "bowler",
    "team2026": null,
    "isCapped": true,
    "stats": {
      "matches": 130,
      "runs": 20,
      "wickets": 165
    }
  },
  {
    "id": "p211",
    "name": "Adil Rashid",
    "country": "England",
    "countryCode": "GB",
    "role": "bowler",
    "basePrice": 150,
    "category": "bowler",
    "team2026": null,
    "isCapped": true,
    "stats": {
      "matches": 200,
      "runs": 350,
      "wickets": 250
    }
  },
  {
    "id": "p212",
    "name": "Mark Wood",
    "country": "England",
    "countryCode": "GB",
    "role": "bowler",
    "basePrice": 150,
    "category": "bowler",
    "team2026": null,
    "isCapped": true,
    "stats": {
      "matches": 80,
      "runs": 200,
      "wickets": 95
    }
  },
  {
    "id": "p213",
    "name": "Tymal Mills",
    "country": "England",
    "countryCode": "GB",
    "role": "bowler",
    "basePrice": 75,
    "category": "bowler",
    "team2026": null,
    "isCapped": true,
    "stats": {
      "matches": 60,
      "runs": 15,
      "wickets": 70
    }
  },
  {
    "id": "p214",
    "name": "Reece Topley",
    "country": "England",
    "countryCode": "GB",
    "role": "bowler",
    "basePrice": 75,
    "category": "bowler",
    "team2026": null,
    "isCapped": true,
    "stats": {
      "matches": 70,
      "runs": 25,
      "wickets": 85
    }
  },
  {
    "id": "p215",
    "name": "Chris Jordan",
    "country": "England",
    "countryCode": "GB",
    "role": "bowler",
    "basePrice": 100,
    "category": "bowler",
    "team2026": null,
    "isCapped": true,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p216",
    "name": "Adam Zampa",
    "country": "Australia",
    "countryCode": "AU",
    "role": "bowler",
    "basePrice": 150,
    "category": "bowler",
    "team2026": null,
    "isCapped": true,
    "stats": {
      "matches": 175,
      "runs": 100,
      "wickets": 225
    }
  },
  {
    "id": "p217",
    "name": "Ashton Agar",
    "country": "Australia",
    "countryCode": "AU",
    "role": "all-rounder",
    "basePrice": 100,
    "category": "all-rounder",
    "team2026": null,
    "isCapped": true,
    "stats": {
      "matches": 130,
      "runs": 1000,
      "wickets": 125
    }
  },
  {
    "id": "p218",
    "name": "Kane Richardson",
    "country": "Australia",
    "countryCode": "AU",
    "role": "bowler",
    "basePrice": 100,
    "category": "bowler",
    "team2026": null,
    "isCapped": true,
    "stats": {
      "matches": 80,
      "runs": 50,
      "wickets": 100
    }
  },
  {
    "id": "p219",
    "name": "Mujeeb Ur Rahman",
    "country": "Afghanistan",
    "countryCode": "AF",
    "role": "bowler",
    "basePrice": 150,
    "category": "bowler",
    "team2026": null,
    "isCapped": true,
    "stats": {
      "matches": 120,
      "runs": 50,
      "wickets": 145
    }
  },
  {
    "id": "p220",
    "name": "Fazalhaq Farooqi",
    "country": "Afghanistan",
    "countryCode": "AF",
    "role": "bowler",
    "basePrice": 100,
    "category": "bowler",
    "team2026": null,
    "isCapped": true,
    "stats": {
      "matches": 80,
      "runs": 40,
      "wickets": 110
    }
  },
  {
    "id": "p221",
    "name": "Naveen-ul-Haq",
    "country": "Afghanistan",
    "countryCode": "AF",
    "role": "bowler",
    "basePrice": 100,
    "category": "bowler",
    "team2026": null,
    "isCapped": true,
    "stats": {
      "matches": 90,
      "runs": 60,
      "wickets": 110
    }
  },
  {
    "id": "p222",
    "name": "Josh Little",
    "country": "Ireland",
    "countryCode": "IE",
    "role": "bowler",
    "basePrice": 75,
    "category": "bowler",
    "team2026": null,
    "isCapped": true,
    "stats": {
      "matches": 60,
      "runs": 20,
      "wickets": 75
    }
  },
  {
    "id": "p223",
    "name": "Akeal Hosein",
    "country": "West Indies",
    "countryCode": "WI",
    "role": "bowler",
    "basePrice": 75,
    "category": "bowler",
    "team2026": null,
    "isCapped": true,
    "stats": {
      "matches": 80,
      "runs": 200,
      "wickets": 95
    }
  },
  {
    "id": "p224",
    "name": "Dushmantha Chameera",
    "country": "Sri Lanka",
    "countryCode": "LK",
    "role": "bowler",
    "basePrice": 75,
    "category": "bowler",
    "team2026": null,
    "isCapped": true,
    "stats": {
      "matches": 60,
      "runs": 20,
      "wickets": 75
    }
  },
  {
    "id": "p225",
    "name": "Rahmanullah Gurbaz",
    "country": "Afghanistan",
    "countryCode": "AF",
    "role": "wicket-keeper",
    "basePrice": 100,
    "category": "wicket-keeper",
    "team2026": null,
    "isCapped": true,
    "stats": {
      "matches": 100,
      "runs": 2800,
      "wickets": 0
    }
  },
  {
    "id": "p226",
    "name": "Maheesh Theekshana",
    "country": "Sri Lanka",
    "countryCode": "LK",
    "role": "bowler",
    "basePrice": 150,
    "category": "bowler",
    "team2026": null,
    "isCapped": true,
    "stats": {
      "matches": 70,
      "runs": 30,
      "wickets": 90
    }
  },
  {
    "id": "p227",
    "name": "Sikandar Raza",
    "country": "Zimbabwe",
    "countryCode": "ZW",
    "role": "all-rounder",
    "basePrice": 100,
    "category": "all-rounder",
    "team2026": null,
    "isCapped": true,
    "stats": {
      "matches": 180,
      "runs": 3200,
      "wickets": 85
    }
  },
  {
    "id": "p228",
    "name": "Virat Kohli",
    "country": "India",
    "countryCode": "IN",
    "role": "batsman",
    "basePrice": 200,
    "category": "marquee",
    "team2026": "rcb",
    "isCapped": true,
    "stats": {
      "matches": 380,
      "runs": 12000,
      "wickets": 4
    }
  },
  {
    "id": "p229",
    "name": "Rajat Patidar",
    "country": "India",
    "countryCode": "IN",
    "role": "batsman",
    "basePrice": 150,
    "category": "batsman",
    "team2026": "rcb",
    "isCapped": true,
    "stats": {
      "matches": 40,
      "runs": 900,
      "wickets": 0
    }
  },
  {
    "id": "p230",
    "name": "Phil Salt",
    "country": "England",
    "countryCode": "GB",
    "role": "wicket-keeper",
    "basePrice": 200,
    "category": "marquee",
    "team2026": "rcb",
    "isCapped": true,
    "stats": {
      "matches": 150,
      "runs": 4200,
      "wickets": 0
    }
  },
  {
    "id": "p231",
    "name": "Yash Dayal",
    "country": "India",
    "countryCode": "IN",
    "role": "bowler",
    "basePrice": 75,
    "category": "bowler",
    "team2026": "rcb",
    "isCapped": true,
    "stats": {
      "matches": 35,
      "runs": 15,
      "wickets": 40
    }
  },
  {
    "id": "p232",
    "name": "Krunal Pandya",
    "country": "India",
    "countryCode": "IN",
    "role": "all-rounder",
    "basePrice": 100,
    "category": "all-rounder",
    "team2026": "rcb",
    "isCapped": true,
    "stats": {
      "matches": 120,
      "runs": 1800,
      "wickets": 70
    }
  },
  {
    "id": "p233",
    "name": "Josh Hazlewood",
    "country": "Australia",
    "countryCode": "AU",
    "role": "bowler",
    "basePrice": 150,
    "category": "bowler",
    "team2026": "rcb",
    "isCapped": true,
    "stats": {
      "matches": 100,
      "runs": 50,
      "wickets": 130
    }
  },
  {
    "id": "p234",
    "name": "Tim David",
    "country": "Australia",
    "countryCode": "AU",
    "role": "batsman",
    "basePrice": 150,
    "category": "batsman",
    "team2026": "rcb",
    "isCapped": true,
    "stats": {
      "matches": 120,
      "runs": 2800,
      "wickets": 2
    }
  },
  {
    "id": "p235",
    "name": "Romario Shepherd",
    "country": "West Indies",
    "countryCode": "WI",
    "role": "all-rounder",
    "basePrice": 75,
    "category": "all-rounder",
    "team2026": "rcb",
    "isCapped": true,
    "stats": {
      "matches": 100,
      "runs": 1200,
      "wickets": 95
    }
  },
  {
    "id": "p236",
    "name": "Devdutt Padikkal",
    "country": "India",
    "countryCode": "IN",
    "role": "batsman",
    "basePrice": 75,
    "category": "batsman",
    "team2026": "rcb",
    "isCapped": true,
    "stats": {
      "matches": 85,
      "runs": 2000,
      "wickets": 0
    }
  },
  {
    "id": "p237",
    "name": "Jitesh Sharma",
    "country": "India",
    "countryCode": "IN",
    "role": "wicket-keeper",
    "basePrice": 50,
    "category": "wicket-keeper",
    "team2026": "rcb",
    "isCapped": true,
    "stats": {
      "matches": 35,
      "runs": 650,
      "wickets": 0
    }
  },
  {
    "id": "p238",
    "name": "Swapnil Singh",
    "country": "India",
    "countryCode": "IN",
    "role": "all-rounder",
    "basePrice": 30,
    "category": "uncapped",
    "team2026": "rcb",
    "isCapped": false,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p239",
    "name": "Suyash Sharma",
    "country": "India",
    "countryCode": "IN",
    "role": "bowler",
    "basePrice": 20,
    "category": "uncapped",
    "team2026": "rcb",
    "isCapped": false,
    "stats": {
      "matches": 8,
      "runs": 2,
      "wickets": 8
    }
  },
  {
    "id": "p240",
    "name": "Abhinandan Singh",
    "country": "India",
    "countryCode": "IN",
    "role": "bowler",
    "basePrice": 20,
    "category": "uncapped",
    "team2026": "rcb",
    "isCapped": false,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p241",
    "name": "Nuwan Thushara",
    "country": "Sri Lanka",
    "countryCode": "LK",
    "role": "bowler",
    "basePrice": 75,
    "category": "bowler",
    "team2026": "rcb",
    "isCapped": true,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p242",
    "name": "Jacob Bethell",
    "country": "England",
    "countryCode": "GB",
    "role": "all-rounder",
    "basePrice": 100,
    "category": "all-rounder",
    "team2026": "rcb",
    "isCapped": true,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p243",
    "name": "Venkatesh Iyer",
    "country": "India",
    "countryCode": "IN",
    "role": "all-rounder",
    "basePrice": 100,
    "category": "all-rounder",
    "team2026": "rcb",
    "isCapped": true,
    "stats": {
      "matches": 55,
      "runs": 1200,
      "wickets": 8
    }
  },
  {
    "id": "p244",
    "name": "Jacob Duffy",
    "country": "New Zealand",
    "countryCode": "NZ",
    "role": "bowler",
    "basePrice": 50,
    "category": "bowler",
    "team2026": "rcb",
    "isCapped": true,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p245",
    "name": "Vihaan Malhotra",
    "country": "India",
    "countryCode": "IN",
    "role": "batsman",
    "basePrice": 20,
    "category": "uncapped",
    "team2026": "rcb",
    "isCapped": false,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p246",
    "name": "Kanishk Chouhan",
    "country": "India",
    "countryCode": "IN",
    "role": "bowler",
    "basePrice": 20,
    "category": "uncapped",
    "team2026": "rcb",
    "isCapped": false,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p247",
    "name": "Rasikh Salam",
    "country": "India",
    "countryCode": "IN",
    "role": "bowler",
    "basePrice": 30,
    "category": "uncapped",
    "team2026": "rcb",
    "isCapped": false,
    "stats": {
      "matches": 10,
      "runs": 5,
      "wickets": 12
    }
  },
  {
    "id": "p248",
    "name": "Vicky Ostwal",
    "country": "India",
    "countryCode": "IN",
    "role": "bowler",
    "basePrice": 20,
    "category": "uncapped",
    "team2026": "rcb",
    "isCapped": false,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p249",
    "name": "Mangesh Yadav",
    "country": "India",
    "countryCode": "IN",
    "role": "bowler",
    "basePrice": 20,
    "category": "uncapped",
    "team2026": "rcb",
    "isCapped": false,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p250",
    "name": "Satvik Deswal",
    "country": "India",
    "countryCode": "IN",
    "role": "batsman",
    "basePrice": 20,
    "category": "uncapped",
    "team2026": "rcb",
    "isCapped": false,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p251",
    "name": "Jordan Cox",
    "country": "England",
    "countryCode": "GB",
    "role": "wicket-keeper",
    "basePrice": 50,
    "category": "wicket-keeper",
    "team2026": "rcb",
    "isCapped": true,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p252",
    "name": "Riyan Parag",
    "country": "India",
    "countryCode": "IN",
    "role": "all-rounder",
    "basePrice": 150,
    "category": "all-rounder",
    "team2026": "rr",
    "isCapped": true,
    "stats": {
      "matches": 80,
      "runs": 1200,
      "wickets": 15
    }
  },
  {
    "id": "p253",
    "name": "Yashasvi Jaiswal",
    "country": "India",
    "countryCode": "IN",
    "role": "batsman",
    "basePrice": 200,
    "category": "marquee",
    "team2026": "rr",
    "isCapped": true,
    "stats": {
      "matches": 80,
      "runs": 2500,
      "wickets": 2
    }
  },
  {
    "id": "p254",
    "name": "Dhruv Jurel",
    "country": "India",
    "countryCode": "IN",
    "role": "wicket-keeper",
    "basePrice": 100,
    "category": "wicket-keeper",
    "team2026": "rr",
    "isCapped": true,
    "stats": {
      "matches": 15,
      "runs": 250,
      "wickets": 0
    }
  },
  {
    "id": "p255",
    "name": "Shimron Hetmyer",
    "country": "West Indies",
    "countryCode": "WI",
    "role": "batsman",
    "basePrice": 150,
    "category": "batsman",
    "team2026": "rr",
    "isCapped": true,
    "stats": {
      "matches": 185,
      "runs": 4000,
      "wickets": 1
    }
  },
  {
    "id": "p256",
    "name": "Ravindra Jadeja",
    "country": "India",
    "countryCode": "IN",
    "role": "all-rounder",
    "basePrice": 200,
    "category": "marquee",
    "team2026": "rr",
    "isCapped": true,
    "stats": {
      "matches": 340,
      "runs": 3800,
      "wickets": 175
    }
  },
  {
    "id": "p257",
    "name": "Sam Curran",
    "country": "England",
    "countryCode": "GB",
    "role": "all-rounder",
    "basePrice": 200,
    "category": "marquee",
    "team2026": "rr",
    "isCapped": true,
    "stats": {
      "matches": 195,
      "runs": 2400,
      "wickets": 195
    }
  },
  {
    "id": "p258",
    "name": "Jofra Archer",
    "country": "England",
    "countryCode": "GB",
    "role": "bowler",
    "basePrice": 200,
    "category": "marquee",
    "team2026": "rr",
    "isCapped": true,
    "stats": {
      "matches": 80,
      "runs": 350,
      "wickets": 100
    }
  },
  {
    "id": "p259",
    "name": "Tushar Deshpande",
    "country": "India",
    "countryCode": "IN",
    "role": "bowler",
    "basePrice": 100,
    "category": "bowler",
    "team2026": "rr",
    "isCapped": true,
    "stats": {
      "matches": 55,
      "runs": 15,
      "wickets": 60
    }
  },
  {
    "id": "p260",
    "name": "Ravi Bishnoi",
    "country": "India",
    "countryCode": "IN",
    "role": "bowler",
    "basePrice": 150,
    "category": "bowler",
    "team2026": "rr",
    "isCapped": true,
    "stats": {
      "matches": 70,
      "runs": 15,
      "wickets": 90
    }
  },
  {
    "id": "p261",
    "name": "Sandeep Sharma",
    "country": "India",
    "countryCode": "IN",
    "role": "bowler",
    "basePrice": 100,
    "category": "bowler",
    "team2026": "rr",
    "isCapped": true,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p262",
    "name": "Nandre Burger",
    "country": "South Africa",
    "countryCode": "ZA",
    "role": "bowler",
    "basePrice": 75,
    "category": "bowler",
    "team2026": "rr",
    "isCapped": true,
    "stats": {
      "matches": 30,
      "runs": 15,
      "wickets": 35
    }
  },
  {
    "id": "p263",
    "name": "Kwena Maphaka",
    "country": "South Africa",
    "countryCode": "ZA",
    "role": "bowler",
    "basePrice": 50,
    "category": "bowler",
    "team2026": "rr",
    "isCapped": true,
    "stats": {
      "matches": 10,
      "runs": 5,
      "wickets": 12
    }
  },
  {
    "id": "p264",
    "name": "Adam Milne",
    "country": "New Zealand",
    "countryCode": "NZ",
    "role": "bowler",
    "basePrice": 75,
    "category": "bowler",
    "team2026": "rr",
    "isCapped": true,
    "stats": {
      "matches": 60,
      "runs": 30,
      "wickets": 70
    }
  },
  {
    "id": "p265",
    "name": "Kuldeep Sen",
    "country": "India",
    "countryCode": "IN",
    "role": "bowler",
    "basePrice": 50,
    "category": "bowler",
    "team2026": "rr",
    "isCapped": true,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p266",
    "name": "Vaibhav Suryavanshi",
    "country": "India",
    "countryCode": "IN",
    "role": "batsman",
    "basePrice": 30,
    "category": "uncapped",
    "team2026": "rr",
    "isCapped": false,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p267",
    "name": "Shubham Dubey",
    "country": "India",
    "countryCode": "IN",
    "role": "batsman",
    "basePrice": 30,
    "category": "uncapped",
    "team2026": "rr",
    "isCapped": false,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p268",
    "name": "Lhuan-dre Pretorius",
    "country": "South Africa",
    "countryCode": "ZA",
    "role": "wicket-keeper",
    "basePrice": 50,
    "category": "wicket-keeper",
    "team2026": "rr",
    "isCapped": true,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p269",
    "name": "Donovan Ferreira",
    "country": "South Africa",
    "countryCode": "ZA",
    "role": "all-rounder",
    "basePrice": 75,
    "category": "all-rounder",
    "team2026": "rr",
    "isCapped": true,
    "stats": {
      "matches": 20,
      "runs": 250,
      "wickets": 5
    }
  },
  {
    "id": "p270",
    "name": "Yudhvir Singh",
    "country": "India",
    "countryCode": "IN",
    "role": "bowler",
    "basePrice": 30,
    "category": "uncapped",
    "team2026": "rr",
    "isCapped": false,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p271",
    "name": "Sushant Mishra",
    "country": "India",
    "countryCode": "IN",
    "role": "bowler",
    "basePrice": 20,
    "category": "uncapped",
    "team2026": "rr",
    "isCapped": false,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p272",
    "name": "Dasun Shanaka",
    "country": "Sri Lanka",
    "countryCode": "LK",
    "role": "all-rounder",
    "basePrice": 100,
    "category": "all-rounder",
    "team2026": "rr",
    "isCapped": true,
    "stats": {
      "matches": 150,
      "runs": 2200,
      "wickets": 55
    }
  },
  {
    "id": "p273",
    "name": "Ravi Singh",
    "country": "India",
    "countryCode": "IN",
    "role": "batsman",
    "basePrice": 20,
    "category": "uncapped",
    "team2026": "rr",
    "isCapped": false,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p274",
    "name": "Aman Rao Perala",
    "country": "India",
    "countryCode": "IN",
    "role": "bowler",
    "basePrice": 20,
    "category": "uncapped",
    "team2026": "rr",
    "isCapped": false,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p275",
    "name": "Yash Raj Punja",
    "country": "India",
    "countryCode": "IN",
    "role": "bowler",
    "basePrice": 20,
    "category": "uncapped",
    "team2026": "rr",
    "isCapped": false,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p276",
    "name": "Pat Cummins",
    "country": "Australia",
    "countryCode": "AU",
    "role": "all-rounder",
    "basePrice": 200,
    "category": "marquee",
    "team2026": "srh",
    "isCapped": true,
    "stats": {
      "matches": 140,
      "runs": 450,
      "wickets": 180
    }
  },
  {
    "id": "p277",
    "name": "Travis Head",
    "country": "Australia",
    "countryCode": "AU",
    "role": "batsman",
    "basePrice": 200,
    "category": "marquee",
    "team2026": "srh",
    "isCapped": true,
    "stats": {
      "matches": 130,
      "runs": 3200,
      "wickets": 8
    }
  },
  {
    "id": "p278",
    "name": "Abhishek Sharma",
    "country": "India",
    "countryCode": "IN",
    "role": "all-rounder",
    "basePrice": 150,
    "category": "all-rounder",
    "team2026": "srh",
    "isCapped": true,
    "stats": {
      "matches": 50,
      "runs": 1200,
      "wickets": 10
    }
  },
  {
    "id": "p279",
    "name": "Heinrich Klaasen",
    "country": "South Africa",
    "countryCode": "ZA",
    "role": "wicket-keeper",
    "basePrice": 200,
    "category": "marquee",
    "team2026": "srh",
    "isCapped": true,
    "stats": {
      "matches": 185,
      "runs": 4600,
      "wickets": 0
    }
  },
  {
    "id": "p280",
    "name": "Ishan Kishan",
    "country": "India",
    "countryCode": "IN",
    "role": "wicket-keeper",
    "basePrice": 150,
    "category": "wicket-keeper",
    "team2026": "srh",
    "isCapped": true,
    "stats": {
      "matches": 110,
      "runs": 3000,
      "wickets": 0
    }
  },
  {
    "id": "p281",
    "name": "Liam Livingstone",
    "country": "England",
    "countryCode": "GB",
    "role": "all-rounder",
    "basePrice": 150,
    "category": "all-rounder",
    "team2026": "srh",
    "isCapped": true,
    "stats": {
      "matches": 200,
      "runs": 4500,
      "wickets": 55
    }
  },
  {
    "id": "p282",
    "name": "Nitish Kumar Reddy",
    "country": "India",
    "countryCode": "IN",
    "role": "all-rounder",
    "basePrice": 100,
    "category": "all-rounder",
    "team2026": "srh",
    "isCapped": true,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p283",
    "name": "Harshal Patel",
    "country": "India",
    "countryCode": "IN",
    "role": "bowler",
    "basePrice": 150,
    "category": "bowler",
    "team2026": "srh",
    "isCapped": true,
    "stats": {
      "matches": 120,
      "runs": 550,
      "wickets": 155
    }
  },
  {
    "id": "p284",
    "name": "Jaydev Unadkat",
    "country": "India",
    "countryCode": "IN",
    "role": "bowler",
    "basePrice": 75,
    "category": "bowler",
    "team2026": "srh",
    "isCapped": true,
    "stats": {
      "matches": 100,
      "runs": 50,
      "wickets": 120
    }
  },
  {
    "id": "p285",
    "name": "Kamindu Mendis",
    "country": "Sri Lanka",
    "countryCode": "LK",
    "role": "all-rounder",
    "basePrice": 100,
    "category": "all-rounder",
    "team2026": "srh",
    "isCapped": true,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p286",
    "name": "Brydon Carse",
    "country": "England",
    "countryCode": "GB",
    "role": "bowler",
    "basePrice": 75,
    "category": "bowler",
    "team2026": "srh",
    "isCapped": true,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p287",
    "name": "Eshan Malinga",
    "country": "Sri Lanka",
    "countryCode": "LK",
    "role": "bowler",
    "basePrice": 50,
    "category": "bowler",
    "team2026": "srh",
    "isCapped": true,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p288",
    "name": "Zeeshan Ansari",
    "country": "India",
    "countryCode": "IN",
    "role": "bowler",
    "basePrice": 20,
    "category": "uncapped",
    "team2026": "srh",
    "isCapped": false,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p289",
    "name": "Shivam Mavi",
    "country": "India",
    "countryCode": "IN",
    "role": "bowler",
    "basePrice": 75,
    "category": "bowler",
    "team2026": "srh",
    "isCapped": true,
    "stats": {
      "matches": 40,
      "runs": 30,
      "wickets": 50
    }
  },
  {
    "id": "p290",
    "name": "Jack Edwards",
    "country": "Australia",
    "countryCode": "AU",
    "role": "all-rounder",
    "basePrice": 50,
    "category": "all-rounder",
    "team2026": "srh",
    "isCapped": true,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p291",
    "name": "Aniket Verma",
    "country": "India",
    "countryCode": "IN",
    "role": "batsman",
    "basePrice": 20,
    "category": "uncapped",
    "team2026": "srh",
    "isCapped": false,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p292",
    "name": "Harsh Dubey",
    "country": "India",
    "countryCode": "IN",
    "role": "all-rounder",
    "basePrice": 20,
    "category": "uncapped",
    "team2026": "srh",
    "isCapped": false,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p293",
    "name": "Smaran Ravichandran",
    "country": "India",
    "countryCode": "IN",
    "role": "batsman",
    "basePrice": 20,
    "category": "uncapped",
    "team2026": "srh",
    "isCapped": false,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p294",
    "name": "Salil Arora",
    "country": "India",
    "countryCode": "IN",
    "role": "wicket-keeper",
    "basePrice": 20,
    "category": "uncapped",
    "team2026": "srh",
    "isCapped": false,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p295",
    "name": "Sakib Hussain",
    "country": "India",
    "countryCode": "IN",
    "role": "bowler",
    "basePrice": 20,
    "category": "uncapped",
    "team2026": "srh",
    "isCapped": false,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p296",
    "name": "Onkar Tarmale",
    "country": "India",
    "countryCode": "IN",
    "role": "bowler",
    "basePrice": 20,
    "category": "uncapped",
    "team2026": "srh",
    "isCapped": false,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  },
  {
    "id": "p297",
    "name": "Praful Hinge",
    "country": "India",
    "countryCode": "IN",
    "role": "bowler",
    "basePrice": 20,
    "category": "uncapped",
    "team2026": "srh",
    "isCapped": false,
    "stats": {
      "matches": 0,
      "runs": 0,
      "wickets": 0
    }
  }
];

export const formatPrice = (price: number) => {
    if (price >= 100) {
        return `₹${(price / 100).toFixed(2)}Cr`;
    }
    return `₹${price}L`;
};

export const getRoleBadgeColor = (role: string) => {
    switch (role) {
        case "batsman":
            return "bg-blue-500/20 text-blue-400 border border-blue-500/50";
        case "bowler":
            return "bg-red-500/20 text-red-400 border border-red-500/50";
        case "all-rounder":
            return "bg-purple-500/20 text-purple-400 border border-purple-500/50";
        case "wicket-keeper":
            return "bg-amber-500/20 text-amber-400 border border-amber-500/50";
        default:
            return "bg-gray-500/20 text-gray-400 border border-gray-500/50";
    }
};

export const getRoleDisplay = (role: string) => {
    switch (role) {
        case "batsman":
            return "Batsman";
        case "bowler":
            return "Bowler";
        case "all-rounder":
            return "All-Rounder";
        case "wicket-keeper":
            return "Wicket-Keeper";
        default:
            return role;
    }
};

export const getBidIncrement = (currentBid: number) => {
    if (currentBid < 100) return 5;
    if (currentBid < 500) return 25;
    if (currentBid < 1000) return 50;
    if (currentBid < 1500) return 75;
    return 100;
};
