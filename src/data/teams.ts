// IPL Teams Data
export interface Team {
    id: string;
    name: string;
    abbr: string;
    color: string;
    colorLight: string;
    logo?: string;
}

export const IPL_TEAMS: Team[] = [
    {
        id: "csk",
        name: "Chennai Super Kings",
        abbr: "CSK",
        color: "#ffc107",
        colorLight: "#ffe066",
    },
    {
        id: "mi",
        name: "Mumbai Indians",
        abbr: "MI",
        color: "#004ba0",
        colorLight: "#2196f3",
    },
    {
        id: "rcb",
        name: "Royal Challengers Bangalore",
        abbr: "RCB",
        color: "#d4001f",
        colorLight: "#ff5252",
    },
    {
        id: "kkr",
        name: "Kolkata Knight Riders",
        abbr: "KKR",
        color: "#3a225d",
        colorLight: "#7c4dff",
    },
    {
        id: "dc",
        name: "Delhi Capitals",
        abbr: "DC",
        color: "#0066b3",
        colorLight: "#42a5f5",
    },
    {
        id: "pbks",
        name: "Punjab Kings",
        abbr: "PBKS",
        color: "#ed1b24",
        colorLight: "#fc5858",
    },
    {
        id: "rr",
        name: "Rajasthan Royals",
        abbr: "RR",
        color: "#ea1a85",
        colorLight: "#ff6eb4",
    },
    {
        id: "srh",
        name: "Sunrisers Hyderabad",
        abbr: "SRH",
        color: "#ff822a",
        colorLight: "#ffa726",
    },
    {
        id: "lsg",
        name: "Lucknow Super Giants",
        abbr: "LSG",
        color: "#a72056",
        colorLight: "#e91e63",
    },
    {
        id: "gt",
        name: "Gujarat Titans",
        abbr: "GT",
        color: "#1c1c1c",
        colorLight: "#616161",
    },
];

export const getTeamById = (id: string): Team | undefined => {
    return IPL_TEAMS.find((team) => team.id === id);
};

export const getTeamColor = (id: string): string => {
    return getTeamById(id)?.color || "#666666";
};
