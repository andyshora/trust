import _ from 'lodash'

import {
  Color,
  Vector3
} from 'three'

import {
  addPoint,
  createPointCloud,
  updatePoint
} from '../utils'

import Item from './Item'

var Vector = require('vector2d-lib'),
  Utils = require('drawing-utils-lib')

/**
 * Creates a new World.
 *
 * @param {Object} [opt_options=] A map of initial properties.
 * @constructor
 */
function World(opt_options) {
  Item.call(this)

  var options = opt_options || {}

  this.el = options.el || document.body
  this.name = 'World'

  this.options = options

  this.clouds = {
    Hawk: createPointCloud({
      pointSize: options.Hawk.pointSize,
      color: options.Hawk.color,
      shape: options.Hawk.shape
    }),
    Dove: createPointCloud({
      pointSize: options.Dove.pointSize,
      color: options.Dove.color,
      shape: options.Dove.shape
    }),
    Resource: createPointCloud({
      pointSize: options.Resource.pointSize,
      color: options.Resource.color,
      shape: options.Resource.shape
    })
  }


  /**
   * Worlds do not have worlds. However, assigning an
   * object literal makes for less conditions in the
   * update loop.
   */
  this.world = {}
}
Utils.extend(World, Item)

/**
 * Resets all properties.
 * @function init
 * @memberof World
 *
 * @param {Object} [opt_options=] A map of initial properties.
 * @param {number} [opt_options.width = this.el.scrollWidth] Width.
 * @param {number} [opt_options.height = this.el.scrollHeight] Height.
 *
 */
World.prototype.init = function(world, opt_options) {

  World._superClass.init.call(this, this.world, opt_options)

  var options = opt_options || {}

  this.color = options.color || [0, 0, 0]
  this.width = options.width || this.el.scrollWidth
  this.height = options.height || this.el.scrollHeight
  this.location = options.location || new Vector(0, 0)
  this.borderWidth = options.borderWidth || 0
  this.borderStyle = options.borderStyle || 'none'
  this.borderColor = options.borderColor || [0, 0, 0]
  this.gravity = options.gravity || new Vector(0, 1)
  this.c = typeof options.c !== 'undefined' ? options.c : 0.1
  this.pauseStep = !!options.pauseStep
  this.pauseDraw = !!options.pauseDraw
  this._camera = this._camera || new Vector()
  this.agents = []
  this.resources = []
  this.walkers = []
}

World.prototype.removeItem = function(item, data) {
  let index = -1
  const itemToRemove = item

  if (data && data.list) {
    index = _.findIndex(data.list, i => i.id === itemToRemove.id)
    const item = data.list[index]
    console.warn(`Resource ${item.id} consumed, and is no longer active in this world`)
  }

  // remove vertex in point cloud
  if (index !== -1 && item.name in this.clouds) {
    const pointCloud = this.clouds[item.name]

    // todo - do not change length of array buffer - super expensive
    // just hide the item
    pointCloud.geometry.attributes.color.array[(index * 3)] = 0
    pointCloud.geometry.attributes.color.array[(index * 3) + 1] = 0
    pointCloud.geometry.attributes.color.array[(index * 3) + 2] = 0

    pointCloud.geometry.attributes.position.array[(index * 3)] = 0
    pointCloud.geometry.attributes.position.array[(index * 3) + 1] = 0
    pointCloud.geometry.attributes.position.array[(index * 3) + 2] = 0

    pointCloud.geometry.attributes.position.needsUpdate = true
    pointCloud.geometry.attributes.color.needsUpdate = true
  }
}

/**
 * Adds an item to the world's view.
 * @param {Object} item An instance of item.
 */
