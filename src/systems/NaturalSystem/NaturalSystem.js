import React, { Component } from 'react'
import PropTypes from 'prop-types'
import loop from 'raf-loop'
import _ from 'lodash'

import {
  // AmbientLight,
  AxesHelper,
  // Box3,
  // BoxGeometry,
  DirectionalLight,
  DirectionalLightHelper,
  // Group,
  // Mesh,
  // MeshStandardMaterial,
  Object3D,
  OrthographicCamera,
  // PerspectiveCamera,
  // PointLight,
  // PointLightHelper,
  Scene,
  // SphereGeometry,
  // SpotLight,
  // SpotLightHelper,
  // Vector3,
  WebGLRenderer
} from 'three'

import OrthographicTrackballControls from 'threejs-controls/OrthographicTrackballControls'
import Flora from 'florajs'

// FloraJS objects
import Item from '../objects/Item'
import Resource from '../objects/Resource'
import Sensor from '../objects/Sensor'
import System from '../objects/System'
import Walker from '../objects/Walker'

import { statsService as stats } from '../../services/StatsService'
import { audioService as audio } from '../../services/AudioService'

const DEBUG = false
const DEBUG_LIGHTS = false

let NUM_HAWKS = 10
let NUM_DOVES = 50
let NUM_RESOURCES = 200
let SENSOR_AGGRESSIVE = 100
let SENSOR_EAT = 50
let FIGHT_COST = 20
let WIN_GAIN = 8
let LIFE_TOTAL = 100
let CAMERA_FOLLOWS_HAWK = false

let RESOURCES_REGENERATE = true

// let foodEaten = 0
// let fightCount = 0

// the game theory payoff matrix
const payoffMatrix = actors => {
  if (actors.length === 1) {
    // no competition - winner takes all
    stats.recordUnchallenged({ winner: actors[0] })
    return {
      costs: [0, 0],
      gains: [WIN_GAIN, 0]
    }
  }

  const str = actors.join('')
  let gains = [WIN_GAIN / 2, WIN_GAIN / 2]
  let costs = [0, 0]
  switch (str) {
    case 'HawkHawk':
      // the early bird gets the worm
      costs = [FIGHT_COST / 2, FIGHT_COST / 2]
      // fightCount++
      audio.play('click', { volume: 1 })
      stats.recordEncounter({ actors: str, winner: 'Hawk' })
      break
    case 'HawkDove':
      gains = [WIN_GAIN, 0]
      // audio.play('button')
      stats.recordEncounter({ actors: 'DoveHawk', winner: 'Hawk' })
      break
    case 'DoveHawk':
      gains = [0, WIN_GAIN]
      // audio.play('button')
      stats.recordEncounter({ actors: str, winner: 'Hawk' })
      break
    default:
      // audio.play('click')
      stats.recordEncounter({ actors: str, winner: 'Dove' })
      break
  }
  return {
    costs,
    gains
  }
}

const _onConsume = (sensor, resource) => {
  resource.newClaim(sensor.parent)
}

function _onResourceWon(resource) {
  const numResources = resource.world.resources.length
  System.remove(resource, {
    list: resource.world.resources
  })

  // const availableResources = _.filter(resource.world.resources, r => !r.consumed)

  // add a new resource
  const location = new Flora.Vector(
    Flora.Utils.getRandomNumber(resource.world.width * 0.1, resource.world.width * 0.9),
    Flora.Utils.getRandomNumber(resource.world.height * 0.1, resource.world.height * 0.9)
  )

  if (RESOURCES_REGENERATE) {
    System.add('Resource', {
      name: 'Food',
      type: 'Food',
      location,
      index: numResources + 1,
      isStatic: true,
      onResourceWon: _onResourceWon,
      maxClaimTimer: 100,
      executePayoffMatrix: payoffMatrix
    })
  }

  const doveLife = _.sumBy(System.firstWorld().walkers, w => w.life)
  const hawkLife = _.sumBy(System.firstWorld().agents, w => w.life)
  stats.setLifeTotals([
    { actor: 'Dove', value: doveLife / NUM_DOVES  },
    { actor: 'Hawk', value: hawkLife / NUM_HAWKS  }
  ])
  resource.world.options.resultsCallback(stats.stats)
}

