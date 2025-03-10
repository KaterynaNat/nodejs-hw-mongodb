import { getAllContacts } from '../services/getAllContacts.js';
import { getContactById } from '../services/getContactById.js';

const router = router();

router.get('/', async (req, res) => {
  const contacts = await getAllContacts();
  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
});

router.get('/:id', async (req, res) => {
  const id = req.params.id;
  const contact = await getContactById(id);
  if (contact === null) {
    res.status(404).json({
      message: 'Contact not found',
    });
  } else {
    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${id}!`,
      data: contact,
    });
  }
});

export default router;
