import React, { useState } from 'react';

function DateFilter({ onFilter, onDownload, reportType, loading = false }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showFilter, setShowFilter] = useState(false);

  const handleFilter = () => {
    if (startDate && endDate) {
      onFilter({ startDate, endDate });
    } else {
      onFilter({});
    }
  };

  const handleDownload = () => {
    if (startDate && endDate) {
      onDownload({ startDate, endDate, reportType });
    } else {
      alert('Silakan pilih tanggal mulai dan tanggal selesai untuk download data!');
    }
  };

  const handleToday = () => {
    const today = new Date().toISOString().split('T')[0];
    setStartDate(today);
    setEndDate(today);
  };

  const handleThisWeek = () => {
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6));
    
    setStartDate(startOfWeek.toISOString().split('T')[0]);
    setEndDate(endOfWeek.toISOString().split('T')[0]);
  };

  const handleThisMonth = () => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    setStartDate(startOfMonth.toISOString().split('T')[0]);
    setEndDate(endOfMonth.toISOString().split('T')[0]);
  };

  const handleLastMonth = () => {
    const today = new Date();
    const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    
    setStartDate(startOfLastMonth.toISOString().split('T')[0]);
    setEndDate(endOfLastMonth.toISOString().split('T')[0]);
  };

  const handleClear = () => {
    setStartDate('');
    setEndDate('');
    onFilter({});
  };

  return (
    <div className="date-filter-container">
      <div className="date-filter-header">
        <button 
          className="btn btn-secondary"
          onClick={() => setShowFilter(!showFilter)}
        >
          {showFilter ? 'Sembunyikan Filter' : 'Tampilkan Filter'} 📅
        </button>
        
        {showFilter && (
          <div className="date-filter-controls">
            <div className="date-inputs">
              <div className="form-group">
                <label htmlFor="startDate">Tanggal Mulai:</label>
                <input
                  type="date"
                  id="startDate"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="form-control"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="endDate">Tanggal Selesai:</label>
                <input
                  type="date"
                  id="endDate"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="form-control"
                />
              </div>
            </div>

            <div className="quick-filters">
              <button 
                className="btn btn-sm btn-outline"
                onClick={handleToday}
                title="Hari ini"
              >
                Hari Ini
              </button>
              <button 
                className="btn btn-sm btn-outline"
                onClick={handleThisWeek}
                title="Minggu ini"
              >
                Minggu Ini
              </button>
              <button 
                className="btn btn-sm btn-outline"
                onClick={handleThisMonth}
                title="Bulan ini"
              >
                Bulan Ini
              </button>
              <button 
                className="btn btn-sm btn-outline"
                onClick={handleLastMonth}
                title="Bulan lalu"
              >
                Bulan Lalu
              </button>
            </div>

            <div className="filter-actions">
              <button 
                className="btn btn-primary"
                onClick={handleFilter}
                disabled={loading}
              >
                {loading ? 'Memfilter...' : 'Terapkan Filter'}
              </button>
              
              <button 
                className="btn btn-success"
                onClick={handleDownload}
                disabled={loading}
              >
                {loading ? 'Mengunduh...' : '📥 Download Report'}
              </button>
              
              <button 
                className="btn btn-outline"
                onClick={handleClear}
                disabled={loading}
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>

      {showFilter && (startDate || endDate) && (
        <div className="date-filter-info">
          <span className="filter-badge">
            📅 Filter: {startDate || 'Semua'} - {endDate || 'Semua'}
          </span>
        </div>
      )}
    </div>
  );
}

export default DateFilter;
