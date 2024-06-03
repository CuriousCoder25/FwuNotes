import { useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Button, Card } from '@mui/material';
import { Link } from 'react-router-dom';
import logo from '../../public/logo1.png'; // Adjust the import path as necessary

const years = [2077, 2078, 2079, 2080];

const Mock = () => {
  const [currentYear, setCurrentYear] = useState(null);

  const handleTestNowClick = (year) => {
    setCurrentYear(year);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex justify-center items-center mt-8">
        <img src={logo} alt="Logo" className="w-1/2 h-32 md:w-1/2 md:h-30 mt-20" />
      </div>
      <div className="flex-grow flex justify-center items-center bg-gray-100 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {years.map((year) => (
            <Card key={year} className="p-6 flex flex-col items-center shadow-md hover:shadow-lg transition-shadow duration-300">
              <h2 className="text-xl font-bold mb-2">{year}</h2>
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="h-12 w-12 mb-4" viewBox="0 0 16 16">
                <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
              </svg>
              <p className="mb-4 text-center text-sm font-medium text-gray-600">
                Unlock your potential with our mock tests.
              </p>
              <Link to={`/Mock${year - 2076}/`}>
                <Button variant="contained" color="primary" onClick={() => handleTestNowClick(year)}>
                  Test Now
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Mock;