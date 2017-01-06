import invariant from 'invariant'
import React, {Component, PropTypes} from 'react'
import {Button} from 'react-bootstrap'

export default class ButtonLink extends Component {
  static propTypes = {
    to: PropTypes.string.isRequired
  }

  static contextTypes = {
    router: PropTypes.object
  }

  _handleClick = (event) => {
    // copied from react-router
    if (this.props.onClick) this.props.onClick(event)

    if (event.defaultPrevented) return

    const { router } = this.context
    invariant(
      router,
      '<ButtonLink>s rendered outside of a router context cannot navigate.'
    )

    if (isModifiedEvent(event) || !isLeftClickEvent(event)) return

    // If target prop is set (e.g. to "_blank"), let browser handle link.
    /* istanbul ignore if: untestable with Karma */
    if (this.props.target) return

    event.preventDefault()

    router.push(resolveToLocation(this.props.to, router))
  }

  render () {
    const {children, ...buttonProps} = this.props
    return (
      <Button
        {...buttonProps}
        onClick={this._handleClick}
        >
        {children}
      </Button>
    )
  }
}

function isLeftClickEvent (event) {
  return event.button === 0
}

function isModifiedEvent (event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)
}

function resolveToLocation (to, router) {
  return typeof to === 'function' ? to(router.location) : to
}
