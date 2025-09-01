const express = require("express");
const multer = require("multer");
const router = express.Router();
const {
  addSchool,
  showSchools,
  getSchoolById,
  updateSchool,
  deleteSchool,
} = require("../controllers/schoolController");
const upload = require("../middlewares/upload");

// School routes
router.get("/schools", showSchools); // GET /api/schools - Get all schools with pagination and search
router.get("/schools/:id", getSchoolById); // GET /api/schools/:id - Get school by ID
router.post("/schools", upload.single("image"), addSchool); // POST /api/schools - Add new school
router.put("/schools/:id", updateSchool); // PUT /api/schools/:id - Update school
router.delete("/schools/:id", deleteSchool); // DELETE /api/schools/:id - Delete school

// Legacy routes for backward compatibility
router.get("/show-schools", showSchools);
router.post("/add-school", upload.single("image"), addSchool);

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File too large. Maximum size is 5MB.",
      });
    }
  }

  if (error.message === "Only image files are allowed!") {
    return res.status(400).json({
      success: false,
      message: "Only image files are allowed!",
    });
  }

  next(error);
});

module.exports = router;