World.prototype.add = function(item) {
  // if (item.index === -1) {
  //   return
  // }
  switch (item.type) {
    case 'Dove':
      this.walkers.push(item)
      // add a vertex to the cloud to represent Dove's position
      // this.clouds.Dove.geometry.vertices.push(new Vector3(item.location.x, item.location.y, 0));
      // this.clouds.Dove.geometry.colors.push(new Color(0xFFFFFF));
      addPoint({
        index: item.index,
        geometry: this.clouds.Dove.geometry,
        color: item.color ? item.color : this.options.Dove.color,
        size: item.size ? item.size : this.options.Dove.pointSize,
        position: [item.location.x, item.location.y, 0]
      })
      break
    case 'Food':
      if (item.name === 'Resource') {
        this.resources.push(item)
        // add a vertex to the cloud to represent Dove's position
        // this.clouds.Resource.geometry.vertices.push(new Vector3(item.location.x, item.location.y, 0));
        // this.clouds.Resource.geometry.colors.push(new Color(0x00FF33));
        addPoint({
          index: item.index,
          geometry: this.clouds.Resource.geometry,
          color: item.color ? item.color : this.options.Resource.color,
          size: item.size ? item.size : this.options.Resource.pointSize,
          position: [item.location.x, item.location.y, 0]
        })
      } else if (item.name === 'Sensor') {

      }
      break
    case 'Hawk':
      this.agents.push(item)
      // add a vertex to the cloud to represent Hawk's position
      // this.clouds.Hawk.geometry.vertices.push(new Vector3(item.location.x, item.location.y, 0));
      // this.clouds.Hawk.geometry.colors.push(new Color(0xFF0000));
      addPoint({
        index: item.index,
        geometry: this.clouds.Hawk.geometry,
        color: item.color ? item.color : this.options.Hawk.color,
        size: item.size ? item.size : this.options.Hawk.pointSize,
        position: [item.location.x, item.location.y, 0]
      })
      break
    default:
      break
  }
}

/**
 * Applies forces to world.
 * @function step
 * @memberof World
 */
World.prototype.step = function() {
  // update position of all vertices
  // const hawkPositions = this.clouds.Hawk.geometry.attributes.position.array;
  const updateFlags = {
    position: false,
    size: false,
    color: false
  }
  for (let i = 0; i < this.agents.length; i++) {
    updatePoint({
      index: i,
      geometry: this.clouds.Hawk.geometry,
      position: [this.agents[i].location.x, this.agents[i].location.y, 0],
      updateFlags
    })
    // const positionIndex = i * 3;
    // const v = this.clouds.Hawk.geometry.vertices[i]
    // v.setX(this.agents[i].location.x)
    // v.setY(this.agents[i].location.y)
    // hawkPositions[positionIndex] = this.agents[i].location.x;
    // hawkPositions[positionIndex + 1] = this.agents[i].location.y;
    // if (this.agents[i].opacity < 1) {
    //   this.clouds.Hawk.geometry.colors[i] = new Color(0xFF1111);
    //   this.clouds.Hawk.geometry.colorsNeedUpdate = true;
    // }
  }
  // const dovePositions = this.clouds.Dove.geometry.attributes.position.array;
  // update position of all vertices
  for (let i = 0; i < this.walkers.length; i++) {
    updatePoint({
      index: i,
      geometry: this.clouds.Dove.geometry,
      position: [this.walkers[i].location.x, this.walkers[i].location.y, 0],
      updateFlags
    })
    // const v = this.clouds.Dove.geometry.vertices[i]
    // v.setX(this.walkers[i].location.x)
    // v.setY(this.walkers[i].location.y)
    // const positionIndex = i * 3;
    // dovePositions[positionIndex] = this.walkers[i].location.x;
    // dovePositions[positionIndex + 1] = this.walkers[i].location.y;
    // if (this.walkers[i].opacity < 1) {
    //   this.clouds.Dove.geometry.colors[i] = new Color(0xFF1111);
    //   this.clouds.Dove.geometry.colorsNeedUpdate = true;
    // }
  }
  this.clouds.Hawk.geometry.attributes.position.needsUpdate = true
  this.clouds.Dove.geometry.attributes.position.needsUpdate = true
  this.clouds.Resource.geometry.attributes.position.needsUpdate = true

  this.location.add(this._camera)
}

export default World
