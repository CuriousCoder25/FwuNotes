import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Login from "../pages/Login";
import Logout from "./home/Logout";
import { useAuth } from "../../src/context/AuthProvider";
import {
  HiMenu, HiX, HiSun, HiMoon, HiSearch,
  HiHome, HiBookOpen, HiClipboardList, HiUserCircle, HiChevronDown
} from "react-icons/hi";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faBook, faClipboard, faChartBar, faFileAlt, faUserCircle, faBell } from '@fortawesome/free-solid-svg-icons';


function Navbar() {
  const [authUser] = useAuth();
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const element = document.documentElement;
  const navigate = useNavigate();

  const [showMenuLeft, setShowMenuLeft] = useState(false);
  const [showMenuRight, setShowMenuRight] = useState(false);
  const [showSemesterDropdown, setShowSemesterDropdown] = useState(false);
  const [showCivilNotesDropdown, setShowCivilNotesDropdown] = useState(false);
  const [showComputerNotesDropdown, setShowComputerNotesDropdown] = useState(false);
  const [showEntranceTestDropdown, setShowEntranceTestDropdown] = useState(false);
  const isLargeScreen = window.innerWidth >= 1024;
  const isSmallScreen = window.innerWidth < 1024;
  const profileRef = useRef(null);
  const [sticky, setSticky] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("home");
  // const [activeTab, setActiveTab] = useState("home");
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50); // Adjust threshold as needed
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [userData, setUserData] = useState({
    userImage: 'https://www.pngall.com/wp-content/uploads/5/Profile-Avatar-PNG-Picture.png'
  });

  useEffect(() => {
    // Fetch user data from local storage
    const storedUsers = localStorage.getItem('Users');
    if (storedUsers) {
      const users = JSON.parse(storedUsers);
      if (users && users.userImage) {
        setUserData({ userImage: users.userImage });
      }
    }
  }, []);

  useEffect(() => {
    if (theme === "dark") {
      element.classList.add("dark");
      localStorage.setItem("theme", "dark");
      document.body.classList.add("dark");
    } else {
      element.classList.remove("dark");
      localStorage.setItem("theme", "light");
      document.body.classList.remove("dark");
    }
  }, [theme]);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target) &&
        event.target.closest(".navbar-end") === null
      ) {
        setShowMenuRight(false);
        setShowSemesterDropdown(false);
      }
    };

    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const fetchSearchResults = () => {
    navigate("/mock");
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    fetchSearchResults();
  };

  const handleSemesterClick = (semester) => {
    navigate(`/showbook?semester=${semester}`);
    setShowSemesterDropdown(false);
  };

  const handleCivilBook = (semester) => {
    navigate(`/books-uploaded-civil?semester=${semester}`);
    setShowSemesterDropdown(false);
  };



  const navItems = (
    <>
      <li>
        <Link
          to="/"
          className="link-underline text-gray-900 dark:text-gray-100 hover:text-[#4338ca] dark:hover:text-[#6d28d9]"
        >
          Home
        </Link>
      </li>

      
      <li
        className="relative"
        onMouseEnter={() => setShowCivilNotesDropdown(true)}
        onMouseLeave={() => setShowCivilNotesDropdown(false)}
      >
        <Link
          to="/books-uploaded-civil"
          className="link-underline text-gray-900 dark:text-gray-100 hover:text-[#6d28d9] dark:hover:text-[#6d28d9]"
        >
          Civil Notes
        </Link>
        {showCivilNotesDropdown && (
          <ul
            className="absolute left-0 mt-1 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-10 dark:bg-slate-700 text-gray-900 dark:text-gray-100 backdrop-blur-md dark:hover:text-[#6d28d9] z-50"
            style={{ top: '100%' }} // Ensure dropdown is directly below
          >
            {Array.from({ length: 9 }, (_, i) => i).map((semester) => (
              <li
                key={semester}
                className="block px-4 py-2 text-sm text-gray-900 dark:text-[#ede9fe] hover:bg-gray-100 dark:hover:bg-slate-600 hover:text-[#6d28d9] dark:hover:text-[#6d28d9] transition-colors duration-200"
                style={{ textShadow: "0 0 2px rgba(255, 165, 0, 0.6)" }}
                onClick={() => handleCivilBook(semester)}
              >
                Semester {semester}
              </li>
            ))}
          </ul>
        )}
      </li>

      <li
        className="relative"
        onMouseEnter={() => setShowComputerNotesDropdown(true)}
        onMouseLeave={() => setShowComputerNotesDropdown(false)}
      >
        <Link
          to="/showbook"
          className="link-underline text-gray-900 dark:text-gray-100 hover:text-[#6d28d9] dark:hover:text-[#6d28d9]"
        >
          Computer Notes
        </Link>
        {showComputerNotesDropdown && (
          <ul
            className="absolute left-0 mt-1 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-10 dark:bg-slate-700 text-gray-900 dark:text-gray-100 backdrop-blur-md dark:hover:text-[#6d28d9] z-50"
            style={{ top: '100%' }} // Ensure dropdown is directly below
          >
            {Array.from({ length: 9 }, (_, i) => i).map((semester) => (
              <li
                key={semester}
                className="block px-4 py-2 text-sm text-gray-900 dark:text-[#ede9fe] hover:bg-gray-100 dark:hover:bg-slate-600 hover:text-[#6d28d9] dark:hover:text-[#6d28d9] transition-colors duration-200"
                style={{ textShadow: "0 0 2px rgba(255, 165, 0, 0.6)" }}
                onClick={() => handleSemesterClick(semester)}
              >
                Semester {semester}
              </li>
            ))}
          </ul>
        )}
      </li>

      <li
        className="relative"
        onMouseEnter={() => setShowEntranceTestDropdown(true)}
        onMouseLeave={() => setShowEntranceTestDropdown(false)}
      >
        <Link
          to="/mock"
          className="link-underline text-gray-900 dark:text-gray-100 hover:text-[#6d28d9] dark:hover:text-[#6d28d9]"
        >
          Entrance Test
        </Link>
        {showEntranceTestDropdown && (
          <ul className="absolute left-0 z-50 mt-10 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 dark:bg-slate-700 text-gray-900 dark:text-gray-100">
            {Array.from({ length: 10 }, (_, i) => 2071 + i).map((year) => (
              <li key={year} className="block px-2 py-1 text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-slate-600 dark:hover:text-[#6d28d9]">
                <Link to={`/mock${year - 2071}`}>{year}</Link>
              </li>
            ))}
          </ul>
        )}
      </li>

      <li>
        <Link
          to="/quizresult"
          className="link-underline text-gray-900 dark:text-gray-100 hover:text-[#6d28d9] dark:hover:text-[#6d28d9]"
        >
          TestResults
        </Link>
      </li>

      <li>
        <Link
          to="/about"
          className="link-underline text-gray-900 dark:text-gray-100 hover:text-[#6d28d9] dark:hover:text-[#6d28d9]"
        >
          About
        </Link>
      </li>

      <li>
        <Link
          to="/profile"
          className="link-underline text-gray-900 dark:text-gray-100 hover:text-[#6d28d9] dark:hover:text-[#6d28d9]"
        >
          Profile
        </Link>
      </li>
    </>
  );



  const [scrolling, setScrolling] = useState(false);

  // Effect to handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolling(true);
      } else {
        setScrolling(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <div
        className={`w-full fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out 
    ${isSmallScreen
            ? 'border-transparent shadow-none'
            : scrolling
              ? 'bg-slate-200 shadow-md dark:bg-slate-900 dark:shadow-md border-b border-slate-300 dark:border-slate-600'
              : 'border-b border-slate-100 dark:border-slate-700 shadow-md dark:shadow-lg'}
    ${isLargeScreen ? 'h-17' : 'h-16'}
  `}
      >
        <div className="max-w-screen-2xl container mx-auto md:px-20 px-4">
          <div className={`navbar fixed top-0 left-0 right-0 z-50 flex justify-between items-center py-2 transition-all duration-300 ${isScrolled ? 'bg-opacity-90 backdrop-blur-md shadow-md' : 'bg-transparent'}`}>
            <div className="navbar-start flex items-center">
              <div className="dropdown">
                <div
                  tabIndex={0}
                  role="button"
                  className="lg:hidden flex items-center justify-center w-14 h-14 sm:w-12 sm:h-12 transition-transform duration-300 ease-in-out hover:bg-blue-500 dark:hover:bg-blue-700 border-2 border-blue-300 dark:border-blue-600 rounded-full shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-500 dark:focus:ring-blue-300"
                  onClick={() => setShowMenuLeft(!showMenuLeft)}
                >
                  {showMenuLeft ? (
                    <HiX
                      className={`h-8 w-8 ${theme === "dark" ? "text-white" : "text-black"} transform transition-transform duration-300 ease-in-out hover:scale-125`}
                    />
                  ) : (
                    <HiMenu
                      className={`h-8 w-8 ${theme === "dark" ? "text-white" : "text-black"} transform transition-transform duration-300 ease-in-out hover:scale-125`}
                    />
                  )}
                </div>

                {showMenuLeft && (
                  <div
                    className={`fixed top-0 left-0 w-2/3 h-screen bg-opacity-90 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 transition-transform duration-300 ease-in-out z-50 ${showMenuLeft ? 'translate-x-0' : '-translate-x-full'} backdrop-blur-md shadow-2xl`}
                  >
                    <div className="flex items-center justify-between p-4 border-b dark:border-slate-600 bg-gray-50 dark:bg-slate-700 shadow-md">
                      <button
                        className="btn btn-ghost flex items-center justify-center w-16 h-16 lg:w-14 lg:h-14 bg-opacity-90 transition-transform duration-300 ease-in-out hover:bg-blue-600 dark:hover:bg-blue-800 border-2 border-blue-500 dark:border-blue-700 rounded-full shadow-2xl hover:shadow-3xl focus:outline-none focus:ring-4 focus:ring-blue-500 dark:focus:ring-blue-300"
                        onClick={() => setShowMenuLeft(false)}
                      >
                        <HiX
                          className={`h-12 w-12 lg:h-10 lg:w-10 ${theme === "dark" ? "text-white" : "text-black"} transform transition-transform duration-300 ease-in-out hover:scale-150`}
                        />
                      </button>

                      <Link
                        to="/"
                        className="relative flex items-center space-x-2 text-gray-900 dark:text-gray-100 transition-transform duration-300 ease-in-out transform hover:scale-105 sm:hidden"
                      >
                        <span className="relative text-3xl font-serif text-blue-500 group transition-all duration-300 ease-in-out">
                          SOE
                          <span className="absolute inset-0 rounded-md bg-gradient-to-r from-blue-400 to-blue-600 opacity-0 blur-md transition-opacity duration-300 ease-in-out group-hover:opacity-50 group-hover:blur-md"></span>
                        </span>
                        <span className="text-xl font-serif text-gray-900 dark:text-gray-100">
                          notes
                        </span>
                      </Link>
                    </div>

                    <ul className="mt-4 space-y-2 p-4 overflow-y-auto max-h-[300vh]">
                      {navItems}
                    </ul>

                    <div className="p-4 border-t dark:border-slate-600 mt-auto">
                      {authUser ? (
                        <div className="flex items-center space-x-4">
                          <img
                            className="w-12 h-12 rounded-full border-2 border-gray-600"
                            src={userData.userImage}
                            alt="User Avatar"
                          />
                          <div className="text-gray-900 dark:text-gray-100">
                            <div className="font-semibold">{userData.username}</div>
                            <Link to="/profile" className="text-sm text-blue-500">
                              View Profile
                            </Link>
                          </div>
                          <div>
                            <Logout />
                          </div>
                        </div>
                      ) : (
                        <div>
                          <a
                            className="bg-blue-500 text-gray-900 dark:text-gray-100 px-3 py-2 rounded-md hover:bg-blue-700 duration-300 cursor-pointer"
                            onClick={() => document.getElementById("my_modal_3").showModal()}
                          >
                            Login
                          </a>
                          <Login />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <Link
                to="/"
                className="relative flex items-center space-x-2 text-gray-900 dark:text-gray-100 transition-transform duration-300 ease-in-out transform hover:scale-105 hidden sm:flex"
              >
                <span className="relative text-4xl font-serif text-blue-500 group transition-all duration-300 ease-in-out">
                  SOE
                  <span className="absolute inset-0 rounded-md bg-gradient-to-r from-blue-400 to-blue-600 opacity-0 blur-md transition-opacity duration-300 ease-in-out group-hover:opacity-50 group-hover:blur-md"></span>
                </span>
                <span className="text-2xl font-serif text-gray-900 dark:text-gray-100">
                  notes
                </span>
              </Link>
            </div>

            <div className="navbar-end flex items-center space-x-6">


              <div className="hidden lg:flex navbar-center items-center space-x-4">
                <ul className="menu menu-horizontal px-1 w-full text-gray-900 dark:text-gray-100">
                  {navItems}
                </ul>
              </div>
              <label className="relative flex items-center cursor-pointer">
  <input
    type="checkbox"
    className="hidden"
    checked={theme === "dark"}
    onChange={() => setTheme(theme === "dark" ? "light" : "dark")}
  />
  <div className="relative w-12 h-6 lg:w-14 lg:h-7 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center p-0.5 transition-colors duration-300">
    <div
      className={`absolute flex items-center justify-center transition-transform duration-300 ${
        theme === "dark" ? 'left-0.5' : 'right-0.5'
      }`}
      style={{ width: '1.5rem', height: '1.5rem' }}
    >
      <HiSun
        className={`text-gray-100 text-md lg:text-lg ${theme === "dark" ? 'block' : 'hidden'}`}
        style={{ marginRight: '0.25rem' }} // Padding between icons
      />
      <HiMoon
        className={`text-gray-900 text-md lg:text-lg ${theme === "dark" ? 'hidden' : 'block'}`}
        style={{ marginLeft: '0.25rem' }} // Padding between icons
      />
    </div>

    <div
      className={`absolute w-5 h-5 lg:w-6 lg:h-6 bg-white dark:bg-gray-800 rounded-full shadow-md transform transition-transform duration-300 ${
        theme === "dark" ? 'translate-x-6' : 'translate-x-0'
      }`}
    ></div>
  </div>
</label>

              <div className="p-4 mt-auto">
                {authUser ? (
                  <Logout />
                ) : (
                  <div>
                    <a
                      className="bg-blue-500 text-gray-900 dark:text-gray-100 px-3 py-2 rounded-md hover:bg-blue-700 duration-300 cursor-pointer"
                      onClick={() => document.getElementById("my_modal_3").showModal()}
                    >
                      Login
                    </a>
                    <Login />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>




      {/* Bottom Navigation Bar for Mobile */}
      <div
        className={`lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-gray-100 text-black shadow-lg dark:bg-gray-900 dark:text-gray-100 transition-transform duration-300 ease-in-out ${isVisible ? "transform translate-y-0" : "transform translate-y-full"
          }`}
        style={{ height: "60px" }}
      >
        <div className="flex justify-around py-1">
          <Link
            to="/"
            className={`flex flex-col items-center p-2 transition-transform duration-300 ease-in-out transform hover:scale-110 focus:outline-none ${activeTab === "home" ? "text-blue-500 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"
              }`}
            onClick={() => setActiveTab("home")}
          >
            <FontAwesomeIcon icon={faHome} className="w-5 h-5" />
            <span className="text-xs mt-1">Home</span>
          </Link>
          <Link
            to="/showbook"
            className={`flex flex-col items-center p-2 transition-transform duration-300 ease-in-out transform hover:scale-110 focus:outline-none ${activeTab === "soenotes" ? "text-blue-500 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"
              }`}
            onClick={() => setActiveTab("soenotes")}
          >
            <FontAwesomeIcon icon={faBook} className="w-5 h-5" />
            <span className="text-xs mt-1">BCT</span>
          </Link>
          <Link
            to="/books-uploaded-civil"
            className={`flex flex-col items-center p-2 transition-transform duration-300 ease-in-out transform hover:scale-110 focus:outline-none ${activeTab === "soenotes" ? "text-blue-500 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"
              }`}
            onClick={() => setActiveTab("soenotes")}
          >
            <FontAwesomeIcon icon={faBook} className="w-5 h-5" />
            <span className="text-xs mt-1">BCE</span>
          </Link>
          {/* books-uploaded-civil */}
          <Link
            to="/mock"
            className={`flex flex-col items-center p-2 transition-transform duration-300 ease-in-out transform hover:scale-110 focus:outline-none ${activeTab === "entrance" ? "text-blue-500 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"
              }`}
            onClick={() => setActiveTab("entrance")}
          >
            <FontAwesomeIcon icon={faFileAlt} className="w-5 h-5" />
            <span className="text-xs mt-1">Mock</span>
          </Link>
          {/* <Link
            to="/quizresult"
            className={`flex flex-col items-center p-2 transition-transform duration-300 ease-in-out transform hover:scale-110 focus:outline-none ${activeTab === "results" ? "text-blue-500 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"
              }`}
            onClick={() => setActiveTab("results")}
          >
            <FontAwesomeIcon icon={faChartBar} className="w-5 h-5" />
            <span className="text-xs mt-1">Results</span>
          </Link> */}
          <Link
            to="/AdmissionGuidelines"
            className={`flex flex-col items-center p-2 transition-transform duration-300 ease-in-out transform hover:scale-110 focus:outline-none ${activeTab === "notice" ? "text-blue-500 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"
              }`}
            onClick={() => setActiveTab("notice")}
          >
            <FontAwesomeIcon icon={faBell} className="w-5 h-5" />
            <span className="text-xs mt-1">Notice</span>
          </Link>
        </div>
      </div>
    </>
  );
}

export default Navbar;
