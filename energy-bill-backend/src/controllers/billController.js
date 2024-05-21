const billService = require('../services/billService');

exports.uploadBill = async (req, res) => {
    try {
        const data = await billService.handleUpload(req);
        res.json({ message: 'Data saved successfully', data });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: err.message });
    }
};
