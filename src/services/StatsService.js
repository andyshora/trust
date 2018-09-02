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
  constructor() {
    this._stats = Object.assign({}, _initialStats)
  }
  init({ totals }) {
    console.log('init', totals)
    this._stats.totalActors.Dove = totals.Dove
    this._stats.totalActors.Hawk = totals.Hawk
  }
  recordUnchallenged({ winner }) {
    console.log('recordUnchallenged', winner)
    if (winner in this._stats.unchallenged) {
      this._stats.unchallenged[winner]++
    } else {
      console.error(`${winner} not found in this._stats.unchallenged`)
    }
  }
  recordEncounter({ actors, winner }) {
    console.log('recordEncounter', actors, winner)
    if (actors in this._stats.encounters) {
      this._stats.encounters[actors]++
    } else {
      console.error(`${actors} not found in this._stats.encounters`)
    }

    if (winner in this._stats.wins) {
      this._stats.wins[winner]++
    } else {
      console.error(`${winner} not found in this._stats.wins`)
    }
  }
  setLifeTotals(avgLifeTotals) {
    avgLifeTotals.forEach(item => {
      if (item.actor in this._stats.avgLifeTotals) {
        this._stats.avgLifeTotals[item.actor] = item.value
      } else {
        console.error(`${item.actor} not found in this._stats.avgLifeTotals`)
      }
    })
  }
  clear() {
    this._stats = Object.assign({}, _initialStats)
  }
  get stats() {
    return this._stats
  }
}

export const statsService = new StatsService()
