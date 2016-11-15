import {Organization} from '../models'

const createOrganization = (req, res) => {
  Organization.create(req.body, (err, organization) => {
    if (err) return res.status(500).json({error: err})
    res.json(organization)
  })
}

const deleteOrganization = (req, res) => {
  Organization.findByIdAndRemove(req.params.id, (err, organization) => {
    if (err) return res.status(500).json({error: err})
    res.json(organization)
  })
}

const getOrganizations = (req, res) => {
  Organization.find((err, organizations) => {
    if (err) return res.status(500).json({error: err})
    res.json(organizations)
  })
}

const updateOrganization = (req, res) => {
  Organization.findByIdAndUpdate(req.params.id, req.body, (err, organization) => {
    if (err) return res.status(500).json({error: err})
    res.json(organization)
  })
}

export default function makeRoutes (app) {
  app.delete('/api/organization/:id', deleteOrganization)
  app.get('/api/organization', getOrganizations)
  app.post('/api/organization', createOrganization)
  app.put('/api/organization/:id', updateOrganization)
}
