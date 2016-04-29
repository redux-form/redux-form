import React, { Component } from 'react'
import BandsForm from '../../examples/BandsForm'
import Example from '../../components/Example'
import explanation from './Multirecord.md'
import rawBandsForm from '!!raw!../../examples/BandsForm'
import rawBandForm from '!!raw!../../examples/BandForm'

class Multirecord extends Component {
  render() {
    return (
      <Example
        name="Multirecord Form"
        explanation={explanation}
        component={BandsForm}
        form="band"
        files={{
          'BandsForm.js': rawBandsForm,
          'BandForm.js': rawBandForm
        }}/>
    )
  }
}

export default Multirecord
