/*global document */

var Vector = require('vector2d-lib')

/**
 * Creates a new Item.
 * @constructor
 * @param {string} opt_name The item's class name.
 */
function Item() {
  Item._idCount++
}

/**
 * Holds a count of item instances.
 * @memberof Item
 * @private
 */
Item._idCount = 0

/**
 * Resets all properties.
 * @function init
 * @memberof Item
 *
 * @param {Object} [opt_options=] A map of initial properties.
 * @param {number} [opt_options.name = 'Item'] The item's name.
 * @param {number} [opt_options.width = 10] Width.
 * @param {number} [opt_options.height = 10] Height.
 * @param {number} [opt_options.scale = 1] Scale.
 * @param {number} [opt_options.angle = 0] Angle.
 * @param {Array} [opt_options.colorMode = 'rgb'] Color mode. Possible values are 'rgb' and 'hsl'.
 * @param {Array} [opt_options.color = 200, 200, 200] Color.
 * @param {Array} [opt_options.borderWidth = 0] borderWidth.
 * @param {Array} [opt_options.borderStyle = 'none'] borderStyle.
 * @param {Array} [opt_options.borderColor = 255, 255, 255] borderColor.
 * @param {Array} [opt_options.borderRadius = 0] borderRadius.
 * @param {Array} [opt_options.boxShadowOffsetX = 0] boxShadowOffsetX.
 * @param {Array} [opt_options.boxShadowOffsetY = 0] boxShadowOffsetY.
 * @param {Array} [opt_options.boxShadowBlur = 0] boxShadowBlur.
 * @param {Array} [opt_options.boxShadowSpread = 0] boxShadowSpread.
 * @param {Array} [opt_options.boxShadowColor = 255, 255, 255] boxShadowColor.
 * @param {Array} [opt_options.opacity = 1] opacity.
 * @param {Array} [opt_options.zIndex = 0] zIndex.
 * @param {number} [opt_options.mass = 10] mass.
 * @param {Function|Object} [opt_options.acceleration = new Vector()] acceleration.
 * @param {Function|Object} [opt_options.velocity = new Vector()] velocity.
 * @param {Function|Object} [opt_options.location = new Vector()] location.
 * @param {number} [opt_options.maxSpeed = 10] maxSpeed.
 * @param {number} [opt_options.minSpeed = 0] minSpeed.
 * @param {bounciness} [opt_options.bounciness = 0] bounciness.
 * @param {number} [opt_options.life = 0] life.
 * @param {number} [opt_options.lifespan = -1] lifespan.
 * @param {boolean} [opt_options.checkWorldEdges = true] Set to true to check for world boundary collisions.
 * @param {boolean} [opt_options.wrapWorldEdges = false] Set to true to check for world boundary collisions and position item at the opposing boundary.
 * @param {Function} [opt_options.beforeStep = function() {}] This function will be called at the beginning of the item's step() function.
 * @param {Function} [opt_options.afterStep = function() {}] This function will be called at the end of the item's step() function.
 * @param {string} [opt_options.controlCamera = false] Set to true to set world's position relaive to this item.
 */
Item.prototype.init = function(world, opt_options) {

  if (!world || typeof world !== 'object') {
    throw new Error('Item requires an instance of World.')
  }

  this.world = world

  var options = opt_options || {}

  this.index = options.index

  this.name = typeof this.name !== 'undefined' ? this.name
    : options.name || 'Item'

  this.width = typeof this.width !== 'undefined' ? this.width
    : typeof options.width === 'undefined' ? 10 : options.width

  this.height = typeof this.height !== 'undefined' ? this.height
    : typeof options.height === 'undefined' ? 10 : options.height

  this.scale = typeof this.scale !== 'undefined' ? this.scale
    : typeof options.scale === 'undefined' ? 1 : options.scale

  this.angle = typeof this.angle !== 'undefined' ? this.angle
    : options.angle || 0

  this.color = options.color
  this.size = options.size

  this.opacity = typeof this.opacity !== 'undefined' ? this.opacity
    : typeof options.opacity === 'undefined' ? 1 : options.opacity

  this.mass = typeof this.mass !== 'undefined' ? this.mass
    : typeof options.mass === 'undefined' ? 10 : options.mass

  this.acceleration = typeof this.acceleration !== 'undefined' ? this.acceleration
    : options.acceleration || new Vector()

  this.velocity = typeof this.velocity !== 'undefined' ? this.velocity
    : options.velocity || new Vector()

  this.location = typeof this.location !== 'undefined' ? this.location
    : options.location || new Vector(this.world.width / 2, this.world.height / 2)

  this.maxSpeed = typeof this.maxSpeed !== 'undefined' ? this.maxSpeed
    : typeof options.maxSpeed === 'undefined' ? 10 : options.maxSpeed

  this.minSpeed = typeof this.minSpeed !== 'undefined' ? this.minSpeed
    : options.minSpeed || 0

  this.bounciness = typeof this.bounciness !== 'undefined' ? this.bounciness
    : typeof options.bounciness === 'undefined' ? 0.5 : options.bounciness

  this.life = typeof this.life !== 'undefined' ? this.life
    : options.life || 0

  this.lifespan = typeof this.lifespan !== 'undefined' ? this.lifespan
    : typeof options.lifespan === 'undefined' ? -1 : options.lifespan

  this.checkWorldEdges = typeof this.checkWorldEdges !== 'undefined' ? this.checkWorldEdges
    : typeof options.checkWorldEdges === 'undefined' ? true : options.checkWorldEdges

  this.wrapWorldEdges = typeof this.wrapWorldEdges !== 'undefined' ? this.wrapWorldEdges
    : !!options.wrapWorldEdges

  this.beforeStep = typeof this.beforeStep !== 'undefined' ? this.beforeStep
    : options.beforeStep || function() {}

  this.afterStep = typeof this.afterStep !== 'undefined' ? this.afterStep
    : options.afterStep || function() {}

  this.controlCamera = typeof this.controlCamera !== 'undefined' ? this.controlCamera
    : !!options.controlCamera

  this._force = this._force || new Vector()

  this.id = this.name + Item._idCount

  this.type = options.type

  if (!this.el) {
    this.world.add(this)
    this.el = 1
  }
}

