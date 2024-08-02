import React, { useState, useEffect } from 'react';
import Navbar from "../Navbar";
import Footer from "../Footer";

const QuizResult = () => {
  const [quizResults, setQuizResults] = useState([]);
  const [formData, setFormData] = useState({
    userName: '',
    engineeringField: 'Computer',
    review: 'Challenging but fun! and too easy',
    rating: 4,
    totalQuestions: 15,
    solvedQuestions: 12
  });
  const [formMode, setFormMode] = useState('add'); // 'add' or 'update'
  const [selectedQuizResultId, setSelectedQuizResultId] = useState(null);
  const [topPerformers, setTopPerformers] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [progress, setProgress] = useState(0); // Progress state

  useEffect(() => {
    let progressInterval;
    if (loading) {
      progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev < 99) {
            return prev + 10; // Increment progress by 10% until 99%
          } else {
            clearInterval(progressInterval);
            return prev;
          }
        });
      }, 100); // Adjust the interval duration as needed
    }
    return () => clearInterval(progressInterval);
  }, [loading]);

  useEffect(() => {
    fetchQuizResults();
  }, []);

  useEffect(() => {
    if (!loading) {
      calculateTopPerformers();
    }
  }, [quizResults, loading]);

  const fetchQuizResults = () => {
    fetch('https://fwu-soe.onrender.com/api/quiz-results/')
      .then(response => response.json())
      .then(data => {
        setQuizResults(data);
        setLoading(false); // Set loading to false after data is fetched
        setProgress(100); // Set progress to 100% after data is fetched
      })
      .catch(error => {
        console.error('Error fetching quiz results:', error);
        setLoading(false); // Set loading to false even if there is an error
        setProgress(100); // Set progress to 100% even if there is an error
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formMode === 'add') {
      // Add new quiz result
      fetch('https://fwu-soe.onrender.com/api/quiz-results/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      .then(response => response.json())
      .then(data => {
        console.log('Quiz result submitted successfully:', data);
        fetchQuizResults(); // Fetch updated quiz results after submission
      })
      .catch(error => console.error('Error submitting quiz result:', error));
    } else if (formMode === 'update' && selectedQuizResultId) {
      // Update existing quiz result
      fetch(`https://fwu-soe.onrender.com/api/quiz-results/${selectedQuizResultId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      .then(response => response.json())
      .then(data => {
        console.log('Quiz result updated successfully:', data);
        fetchQuizResults(); // Fetch updated quiz results after update
        setFormMode('add'); // Reset form mode to 'add' after update
        setSelectedQuizResultId(null); // Reset selected quiz result ID
      })
      .catch(error => console.error('Error updating quiz result:', error));
    }

    // Reset form data
    setFormData({
      userName: '',
      engineeringField: 'Computer',
      review: 'Challenging but fun! and too easy',
      rating: 4,
      totalQuestions: 15,
      solvedQuestions: 12
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleDeleteQuizResult = (id) => {
    fetch(`https://fwu-soe.onrender.com/api/quiz-results/${id}`, {
      method: 'DELETE',
    })
    .then(response => {
      if (response.ok) {
        console.log(`Quiz result with ID ${id} deleted successfully.`);
        fetchQuizResults(); // Fetch updated quiz results after deletion
      } else {
        throw new Error('Failed to delete quiz result.');
      }
    })
    .catch(error => console.error('Error deleting quiz result:', error));
  };

  const calculateTopPerformers = () => {
    // Sort quiz results by rating (descending order)
    const sortedResults = [...quizResults].sort((a, b) => b.rating - a.rating);
    // Get top 20 performers
    const topPerformersList = sortedResults.slice(0, 20);
    setTopPerformers(topPerformersList);
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8 mt-20">
        <h1 className="text-3xl font-bold mb-4">User Quiz Results</h1>
        {loading ? (
          <div className="flex justify-center items-center">
            <div className="radial-progress" style={{ "--value": progress }} role="progressbar">{progress}%</div>
          </div>
        ) : (
          <>
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">Top Performers</h2>
              {topPerformers.length > 0 ? (
                topPerformers.map((performer, index) => (
                  <div key={index} className="bg-yellow-100 shadow-md rounded-lg p-4 hover:shadow-xl transition duration-300 mb-4">
                    <h3 className="text-lg font-semibold mb-2">Rank {index + 1}</h3>
                    <p className="text-gray-700 mb-1">User Name: {performer.userName}</p>
                    <p className="text-gray-700 mb-1">Engineering Field: {performer.engineeringField}</p>
                    <p className="text-gray-700 mb-1">Total Questions: {performer.totalQuestions}</p>
                    <p className="text-gray-700 mb-1">Correct Answers: {performer.solvedQuestions}</p>
                  </div>
                ))
              ) : (
                <p>No top performers found.</p>
              )}
            </div>
          </>
        )}
      </div>
      <Footer />
    </>
  );
};

export default QuizResult;
