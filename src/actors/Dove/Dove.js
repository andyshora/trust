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
  // OrthographicCamera,
  PerspectiveCamera,
  // PointLight,
  // PointLightHelper,
  Scene,
  SphereGeometry,
  // SpotLight,
  // SpotLightHelper,
  Vector3,
  WebGLRenderer
} from 'three'

import OBJLoader from 'three-obj-loader'
import OrbitControls from 'threejs-orbit-controls'

OBJLoader(THREE)
console.log(typeof THREE.OBJLoader)

const DEBUG = false
const DEBUG_LIGHTS = false

class Dove extends Component {
  _actorObj = null
  _animationEngine = null
  _controls = null
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

      this._renderer = new WebGLRenderer({ antialias: true })
      this._renderer.setPixelRatio(window.devicePixelRatio)
      this._renderer.setClearColor(0x000000)
      this._container.current.appendChild(this._renderer.domElement)

      this._setupSceneAndCamera()
      this._setupObjects()

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
    const { cameraZ } = this.props
    this._scene = new Scene()
    this._camera = new PerspectiveCamera(45, this._width / this._height, 1, 20000)
    this._camera.position.set(0, 200, cameraZ)

    this._controls = new OrbitControls(this._camera, this._renderer.domElement)
    this._controls.maxDistance = 20000
    this._controls.minDistance = 200
    this._controls.enablePan = false
    this._controls.autoRotate = true
    this._controls.target = new Vector3(0, 0, 0)

    if (DEBUG) {
      const axesHelper = new AxesHelper(500)
      this._scene.add(axesHelper)
    }

    const lightTarget = new Object3D()
    lightTarget.position.set(0, 0, 0)
    this._scene.add(lightTarget)

    const lights = [
      new DirectionalLight(0xffffff, 1),
      new DirectionalLight(0xffffff, 0.8),
      new DirectionalLight(0xffffff, 0.5),
      new DirectionalLight(0xffffff, 0.8),
      new DirectionalLight(0xffffff, 0.8),
      new DirectionalLight(0xffffff, 0.5)
    ]

    const radius = 2000
    lights[0].position.set(0, radius * 0.5, 0)
    lights[1].position.set(radius * 0.5, 0, 0)
    lights[2].position.set(0, 0, radius * -0.5)
    lights[3].position.set(0, radius * -0.5, 0)
    lights[4].position.set(radius * -0.5, 0, 0)
    lights[5].position.set(0, 0, radius * 0.5)

    lights.forEach(l => {
      l.target = lightTarget
      l.distance = 9000
      this._scene.add(l)
    })

    if (DEBUG_LIGHTS) {
      lights.forEach(l => this._scene.add(new DirectionalLightHelper(l)))
    }

    this._animationEngine = loop(this._renderScene)
  }
  _loadMesh = ({
    group,
    name = 'dove',
    numMeshes = 1,
    material
  }) => {
    const loader = new THREE.OBJLoader()
    const SCALE = name === 'dove' ? 1000 : 300
    loader.load(
    	// resource URL
    	`${name}.obj`,
    	// called when resource is loaded
    	object => {
        const _objects = _.times(numMeshes, i => {
          let obj = object.clone()
          obj.children.forEach(mesh => mesh.material = material)
          obj.scale.x = SCALE
          obj.scale.y = SCALE
          obj.scale.z = SCALE
          return obj
        })

        if (group.length) {
          group.forEach((g, i) => g.add(_objects[i]))
        } else {
          group.add(_objects[0])
        }
        this._renderScene()
    	},
    	// called when loading is in progresses
    	xhr => {
    		console.log((xhr.loaded / xhr.total * 100) + '% loaded')
    	},
    	// called when loading has errors
    	error => {
    		console.log('An error happened')
    	}
    )
  }
  _setupObjects() {

    const { name } = this.props
    const materials = {
      dove: new MeshStandardMaterial({ color: 0xFFFFFF, wireframe: true, roughness: 0.18, metalness: 0 }),
      hawk: new MeshStandardMaterial({ color: 0xFF0000, wireframe: true, roughness: 0.18, metalness: 0 })
    }
    this._objectGroup = new Group()

    const { behaviour } = this.props
    switch (behaviour) {
      case 'spinning': {
        const sphereGeometry = new SphereGeometry(100, 32, 32)
        const sphereMaterial = new MeshStandardMaterial({
          color: 0x666666,
          wireframe: true,
          opacity: 0.4,
          transparent: true,
          roughness: 0.5,
          metalness: 0.1
        })
        const sphere = new Mesh(sphereGeometry, sphereMaterial)
        this._scene.add(this._objectGroup)

        this._loadMesh({ name, material: materials[name], group: this._objectGroup })

        // position group in the center of the scene
        this._objectGroup.position.set(0, 0, 0)
        break
      }
      case 'flying': {
        const geometry = new BoxGeometry(100, 100, 100)
        const sphereGeometry = new SphereGeometry(100, 32, 32)
        const sphereMaterial = new MeshStandardMaterial({
          color: 0x666666,
          wireframe: true,
          opacity: 0.4,
          transparent: true,
          roughness: 0.5,
          metalness: 0.1
        })
        const sphere = new Mesh(sphereGeometry, sphereMaterial)

        this._scene.add(this._objectGroup)

        this._loadMesh({ name, material: materials[name], group: this._objectGroup })
        // this._objectGroup.add(sphere)

        // position group in the center of the scene
        this._objectGroup.position.set(0, 0, 0)
        break
      }
      case 'meeting': {
        const geometry = new BoxGeometry(100, 100, 100)

        const sphereGeometry = new SphereGeometry(100, 32, 32)
        const sphereMaterial = new MeshStandardMaterial({
          color: 0x666666,
          wireframe: true,
          opacity: 0.4,
          transparent: true,
          roughness: 0.5,
          metalness: 0.1
        })

        const spheres = [
          new Mesh(sphereGeometry, sphereMaterial),
          new Mesh(sphereGeometry, sphereMaterial)
        ]

        this._actorGroups = [
          new Group(),
          new Group()
        ]

        // this._actorGroups[0].add(spheres[0])
        this._actorGroups[0].position.set(-500, 0, 0)
        this._actorGroups[0].rotateY(90 * Math.PI / 180)

        // this._actorGroups[1].add(spheres[1])
        this._actorGroups[1].position.set(500, 0, 0)
        this._actorGroups[1].rotateY(-90 * Math.PI / 180)

        this._loadMesh({
          name,
          numMeshes: 2,
          material: materials[name],
          group: this._actorGroups
        })

        this._actorGroups.forEach(g => this._objectGroup.add(g))
        this._scene.add(this._objectGroup)

        // position group in the center of the scene
        this._objectGroup.position.set(0, 0, 0)
        break
      }
      default:
        break
    }
  }
  _renderScene = dt => {
    const { behaviour } = this.props
    switch (behaviour) {
      case 'spinning':
        // this._objectGroup.rotation.y += this._rotationSpeed
        break
      case 'flying':
        this._objectGroup.rotation.y += this._rotationSpeed / 2
        break
      case 'meeting':
        break
      default:
        break
    }

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

Dove.propTypes = {
  autoStartAnimation: PropTypes.bool,
  cameraZ: PropTypes.number,
  name: PropTypes.string,
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired
}

Dove.defaultProps = {
  autoStartAnimation: true,
  cameraZ: 500,
  name: 'dove'
}

export default Dove
