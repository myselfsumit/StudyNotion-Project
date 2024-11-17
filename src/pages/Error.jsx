import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Error = () => {
  const navigate = useNavigate();

  // Game states
  const [num1, setNum1] = useState(generateRandomNumber());
  const [num2, setNum2] = useState(generateRandomNumber());
  const [operator, setOperator] = useState(generateRandomOperator());
  const [userAnswer, setUserAnswer] = useState("");
  const [message, setMessage] = useState("");

  // Generate a random number
  function generateRandomNumber() {
    return Math.floor(Math.random() * 10) + 1;
  }

  // Generate a random operator (+, -, *)
  function generateRandomOperator() {
    const operators = ["+", "-", "*"];
    return operators[Math.floor(Math.random() * operators.length)];
  }

  // Calculate the correct answer
  function calculateAnswer() {
    switch (operator) {
      case "+":
        return num1 + num2;
      case "-":
        return num1 - num2;
      case "*":
        return num1 * num2;
      default:
        return 0;
    }
  }

  // Handle answer submission
  const handleSubmit = () => {
    const correctAnswer = calculateAnswer();
    if (parseInt(userAnswer) === correctAnswer) {
      setMessage("🎉 Correct! Well done!");
      generateNewQuestion();
    } else {
      setMessage("❌ Oops! Try again.");
    }
    setUserAnswer(""); // Reset input field
  };

  // Generate a new question
  const generateNewQuestion = () => {
    setNum1(generateRandomNumber());
    setNum2(generateRandomNumber());
    setOperator(generateRandomOperator());
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-richblack-900 to-richblack-800 text-richblack-50">
      {/* Error Text */}
      <div className="text-center space-y-4 mb-8">
        <h1 className="text-9xl font-bold animate-bounce">404</h1>
        <p className="text-xl font-medium">
          Oops! The page you’re looking for doesn’t exist.
        </p>
        <p className="text-richblack-300">
          While you're here, test your math skills!
        </p>
      </div>

      {/* Math Game Container */}
      <div className="bg-richblack-700 p-8 rounded-lg shadow-lg text-center w-[400px]">
        <h2 className="text-lg font-semibold mb-4">Solve This Problem:</h2>
        <p className="text-3xl font-bold mb-6">
          {num1} {operator} {num2} = ?
        </p>

        <input
          type="number"
          className="w-full p-3 text-lg text-richblack-900 rounded-md mb-4 outline-none focus:ring-2 focus:ring-yellow-100"
          placeholder="Enter your answer"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          className="w-full py-2 bg-yellow-100 text-richblack-900 font-semibold rounded-md hover:bg-yellow-50 transition-all duration-300"
        >
          Submit Answer
        </button>

        {/* Feedback Message */}
        {message && (
          <p
            className={`mt-4 font-medium ${
              message.includes("Correct")
                ? "text-green-400"
                : "text-red-400"
            }`}
          >
            {message}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex gap-4">
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 text-sm font-semibold text-richblack-900 bg-yellow-100 rounded-md hover:bg-yellow-50 transition-all duration-300"
        >
          Go to Homepage
        </button>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-3 text-sm font-semibold border border-richblack-700 text-richblack-300 rounded-md hover:text-richblack-50 hover:border-richblack-50 transition-all duration-300"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default Error;
