import Contact from '../models/Contact.js';

export const submitContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message are required' });
    }
    await Contact.create({ name, email, phone, subject, message });
    res.json({ message: 'Message sent successfully. We will get back to you soon.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
