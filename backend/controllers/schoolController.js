const db = require("../config/db");

exports.addSchool = async (req, res) => {
  try {
    const { school_name, address, city, state, contact, email, image } =
      req.body;

    // Handle uploaded file
    let imagePath = image || null;
    if (req.file) {
      imagePath = req.file.filename;
    }

    // Log the request for debugging
    console.log("Request body:", req.body);
    console.log("Request file:", req.file);

    // Validate required fields
    if (!school_name || !address || !city || !state) {
      return res.status(400).json({
        success: false,
        message: "School name, address, city, and state are required",
      });
    }

    // Check if school already exists
    const checkQuery = "SELECT id FROM schools WHERE school_name = ?";
    const [existingSchool] = await db
      .promise()
      .execute(checkQuery, [school_name]);

    if (existingSchool.length > 0) {
      return res.status(409).json({
        success: false,
        message: "School with this name already exists",
      });
    }

    // Insert new school
    const insertQuery = `
      INSERT INTO schools (school_name, address, city, state, contact, email, image, created_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    const [result] = await db
      .promise()
      .execute(insertQuery, [
        school_name,
        address,
        city,
        state,
        contact || null,
        email || null,
        imagePath,
      ]);

    res.status(201).json({
      success: true,
      message: "School added successfully",
      data: {
        id: result.insertId,
        school_name,
        address,
        city,
        state,
        contact,
        email,
        image: imagePath,
      },
    });
  } catch (error) {
    console.error("Error adding school:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.showSchools = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const offset = (page - 1) * limit;

    let query = "SELECT * FROM schools";
    let countQuery = "SELECT COUNT(*) as total FROM schools";
    let queryParams = [];
    let countParams = [];

    // Add search functionality
    if (search) {
      const searchCondition =
        " WHERE school_name LIKE ? OR address LIKE ? OR city LIKE ? OR state LIKE ?";
      query += searchCondition;
      countQuery += searchCondition;
      const searchPattern = `%${search}%`;
      queryParams = [
        searchPattern,
        searchPattern,
        searchPattern,
        searchPattern,
      ];
      countParams = [
        searchPattern,
        searchPattern,
        searchPattern,
        searchPattern,
      ];
    }

    // Add ordering and pagination
    query += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
    queryParams.push(parseInt(limit), parseInt(offset));

    // Execute queries
    const [schools] = await db.promise().execute(query, queryParams);
    const [countResult] = await db.promise().execute(countQuery, countParams);

    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      message: "Schools retrieved successfully",
      data: {
        schools,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalSchools: total,
          schoolsPerPage: parseInt(limit),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching schools:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.getSchoolById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Valid school ID is required",
      });
    }

    const query = "SELECT * FROM schools WHERE id = ?";
    const [schools] = await db.promise().execute(query, [id]);

    if (schools.length === 0) {
      return res.status(404).json({
        success: false,
        message: "School not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "School retrieved successfully",
      data: schools[0],
    });
  } catch (error) {
    console.error("Error fetching school:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.updateSchool = async (req, res) => {
  try {
    const { id } = req.params;
    const { school_name, address, city, state, contact, email, image } =
      req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Valid school ID is required",
      });
    }

    // Check if school exists
    const checkQuery = "SELECT id FROM schools WHERE id = ?";
    const [existingSchool] = await db.promise().execute(checkQuery, [id]);

    if (existingSchool.length === 0) {
      return res.status(404).json({
        success: false,
        message: "School not found",
      });
    }

    // Check if school_name is being changed and if new name already exists
    if (school_name) {
      const nameCheckQuery =
        "SELECT id FROM schools WHERE school_name = ? AND id != ?";
      const [nameExists] = await db
        .promise()
        .execute(nameCheckQuery, [school_name, id]);

      if (nameExists.length > 0) {
        return res.status(409).json({
          success: false,
          message: "School with this name already exists",
        });
      }
    }

    // Build update query dynamically
    const updateFields = [];
    const updateValues = [];

    if (school_name) {
      updateFields.push("school_name = ?");
      updateValues.push(school_name);
    }
    if (address) {
      updateFields.push("address = ?");
      updateValues.push(address);
    }
    if (city) {
      updateFields.push("city = ?");
      updateValues.push(city);
    }
    if (state) {
      updateFields.push("state = ?");
      updateValues.push(state);
    }
    if (contact !== undefined) {
      updateFields.push("contact = ?");
      updateValues.push(contact);
    }
    if (email !== undefined) {
      updateFields.push("email = ?");
      updateValues.push(email);
    }
    if (image !== undefined) {
      updateFields.push("image = ?");
      updateValues.push(image);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one field must be provided for update",
      });
    }

    updateFields.push("updated_at = NOW()");
    updateValues.push(id);

    const updateQuery = `UPDATE schools SET ${updateFields.join(
      ", "
    )} WHERE id = ?`;
    await db.promise().execute(updateQuery, updateValues);

    // Fetch updated school
    const selectQuery = "SELECT * FROM schools WHERE id = ?";
    const [updatedSchool] = await db.promise().execute(selectQuery, [id]);

    res.status(200).json({
      success: true,
      message: "School updated successfully",
      data: updatedSchool[0],
    });
  } catch (error) {
    console.error("Error updating school:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.deleteSchool = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Valid school ID is required",
      });
    }

    // Check if school exists
    const checkQuery = "SELECT id FROM schools WHERE id = ?";
    const [existingSchool] = await db.promise().execute(checkQuery, [id]);

    if (existingSchool.length === 0) {
      return res.status(404).json({
        success: false,
        message: "School not found",
      });
    }

    // Delete school
    const deleteQuery = "DELETE FROM schools WHERE id = ?";
    await db.promise().execute(deleteQuery, [id]);

    res.status(200).json({
      success: true,
      message: "School deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting school:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
