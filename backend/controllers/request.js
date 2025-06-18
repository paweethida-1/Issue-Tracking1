const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ✅ สร้างคำร้องใหม่
exports.createRequest = async (req, res) => {
  try {
    const {
      title,
      description,
      department,
      serviceType,
      requestDate,
      imageUrl,
    } = req.body;

    const request = await prisma.request.create({
      data: {
        title,
        description,
        department,
        serviceType,
        requestDate: new Date(requestDate),
        imageUrl,
      },
    });

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create request', details: error.message });
  }
};

// ✅ ดึงคำร้องทั้งหมด (admin)
exports.getAllRequests = async (req, res) => {
  try {
    const requests = await prisma.request.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
};

// ✅ ดึงคำร้องเดียว (by ID)
exports.getRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await prisma.request.findUnique({ where: { id } });

    if (!request) return res.status(404).json({ error: 'Request not found' });

    res.json(request);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch request' });
  }
};

// ✅ แก้ไข priority (admin)
exports.updatePriority = async (req, res) => {
  try {
    const { id } = req.params;
    const { priority } = req.body;

    const updated = await prisma.request.update({
      where: { id },
      data: { priority },
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update priority' });
  }
};

// ✅ เปลี่ยน status (admin)
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await prisma.request.update({
      where: { id },
      data: { status },
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update status' });
  }
};