/**
 * Applies forces to item.
 * @function step
 * @memberof Item
 */
Item.prototype.step = function() {

  var x = this.location.x,
    y = this.location.y

  this.beforeStep.call(this)
  this.applyForce(this.world.gravity)
  this.applyForce(this.world.wind)
  this.velocity.add(this.acceleration)
  this.velocity.limit(this.maxSpeed, this.minSpeed)
  this.location.add(this.velocity)
  if (this.checkWorldEdges) {
    this._checkWorldEdges()
  } else if (this.wrapWorldEdges) {
    this._wrapWorldEdges()
  }
  if (this.controlCamera) { // need the corrected velocity which is the difference bw old/new location
    this._checkCameraEdges(x, y, this.location.x, this.location.y)
  }
  this.acceleration.mult(0)
  this.afterStep.call(this)
}

/**
 * Adds a force to this object's acceleration.
 * @function applyForce
 * @memberof Item
 * @param {Object} force A Vector representing a force to apply.
 * @returns {Object} A Vector representing a new acceleration.
 */
Item.prototype.applyForce = function(force) {
  // calculated via F = m * a
  if (force) {
    this._force.x = force.x
    this._force.y = force.y
    this._force.div(this.mass)
    this.acceleration.add(this._force)
    return this.acceleration
  }
}

/**
 * Prevents object from moving beyond world bounds.
 * @function _checkWorldEdges
 * @memberof Item
 * @private
 */
Item.prototype._checkWorldEdges = function() {

  var worldRight = this.world.width,
    worldBottom = this.world.height,
    location = this.location,
    velocity = this.velocity,
    width = this.width * this.scale,
    height = this.height * this.scale,
    bounciness = this.bounciness

  if (location.x + width / 2 > worldRight) {
    location.x = worldRight - width / 2
    velocity.x *= -1 * bounciness
  } else if (location.x < width / 2) {
    location.x = width / 2
    velocity.x *= -1 * bounciness
  }

  if (location.y + height / 2 > worldBottom) {
    location.y = worldBottom - height / 2
    velocity.y *= -1 * bounciness
  } else if (location.y < height / 2) {
    location.y = height / 2
    velocity.y *= -1 * bounciness
  }
}

/**
 * If item moves beyond world bounds, position's object at the opposite boundary.
 * @function _wrapWorldEdges
 * @memberof Item
 * @private
 */
Item.prototype._wrapWorldEdges = function() {

  var worldRight = this.world.width,
    worldBottom = this.world.height,
    location = this.location,
    width = this.width * this.scale,
    height = this.height * this.scale

  if (location.x - width / 2 > worldRight) {
    location.x = -width / 2
  } else if (location.x < -width / 2) {
    location.x = worldRight + width / 2
  }

  if (location.y - height / 2 > worldBottom) {
    location.y = -height / 2
  } else if (location.y < -height / 2) {
    location.y = worldBottom + height / 2
  }
}

/**
 * Moves the world in the opposite direction of the Camera's controlObj.
 */
Item.prototype._checkCameraEdges = function(lastX, lastY, x, y) {
  this.world._camera.x = lastX - x
  this.world._camera.y = lastY - y
}

/**
 * Updates the corresponding DOM element's style property.
 * @function draw
 * @memberof Item
 */
Item.prototype.draw = function() {}

export default Item
