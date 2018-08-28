import React, { Component } from 'react'
import PropTypes from 'prop-types'
import loop from 'raf-loop'

import {
  Box3,
  BoxGeometry,
  Group,
  Mesh,
  MeshBasicMaterial,
  OrthographicCamera,
  PointLight,
  Scene,
  WebGLRenderer
} from 'three'

class Dove extends Component {
  _animationEngine = null
  _cube = null
  _group = null
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
    this._scene = new Scene()
    this._camera = new OrthographicCamera(
      this._width / - 2,
      this._width / 2,
      this._height / 2,
      this._height / - 2,
      1,
      1000
    )

    this._camera.position.set(
      this._width / 2,
      this._height / 2,
      100
    )

    /* Lights */
    const frontLight = new PointLight(0xFFFFFF, 1)
    const backLight = new PointLight(0xFFFFFF, 0.5)
    this._scene.add(frontLight)
    this._scene.add(backLight)
    frontLight.position.x = 20
    backLight.position.x = -20

    this._animationEngine = loop(this._renderScene)
  }
  _setupObjects() {
    /* Actual content of the this.scene */
    const geometry = new BoxGeometry(100, 100, 100)
    const material = new MeshBasicMaterial({ color: 0xFF00FF, wireframe: true })
    this._cube = new Mesh(geometry, material)

    // reset mesh to center of scene
    const boundingBox = new Box3().setFromObject(this._cube)
    boundingBox.center(this._cube.position)
    this._cube.position.multiplyScalar(-1)

    this._pivot = new Group()
    this._scene.add(this._pivot)
    this._pivot.add(this._cube)

    // position group in the center of the scene
    this._pivot.position.set(this._width / 2, this._height / 2, 0)
    this._pivot.rotation.set(20 * Math.PI / 180, 0, 0)
  }
  _renderScene = dt => {
    this._pivot.rotation.y += this._rotationSpeed
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
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired
}

Dove.defaultProps = {
  autoStartAnimation: true
}

export default Dove
