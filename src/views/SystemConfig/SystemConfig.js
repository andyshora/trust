import React, { Component } from 'react'
import PropTypes from 'prop-types'

// Styles
import { SystemConfigWrapper } from './SystemConfig.styles'

class SystemConfig extends Component {
  _form = React.createRef()
  _getFormValues = () => {
    const data = {}
    const formData = new FormData(this._form)
    formData.entries.forEach(e => {
      const key = e[0]
      const value = e[1]
      data[key] = value
    })
    return data
  }
  // componentDidMount() {}
  render() {
    const { propName } = this.props

    return (
      <SystemConfigWrapper>
        <form ref={this._form}>
          <div>
            <label>Hawks</label> <input type='number' name='hawks' defaultValue={5} />
          </div>
          <div>
            <label>Doves</label> <input type='number' name='doves' defaultValue={20} />
          </div>
          <div>
            <label>Gain</label> <input type='number' name='gain' defaultValue={10} />
          </div>
          <div>
            <label>Cost</label> <input type='number' name='cost' defaultValue={50} />
          </div>
        </form>
      </SystemConfigWrapper>
    )
  }
}

SystemConfig.propTypes = {
  propName: PropTypes.number
}

SystemConfig.defaultProps = {
  propName: null
}

export default SystemConfig
