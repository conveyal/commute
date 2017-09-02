import copy from 'copy-to-clipboard'
import React, {Component, PropTypes} from 'react'
import { Grid, Row, Col,
  Button, ButtonToolbar, Panel, Form, ControlLabel, FormGroup, FormControl } from 'react-bootstrap'

import ButtonLink from './util/button-link'
import Icon from './util/icon'

// default config for a new site: basic report with summary section and 2-hour transit access map
const defaultConfig = {
  isPublic: false,
  sections: [
    {
      type: 'summary'
    },
    {
      type: 'map',
      mode: 'TRANSIT',
      cutoff: 7200
    }
  ]
}

// default config for a newly added section: transit map w/ 2-hour cutoff
const defaultSection = {
  type: 'map',
  mode: 'TRANSIT',
  cutoff: 7200
}

export default class SiteCreateReport extends Component {
  static propTypes = {
    isMultiSite: PropTypes.bool.isRequired,
    multiSite: PropTypes.object,
    site: PropTypes.object,
    update: PropTypes.func
  }

  state = {
    linkWasJustCopied: false
  }

  componentWillMount () {
    const entity = this._getEntity()

    if (!entity.reportConfig || !entity.reportConfig.sections) {
      // add the default configuration if needed
      entity.reportConfig = defaultConfig
      this.props.update(entity)
    }
  }

  _addSection = () => {
    const entity = this._getEntity()
    entity.reportConfig.sections.push(defaultSection)
    this.props.update(entity)
  }

  _copyPublicLink = () => {
    copy(this._getReportUrl(true))
    this.setState({ linkWasJustCopied: true })
    setTimeout(() => {
      this.setState({ linkWasJustCopied: false })
    }, 3000)
  }

  _deleteSection = (index) => {
    const entity = this._getEntity()
    const newSections = entity.reportConfig.sections.filter((e, i) => { return i !== index })
    entity.reportConfig.sections = newSections
    this.props.update(entity)
  }

  _getEntity () {
    const { isMultiSite, multiSite, site } = this.props
    return isMultiSite ? multiSite : site
  }

  _getReportUrl (publicUrl) {
    const entity = this._getEntity()
    let publicPrefix = ''
    if (publicUrl) {
      const {host, protocol} = window.location
      publicPrefix = `${protocol}//${host}/public`
    }
    return `${publicPrefix}/${this.props.isMultiSite ? 'multi-site' : 'site'}/${entity._id}/report`
  }

  _swapSections = (x, y) => {
    const entity = this._getEntity()
    const temp = entity.reportConfig.sections[y]
    entity.reportConfig.sections[y] = entity.reportConfig.sections[x]
    entity.reportConfig.sections[x] = temp
    this.props.update(entity)
  }

  _togglePublic = (evt) => {
    const entity = this._getEntity()
    entity.reportConfig.isPublic = evt.target.checked
    this.props.update(entity)
  }

  _updateSection = (index, config) => {
    const entity = this._getEntity()
    entity.reportConfig.sections[index] = config
    this.props.update(entity)
  }

  render () {
    const entity = this._getEntity()
    const entityHasSections = !!(
      entity.reportConfig &&
      entity.reportConfig.sections &&
      entity.reportConfig.sections.length > 0
    )

    return (
      <Grid className='create-report'>
        <Row ref='report'>
          <Col xs={12}>
            <h2 className='header'>Create Printable Report</h2>
            <Row>
              <Col xs={4}>
                <p className='instruction'>
                  This page allows you to create a customized report for this site. Use the buttons in the Sections headers to reorder or delete sections. Click the "Add Section" button below to add a new section to the end of the report.
                </p>
                <div className='main-button'>
                  <Button
                    bsStyle='success'
                    onClick={this._addSection}
                  ><Icon type='plus' /> Add Section</Button>
                </div>

                <p className='instruction'>
                  To generate the report, click the "View Report" button.
                </p>
                <div className='main-button'>
                  <ButtonLink
                    bsStyle='primary'
                    bsSize='large'
                    to={this._getReportUrl()}>
                    <Icon type='print' /> View Report
                  </ButtonLink>
                </div>

                <p className='instruction'>
                  It is possible to make this report viewable without having to login.
                  Checking the box below will enable this and create a page that will
                  allow anyone who knows the URL to be able to access the report.
                </p>
                <div className='main-button'>
                  <Panel>
                    <div className='checkbox'>
                      <label
                        htmlFor='create-report-checkbox'
                        style={{
                          fontWeight: 'bold'
                        }}
                        >
                        <input
                          checked={entity.reportConfig.isPublic}
                          id='create-report-checkbox'
                          onChange={this._togglePublic}
                          type='checkbox'
                          />
                        Make Report Public
                      </label>
                    </div>
                    {entity.reportConfig &&
                      entity.reportConfig.isPublic && (
                        <div>
                          <p>This report is public!</p>
                          <p>
                            <a
                              href={this._getReportUrl(true)}
                              >
                              Click Here
                            </a> to go to the public report.
                          </p>
                          <Button
                            bsStyle='success'
                            onClick={this._copyPublicLink}
                            >
                            <Icon type='clipboard' />
                            Copy Link to the Clipboard
                          </Button>
                          {this.state.linkWasJustCopied &&
                            <p style={{ marginTop: '10px' }}>Successfully copied!</p>
                          }
                        </div>
                      )
                    }
                  </Panel>
                </div>
              </Col>
              <Col xs={8}>
                {!entityHasSections && (
                  <Panel className='empty-panel'>
                    <h3>This report does not have any sections yet.</h3>
                    Click the "Add Section" button to add the first section.
                  </Panel>
                )}

                {entityHasSections && entity.reportConfig.sections.map((section, k) => {
                  return (
                    <ReportSection
                      config={section}
                      index={k}
                      length={entity.reportConfig.sections.length}
                      key={k}
                      deleteSection={this._deleteSection}
                      updateSection={this._updateSection}
                      swapSections={this._swapSections}
                      />
                  )
                })}
              </Col>
            </Row>
          </Col>
        </Row>
      </Grid>
    )
  }
}

