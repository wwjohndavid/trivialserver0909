import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { HelloComponent } from './hello';

import { useState, useEffect } from 'react';
import { render } from 'react-dom';
import {Quiz} from './lib/Quiz';

function App () {
  const [quizResult, setQuizResult] = useState();
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [quiz, setQuiz] = useState(null);

  useEffect(() => {
    fetch('https://opentdb.com/api.php?amount=10&difficulty=hard&type=boolean')
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);

          const questions = [];

            result.results.forEach((item) => {
              questions.push({
                type: 'boolean',
                difficulty: 'hard',
                category: item.category,
                question: item.question,
                // answerSelectionType: 'single',
                answers: [
                  'True',
                  'False',
                ],
                correctAnswer: item.correct_answer == 'False' ? '2' : '1',
                // messageForCorrectAnswer: 'Correct answer. Good job.',
                // messageForIncorrectAnswer: 'Incorrect answer. Please try again.',
                // explanation: 'React is not MVC framework',
                point: '1',
              });
            });
            console.log(questions);
          setQuiz({
            quizTitle: 'React Quiz Component Demo',
            quizSynopsis: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim',
            nrOfQuestions: '10',
            questions,
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          setIsLoaded(true);
          setError(error);
        },
      );
  }, []);

  if (error) {
    return (
      <div>
        Error:
        {error.message}
      </div>
    );
  } if (!isLoaded || quiz == null) {
    return <div>Loading...</div>;
  }
  return (
    <div>
    
      {
        // <HelloComponent/>

        <Quiz
          quiz={quiz }
          shuffle={true}
            showInstantFeedback = {false}
            continueTillCorrect = {false}
          onComplete={setQuizResult}
          onQuestionSubmit={(obj) => console.log('user question results:', obj)}
          disableSynopsis={true}
          revealAnswerOnSubmit={true}
          allowNavigation={true}
          customResultPage={null}
          showDefaultResult={false}
        /> 
      }
    
     </div>

  );
};



ReactDOM.render(
  <App/>,
  document.getElementById('root')
);