function hawksOnly({ height, resultsCallback, width }) {
  NUM_HAWKS = 10
  NUM_DOVES = 0
  NUM_RESOURCES = 10
  SENSOR_AGGRESSIVE = 300
  setupWorld({ height, resultsCallback, width })
}

function dovesOnly({ height, resultsCallback, width }) {
  NUM_HAWKS = 0
  NUM_DOVES = 10
  NUM_RESOURCES = 10
  SENSOR_AGGRESSIVE = 300
  setupWorld({ height, resultsCallback, width })
}

function huntersAndPrey({ height, resultsCallback, width }) {
  NUM_HAWKS = 50
  NUM_DOVES = 10
  NUM_RESOURCES = 20
  SENSOR_AGGRESSIVE = 100
  setupWorld({ height, resultsCallback, width })
}

function setupWorld({ height, resultsCallback, width }) {
  console.log('NUM_HAWKS', NUM_HAWKS)
  console.log('NUM_DOVES', NUM_DOVES)
  console.log('NUM_RESOURCES', NUM_RESOURCES)

  stats.init({
    totals: {
      Dove: NUM_DOVES,
      Hawk: NUM_HAWKS
    },
    life: {
      fightCost: FIGHT_COST,
      winGain: WIN_GAIN,
      startingLife: WIN_GAIN
    }
  })
  System.setup(function() {
    System.Classes = {
      Item: Item,
      Resource: Resource,
      Sensor: Sensor,
      Walker: Walker
    }
    const world = this.add('World', {
      width,
      height,
      gravity: new Flora.Vector(),
      c: 0,
      resultsCallback,
      Hawk: {
        pointSize: 20,
        color: 0xFF0000,
        shape: 'disc'
      },
      Dove: {
        pointSize: 20,
        color: 0xFFFFFF,
        shape: 'disc'
      },
      Resource: {
        pointSize: 50,
        color: 0x00FF00,
        shape: 'spark'
      }
    })

    for (let i = 0; i < NUM_RESOURCES; i++) {
      const location = new Flora.Vector(
        Flora.Utils.getRandomNumber(world.width * 0.1, world.width * 0.9),
        Flora.Utils.getRandomNumber(world.height * 0.1, world.height * 0.9)
      )
      this.add('Resource', {
        name: 'Food',
        type: 'Food',
        color: 0x00FF00,
        size: 50,
        location,
        index: i,
        isStatic: true,
        onResourceWon: _onResourceWon,
        maxClaimTimer: 100,
        executePayoffMatrix: payoffMatrix
      })
    }
    for (let i = 0; i < NUM_DOVES; i++) {
      const location = new Flora.Vector(
        Flora.Utils.getRandomNumber(world.width * 0.1, world.width * 0.9),
        Flora.Utils.getRandomNumber(world.height * 0.1, world.height * 0.9)
      )
      this.add('Walker', {
        name: 'Dove',
        type: 'Dove',
        size: 20,
        color: 0xFFFFFF,
        life: LIFE_TOTAL,
        location,
        index: i,
        // remainsOnScreen: true,
        perlinSpeed: 0.001,
        motorSpeed: 2,
        minSpeed: 1,
        maxSpeed: 3,
        sensors: [
          this.add('Sensor', {
            type: 'Food',
            targetType: 'Resource',
            sensitivity: SENSOR_EAT,
            behavior: 'EAT',
            onConsume: _onConsume
          }),
          this.add('Sensor', {
            type: 'Food',
            targetType: 'Resource',
            sensitivity: SENSOR_AGGRESSIVE,
            behavior: 'AGGRESSIVE'
          })
        ]
      })
    }

    for (var i = 0; i < NUM_HAWKS; i++) {
      const location = new Flora.Vector(
        Flora.Utils.getRandomNumber(world.width * 0.1, world.width * 0.9),
        Flora.Utils.getRandomNumber(world.height * 0.1, world.height * 0.9)
      )
      const controlCamera = CAMERA_FOLLOWS_HAWK && !i
      this.add('Walker', {
        name: 'Hawk',
        type: 'Hawk',
        size: 100,
        color: 0xFF0000,
        life: LIFE_TOTAL,
        location,
        index: i,
        motorSpeed: 2,
        minSpeed: 1,
        maxSpeed: 5,
        controlCamera,
        // flocking: true,
        sensors: [
          this.add('Sensor', {
            type: 'Food',
            targetType: 'Resource',
            sensitivity: SENSOR_EAT,
            behavior: 'EAT',
            onConsume: _onConsume
          }),
          this.add('Sensor', {
            type: 'Food',
            targetType: 'Resource',
            sensitivity: SENSOR_AGGRESSIVE,
            behavior: 'AGGRESSIVE'
          })
        ]
      })
    }

    this._toggleFPS()
  })
  System.loop()
}

