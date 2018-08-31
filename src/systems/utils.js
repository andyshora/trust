import {
  AdditiveBlending,
  BufferGeometry,
  Color,
  Float32BufferAttribute,
  Points,
  ShaderMaterial,
  Math,
  TextureLoader,
  Vector3,
  VertexColors
} from 'three'

import _ from 'lodash'

const MAX_POINTS = 2000

export const createPointCloud = ({
  pointSize = 0,
  color = 0x000000,
  shape = 'disc'
}) => {
  const geometry = new BufferGeometry()

  const uniforms = {
    texture: {
      value: new TextureLoader().load(`assets/images/${shape}.png`)
    },
    size: {
      value: pointSize
    }
  }

  const material = new ShaderMaterial({
    uniforms:       uniforms,
    vertexShader:   document.getElementById('vertexshader').textContent,
    fragmentShader: document.getElementById('fragmentshader').textContent,
    blending:       AdditiveBlending,
    depthTest:      false,
    transparent:    true,
    vertexColors:   true
  })

  // we can't be changing the length of the buffer
  // so we allocate the whole thing, with 'hidden' defaults
  const positions = new Float32Array(MAX_POINTS * 3)
  const colors = new Float32Array(MAX_POINTS * 3)
  const allocatedFlags = []

  for (let i = 0, l = MAX_POINTS; i < l; i ++) {
    positions[i * 3] = 0
    positions[(i * 3) + 1] = 0
    positions[(i * 3) + 2] = 0

    colors[i * 3] = 0
    colors[(i * 3) + 1] = 0
    colors[(i * 3) + 2] = 0

    allocatedFlags[i] = false
  }

  geometry.userData = {
    allocatedFlags
  }
  geometry.addAttribute('position', new Float32BufferAttribute(positions, 3).setDynamic(true))
  geometry.addAttribute('color', new Float32BufferAttribute(colors, 3).setDynamic(true))

  return new Points(geometry, material)
}

export const addPoint = ({
  index = -1,
  geometry,
  color = 0x000000,
  size = 0,
  position = [0, 0, 0]
}) => {
  if (!geometry) {
    return console.error('No geometry supplied')
  }
  if (position && position.length !== 3) {
    return console.error('Invalid position array length')
  }
  if (index < 0 || index > MAX_POINTS) {
    return console.error('Invalid array index for point', index)
  }

  // const firstAvailableIndex = _.findIndex(geometry.userData.allocatedFlags, allocated => !allocated) * 3
  // console.log('firstAvailableIndex', firstAvailableIndex)
  geometry.attributes.position.array[index * 3] = position[0]
  geometry.attributes.position.array[(index * 3) + 1] = position[1]
  geometry.attributes.position.array[(index * 3) + 2] = position[2]

  const c = new Color(color)
  geometry.attributes.color.array[index * 3] = c.r
  geometry.attributes.color.array[(index * 3) + 1] = c.g
  geometry.attributes.color.array[(index * 3) + 2] = c.b

  geometry.attributes.position.needsUpdate = true
  geometry.attributes.color.needsUpdate = true
}

export const updatePoint = ({
  index = -1,
  geometry,
  color,
  size,
  position,
  updateFlags = {
    position: true,
    size: true,
    color: true
  }
}) => {
  if (index < 0 || index > MAX_POINTS) {
    return console.error('index out of bounds', index)
  }

  if (position) {
    geometry.attributes.position.array[(index * 3)] = position[0]
    geometry.attributes.position.array[(index * 3) + 1] = position[1]
    geometry.attributes.position.array[(index * 3) + 2] = position[2]
    if (updateFlags && updateFlags.position) {
      geometry.attributes.position.needsUpdate = true
    }
  }

  if (color) {
    const c = new Color(color)
    geometry.attributes.color.array[(index * 3)] = c.r
    geometry.attributes.color.array[(index * 3) + 1] = c.g
    geometry.attributes.color.array[(index * 3) + 2] = c.b
    if (updateFlags && updateFlags.color) {
      geometry.attributes.color.needsUpdate = true
    }
  }
}
