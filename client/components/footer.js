import React from 'react'
import {Grid} from 'react-bootstrap'
import {pure} from 'recompose'

const Footer = () =>
  <footer>
    <Grid>
      <p className='text-center text-muted'>&copy; <a href='http://conveyal.com'>Conveyal</a></p>
    </Grid>
  </footer>

export default pure(Footer)
