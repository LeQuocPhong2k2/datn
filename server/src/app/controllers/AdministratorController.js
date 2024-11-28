require('dotenv').config({ path: '../../../../.env' })
const Administrator = require('../models/Administrator')

const AdministratorController = {
  getAdministratorsbyAccountId: async (req, res) => {
    try {
      const { account_id } = req.body
      const administrators = await Administrator.find({
        account: account_id,
      })
      res.json(administrators)
      // console.log('Administrators được truy vấn ra là:', administrators)
    } catch (error) {
      console.error('Error fetching administrators:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  },
}
module.exports = AdministratorController
