const express = require('express');
const router = express.Router();
const Contact = require('../models/contact');

router.get('/', async (res) => {
  try {
    const contacts = await Contact.find();
    if (contacts.length === 0) {
      return res.status(404).json({ message: 'No contacts found' });
    }
    res.json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
