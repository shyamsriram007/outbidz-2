// Script to assemble players.js from team data files
// Run: node server/generate-players.js
const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'team-data');
const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json')).sort();
let allPlayers = [];
for (const f of files) {
  const data = JSON.parse(fs.readFileSync(path.join(dataDir, f), 'utf8'));
  allPlayers = allPlayers.concat(data);
}

const output = `// Auto-generated player data - IPL 2026 squads + auction pool
// Format: [name, country, countryCode, role, basePrice, category, team2026, isCapped]

const CRICKETER_DATA = ${JSON.stringify(allPlayers, null, 2)};

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

const CATEGORY_ORDER = ["marquee", "batsman", "bowler", "wicket-keeper", "all-rounder", "uncapped"];

let PLAYER_STATS;
try { PLAYER_STATS = require('../src/data/player-stats.json'); } catch(e) { PLAYER_STATS = {}; }

function getOrderedPlayers() {
    const grouped = {};
    CATEGORY_ORDER.forEach(c => grouped[c] = []);
    CRICKETER_DATA.forEach(p => {
        const cat = p[5];
        if (grouped[cat]) grouped[cat].push(p);
        else grouped["uncapped"].push(p);
    });
    const orderedData = [];
    CATEGORY_ORDER.forEach(cat => orderedData.push(...shuffleArray(grouped[cat])));
    return orderedData.map((data, index) => {
        const statsArr = PLAYER_STATS[data[0]] || [0, 0, 0];
        return {
            id: "p" + (index + 1),
            name: data[0], country: data[1], countryCode: data[2],
            role: data[3], basePrice: data[4], category: data[5],
            team2026: data[6] || null, isCapped: data[7] !== false,
            stats: { matches: statsArr[0], runs: statsArr[1], wickets: statsArr[2] },
        };
    });
}

function getShuffledPlayers() { return getOrderedPlayers(); }
module.exports = { getShuffledPlayers };
`;

fs.writeFileSync(path.join(__dirname, 'players.js'), output);
console.log('Generated players.js with ' + allPlayers.length + ' players from ' + files.length + ' files');
