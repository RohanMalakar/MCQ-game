import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { questions as allQuestions } from "./components/questions.jsx";
import { 
  FiSun, 
  FiMoon, 
  FiCheck, 
  FiChevronRight, 
  FiAward, 
  FiBox,
  FiRefreshCw
} from "react-icons/fi";

const shuffleArray = (arr) => [...arr].sort(() => Math.random() - 0.5);

// Background Bubble Component
const Bubble = ({ darkMode }) => {
  const size = Math.random() * 100 + 50;
  const duration = Math.random() * 10 + 15;
  const x = Math.random() * 100;
  
  return (
    <motion.div
      className={`absolute rounded-full ${darkMode ? "bg-blue-900/10" : "bg-blue-500/5"}`}
      initial={{ 
        y: "110vh", 
        x: `${x}vw`, 
        height: 0, 
        width: 0, 
        opacity: 0.7 
      }}
      animate={{ 
        y: "-10vh", 
        height: size, 
        width: size, 
        opacity: 0 
      }}
      transition={{ 
        duration, 
        repeat: Infinity, 
        repeatType: "loop",
        ease: "linear"
      }}
    />
  );
};

// Bubbles Background
const BubblesBackground = ({ darkMode }) => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {[...Array(10)].map((_, i) => (
        <Bubble key={i} darkMode={darkMode} />
      ))}
    </div>
  );
};

