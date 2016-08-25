import shallowEqual from 'shallowequal'

const shallowCompare = (instance, nextProps, nextState) => {
  return (
    !shallowEqual(instance.props, nextProps) ||
    !shallowEqual(instance.state, nextState)
  )
}

export default shallowCompare
