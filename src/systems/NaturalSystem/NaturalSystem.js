import React, { Component } from 'react'
import PropTypes from 'prop-types'
import loop from 'raf-loop'
import _ from 'lodash'

import {
  // AmbientLight,
  AxesHelper,
  // Box3,
  BoxGeometry,
  DirectionalLight,
  DirectionalLightHelper,
  Group,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  OrthographicCamera,
  // PerspectiveCamera,
  PointLight,
  PointLightHelper,
  Scene,
  SphereGeometry,
  // SpotLight,
  // SpotLightHelper,
  Vector3,
  WebGLRenderer
} from 'three'

import OrthographicTrackballControls from 'threejs-controls/OrthographicTrackballControls';
import Flora from 'florajs'

// FloraJS objects
import Item from '../objects/Item'
import Resource from '../objects/Resource'
import Sensor from '../objects/Sensor'
import System from '../objects/System'
import Walker from '../objects/Walker'

const DEBUG = false
const DEBUG_LIGHTS = false

const NUM_HAWKS = 10
const NUM_DOVES = 50
const NUM_RESOURCES = 200
const SENSOR_AGGRESSIVE = 100
const SENSOR_EAT = 50
const FIGHT_COST = 20
const WIN_GAIN = 8
const LIFE_TOTAL = 100

const RESOURCES_REGENERATE = false

let foodEaten = 0
let fightCount = 0

// the game theory payoff matrix
const payoffMatrix = actors => {
  if (actors.length === 1) {
    // no competition - winner takes all
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
      fightCount++
      break
    case 'HawkDove':
      gains = [WIN_GAIN, 0]
      break
    case 'DoveHawk':
      gains = [0, WIN_GAIN]
      break
    default:
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

  const availableResources = _.filter(resource.world.resources, r => !r.consumed)

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
  console.log('doveLife (total, average)', doveLife / NUM_DOVES)
  console.log('hawkLife (total, average)', hawkLife / NUM_HAWKS, `(${fightCount} fights)`)
  resource.world.options.resultsCallback([
    { actor: 'Dove', lifeAverage: doveLife / NUM_DOVES },
    { actor: 'Hawk', lifeAverage: hawkLife / NUM_HAWKS, fights: fightCount }
  ])
}

function huntersAndPrey({ height, resultsCallback, width }) {
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
        pointSize: 10,
        color: 0x00FF00,
        shape: 'hex'
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
      this.add('Walker', {
        name: 'Hawk',
        type: 'Hawk',
        life: LIFE_TOTAL,
        location,
        index: i,
        motorSpeed: 2,
        minSpeed: 1,
        maxSpeed: 5,
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
  componentDidMount() {
    const {
      autoStartAnimation,
      height,
      resultsCallback,
      width
    } = this.props
    if (this._container) {
      this._width = width
      this._height = height

      huntersAndPrey({
        height: height,
        width: width,
        resultsCallback: typeof resultsCallback === 'function' && resultsCallback
      })

      this._renderer = new WebGLRenderer({ antialias: true })
      this._renderer.setPixelRatio(window.devicePixelRatio)
      this._renderer.setClearColor(0x000000)
      this._container.current.appendChild(this._renderer.domElement)

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
  _renderScene = dt => {
    // const { behaviour } = this.props

    // do stuff here
    this._controls.update()
    this._camera.updateProjectionMatrix()
    this._renderer.render(this._scene, this._camera)
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
  width: PropTypes.number.isRequired
}

NaturalSystem.defaultProps = {
  autoStartAnimation: true,
  resultsCallback: null
}

export default NaturalSystem