export default function App() {
  const [questions, setQuestions] = useState(shuffleArray(allQuestions));
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showScore, setShowScore] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check system preference for dark/light mode
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(prefersDark);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleNext = () => {
    if (selected) {
      if (selected === questions[current].answer) {
        setScore(score + 1);
      }
      setUserAnswers([...userAnswers, { ...questions[current], selected }]);
    } else {
      setUserAnswers([...userAnswers, { ...questions[current], selected: "Not Answered" }]);
    }

    setSelected(null);

    if (current + 1 < questions.length) {
      setCurrent(current + 1);
    } else {
      setShowScore(true);
    }
  };

  const resetQuiz = () => {
    setQuestions(shuffleArray(allQuestions));
    setCurrent(0);
    setScore(0);
    setSelected(null);
    setShowScore(false);
    setUserAnswers([]);
  };

  // Theme classes based on dark/light mode
  const themeClasses = {
    background: darkMode ? "bg-gray-900" : "bg-gray-50",
    text: darkMode ? "text-gray-200" : "text-gray-800",
    card: darkMode ? "bg-gray-800 border-gray-700 shadow-md" : "bg-white border-gray-200 shadow-sm",
    button: darkMode ? "bg-blue-500 hover:bg-blue-600 shadow-blue-900/30" : "bg-blue-600 hover:bg-blue-700 shadow-md",
    optionButton: darkMode 
      ? "bg-gray-700 hover:bg-gray-600 border-gray-600" 
      : "bg-gray-100 hover:bg-blue-100 border-gray-300",
    selectedOption: darkMode ? "bg-blue-500 text-white" : "bg-blue-600 text-white",
    gradient: darkMode 
      ? "bg-gradient-to-br from-gray-800 to-blue-900" 
      : "bg-gradient-to-br from-blue-100 to-purple-200",
    resultCard: darkMode 
      ? "bg-gray-700 border-gray-600" 
      : "bg-gray-50 border-gray-200",
    correct: darkMode ? "text-green-400" : "text-green-600",
    incorrect: darkMode ? "text-red-400" : "text-red-500",
    muted: darkMode ? "text-gray-400" : "text-gray-500",
  };

  return (
    <div className={`min-h-screen ${themeClasses.gradient} transition-colors duration-300 flex items-center justify-center p-4`}>
      <BubblesBackground darkMode={darkMode} />
      
      {/* Theme Toggle */}
      <motion.button
        className={`fixed top-4 right-4 p-3 rounded-full ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
        onClick={toggleDarkMode}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {darkMode ? 
          <FiSun className="text-yellow-400" size={20} /> : 
          <FiMoon className="text-blue-500" size={20} />
        }
      </motion.button>

      <motion.div 
        className={`${themeClasses.card} p-6 rounded-2xl border max-w-xl w-full relative`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {showScore ? (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-center mb-4">
                <FiAward size={36} className={`${darkMode ? "text-blue-400" : "text-blue-500"} mr-2`} />
                <h2 className={`text-2xl font-bold ${themeClasses.text}`}>Quiz Completed 🎉</h2>
              </div>
              
              <div className="text-center mb-6">
                <p className={`text-lg ${themeClasses.text}`}>
                  Your Score: <span className="font-bold">{score}</span> / {questions.length}
                </p>
                <div className="w-full bg-gray-300 rounded-full h-2.5 mt-3 dark:bg-gray-700">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full dark:bg-blue-500"
                    style={{ width: `${(score / questions.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
                {userAnswers.map((item, idx) => (
                  <motion.div 
                    key={idx} 
                    className={`p-4 rounded-lg border ${themeClasses.resultCard}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * idx }}
                  >
                    <div className="flex items-start">
                      <div className="mr-2 mt-1">
                        <FiBox className={themeClasses.muted} />
                      </div>
                      <div className="flex-1">
                        <p className={`font-semibold ${themeClasses.text}`}>{idx + 1}. {item.question}</p>
                        <p className={`text-sm mt-2 ${themeClasses.text}`}>
                          Your Answer: <span className={`font-bold ${item.selected === item.answer ? themeClasses.correct : themeClasses.incorrect}`}>
                            {item.selected}
                          </span>
                        </p>
                        {item.selected !== item.answer && (
                          <p className={`text-sm ${themeClasses.muted}`}>
                            Correct Answer: <span className="font-semibold">{item.answer}</span>
                          </p>
                        )}
                        <p className={`text-xs italic mt-1 ${themeClasses.muted}`}>Category: {item.category}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.button
                onClick={resetQuiz}
                className={`w-full ${themeClasses.button} text-white py-3 rounded-2xl mt-6 shadow-lg flex items-center justify-center`}
                whileHover={{ scale: 1.02, shadow: "0px 5px 15px rgba(0, 0, 0, 0.2)" }}
                whileTap={{ scale: 0.95 }}
              >
                <FiRefreshCw className="mr-2" />
                Take Quiz Again
              </motion.button>
            </motion.div>
          </>
        ) : (
          <>
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-4">
                <span className={`text-sm font-medium px-3 py-1 rounded-full ${darkMode ? "bg-blue-900/30 text-blue-400" : "bg-blue-100 text-blue-700"}`}>
                  {questions[current].category}
                </span>
                <span className={`text-sm ${themeClasses.muted}`}>
                  {current + 1} of {questions.length}
                </span>
              </div>
              
              <h2 className={`text-xl font-semibold mb-6 ${themeClasses.text}`}>
                {questions[current].question}
              </h2>
              
              <div className="space-y-3 mb-6">
                {questions[current].options.map((option, i) => (
                  <motion.button
                    key={i}
                    onClick={() => setSelected(option)}
                    className={`block w-full px-4 py-3 rounded-xl border text-left
                      ${selected === option ? themeClasses.selectedOption : themeClasses.optionButton} 
                      ${themeClasses.text}`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 border ${
                        selected === option ? 
                          "bg-white border-white" : 
                          darkMode ? "border-gray-500" : "border-gray-400"
                      }`}>
                        {selected === option && (
                          <FiCheck className={darkMode ? "text-blue-500" : "text-blue-600"} size={14} />
                        )}
                      </div>
                      {option}
                    </div>
                  </motion.button>
                ))}
              </div>
              
              <motion.button
                onClick={handleNext}
                className={`w-full ${themeClasses.button} text-white py-3 rounded-2xl shadow-lg flex items-center justify-center`}
                whileHover={{ scale: 1.05, shadow: "0px 5px 15px rgba(0, 0, 0, 0.2)" }}
                whileTap={{ scale: 0.95 }}
                disabled={selected === null}
              >
                {current + 1 === questions.length ? "Finish Quiz" : "Next Question"}
                <FiChevronRight className="ml-2" />
              </motion.button>
            </motion.div>
          </>
        )}
      </motion.div>
    </div>
  );
}