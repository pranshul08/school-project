// require("dotenv").config();
// const express = require("express");
// const path = require("path");
// const cors = require("cors");
// const db = require("./config/db.js");

// const app = express();

// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// const schoolRoutes = require("./routes/schoolRoutes.js")

// app.use("/api/", schoolRoutes);

// app.use("/images", express.static(path.join(__dirname, "images")));

// app.use((req, res) => {
//   res.status(404).json({ error: "Route not found" });
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));




require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const db = require("./config/db.js");

const app = express();

// Enable CORS: allowing only specific origins (e.g., your frontend URL)
// This will restrict the backend to only accept requests from the frontend (localhost:3000 in this case).
// Change 'http://localhost:3000' to match the URL of your actual frontend.
app.use(cors({
  origin: 'http://localhost:5173',  // Allow requests only from this origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific HTTP methods (optional)
  allowedHeaders: ['Content-Type', 'Authorization'] // Allowed headers (optional)
}));

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import and use the schoolRoutes
const schoolRoutes = require("./routes/schoolRoutes.js");
app.use("/api/", schoolRoutes);

// Serve static files (e.g., images) from the "images" directory
app.use("/images", express.static(path.join(__dirname, "images")));

// 404 Error handler for undefined routes
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Set referrer policy for all requests
// This helps avoid sending the referrer information for cross-origin requests,
// preventing issues with the strict-origin-when-cross-origin policy.
app.use((req, res, next) => {
  res.setHeader('Referrer-Policy', 'no-referrer-when-downgrade');  // Adjust this based on your needs
  next();
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
