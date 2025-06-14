const prisma = require("../config/prisma");

exports.list = async (req, res) => {
  try {
    const user = await prisma.user.findMany({});

    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.update = async (req, res) => {
  try {
    const { userId } = req.params;
    const { email } = req.body;
    const updatedUser = await prisma.user.update({
      where: {
        id: Number(userId),
      },
      data: {
        email: email,
      },
    });

    res.json({ message: "Update success" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.remove = async (req, res) => {
  try {
    const { userId } = req.params;
    const removed = await prisma.user.delete({
      where: {
        id: Number(userId),
      },
    });

    res.status(200).json({ message: "Deleted success" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};


// exports.changeStatus = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const { status } = req.body;
//     const updatedUser = await prisma.user.update({
//       where: {
//         id: Number(userId),
//       },
//     });

//     res.status(200).json({ message: "Change-Status success" });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// exports.changeRole = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const { role } = req.body;
//     const updatedUser = await prisma.user.update({
//       where: {
//         id: Number(userId),
//       },
//       data: {
//         role: role,
//       },
//     });

//     res.status(200).json({ message: "Change-Role success" });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };
