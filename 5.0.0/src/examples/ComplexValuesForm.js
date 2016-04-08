import React, { Component, PropTypes } from 'react'
import { reduxForm } from 'redux-form'
import ObjectSelect from './ObjectSelect'
export const fields = [ 'hobbies', 'favoriteHobby', 'colors' ]
const potentialHobbies = [
  { id: 1, label: 'Guitar', category: 'music' },
  { id: 2, label: 'Cycling', category: 'sports' },
  { id: 3, label: 'Hiking', category: 'outdoors' }
]
const potentialColors = [ 'Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Indigo', 'Violet' ]

class ComplexValuesForm extends Component {
  render() {
    const {
      fields: { hobbies, favoriteHobby, colors },
      handleSubmit,
      resetForm,
      submitting
    } = this.props
    return (<form className="form-horizontal" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="col-xs-4 control-label">Hobbies</label>
          <div className="col-xs-8">
            <ObjectSelect multiple className="form-control" options={potentialHobbies} {...hobbies}/>
          </div>
        </div>
        <div className="form-group">
          <label className="col-xs-4 control-label">Favorite Hobby</label>
          <div className="col-xs-8">
            <ObjectSelect className="form-control" options={potentialHobbies} {...favoriteHobby}/>
          </div>
        </div>
        <div className="form-group">
          <label className="col-xs-4 control-label">Colors</label>
          <div className="col-xs-8">
            <select multiple className="form-control" style={{ height: 140 }} {...colors}>
              {potentialColors.map(color => <option key={color} value={color}>{color}</option>)}
            </select>
          </div>
        </div>
        <div className="text-center">
          <button type="submit" className="btn btn-primary btn-lg" style={{ margin: 10 }} disabled={submitting}>
            {submitting ? <i className="fa fa-cog fa-spin"/> : <i className="fa fa-paper-plane"/>} Submit
          </button>
          <button type="button" className="btn btn-default btn-lg" style={{ margin: 10 }} disabled={submitting} onClick={resetForm}>
            <i className="fa fa-undo"/> Reset Values
          </button>
        </div>
      </form>
    )
  }
}

ComplexValuesForm.propTypes = {
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  resetForm: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired
}

export default reduxForm({
  form: 'complexValues',
  fields,
  initialValues: {
    hobbies: [ potentialHobbies[0], potentialHobbies[2] ],
    favoriteHobby: potentialHobbies[2],
    colors: [ 'Red', 'Green', 'Blue' ]
  }
})(ComplexValuesForm)
