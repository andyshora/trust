const _initialStats = {
  totalActors: {
    Dove: 0,
    Hawk: 0
  },
  avgLifeTotals: {
    Dove: 0,
    Hawk: 0
  },
  unchallenged: {
    Dove: 0,
    Hawk: 0
  },
  encounters: {
    DoveDove: 0,
    DoveHawk: 0,
    HawkHawk: 0
  },
  wins: {
    Dove: 0,
    Hawk: 0
  }
}

class StatsService {
  constructor({ totals }) {
    this._stats = Object.assign({}, _initialStats)

    this._stats.totalActors.Dove = totals.Dove
    this._stats.totalActors.Hawk = totals.Hawk
  }
  recordUnchallenged({ winner }) {
    if (winner in this._stats.unchallenged) {
      this._stats.unchallenged[winner]++
    } else {
      console.error(`${winner} not found in this._stats.unchallenged`)
    }
  }
  recordEncounter({ actors, winner }) {
    if (actors in this._stats.encounters) {
      this._stats.encounters[actors]++
    } else {
      console.error(`${actors} not found in this._stats.encounters`)
    }
  }
  clear() {
    this._stats = Object.assign({}, _initialStats)
  }
}

export const stateService = new StatsService()
