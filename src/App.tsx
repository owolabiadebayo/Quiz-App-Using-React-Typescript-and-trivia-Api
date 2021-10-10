import React, { useState } from 'react';
import { fetchQuizQuestions } from './API';

import QuestionCard from './components/QuestionCard';
// Types
import { QuestionState, Difficulty } from './API';
//style
import { GlobalStyle, Wrapper } from './App.styles';

const TOTAL_QUESTION = 10;
console.log(fetchQuizQuestions(TOTAL_QUESTION, Difficulty.EASY));

export type AnswerObject = {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string;
}

const App = () => {

  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionState[]>([])
  const [number, setNumber] = useState(0);
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(true)



  const startTrivia = async () => {
    setLoading(true);
    setGameOver(false);

    const newQuestions = await fetchQuizQuestions(
      TOTAL_QUESTION,
      Difficulty.EASY
    );
    setQuestions(newQuestions);
    setScore(0)
    setUserAnswers([]);
    setNumber(0);
    setLoading(false);
  };
  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!gameOver) {
      // Users answer
      const answer = e.currentTarget.value;
      // check answer against correct answer
      const correct = questions[number].correct_answer === answer;
      // add score if answer is correct
      if (correct) setScore(prev => prev + 1);
      //save answer in the array
      const answerObject = {
        question: questions[number].question,
        answer,
        correct,
        correctAnswer: questions[number].correct_answer
      }
      setUserAnswers((prev) => [...prev, answerObject])
    }
  };

  const nextQuestion = () => {
    //Move on to the next question if not the last question
    const nextQuestion = number + 1;

    if (nextQuestion === TOTAL_QUESTION) {
      setGameOver(true);
    } else {
      setNumber(nextQuestion)
    }

  };

  return (
    <>
      <GlobalStyle />
      <Wrapper>
        <h1>REACT QUIZ</h1>
        {gameOver || userAnswers.length === TOTAL_QUESTION ? (<button className="start" onClick={startTrivia}>
          Start
        </button>) : null}

        {!gameOver ? <p className="score">Score:{score}</p> : null}
        {loading && <p>Loading Questions....</p>}
        {!loading && !gameOver && (
          <QuestionCard
            questionNr={number + 1} totalQuestions={TOTAL_QUESTION}
            question={questions[number].question}
            answers={questions[number].answers}
            userAnswer={userAnswers ? userAnswers[number] : undefined}
            callback={checkAnswer}
          />
        )}
        {!gameOver && !loading && userAnswers.length === number + 1 && number !== TOTAL_QUESTION - 1 ? (<button className="start" style={{
          cursor: "pointer", borderRadius: "10px",
          height: "40px",
          margin: "20px 0",
          padding: "0 40px",
          border: "2px solid #d38558",
          boxShadow: "0px 5px 10px rgba(0,0,0,0.25)", background: "linear-gradient(180deg, #fff, #ffcc91)"
        }} onClick={nextQuestion}>
          Next Question
        </button>) : null}
      </Wrapper>
    </>
  );
}

export default App;