class NaturalSystem extends Component {
  _animationEngine = null
  _controls = null
  _cube = null
  _group = null
  _lightTarget = null
  _scene = null
  _renderer = null
  _camera = null
  _width = null
  _height = null
  _rotationSpeed = 0.005
  constructor(props) {
    super(props)
    this._container = React.createRef()
  }
  // static getDerivedStateFromProps() {}
  componentDidMount() {
    this._stopActiveSystem()
    this._initNewSystem()
  }
  componentDidUpdate(prevProps) {
    if (prevProps.type !== this.props.type) {
      this._stopActiveSystem()
      this._initNewSystem()
    }
  }
  componentWillUnmount() {
    this._stopActiveSystem()
  }
  _clearScene() {
    if (this._scene) {
      this._scene.remove.apply(this._scene, this._scene.children)
    }
  }
  _stopActiveSystem() {
    const { resultsCallback } = this.props
    this.stopAnimation()
    stats.clear()
    resultsCallback(stats.stats)
    // this._animationEngine = null
    // this._controls = null
    // this._cube = null
    // this._group = null
    // this._lightTarget = null
    // this._scene = null
    // this._renderer = null
    // this._camera = null
  }
  _initNewSystem() {
    const {
      autoStartAnimation,
      height,
      resultsCallback,
      type,
      width
    } = this.props
    if (this._container) {
      this._width = width
      this._height = height

      switch (type) {
        case 'doves':
          dovesOnly({
            height: height,
            width: width,
            resultsCallback: typeof resultsCallback === 'function' && resultsCallback
          })
          break
        case 'hawks':
          hawksOnly({
            height: height,
            width: width,
            resultsCallback: typeof resultsCallback === 'function' && resultsCallback
          })
          break
        default:
          huntersAndPrey({
            height: height,
            width: width,
            resultsCallback: typeof resultsCallback === 'function' && resultsCallback
          })
      }

      if (!this._renderer) {
        this._renderer = new WebGLRenderer({ antialias: true })
        this._renderer.setPixelRatio(window.devicePixelRatio)
        this._renderer.setClearColor(0x000000)
        this._container.current.appendChild(this._renderer.domElement)
      }
      this._clearScene()
      this._setupSceneAndCamera()

      this.resize({ width, height })

      if (autoStartAnimation && this._container.current) {
        this.startAnimation()
      }
    }
  }
  startAnimation() {
    if (this._animationEngine
      && !this._animationEngine.running
      && this._container.current) {
      this._animationEngine.start()
    }
  }
  stopAnimation() {
    if (this._animationEngine
      && this._animationEngine.running
      && this._container.current) {
      this._animationEngine.stop()
    }
  }
  resize({ width, height }) {
    this._width = width
    this._height = height
    this._camera.aspect = this._width / this._height
    this._camera.updateProjectionMatrix()
    this._renderer.setSize(this._width, this._height)
    this._renderScene()
  }
  _setupSceneAndCamera() {
    this._scene = new Scene()
    this._camera = new OrthographicCamera(
      0,
      this._width,
      this._height,
      0,
      1,
      8000
    )
    this._camera.position.set(this._width / 2, this._height / 2, 5000)

    this._controls = new OrthographicTrackballControls(this._camera, this._renderer.domElement)
    this._controls.noRotate = true
    this._controls.noRoll = true
    this._controls.noPan = false
    this._controls.noZoom = false
    this._controls.zoomSpeed = 0.2

    // this._controls.element = this._renderer.domElement
    // this._controls.parent = this._renderer.domElement
    // this._controls.maxDistance = 10000
    // this._controls.minDistance = 200
    // this._controls.enablePan = true
    // this._controls.enableZoom = true
    // this._controls.autoRotate = false
    // this._controls.target = new Vector3(this._width / 2, this._height / 2, 0)

    if (DEBUG) {
      const axesHelper = new AxesHelper(500, this._width)
      this._scene.add(axesHelper)
    }

    const lightTarget = new Object3D()
    lightTarget.position.set(this._width / 2, this._height / 2, 0)
    this._scene.add(lightTarget)

    const lights = [
      new DirectionalLight(0xffffff, 1),
      new DirectionalLight(0xffffff, 0.8),
      new DirectionalLight(0xffffff, 0.5),
      new DirectionalLight(0xffffff, 0.8),
      new DirectionalLight(0xffffff, 0.8),
      new DirectionalLight(0xffffff, 0.5)
    ]

    const radius = 5000
    lights[0].position.set(0, radius * 0.5, 0)
    lights[1].position.set(radius * 0.5, 0, 0)
    lights[2].position.set(0, 0, radius * -0.5)
    lights[3].position.set(0, radius * -0.5, 0)
    lights[4].position.set(radius * -0.5, 0, 0)
    lights[5].position.set(0, 0, radius * 0.5)

    lights.forEach(l => {
      l.target = lightTarget
      // l.distance = 5000
      this._scene.add(l)
    })

    if (DEBUG_LIGHTS) {
      lights.forEach(l => this._scene.add(new DirectionalLightHelper(l, 100, 0xFFFF00)))
    }
    /* Actual content of the scene */
    if (System.firstWorld()) {
      const clouds = System.firstWorld().clouds
      if (NUM_DOVES) {
        this._scene.add(clouds.Dove)
      }
      if (NUM_RESOURCES) {
        this._scene.add(clouds.Resource)
      }
      if (NUM_HAWKS) {
        this._scene.add(clouds.Hawk)
      }

      this._animationEngine = loop(this._renderScene)
    }

  }
  _renderScene = dt => {
    // const { behaviour } = this.props
    if (CAMERA_FOLLOWS_HAWK) {
      const location = System.firstWorld().location
      if (this._renderer.domElement) {
        this._renderer.domElement.style.transform = `translate3d(${_.round(-location.x, 2)}px, ${_.round(-location.y, 2)}px, 0)`

      }
    }

    if (this._controls) {
      this._controls.update()
    }
    if (this._camera) {
      this._camera.updateProjectionMatrix()
    }
    if (this._renderer) {
      this._renderer.render(this._scene, this._camera)
    }
  }
  reset() {
    System._resetSystem()
  }
  /**
   * This will be called externally, to render the scene
   */
  render() {
    const { height, width } = this.props
    const containerStyles = {
      width,
      height,
      margin: 0,
      overflow: 'hidden'
    }
    return <div ref={this._container} style={containerStyles} />
  }
}

NaturalSystem.propTypes = {
  autoStartAnimation: PropTypes.bool,
  height: PropTypes.number.isRequired,
  resultsCallback: PropTypes.func,
  type: PropTypes.string,
  width: PropTypes.number.isRequired
}

NaturalSystem.defaultProps = {
  autoStartAnimation: true,
  resultsCallback: null,
  type: 'huntersAndPrey'
}

export default NaturalSystem
