import Automation from '../models/Automation.js';

export const createAutomation = async (req, res) => {
  try {
    const userId = req.user.uid;
    const data = req.body;

    const automation = new Automation({
      ...data,
      userId,
      agentId: data.agentId
    });

    await automation.save();
    res.status(201).json(automation);
  } catch (err) {
    console.error('❌ Error creating automation:', err);
    res.status(500).json({ message: 'Error creating automation' });
  }
};

export const getUserAutomations = async (req, res) => {
  try {
    const automations = await Automation.find({ userId: req.user.uid });
    res.json(automations);
  } catch (err) {
    console.error('❌ Error fetching automations:', err);
    res.status(500).json({ message: 'Error fetching automations' });
  }
};

export const deleteAutomation = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { id } = req.params;

    const deleted = await Automation.deleteOne({ _id: id, userId });
    res.json({ success: true, deleted });
  } catch (err) {
    console.error('❌ Error deleting automation:', err);
    res.status(500).json({ message: 'Error deleting automation' });
  }
};
