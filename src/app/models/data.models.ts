export interface Game {
  id: number;
  date: Date;
  home_team: Team;
  home_team_score: number;
  period: number;
  postseason: boolean;
  season: number;
  status: string;
  time: string;
  visitor_team: Team;
  visitor_team_score: number;
}

export interface Team {
  id: number;
  abbreviation: string;
  city: string;
  conference: string;
  division: string;
  full_name: string;
  name: string;
}

export interface Stats {
  wins: number;
  losses: number;
  averagePointsScored: number;
  averagePointsConceded: number;
  lastGames: Result[];
}

export type Result = 'W' | 'L';

export type Conference = 'East' | 'West';

export type Division = 'Atlantic' | 'Central' | 'Southeast' | 'Northwest' | 'Pacific' | 'Southwest';

export const EAST_DIVISIONS: ReadonlyArray<Division> = ['Atlantic', 'Central', 'Southeast'];

export const WEST_DIVISIONS: ReadonlyArray<Division> = ['Northwest', 'Pacific', 'Southwest'];

export const filterTeams = (teams: Team[], filters?: { conference?: string; division?: string }) => {
  if (!filters) { return teams; }
  return teams.filter(t => {
    if (filters.conference && filters.conference !== t.conference) {
      return false;
    }
    if (filters.division && filters.division !== t.division) {
      return false;
    }
    return true;
  });
}

export const getDivisionsByConference = (conference: Conference) => {
  switch (conference) {
    case 'East':
      return EAST_DIVISIONS;
    case 'West':
      return WEST_DIVISIONS;
    default:
      return [];
  }
}