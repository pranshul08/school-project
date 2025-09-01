# API Integration Guide

This project has been successfully integrated with a REST API using the fetch API. The API runs on port 5000.

## Features Implemented

### 1. API Service Module (`src/services/api.js`)
- Centralized API functions for all CRUD operations
- Error handling and response formatting
- Support for file uploads
- Base URL configuration for port 5000

### 2. AddSchool Component Integration
- Form submission to API endpoint
- Image upload functionality
- Loading states and error handling
- Success/error messages
- Form reset after successful submission

### 3. ShowSchool Component Integration
- Fetch schools from API on component mount
- Loading states while fetching data
- Error handling with fallback to static data
- Delete school functionality
- Refresh button to reload data
- Enhanced school cards with contact info

## API Endpoints Expected

Your backend should implement these endpoints:

```
GET    /api/schools          - Get all schools
GET    /api/schools/:id      - Get school by ID
POST   /api/schools          - Create new school
PUT    /api/schools/:id      - Update school
DELETE /api/schools/:id      - Delete school
POST   /api/schools/upload   - Upload school image
```

## Backend Setup

1. Create a new directory for your backend:
```bash
mkdir school-api-backend
cd school-api-backend
```

2. Initialize npm project:
```bash
npm init -y
```

3. Install dependencies:
```bash
npm install express multer cors
npm install -D nodemon
```

4. Use the `backend-example.js` file as a reference to create your server

5. Create an `uploads` directory for storing images

6. Start your backend server:
```bash
npm run dev
```

## Frontend Usage

The frontend is now ready to work with your API:

1. **Adding Schools**: Fill out the form and submit. The data will be sent to your API.

2. **Viewing Schools**: The schools page will automatically fetch data from your API.

3. **Error Handling**: If the API is not available, the app will fall back to static data.

## Configuration

To change the API URL, modify the `API_BASE_URL` in `src/services/api.js`:

```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

## Testing

1. Start your backend server on port 5000
2. Start your React frontend:
```bash
npm run dev
```
3. Navigate to the application and test the functionality

## Error Handling

The application includes comprehensive error handling:
- Network errors
- API response errors
- Form validation errors
- Image upload errors
- Fallback to static data when API is unavailable

## File Structure

```
src/
├── services/
│   └── api.js              # API service functions
├── pages/
│   ├── AddSchool.jsx       # Form with API integration
│   └── ShowSchool.jsx      # School list with API integration
└── ...
```

## Next Steps

1. Implement the backend API using the provided example
2. Set up a database (MongoDB, PostgreSQL, etc.)
3. Add authentication if needed
4. Deploy both frontend and backend
5. Add more features like search, filtering, pagination
