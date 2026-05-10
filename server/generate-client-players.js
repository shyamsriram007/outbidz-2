const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'team-data');
const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json')).sort();
let allPlayers = [];
for (const f of files) {
  const data = JSON.parse(fs.readFileSync(path.join(dataDir, f), 'utf8'));
  allPlayers = allPlayers.concat(data);
}

let playerStats = {};
try {
  playerStats = require('../src/data/player-stats.json');
} catch(e) {}

const clientPlayers = allPlayers.map((p, index) => {
    const stats = playerStats[p[0]] || [0, 0, 0];
    return {
        id: "p" + (index + 1),
        name: p[0],
        country: p[1],
        countryCode: p[2],
        role: p[3],
        basePrice: p[4],
        category: p[5],
        team2026: p[6],
        isCapped: p[7] !== false,
        stats: { matches: stats[0], runs: stats[1], wickets: stats[2] }
    };
});

const output = `export interface PlayerStats {
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

export const PLAYERS: Player[] = ${JSON.stringify(clientPlayers, null, 2)};
`;

fs.writeFileSync(path.join(__dirname, '../src/data/players.ts'), output);
console.log('Generated src/data/players.ts');
