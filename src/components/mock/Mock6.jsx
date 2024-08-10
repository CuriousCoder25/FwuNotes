import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../Navbar";
import { FaCheck, FaRedo, FaArrowRight, FaTimes } from "react-icons/fa";
import backgroundImage from "../../../public/fwu.jpeg";
import AOS from "aos";
import "aos/dist/aos.css";
import logo from '../../../public/fwu.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MathJax from 'react-mathjax2';

const NUM_QUESTIONS = 75;
const QUESTION_TIME = 2 * 60;
const TOTAL_TIME = NUM_QUESTIONS * QUESTION_TIME;

const Mock1 = () => {
  const [currentQuestion, setCurrentQuestion] = useState(() =>
    parseInt(localStorage.getItem("currentQuestion")) || 0
  );
  const [score, setScore] = useState(() =>
    parseInt(localStorage.getItem("score")) || 0
  );
  const [showScore, setShowScore] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [timer, setTimer] = useState(() =>
    parseInt(localStorage.getItem("timer")) || TOTAL_TIME
  );
  const [questionTimer, setQuestionTimer] = useState(() => QUESTION_TIME);
  const [quizData, setQuizData] = useState([]);
  const [showLoader, setShowLoader] = useState(true);
  const [showTitles, setShowTitles] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    userName: "",
    engineeringField: "Computer",
    review: "Any feedback or suggestions?",
    rating: "5",
  });
  const [submittedAnswers, setSubmittedAnswers] = useState([]);
  const [progress, setProgress] = useState(0);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [showPopup, setShowPopup] = useState(null);

  useEffect(() => {
    let progressInterval;
    if (showLoader) {
      progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev < 90) {
            return prev + 1;
          } else {
            return prev;
          }
        });
      }, 100);
    }
    return () => clearInterval(progressInterval);
  }, [showLoader]);

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await fetch(
          "https://fwu-soe.onrender.com/api/quizzes/"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        const filteredData = data.filter((quiz) => quiz.yearID === 2077);

        const processedData = filteredData.map(quiz => {
          const answersWithIds = quiz.answers.map((answer, index) => ({
            ...answer,
            _id: `answer_${index}_${Math.random().toString(36).substr(2, 9)}`
          }));

          const shuffledAnswers = answersWithIds.sort(() => Math.random() - 0.5);

          return {
            ...quiz,
            answers: shuffledAnswers
          };
        });

        setQuizData(processedData);
      } catch (error) {
        console.error("Error fetching quiz data:", error);
      } finally {
        setShowLoader(false);
        setShowTitles(true);
        setProgress(100);
      }
    };

    fetchQuizData();
  }, []);

  useEffect(() => {
    let countdown;
    if (timer > 0 && !showScore) {
      countdown = setInterval(() => {
        setTimer((prevTimer) => {
          localStorage.setItem("timer", prevTimer - 1);
          return prevTimer - 1;
        });
      }, 1000);
    } else if (timer === 0) {
      setShowScore(true);
      setShowForm(true);
      localStorage.removeItem("currentQuestion");
      localStorage.removeItem("score");
      localStorage.removeItem("timer");
    }

    return () => clearInterval(countdown);
  }, [timer, showScore]);

  useEffect(() => {
    let questionCountdown;
    if (questionTimer > 0 && !showScore && selectedAnswer === null) {
      questionCountdown = setInterval(() => {
        setQuestionTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }

    if (questionTimer === 0) {
      handleNextQuestion();
    }

    return () => clearInterval(questionCountdown);
  }, [questionTimer, showScore, selectedAnswer]);

  useEffect(() => {
    localStorage.setItem("currentQuestion", currentQuestion);
    localStorage.setItem("score", score.toString());
  }, [currentQuestion, score]);

  useEffect(() => {
    const titlesTimer = setTimeout(() => {
      setShowTitles(false);
    }, 10000);

    return () => clearTimeout(titlesTimer);
  }, [showTitles]);

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const handleAnswerOptionClick = (answerOption) => {
    if (!selectedAnswer) {
      setSelectedAnswer(answerOption);

      // Determine the correct answer
      const correct = quizData[currentQuestion].answers.find(
        (option) => option.correct
      );
      setCorrectAnswer(correct);

      // Check if the selected answer is correct
      const isCorrect = answerOption.correct;
      if (isCorrect) {
        setScore((prevScore) => prevScore + 1);
        setShowPopup("success");
      } else {
        setShowPopup("fail");
      }

      // Record the user's answer
      setSubmittedAnswers((prev) => [
        ...prev,
        {
          question: quizData[currentQuestion].question,
          userAnswer: answerOption.text,
          correctAnswer: correct.text,
          explanation: quizData[currentQuestion].explanation || "No explanation provided.",
        },
      ]);

      // Show the popup animation for a few seconds before auto-advancing
      setTimeout(() => {
        setShowPopup(null);
        handleNextQuestion();
      }, 4000);
    }
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setCorrectAnswer(null);
    setQuestionTimer(QUESTION_TIME);
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < quizData.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowScore(true);
      setShowForm(true);
      localStorage.removeItem("currentQuestion");
      localStorage.removeItem("score");
      localStorage.removeItem("timer");
    }
  };

  const handleFinishQuiz = () => {
    // Clear selected answer and correct answer (optional)
    setSelectedAnswer(null);
    setCorrectAnswer(null);

    // Reset the timer (optional)
    setQuestionTimer(QUESTION_TIME);

    // Set the state to show the score and form
    setShowScore(true);
    setShowForm(true);

    // Clear local storage
    localStorage.removeItem("currentQuestion");
    localStorage.removeItem("score");
    localStorage.removeItem("timer");

    // Optionally, handle any additional finalization logic here
    // For example, you might want to submit the results or navigate to another page
    // Example: submitQuizResults();
    // Example: history.push('/results-summary');
  };

  // Check if quizData and currentQuestion are valid
  const currentQuestionData = quizData[currentQuestion] || { question: '', answers: [], explanation: '' };

  // Function to determine if the question is mathematical
  const isMathQuestion = (question) => {
    // A simple regex to check for mathematical symbols
    return /[\+\-\*\/\=\(\)\^]/.test(question);
  };

  const isMath = isMathQuestion(currentQuestionData.question);
  const handleRestartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
    setSelectedAnswer(null);
    setCorrectAnswer(null);
    setTimer(TOTAL_TIME);
    setQuestionTimer(QUESTION_TIME);
    setSubmittedAnswers([]);
    localStorage.removeItem("currentQuestion");
    localStorage.removeItem("score");
    localStorage.removeItem("timer");
    setIsFormSubmitted(false);
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes} minutes ${seconds} seconds`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isFormSubmitted) {
      toast.info("You have already submitted the form.");
      return;
    }

    try {
      const response = await fetch(
        "https://fwu-soe.onrender.com/api/quiz-results/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            totalQuestions: quizData.length,
            solvedQuestions: score,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      toast.success("Quiz result submitted successfully!");
      setIsFormSubmitted(true);
      setFormData({
        userName: "",
        engineeringField: "Computer",
        review: "Any feedback or suggestions?",
        rating: "5",
      });
      setShowForm(false); // Close the form after successful submission
    } catch (error) {
      toast.error("There was an error submitting the form.");
      setShowForm(false); // Optionally close the form on error
    }
  };


  return (
    <>
      <Navbar />
      <div className="relative">
        <img
          className="absolute inset-0 w-full h-full object-cover filter blur-sm"
          src={backgroundImage}
          alt="Background Image"
        />
        <div className="relative bg-gray-800 bg-opacity-80 py-20">
          <div className="container mx-auto text-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="flex flex-col items-center"
            >
              {
                showTitles && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="text-center text-white mb-12 px-4"
                  >
                    <img
                      src={logo}
                      alt="Logo"
                      className="h-32 w-auto mx-auto mb-6"
                    />
                    <h1 className="text-4xl font-bold mb-4 leading-tight">
                      Entrance Exam Preparation Test
                    </h1>
                    <h2 className="text-2xl font-semibold mb-2">
                      Attempt all the questions.
                    </h2>
                    <h3 className="text-lg mb-6">
                      Read the following questions carefully and tick the correct answer.
                    </h3>
                  </motion.div>
                )
              }
              {showLoader && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1 }}
                  className="w-full max-w-md mx-auto mb-8 mt-20"
                >
                  <div className="w-full max-w-5xl bg-gray-700 h-2 rounded">
                    <motion.div
                      className="bg-blue-500 h-2 rounded"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-white text-sm text-center mt-2">
                    Loading quiz data...
                  </p>
                </motion.div>
              )}
              {!showLoader && quizData.length > 0 && !showScore && (
                <div className="relative w-full max-w-3xl mx-auto bg-white bg-opacity-70 dark:bg-opacity-20 dark:bg-gray-800 p-6 md:p-8 rounded-xl shadow-lg dark:shadow-gray-700 mt-4 scrollbar-hidden">
                  <div className="absolute inset-0 bg-white bg-opacity-60 dark:bg-gray-900 dark:bg-opacity-60 filter blur-md rounded-xl"></div>
                  <div className="relative z-10">
                    <h2 className="text-lg md:text-xl font-bold mb-4 text-gray-900 dark:text-gray-100 tracking-wider">
                      Question {currentQuestion + 1} of {quizData.length}
                    </h2>
                    <div className="text-base md:text-lg lg:text-xl font-medium mb-6 text-gray-800 dark:text-gray-200 tracking-wider">
                      {isMath ? (
                        <div className="w-full break-words overflow-scroll scrollbar-hidden">
                          <MathJax.Context input='tex'>
                            <MathJax.Node
                              className="whitespace-pre-wrap"
                              style={{
                                letterSpacing: '0.05em',
                                overflowWrap: 'break-word',
                                wordWrap: 'break-word',
                                whiteSpace: 'pre-wrap',
                                fontSize: 'calc(0.75rem + 0.5vw)', // Responsive font size
                              }}
                            >
                              {currentQuestionData.question}
                            </MathJax.Node>
                          </MathJax.Context>
                        </div>
                      ) : (
                        <p
                          className="whitespace-pre-wrap break-words scrollbar-hidden"
                          style={{
                            letterSpacing: '0.05em',
                            overflowWrap: 'break-word',
                            wordWrap: 'break-word',
                            whiteSpace: 'pre-wrap',
                            fontSize: 'calc(0.875rem + 0.2vw)', // Responsive font size
                          }}
                        >
                          {currentQuestionData.question}
                        </p>
                      )}
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {currentQuestionData.answers.map((answer) => (
                        <motion.button
                          key={answer._id}
                          onClick={() => handleAnswerOptionClick(answer)}
                          className={`w-full p-4 rounded-2xl flex items-center justify-start transition-transform duration-500 ease-in-out ${selectedAnswer
                            ? answer.correct
                              ? 'bg-gradient-to-r from-green-600 to-green-800 dark:from-green-400 dark:to-green-600 text-white shadow-inner shadow-green-500' // Correct answer background
                              : answer === selectedAnswer
                                ? 'bg-gradient-to-r from-red-600 to-red-800 dark:from-red-400 dark:to-red-600 text-white shadow-inner shadow-red-500' // Incorrect selected answer background
                                : 'bg-gray-700 dark:bg-gray-800 text-gray-300 dark:text-gray-400 shadow-inner shadow-gray-500' // Non-selected answer background
                            : 'bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 dark:from-blue-400 dark:to-blue-500 dark:hover:from-blue-500 dark:hover:to-blue-600 text-white shadow-inner shadow-blue-500' // Default background
                            } shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {selectedAnswer === answer && (
                            <span className="mr-3 flex items-center">
                              {answer.correct ? (
                                <FaCheck className="w-5 h-5 text-green-300 dark:text-green-200" />
                              ) : (
                                <FaTimes className="w-5 h-5 text-red-300 dark:text-red-200" />
                              )}
                            </span>
                          )}
                          <span
                            className={isMath ? 'font-math' : 'font-normal'}
                            style={{
                              fontSize: 'calc(0.65rem + 0.5vw)', // Smaller, responsive font size
                              letterSpacing: '0.05em',
                              overflowWrap: 'break-word',
                              wordWrap: 'break-word',
                              whiteSpace: 'pre-wrap',
                            }}
                          >
                            {isMath ? (
                              <MathJax.Context input='tex'>
                                <MathJax.Node
                                  className="whitespace-pre-wrap break-words"
                                  style={{ letterSpacing: '0.05em' }}
                                >
                                  {answer.text}
                                </MathJax.Node>
                              </MathJax.Context>
                            ) : (
                              answer.text
                            )}
                          </span>
                        </motion.button>
                      ))}


                    </div>
                    {selectedAnswer && (
                      <motion.div
                        className="mt-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <p className="text-base font-semibold mb-2 tracking-wider flex flex-col space-y-2">
                          {selectedAnswer?.correct ? (
                            <span className="text-green-600 dark:text-green-500 flex items-center">
                              <span className="mr-2">✔️</span> Correct!
                            </span>
                          ) : (
                            <>
                              <span className="text-red-600 dark:text-red-500 flex items-center">
                                <span className="mr-2">❌</span> Incorrect.
                              </span>
                              <span className="text-gray-800 dark:text-gray-300 flex items-center">
                                <span className="mr-2">🔍</span> The correct answer is
                                {isMath ? (
                                  <MathJax.Context input='tex'>
                                    <MathJax.Node
                                      className="ml-2 text-green-600 dark:text-green-500 font-semibold"
                                      style={{ fontSize: 'calc(0.75rem + 0.2vw)' }} // Responsive font size
                                    >
                                      {correctAnswer?.text || "No correct answer provided."}
                                    </MathJax.Node>
                                  </MathJax.Context>
                                ) : (
                                  <span className="ml-2 text-green-600 dark:text-green-500 font-semibold">
                                    {correctAnswer?.text || "No correct answer provided."}
                                  </span>
                                )}
                              </span>
                            </>
                          )}
                        </p>
                        <p
                          className="w-full bg-white dark:bg-gray-100 p-6 rounded-xl shadow-lg dark:shadow-gray-900 overflow-scroll scrollbar-hidden text-black dark:text-gray-900"
                          style={{
                            letterSpacing: '0.05em',
                            overflowWrap: 'break-word',
                            wordWrap: 'break-word',
                            whiteSpace: 'pre-wrap',
                            fontSize: 'calc(0.75rem + 0.2vw)', // Responsive font size
                          }}
                        >
                          {isMath ? (
                            <MathJax.Context input='tex'>
                              <MathJax.Node
                                className="whitespace-pre-wrap break-words"
                                style={{
                                  letterSpacing: '0.05em',
                                  overflowWrap: 'break-word',
                                  wordWrap: 'break-word',
                                  whiteSpace: 'pre-wrap',
                                  fontSize: 'calc(0.75rem + 0.2vw)', // Responsive font size
                                  color: 'inherit' // Inherit text color
                                }}
                              >
                                {currentQuestionData.explanation || "No explanation provided."}
                              </MathJax.Node>
                            </MathJax.Context>
                          ) : (
                            <span
                              style={{
                                letterSpacing: '0.05em',
                                overflowWrap: 'break-word',
                                wordWrap: 'break-word',
                                whiteSpace: 'pre-wrap',
                                fontSize: 'calc(0.75rem + 0.2vw)', // Responsive font size
                                color: 'inherit' // Inherit text color
                              }}
                            >
                              {currentQuestionData.explanation || "No explanation provided."}
                            </span>
                          )}
                        </p>
                      </motion.div>
                    )}
                  </div>
                </div>




              )}

              <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 mt-8 ">
                <button
                  onClick={handleRestartQuiz}
                  className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-l-lg rounded-tr-lg hover:bg-[#172554] dark:bg-blue-500 dark:hover:bg-blue-600 shadow-lg hover:shadow-xl transition-colors duration-300 ease-in-out space-x-2"
                  style={{ borderRadius: '1.5rem 0.5rem 0.5rem 1.5rem' }} // Custom border-radius for one edge more curved
                >
                  <FaRedo className="w-5 h-5" />
                  <span>Restart</span>
                </button>

                <button
                  onClick={handleFinishQuiz}
                  className="flex items-center justify-center px-6 py-3 bg-[#84cc16] text-white rounded-r-lg rounded-bl-lg hover:bg-[#172554] dark:bg-green-500 dark:hover:bg-green-600 shadow-lg hover:shadow-xl transition-colors duration-300 ease-in-out space-x-2"
                  style={{ borderRadius: '0.5rem 1.5rem 1.5rem 0.5rem' }} // Custom border-radius for one edge more curved
                >
                  <FaArrowRight className="w-5 h-5" />
                  <span>Finish</span>
                </button>
              </div>

              {showScore && (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 0.9, y: 0 }}
    transition={{ duration: 0.5 }}
    className="w-full max-w-4xl mx-auto mt-8 p-8  rounded-lg shadow-xl "
  >
    <h2 className="text-4xl font-bold mb-6 text-gray-900 dark:text-gray-900">Entrance Completed!</h2>
    <p className="text-xl mb-8 text-gray-800 dark:text-gray-300">
      You scored <span className="font-bold text-indigo-600">{score}</span> out of <span className="font-bold text-indigo-600">{quizData.length}</span>.
    </p>

    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="space-y-6"
    >
      <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg dark:shadow-gray-700">
        <h2 className="text-3xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Scoreboard</h2>
        <ul className="space-y-4">
          {submittedAnswers.map((answer, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md dark:shadow-gray-700"
            >
              <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">Question {index + 1}:</p>

              <p
                className="bg-gray-200 dark:bg-gray-700 p-4 rounded-md text-gray-900 dark:text-gray-200"
                style={{
                  letterSpacing: '0.05em',
                  overflowWrap: 'break-word',
                  wordWrap: 'break-word',
                  whiteSpace: 'pre-wrap',
                  fontSize: 'calc(0.85rem + 0.2vw)',
                }}
              >
                {isMathQuestion(answer.question) ? (
                  <MathJax.Context input="tex">
                    <MathJax.Node>{answer.question}</MathJax.Node>
                  </MathJax.Context>
                ) : (
                  <span>{answer.question || "No question provided."}</span>
                )}
              </p>

              <p
                className="bg-gray-200 dark:bg-gray-700 p-4 rounded-md text-gray-900 dark:text-gray-200 mt-2"
                style={{
                  letterSpacing: '0.05em',
                  overflowWrap: 'break-word',
                  wordWrap: 'break-word',
                  whiteSpace: 'pre-wrap',
                  fontSize: 'calc(0.85rem + 0.2vw)',
                }}
              >
                <strong>Your Answer:</strong>{' '}
                {isMathQuestion(answer.userAnswer) ? (
                  <MathJax.Context input="tex">
                    <MathJax.Node>{answer.userAnswer}</MathJax.Node>
                  </MathJax.Context>
                ) : (
                  <span>{answer.userAnswer || "No answer provided."}</span>
                )}
              </p>

              <p
                className="bg-gray-200 dark:bg-gray-700 p-4 rounded-md text-gray-900 dark:text-gray-200 mt-2"
                style={{
                  letterSpacing: '0.05em',
                  overflowWrap: 'break-word',
                  wordWrap: 'break-word',
                  whiteSpace: 'pre-wrap',
                  fontSize: 'calc(0.85rem + 0.2vw)',
                }}
              >
                <strong>Correct Answer:</strong>{' '}
                {isMathQuestion(answer.correctAnswer) ? (
                  <MathJax.Context input="tex">
                    <MathJax.Node>{answer.correctAnswer}</MathJax.Node>
                  </MathJax.Context>
                ) : (
                  <span>{answer.correctAnswer || "No correct answer provided."}</span>
                )}
              </p>

              <p
                className="bg-gray-200 dark:bg-gray-700 p-4 rounded-md text-gray-900 dark:text-gray-200 mt-2 tracking-wider overflow-scroll scrollbar-hidden"
                style={{
                  letterSpacing: '0.05em',
                  overflowWrap: 'break-word',
                  wordWrap: 'break-word',
                  whiteSpace: 'pre-wrap',
                  fontSize: 'calc(0.85rem + 0.2vw)',
                }}
              >
                <strong>Explanation:</strong>{' '}
                {isMathQuestion(answer.explanation) ? (
                  <MathJax.Context input="tex">
                    <MathJax.Node>{answer.explanation}</MathJax.Node>
                  </MathJax.Context>
                ) : (
                  <span>{answer.explanation || "No explanation provided."}</span>
                )}
              </p>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  </motion.div>
)}



              {showForm && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center"
                >
                  <div className="bg-gray-100 dark:bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md">
                    <h3 className=" font-semibold mb-4 text-black  dark:text-white">Requested to fill form with your Correct Name</h3>
                    <form onSubmit={handleSubmit}>
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-2 text-black dark:text-white">Name:</label>
                        <input
                          type="text"
                          name="userName"
                          value={formData.userName}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-lg text-black bg-white dark:text-white dark:bg-gray-900 "
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-2 text-black dark:text-white">Engineering Field:</label>
                        <select
                          name="engineeringField"
                          value={formData.engineeringField}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-lg text-black bg-white dark:text-white dark:bg-gray-900"
                        >
                          <option value="Computer">Computer</option>

                          <option value="Civil">Civil</option>

                        </select>
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-2 text-black dark:text-white">Review:</label>
                        <textarea
                          name="review"
                          value={formData.review}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-lg text-black bg-white dark:text-white dark:bg-gray-900"
                        />
                      </div>
                      {/* <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Rating:</label>
                        <input
                          type="hidden"
                          name="rating"
                          value="5"
                          onChange={handleInputChange}
                        />
                        <p className="text-sm">Rating: 5 (hidden)</p>
                      </div> */}
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 "
                      >
                        Submit
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowForm(false)}
                        className="ml-4 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                      >
                        Close
                      </button>
                    </form>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Mock1;
