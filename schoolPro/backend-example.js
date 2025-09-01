// Example Backend API Structure for School Management
// This is a reference file showing what your backend API should implement
// You can use Express.js, Fastify, or any other Node.js framework

const express = require("express");
const multer = require("multer");
const cors = require("cors");
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

// In-memory storage (replace with database in production)
let schools = [
  {
    id: 1,
    name: "La Martiniere College",
    city: "Lucknow",
    address: "Hazratganj",
    state: "Uttar Pradesh",
    contact: "9876543210",
    email_id: "info@lmc.edu",
    image: "/uploads/lmc.jpg",
  },
  {
    id: 2,
    name: "Jagran Public School",
    city: "Lucknow",
    address: "Gomti Nagar",
    state: "Uttar Pradesh",
    contact: "9876543211",
    email_id: "info@jps.edu",
    image: "/uploads/jps.jpg",
  },
];

// API Routes

// GET /api/schools - Get all schools
app.get("/api/schools", (req, res) => {
  try {
    res.json({
      success: true,
      data: schools,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// GET /api/schools/:id - Get school by ID
app.get("/api/schools/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const school = schools.find((s) => s.id === id);

    if (!school) {
      return res.status(404).json({
        success: false,
        error: "School not found",
      });
    }

    res.json({
      success: true,
      data: school,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// POST /api/schools - Create new school
app.post("/api/schools", (req, res) => {
  try {
    const { name, address, city, state, contact, email_id, image } = req.body;

    // Validation
    if (!name || !address || !city || !state || !contact || !email_id) {
      return res.status(400).json({
        success: false,
        error: "All fields are required",
      });
    }

    const newSchool = {
      id: schools.length > 0 ? Math.max(...schools.map((s) => s.id)) + 1 : 1,
      name,
      address,
      city,
      state,
      contact,
      email_id,
      image: image || "/uploads/default.jpg",
    };

    schools.push(newSchool);

    res.status(201).json({
      success: true,
      data: newSchool,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// PUT /api/schools/:id - Update school
app.put("/api/schools/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const schoolIndex = schools.findIndex((s) => s.id === id);

    if (schoolIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "School not found",
      });
    }

    const { name, address, city, state, contact, email_id, image } = req.body;

    schools[schoolIndex] = {
      ...schools[schoolIndex],
      name: name || schools[schoolIndex].name,
      address: address || schools[schoolIndex].address,
      city: city || schools[schoolIndex].city,
      state: state || schools[schoolIndex].state,
      contact: contact || schools[schoolIndex].contact,
      email_id: email_id || schools[schoolIndex].email_id,
      image: image || schools[schoolIndex].image,
    };

    res.json({
      success: true,
      data: schools[schoolIndex],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// DELETE /api/schools/:id - Delete school
app.delete("/api/schools/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const schoolIndex = schools.findIndex((s) => s.id === id);

    if (schoolIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "School not found",
      });
    }

    schools.splice(schoolIndex, 1);

    res.json({
      success: true,
      message: "School deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// POST /api/schools/upload - Upload school image
app.post("/api/schools/upload", upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No image file provided",
      });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    res.json({
      success: true,
      data: {
        imageUrl: imageUrl,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Example package.json for backend:
/*
{
  "name": "school-api-backend",
  "version": "1.0.0",
  "description": "Backend API for School Management",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "multer": "^1.4.5-lts.1",
    "cors": "^2.8.5"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
*/