class ReportSection extends Component {
  static propTypes = {
    config: PropTypes.object.isRequired,
    deleteSection: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
    length: PropTypes.number.isRequired,
    swapSections: PropTypes.func.isRequired,
    updateSection: PropTypes.func.isRequired
  }

  _delete = () => {
    const {deleteSection, index} = this.props
    deleteSection(index)
  }

  _moveDown = () => {
    const {index, swapSections} = this.props
    swapSections(index, index + 1)
  }

  _moveUp = () => {
    const {index, swapSections} = this.props
    swapSections(index, index - 1)
  }

  _setCutoff = evt => { this._updateProperty('cutoff', evt.target.value) }

  _setMode = evt => { this._updateProperty('mode', evt.target.value) }

  _setType = evt => { this._updateProperty('type', evt.target.value) }

  _updateProperty (prop, value) {
    const { config, index, updateSection } = this.props
    config[prop] = value
    updateSection(index, config)
  }

  render () {
    const { config, index, length } = this.props

    const header = <div>
      <span className='section-header'>Section {index + 1}</span>
      <ButtonToolbar className='pull-right'>
        {index > 0 && (
          <Button
            bsSize='xsmall'
            bsStyle='warning'
            onClick={this._moveUp}
          ><Icon type='arrow-up' /> Move Up</Button>
        )}

        {index < length - 1 && (
          <Button
            bsSize='xsmall'
            bsStyle='warning'
            onClick={this._moveDown}
          ><Icon type='arrow-down' /> Move Down</Button>
        )}

        <Button
          bsSize='xsmall'
          bsStyle='danger'
          onClick={this._delete}
        ><Icon type='trash' /> Delete</Button>
      </ButtonToolbar>
    </div>

    return (
      <Panel header={header}>
        <Row>
          <Col xs={6}>
            <Form inline>
              <FormGroup>
                <ControlLabel>Section Type:&nbsp;</ControlLabel>
                <FormControl
                  componentClass='select'
                  onChange={this._setType}
                  value={config.type}
                  >
                  <option value='summary'>Site Access Summary</option>
                  <option value='map'>Commuter Access Map</option>
                  <option value='access-table'>Commuter Access Table</option>
                  <option value='ridematch-table'>Ridematching Table</option>
                </FormControl>
              </FormGroup>
            </Form>
          </Col>
          <Col xs={6}>
            {(config.type === 'map' || config.type === 'access-table') && (
              <Form inline>
                <FormGroup>
                  <ControlLabel>Access Mode:&nbsp;</ControlLabel>
                  <FormControl
                    componentClass='select'
                    onChange={this._setMode}
                    value={config.mode}
                    >
                    <option value='TRANSIT'>Transit</option>
                    <option value='WALK'>Walk</option>
                    <option value='BICYCLE'>Bike</option>
                    <option value='CAR'>Drive</option>
                  </FormControl>
                </FormGroup>

                {config.type === 'map' && (
                  <FormGroup className='cutoff-selector-container'>
                    <ControlLabel>Travel Time Cutoff:&nbsp;</ControlLabel>
                    <FormControl
                      componentClass='select'
                      onChange={this._setCutoff}
                      value={config.cutoff}
                      >
                      <option value={900}>15 minutes</option>
                      <option value={1800}>30 minutes</option>
                      <option value={2700}>45 minutes</option>
                      <option value={3600}>1 hour</option>
                      <option value={5400}>1 hour, 30 minutes</option>
                      <option value={7200}>2 hours</option>
                    </FormControl>
                  </FormGroup>
                )}
              </Form>
            )}
          </Col>
        </Row>
      </Panel>
    )
  }
}
