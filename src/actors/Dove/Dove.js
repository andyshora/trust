import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {
  OrthographicCamera,
  PointLight,
  Scene,
  Vector3,
  WebGLRenderer
} from 'three'

import OrbitControls from '../../controls/OrbitControls'

class Dove extends Component {
  _scene = null
  _renderer = null
  _camera = null
  _width = null
  _height = null
  constructor(props) {
    super(props)
    this._container = React.createRef()
  }
  componentDidMount() {
    const { height, width } = this.props
    if (this._container) {
      this._width = width
      this._height = height

      this._renderer = new WebGLRenderer({ antialias: true })
      this._renderer.setClearColor(0x000000)
      this._container.current.appendChild(this._renderer.domElement)

      this._setupSceneAndCamera()
      this._setupObjects()

      this.resize({ width, height })
    }
  }
  resize({ width, height }) {
    this._width = width
    this._height = height
    this._camera.aspect = this._width / this._height
    this._camera.updateProjectionMatrix()
    this._renderer.setSize(this._width, this._height)
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
      this._height / 2, 100
    )
    this._controls = new OrbitControls(this._camera, {
      element: this._renderer.domElement,
      parent: this._renderer.domElement,
      distance: 500,
      enableRotate: false,
      enableZoom: true,
      target: new Vector3(this._width / 2, this._height / 2, 0)
    })

    /* Lights */
    const frontLight = new PointLight(0xFFFFFF, 1)
    const backLight = new PointLight(0xFFFFFF, 0.5)
    this._scene.add(frontLight)
    this._scene.add(backLight)
    frontLight.position.x = 20
    backLight.position.x = -20
  }
  _setupObjects() {

  }
  _render() {
    this._controls.update()
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

export default Dove
