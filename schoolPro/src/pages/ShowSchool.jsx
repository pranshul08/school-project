import React, { useState, useEffect } from "react";
import { schoolAPI } from '../services/api';
import "../assets/styles/showSchool.css";
import "../assets/styles/responsive.css";

const ShowSchools = () => {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalSchools, setTotalSchools] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    fetchSchools();
  }, [currentPage, searchTerm]);

  const fetchSchools = async () => {
    setLoading(true);
    setError('');
    
    try {
      const result = await schoolAPI.getAllSchools(currentPage, 10, searchTerm);
      
      if (result.success) {
        // Handle backend response structure
        const responseData = result.data.data;
        setSchools(responseData.schools);
        setTotalPages(responseData.pagination.totalPages);
        setTotalSchools(responseData.pagination.totalSchools);
      } else {
        setError('Failed to fetch schools: ' + result.error);
        setSchools([]);
      }
    } catch (err) {
      setError('An unexpected error occurred: ' + err.message);
      setSchools([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTerm(searchInput);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  if (loading) {
    return (
      <div className="main-bg">
        <header className="schools-header">
          <h1>School Search</h1>
          <p className="subtitle">Loading schools...</p>
        </header>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ fontSize: '1.2rem' }}>Loading schools...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-bg">
      <header className="schools-header">
        <h1>School Search</h1>
        <p className="subtitle">Find the right school for your child.</p>
        
        {/* Search Form */}
        <form onSubmit={handleSearch} style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', maxWidth: '400px', margin: '1rem auto' }}>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search schools by name, address, city, or state..."
            style={{
              flex: 1,
              padding: '0.5rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '0.9rem'
            }}
          />
          <button
            type="submit"
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Search
          </button>
        </form>

        {/* Results Info */}
        {totalSchools > 0 && (
          <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>
            Showing {schools.length} of {totalSchools} schools
            {searchTerm && ` for "${searchTerm}"`}
          </p>
        )}
      </header>

      {error && (
        <div style={{
          margin: '1rem',
          padding: '1rem',
          backgroundColor: '#f8d7da',
          border: '1px solid #f5c6cb',
          color: '#721c24',
          borderRadius: '4px'
        }}>
          {error}
        </div>
      )}

      <section className="school-grid-section">
        <div className="school-cards-grid">
          {schools.map((school) => (
            <div className="school-card" key={school.id}>
              <div className="school-image-box">
                <img
                  src={school.image ? `http://localhost:5000/images/${school.image}` : '/schoolImages/default.jpg'}
                  alt={school.school_name}
                  className="school-image"
                  onError={(e) => {
                    e.target.src = '/schoolImages/default.jpg';
                  }}
                />
                {/* Plus Icon */}
                <span className="plus-icon">+</span>
              </div>
              <div className="school-card-info">
                <span className="school-city">{school.city}</span>
                <h2 className="school-name">{school.school_name}</h2>
                <p className="school-address">{school.address}</p>
                {school.contact && (
                  <p style={{ fontSize: '0.9rem', color: '#666' }}>
                    📞 {school.contact}
                  </p>
                )}
                {school.email && (
                  <p style={{ fontSize: '0.9rem', color: '#666' }}>
                    ✉️ {school.email}
                  </p>
                )}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                <button className="apply-btn">Apply Now</button>
          
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          gap: '0.5rem', 
          margin: '2rem 0',
          padding: '1rem'
        }}>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: currentPage === 1 ? '#ccc' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
            }}
          >
            Previous
          </button>
          
          <span style={{ padding: '0 1rem' }}>
            Page {currentPage} of {totalPages}
          </span>
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: currentPage === totalPages ? '#ccc' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
            }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default ShowSchools;
