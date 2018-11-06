const _initialStats = {
  totalActors: {
    Bat: 0,
    Dove: 0,
    Hawk: 0
  },
  avgLifeTotals: {
    Bat: 0,
    Dove: 0,
    Hawk: 0
  },
  unchallenged: {
    Bat: 0,
    Dove: 0,
    Hawk: 0
  },
  encounters: {
    BatBat: 0,
    DoveDove: 0,
    DoveHawk: 0,
    HawkHawk: 0
  },
  wins: {
    Bat: 0,
    Dove: 0,
    Hawk: 0
  },
  params: {

  }
}

class StatsService {
  constructor() {
    this._stats = Object.assign({}, _initialStats)
  }
  init({ life, totals }) {
    this._stats.totalActors.Dove = totals.Dove
    this._stats.totalActors.Hawk = totals.Hawk

    this._stats.params.fightCost = life.fightCost
    this._stats.params.winGain = life.winGain
    this._stats.params.startingLife = life.startingLife
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
  get conslusions() {
    const avgDamage = (this._stats.params.fightCost * this._stats.encounters.HawkHawk) / this._stats.totalActors.Hawk
    return {
      avgDamage
    }
  }
  get stats() {
    const avgDamage = (this._stats.params.fightCost * this._stats.encounters.HawkHawk) / this._stats.totalActors.Hawk
    return {...this._stats, avgDamage}
  }
}

export const statsService = new StatsService()
