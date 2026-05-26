import fs from 'fs';
import { PLAYERS, Player } from './src/data/players';

const exactStats: Record<string, any> = {
    "Sai Sudharsan": { runs: 638, wickets: 0, matches: 14 },
    "Shubman Gill": { runs: 616, wickets: 0, matches: 14 },
    "Heinrich Klaasen": { runs: 606, wickets: 0, matches: 14 },
    "KL Rahul": { runs: 593, wickets: 0, matches: 14 },
    "Vaibhav Sooryavanshi": { runs: 583, wickets: 0, matches: 14 },
    "Ishan Kishan": { runs: 569, wickets: 0, matches: 14 },
    "Abhishek Sharma": { runs: 563, wickets: 2, matches: 14 },
    "Mitchell Marsh": { runs: 563, wickets: 8, matches: 14 },
    "Virat Kohli": { runs: 557, wickets: 0, matches: 14 },
    "Prabhsimran Singh": { runs: 510, wickets: 0, matches: 14 },
    "Sanju Samson": { runs: 450, wickets: 0, matches: 14 },
    "Urvil Patel": { runs: 300, wickets: 0, matches: 10 },
    "Bhuvneshwar Kumar": { runs: 12, wickets: 24, matches: 14 },
    "Kagiso Rabada": { runs: 2, wickets: 24, matches: 14 },
    "Jofra Archer": { runs: 15, wickets: 21, matches: 14 },
    "Anshul Kamboj": { runs: 8, wickets: 21, matches: 14 },
    "Rashid Khan": { runs: 120, wickets: 19, matches: 14 },
    "Eshan Malinga": { runs: 5, wickets: 19, matches: 14 },
    "Kartik Tyagi": { runs: 2, wickets: 18, matches: 13 },
    "Mohammed Siraj": { runs: 10, wickets: 17, matches: 14 },
    "Prince Yadav": { runs: 0, wickets: 16, matches: 14 },
    "Sunil Narine": { runs: 320, wickets: 15, matches: 13 },
};

function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const updatedPlayers = PLAYERS.map(player => {
    if (exactStats[player.name]) {
        player.stats = exactStats[player.name];
        return player;
    }

    const price = player.basePrice || 30;
    
    let expectedMatches = 0;
    if (price >= 150) expectedMatches = getRandomInt(10, 14);
    else if (price >= 75) expectedMatches = getRandomInt(5, 13);
    else if (price >= 50) expectedMatches = getRandomInt(2, 10);
    else expectedMatches = getRandomInt(0, 7);

    let runs = 0;
    let wickets = 0;

    if (expectedMatches > 0) {
        if (player.role === 'batsman' || player.role === 'wicket-keeper') {
            const avgPerMatch = getRandomInt(15, 35);
            runs = expectedMatches * avgPerMatch + getRandomInt(-30, 50);
            if (runs < 0) runs = 0;
            if (player.role === 'batsman' && Math.random() < 0.1) wickets = getRandomInt(1, 3);
        } else if (player.role === 'bowler') {
            wickets = Math.floor(expectedMatches * (Math.random() * 1.0 + 0.5)) + getRandomInt(-2, 2);
            if (wickets < 0) wickets = 0;
            runs = expectedMatches * getRandomInt(0, 5);
        } else if (player.role === 'all-rounder') {
            const avgRuns = getRandomInt(10, 25);
            runs = expectedMatches * avgRuns + getRandomInt(-20, 30);
            if (runs < 0) runs = 0;
            wickets = Math.floor(expectedMatches * (Math.random() * 0.8 + 0.3)) + getRandomInt(-1, 2);
            if (wickets < 0) wickets = 0;
        }
    }

    player.stats = {
        matches: expectedMatches,
        runs: runs,
        wickets: wickets
    };
    return player;
});

const header = `export interface PlayerStats {
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

export const PLAYERS: Player[] = `;

fs.writeFileSync('./src/data/players.ts', header + JSON.stringify(updatedPlayers, null, 2) + ';\n');
console.log('Stats updated successfully!');
