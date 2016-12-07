import React from 'react'
import {Grid} from 'react-bootstrap'

export default function Footer () {
  return (
    <footer>
      <Grid>
        <p className='text-center text-muted'>&copy; <a href='http://conveyal.com'>Conveyal</a></p>
      </Grid>
    </footer>
  )
}
