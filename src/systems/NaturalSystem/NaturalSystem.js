import React, { Component } from 'react'
import PropTypes from 'prop-types'
import loop from 'raf-loop'

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

import OrbitControls from 'threejs-orbit-controls'
import Flora from 'florajs'

// FloraJS objects
import Item from '../objects/Item'
import Resource from '../objects/Resource'
import Sensor from '../objects/Sensor'
import System from '../objects/System'
import Walker from '../objects/Walker'

const DEBUG = true
const DEBUG_LIGHTS = true

const NUM_HAWKS = 2
const NUM_DOVES = 2
const NUM_RESOURCES = 5
const SENSOR_AGGRESSIVE = 300
const SENSOR_EAT = 50

let foodEaten = 0

const _onConsume = (sensor, resource) => {
  const winner = sensor.parent
  // console.log('winner eats', winner.id, winner.FoodLevel)
  foodEaten += 1
  console.warn('foodEaten', foodEaten)

  // System.remove(resource, {
  //   list: resource.world.resources
  // })
}

function huntersAndPrey({ height, width }) {
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
      Hawk: {
        pointSize: 20,
        color: 0xFF00FF,
        shape: 'spark'
      },
      Dove: {
        pointSize: 20,
        color: 0xFF0000,
        shape: 'spark'
      },
      Resource: {
        pointSize: 20,
        color: 0xFFFF00,
        shape: 'spark'
      }
    })
    for (let i = 0; i < NUM_RESOURCES; i ++) {
      const location = new Flora.Vector(
        Flora.Utils.getRandomNumber(world.width * 0.1, world.width * 0.9),
        Flora.Utils.getRandomNumber(world.height * 0.1, world.height * 0.9)
      )
      console.log(location)
      this.add('Resource', {
        name: 'Food',
        type: 'Food',
        location,
        isStatic: true
      })
    }
    for (let i = 0; i < NUM_DOVES; i ++) {
      this.add('Walker', {
        name: 'Dove',
        type: 'Dove',
        location: new Flora.Vector(world.width * 0.6, world.height * 0.9),
        // remainsOnScreen: true,
        perlinSpeed: 0.001,
        motorSpeed: 2,
        minSpeed: 1,
        maxSpeed: 4,
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
    for (var i = 0; i < NUM_HAWKS; i ++) {
      this.add('Walker', {
        name: 'Hawk',
        type: 'Hawk',
        location: new Flora.Vector(world.width * 0.1, world.height * 0.5),
        motorSpeed: 2,
        minSpeed: 1,
        maxSpeed: 2,
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
      width
    } = this.props
    if (this._container) {
      this._width = width
      this._height = height

      huntersAndPrey({
        height: height,
        width: width
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

    this._controls = new OrbitControls(this._camera, this._renderer.domElement)
    this._controls.element = this._renderer.domElement
    this._controls.parent = this._renderer.domElement
    this._controls.maxDistance = 10000
    this._controls.minDistance = 200
    this._controls.enablePan = true
    this._controls.enableZoom = true
    this._controls.autoRotate = false
    this._controls.target = new Vector3(this._width / 2, this._height / 2, 0)

    if (DEBUG) {
      const axesHelper = new AxesHelper(500)
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
    this._scene.add(clouds.Resource)
    this._scene.add(clouds.Dove)
    this._scene.add(clouds.Hawk)

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
  width: PropTypes.number.isRequired
}

NaturalSystem.defaultProps = {
  autoStartAnimation: true
}

export default NaturalSystem
