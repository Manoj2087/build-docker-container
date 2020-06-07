const { Router } = require('express');
const createRobot = require('../robots/createRobot');
const listRobots = require('../robots/listRobots');
const listRobotByType = require('../robots/listRobotByType');
const getRobot = require('../robots/getRobot');
const updateRobot = require('../robots/updateRobot');
const deleteRobot = require('../robots/deleteRobot');

const router = Router();

// GET health
// healthcheckRobotCatalogueService
router.get('/healthcheck', (req, res) => {
  res.status(200).json({ status: 'UP' });
});
// POST robots
router.post('/', createRobot);
// GET robots
router.get('/', listRobots);
// GET robots/filterbytype?type=<value>
router.get('/filterbytype', listRobotByType);
// GET robots/{name}
router.get('/:name', getRobot);
// PUT robots/{name}
router.put('/:name', updateRobot);
// DELETE robots/{name}
router.delete('/:name', deleteRobot);

module.exports = router;
