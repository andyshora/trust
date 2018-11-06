import {
  Utils,
  Vector
} from 'burner'

import _ from 'lodash'

import Item from './Item'
import System from './System';

/**
 * Creates a new Resource.
 *
 * Resources are the root object for any item that moves. They are not
 * aware of other Resources or stimuli. They have no means of locomotion
 * and change only due to external forces. You will never directly
 * implement Resource.
 *
 * @constructor
 * @extends Item
 */
function Resource(opt_options) {
  Item.call(this)
}
Utils.extend(Resource, Item)

/**
 * Initializes an instance of Resource.
 * @param  {Object} world An instance of World.
 * @param  {Object} opt_options A map of initial properties.
 * @param {string|Array} [opt_options.color = 255, 255, 255] Color.
 * @param {boolean} [opt_options.pointToDirection = true] If true, object will point in the direction it's moving.
 * @param {boolean} [opt_options.draggable = false] If true, object can move via drag and drop.
 * @param {Object} [opt_options.parent = null] A parent object. If set, object will be fixed to the parent relative to an offset distance.
 * @param {boolean} [opt_options.pointToParentDirection = true] If true, object points in the direction of the parent's velocity.
 * @param {number} [opt_options.offsetDistance = 30] The distance from the center of the object's parent.
 * @param {number} [opt_options.offsetAngle = 0] The rotation around the center of the object's parent.
 * @param {function} [opt_options.afterStep = null] A function to run after the step() function.
 * @param {function} [opt_options.isStatic = false] Set to true to prevent object from moving.
 * @param {Object} [opt_options.parent = null] Attach to another Flora object.
 */
Resource.prototype.init = function(world, opt_options) {
  Resource._superClass.init.call(this, world, opt_options)

  var options = opt_options || {}

  this.color = options.color || [255, 255, 255]
  this.pointToDirection = typeof options.pointToDirection === 'undefined' ? true : options.pointToDirection
  this.parent = options.parent || null
  this.pointToParentDirection = typeof options.pointToParentDirection === 'undefined' ? true : options.pointToParentDirection
  this.type = options.type
  this.offsetDistance = typeof options.offsetDistance === 'undefined' ? 0 : options.offsetDistance
  this.onResourceWon = typeof options.onResourceWon === 'function' ? options.onResourceWon : null
  this.offsetAngle = options.offsetAngle || 0
  this.executePayoffMatrix = typeof options.executePayoffMatrix === 'function' ? options.executePayoffMatrix : claims => claims[0]
  this.isStatic = !!options.isStatic
  this.claims = []
  this.maxClaimTimer = options.maxClaimTimer || 200
  this.claimTimer = 0
  this.consumed = false
}

Resource.prototype.updateHealthTotals = function(adjustments) {
  console.log('updateHealthTotals', adjustments)

  // add gains and costs
  adjustments.forEach((a, i) => {
    a.actor.life += a.adjustment
    console.log(`${a.actor.id} gained ${a.adjustment}, new life total: ${a.actor.life}`)
  })
}

Resource.prototype.resourceClaimed = function(actor) {
  if (actor) {
    this.consumed = true
    this.updateHealthTotals([{ actor, adjustment: 48 }])
    if (typeof this.onResourceWon === 'function') {
      this.onResourceWon(this)
    }
  }
}

Resource.prototype.newClaim = function(newClaimer) {
  if (this.claims.length === 2 || _.findIndex(this.claims, c => c.id === newClaimer.id) !== -1) {
    return
  }
  if (!this.claims.length && !this.claimTimer) {
    // console.log('set claim timer')
    this.claimTimer = this.maxClaimTimer
  }

  this.claims.push(newClaimer)
  // console.log('claims', this.claims)

  if (this.claims.length === 2) {
    this.fightToDetermineWinner(this.claims)
    this.claimTimer = 0
  }
}

Resource.prototype.fightToDetermineWinner = function(claims) {
  const result = this.executePayoffMatrix(claims.map(c => c.type))
  const { costs, gains } = result

  this.updateLifeTotals({ actors: claims, costs, gains })

  if (typeof this.onResourceWon === 'function') {
    this.onResourceWon(this)
  }
}

Resource.prototype.updateLifeTotals = function({ actors, costs, gains }) {
  this.claims = []
  this.consumed = true
  // console.log('updateLifeTotals', actors.map(a => a.type), gains, costs)

  // add gains and costs
  actors.forEach((a, i) => {
    const lifeChange = gains[i] - costs[i]
    a.life += lifeChange
    console.log(`${a.id} gained ${lifeChange}, new life total: ${a.life}`)
  })
}

Resource.prototype.step = function() {
  var i, max, x = this.location.x,
    y = this.location.y

  this.beforeStep.call(this)

  // do stuff - check collisions, etc
  if (this.claimTimer) {
    this.claimTimer--
    // console.log('claimTimer', this.claimTimer)
  }

  if (!this.claimTimer && this.claims.length) {
    this.fightToDetermineWinner(this.claims)
  }

  this.afterStep.call(this)
}

export default Resource
