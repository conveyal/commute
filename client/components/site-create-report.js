import React, {Component, PropTypes} from 'react'
import { Grid, Row, Col, Button, ButtonToolbar, Panel, Form, ControlLabel, FormGroup, FormControl } from 'react-bootstrap'

import ButtonLink from './button-link'
import Icon from './icon'

// default config for a new site: basic report with summary section and 2-hour transit access map
const defaultConfig = {
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
    site: PropTypes.object,
    updateSite: PropTypes.func
  }

  constructor () {
    super()
    this.state = { }
  }

  componentWillMount () {
    const { site, updateSite } = this.props

    // add the default configuration if needed
    if (!site.reportConfig || !site.reportConfig.sections) {
      site.reportConfig = defaultConfig
      updateSite(site)
    }
  }

  _deleteSection (index) {
    const { site, updateSite } = this.props
    const newSections = site.reportConfig.sections.filter((s, i) => { return i !== index })
    site.reportConfig.sections = newSections
    updateSite(site)
  }

  _addSection () {
    const { site, updateSite } = this.props
    site.reportConfig.sections.push(defaultSection)
    updateSite(site)
  }

  _updateSection (index, config) {
    const { site, updateSite } = this.props
    site.reportConfig.sections[index] = config
    updateSite(site)
  }

  _swapSections (x, y) {
    const { site, updateSite } = this.props
    const temp = site.reportConfig.sections[y]
    site.reportConfig.sections[y] = site.reportConfig.sections[x]
    site.reportConfig.sections[x] = temp
    updateSite(site)
  }

  render () {
    const { site } = this.props

    return (
      <Grid>
        <Row ref='report'>
          <Col xs={12}>
            <h2>Create Printable Report</h2>
            <Row style={{ marginTop: '40px' }}>
              <Col xs={4}>
                <div>
                  This page allows you to create a customized report for this site. Use the buttons in the Sections headers to reorder or delete sections. Click the "Add Section" button below to add a new section to the end of the report.
                </div>
                <div style={{ marginTop: '10px', textAlign: 'center' }}>
                  <Button
                    bsStyle='success'
                    onClick={() => this._addSection()}
                  ><Icon type='plus' /> Add Section</Button>
                </div>

                <div style={{ marginTop: '40px' }}>To generate the report, click the "View Report" button.</div>
                <div style={{ marginTop: '10px', textAlign: 'center' }}>
                  <ButtonLink
                    bsStyle='primary'
                    bsSize='large'
                    to={`/site/${site._id}/report`}>
                    <Icon type='print' /> View Report
                  </ButtonLink>
                </div>
              </Col>
              <Col xs={8}>
                {site.reportConfig && site.reportConfig.sections && site.reportConfig.sections.length === 0 && (
                  <Panel style={{ textAlign: 'center' }}>
                    <h3>This report does not have any sections yet.</h3>
                    Click the "Add Section" button to add the first section.
                  </Panel>
                )}

                {site.reportConfig && site.reportConfig.sections && site.reportConfig.sections.map((section, k) => {
                  return (
                    <ReportSection
                      config={section}
                      index={k}
                      length={site.reportConfig.sections.length}
                      key={k}
                      deleteSection={index => this._deleteSection(index)}
                      updateSection={(index, section) => this._updateSection(index, section)}
                      swapSections={(x, y) => this._swapSections(x, y)}
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
    config: PropTypes.object,
    index: PropTypes.number,
    deleteSection: PropTypes.func,
    swapSections: PropTypes.func,
    updateSection: PropTypes.func
  }

  _updateProperty (prop, value) {
    const { config, index, updateSection } = this.props
    config[prop] = value
    updateSection(index, config)
  }

  render () {
    const { config, index, length, deleteSection, swapSections } = this.props

    const header = <div>
      <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Section {index + 1}</span>
      <ButtonToolbar className='pull-right'>
        {index > 0 && (
          <Button
            bsStyle='warning'
            bsSize='xsmall'
            onClick={() => swapSections(index, index - 1)}
          ><Icon type='arrow-up' /> Move Up</Button>
        )}

        {index < length - 1 && (
          <Button
            bsStyle='warning'
            bsSize='xsmall'
            onClick={() => swapSections(index, index + 1)}
          ><Icon type='arrow-down' /> Move Down</Button>
        )}

        <Button
          bsStyle='danger'
          bsSize='xsmall'
          onClick={() => deleteSection(index)}
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
                <FormControl componentClass='select' value={config.type}
                  onChange={evt => { this._updateProperty('type', evt.target.value) }}
                >
                  <option value='summary'>Site Access Summary</option>
                  <option value='map'>Commuter Access Map</option>
                  <option value='table'>Commuter Access Table</option>
                </FormControl>
              </FormGroup>
            </Form>
          </Col>
          <Col xs={6}>
            {config.type === 'map' && (
              <Form inline>
                <FormGroup>
                  <ControlLabel>Access Mode:&nbsp;</ControlLabel>
                  <FormControl componentClass='select' value={config.mode}
                    onChange={evt => { this._updateProperty('mode', evt.target.value) }}
                  >
                    <option value='TRANSIT'>Transit</option>
                    <option value='WALK'>Walk</option>
                    <option value='BICYCLE'>Bike</option>
                    <option value='CAR'>Drive</option>
                  </FormControl>
                </FormGroup>

                <FormGroup style={{ marginTop: '15px' }}>
                  <ControlLabel>Travel Time Cutoff:&nbsp;</ControlLabel>
                  <FormControl componentClass='select' value={config.cutoff}
                    onChange={evt => { this._updateProperty('cutoff', evt.target.value) }}
                  >
                    <option value={900}>15 minutes</option>
                    <option value={1800}>30 minutes</option>
                    <option value={2700}>45 minutes</option>
                    <option value={3600}>1 hour</option>
                    <option value={5400}>1 hour, 30 minutes</option>
                    <option value={7200}>2 hours</option>
                  </FormControl>
                </FormGroup>

              </Form>
            )}
          </Col>
        </Row>
      </Panel>
    )
  }
}
