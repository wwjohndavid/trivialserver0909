import {
  useState, useEffect, useCallback, Fragment,
} from 'react';
import * as React from 'react';
import QuizResultFilter from './core-components/QuizResultFilter';
import { checkAnswer, selectAnswer, rawMarkup } from './core-components/helpers';
import InstantFeedback from './core-components/InstantFeedback';
import Explanation from './core-components/Explanation';

interface Question {
  
  type: string;
  difficulty: string;
  category: string;
  question: string;
  answers: Array<string>;
  correctAnswer: string;
  point:number;
}

interface Props {
  questions: Array<Question>;
  showDefaultResult:boolean;
  onComplete:Function;
  customResultPage:Function;
  showInstantFeedback:boolean;
  continueTillCorrect:boolean;
  revealAnswerOnSubmit:boolean;
  allowNavigation:boolean;
  appLocale:any;
  onQuestionSubmit:Function;
  
}

export const Core : React.FC<Props> = (props)=>{
  // questions, appLocale, showDefaultResult, onComplete, customResultPage,
  // showInstantFeedback, continueTillCorrect, revealAnswerOnSubmit, allowNavigation,
  // onQuestionSubmit,
  const [incorrectAnswer, setIncorrectAnswer] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState(false);
  const [showNextQuestionButton, setShowNextQuestionButton] = useState(false);
  const [endQuiz, setEndQuiz] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [buttons, setButtons] = useState({});
  const [correct, setCorrect] = useState([]);
  const [incorrect, setIncorrect] = useState([]);
  const [userInput, setUserInput] = useState([]);
  const [filteredValue, setFilteredValue] = useState('all');
  const [userAttempt, setUserAttempt] = useState(1);
  const [showDefaultResultState, setShowDefaultResult] = useState(true);
  const [answerSelectionTypeState, setAnswerSelectionType] = useState(undefined);

  const [totalPoints, setTotalPoints] = useState(0);
  const [correctPoints, setCorrectPoints] = useState(0);
  const [question, setQuestion] = useState(props.questions[currentQuestionIndex]);
  const [questionSummary, setQuestionSummary] = useState(undefined);

  const [beginQuiz, setBeginQuiz] = useState(false);

  useEffect(() => {
    setShowDefaultResult(props.showDefaultResult !== undefined ? props.showDefaultResult : true);
  }, [props.showDefaultResult]);

  useEffect(() => {
    setQuestion(props.questions[currentQuestionIndex]);
  }, [currentQuestionIndex]);

  useEffect(() => {
    
    // const { answerSelectionType } = question;
    // Default single to avoid code breaking due to automatic version upgrade
    // setAnswerSelectionType(answerSelectionType || 'single');
    setAnswerSelectionType('single');
  }, [question, currentQuestionIndex]);

  useEffect(() => {
    if (endQuiz) {
      let totalPointsTemp = 0;
      let correctPointsTemp = 0;
      for (let i = 0; i < props.questions.length; i += 1) {
        let point = props.questions[i].point || 0;
        if (typeof point === 'string' ) {
          // point = parseInt(point);
          point = 1;
        }

        totalPointsTemp += point;

        if (correct.includes(i)) {
          correctPointsTemp += point;
        }
      }
      setTotalPoints(totalPointsTemp);
      setCorrectPoints(correctPointsTemp);
    }
  }, [endQuiz]);

  useEffect(() => {
    // setQuestionSummary({
    //   numberOfQuestions: props.questions.length,
    //   numberOfCorrectAnswers: correct.length,
    //   numberOfIncorrectAnswers: incorrect.length,
    //   props.questions,
    //   userInput,
    //   totalPoints,
    //   correctPoints,
    // });
  }, [totalPoints, correctPoints]);

  useEffect(() => {
    if (endQuiz && props.onComplete !== undefined && questionSummary !== undefined) {
      // onComplete(questionSummary);
    }
  }, [endQuiz, questionSummary]);
  const playAgain = () => {
    setEndQuiz(false);
    setUserInput([]);
    setCurrentQuestionIndex(0);
    setBeginQuiz(false);
  };
  const nextQuestion = (currentQuestionIdx) => {
    setIncorrectAnswer(false);
    setCorrectAnswer(false);
    setShowNextQuestionButton(false);
    setButtons({});
    if (currentQuestionIdx + 1 === props.questions.length) {
      if (userInput.length !== props.questions.length) {
        alert('Quiz is incomplete');
      } else if (props.allowNavigation) {
        const submitQuiz = confirm('You have finished all the questions. Submit Quiz now?');
        if (submitQuiz) {
          setEndQuiz(true);
        }
      } else {
        setEndQuiz(true);
      }
    } else {
      setCurrentQuestionIndex(currentQuestionIdx + 1);
    }
    window.scrollTo(0, 0);
  };

  const handleChange = (event) => {
    setFilteredValue(event.target.value);
  };

  const renderAnswerInResult = (question, userInputIndex) => {
    const { answers, correctAnswer, type } = question;
    let { answerSelectionType } = question;
    let answerBtnCorrectClassName;
    let answerBtnIncorrectClassName;

    // Default single to avoid code breaking due to automatic version upgrade
    answerSelectionType = answerSelectionType || 'single';

    return answers.map((answer, index) => {
      if (answerSelectionType === 'single') {
        // correctAnswer - is string
        answerBtnCorrectClassName = (`${index + 1}` === correctAnswer ? 'correct' : '');
        answerBtnIncorrectClassName = (`${userInputIndex}` !== correctAnswer && `${index + 1}` === `${userInputIndex}` ? 'incorrect' : '');
      } else {
        // correctAnswer - is array of numbers
        answerBtnCorrectClassName = (correctAnswer.includes(index + 1) ? 'correct' : '');
        answerBtnIncorrectClassName = (!correctAnswer.includes(index + 1) && userInputIndex.includes(index + 1) ? 'incorrect' : '');
      }

      return (
        <div key={index}>
          <button
            disabled
            className={`answerBtn btn ${answerBtnCorrectClassName}${answerBtnIncorrectClassName}`}
          >
            {type === 'boolean' && <span>{answer}</span>}
            {type === 'photo' && <img src={answer} alt="image" />}
          </button>
        </div>
      );
    });
  };

  const renderQuizResultQuestions = useCallback(() => {
    let filteredQuestions;
    let filteredUserInput;

    if (filteredValue !== 'all') {
      if (filteredValue === 'correct') {
        filteredQuestions = props.questions.filter((question, index) => correct.indexOf(index) !== -1);
        filteredUserInput = userInput.filter((input, index) => correct.indexOf(index) !== -1);
      } else {
        filteredQuestions = props.questions.filter((question, index) => incorrect.indexOf(index) !== -1);
        filteredUserInput = userInput.filter((input, index) => incorrect.indexOf(index) !== -1);
      }
    }

    return (filteredQuestions || props.questions).map((question, index) => {
      const userInputIndex = filteredUserInput ? filteredUserInput[index] : userInput[index];

      // Default single to avoid code breaking due to automatic version upgrade
      const answerSelectionType = question.answerSelectionType || 'single';

      return (
        <div className="result-answer-wrapper" key={index + 1}>
          <h3 dangerouslySetInnerHTML={rawMarkup(`Q${question.questionIndex}: ${question.question}`)} />
          {question.questionPic && <img src={question.questionPic} alt="image" />}
          {/* {renderTags(answerSelectionType, question.correctAnswer.length, question.segment)} */}
          <div className="result-answer">
            {renderAnswerInResult(question, userInputIndex)}
          </div>
          <Explanation question={question} isResultPage />
        </div>
      );
    });
  }, [endQuiz, filteredValue]);

  const renderAnswers = (question, buttons) => {
    const {
      answers, correctAnswer, type, questionIndex,
    } = question;
    let { answerSelectionType } = question;
    const onClickAnswer = (index) => checkAnswer(index + 1, correctAnswer, answerSelectionType, {
      userInput,
      userAttempt,
      currentQuestionIndex,
      // props.continueTillCorrect,
      showNextQuestionButton,
      incorrect,
      correct,
      setButtons,
      setCorrectAnswer,
      setIncorrectAnswer,
      setCorrect,
      setIncorrect,
      setShowNextQuestionButton,
      setUserInput,
      setUserAttempt,
    });

    const onSelectAnswer = (index) => selectAnswer(index + 1, correctAnswer, answerSelectionType, {
      userInput,
      currentQuestionIndex,
      setButtons,
      setShowNextQuestionButton,
      incorrect,
      correct,
      setCorrect,
      setIncorrect,
      setUserInput,
    });

    const checkSelectedAnswer = (index) => {
      if (userInput[questionIndex - 1] === undefined) {
        return false;
      }
      if (answerSelectionType === 'single') {
        return userInput[questionIndex - 1] === index;
      }
      return Array.isArray(userInput[questionIndex - 1]) && userInput[questionIndex - 1].includes(index);
    };

    // Default single to avoid code breaking due to automatic version upgrade
    answerSelectionType = answerSelectionType || 'single';

    return answers.map((answer, index) => (
      <Fragment key={index}>
        {(buttons[index] !== undefined)
          ? (
            <button
              type="button"
              disabled={buttons[index].disabled || false}
              className={`${buttons[index].className} answerBtn btn`}
              onClick={() => (props.revealAnswerOnSubmit ? onSelectAnswer(index) : onClickAnswer(index))}
            >
              {type === 'boolean' && <span>{answer}</span>}
              {/* {type === 'photo' && <img src={answer} alt="image" />} */}
            </button>
          )
          : (
            <button
              type="button"
              onClick={() => (props.revealAnswerOnSubmit ? onSelectAnswer(index) : onClickAnswer(index))}
              className={`answerBtn btn ${(props.allowNavigation && checkSelectedAnswer(index + 1)) ? 'selected' : null}`}
            >
              {type === 'boolean' && answer}
              {/* {type === 'photo' && <img src={answer} alt="image" />} */}
            </button>
          )}
      </Fragment>
    ));
  };

  // const renderTags = (answerSelectionType, numberOfSelection, segment) => {
  //   const {
  //     singleSelectionTagText,
  //     multipleSelectionTagText,
  //     pickNumberOfSelection,
  //   } = props.appLocale;

  //   return (
  //     <div className="tag-container">
  //       {answerSelectionType === 'single'
  //         && <span className="single selection-tag">{singleSelectionTagText}</span>}
  //       {answerSelectionType === 'multiple'
  //         && <span className="multiple selection-tag">{multipleSelectionTagText}</span>}
  //       <span className="number-of-selection">
  //         {pickNumberOfSelection.replace('<numberOfSelection>', numberOfSelection)}
  //       </span>
  //       {segment && <span className="selection-tag segment">{segment}</span>}
  //     </div>
  //   );
  // };

  const renderResult = () => (
    <div className="card-body">
      <h2>
        {props.appLocale.resultPageHeaderText
          .replace('<correctIndexLength>', correct.length)
          .replace('<questionLength>', props.questions.length)}
      </h2>
      {<h2 className="textCenter">
        {props.appLocale.resultPagePoint
          .replace('<correctPoints>', correctPoints)
          .replace('<totalPoints>', totalPoints)}
      </h2> }
      <br />
      {/* <QuizResultFilter
        filteredValue={filteredValue}
        handleChange={handleChange}
        // appLocale={props.appLocale}
      /> */}
      {renderQuizResultQuestions()}

      <button onClick={() => playAgain()} className="nextQuestionBtn btn" type="button">
        Play Again?
      </button>
    </div>
  );
  return (
    <div className="questionWrapper">

      {!beginQuiz && (
        <div className = "row">
          <div className = "col-md-3">
          <div style = {{marginTop:20}}>           
          </div>

          <h1>
            Welcome to the Trivia Challenge
          </h1>
          <div style = {{marginTop:150}}>           
          </div>
          <h2>
            You will be presented with 10 True or False question.
          </h2>
          <div style = {{marginTop:150}}>           
          </div>

          <h2>
            Can you score 100%?
          </h2>
          <button onClick={() => setBeginQuiz(true)} className="nextQuestionBtn btn" type="button">
            Begin
          </button>
          </div>
        </div>
      )}
      {beginQuiz && (
      <div>
        {!endQuiz
              && (
              <div className="questionWrapperBody">
                <h1>
                  {question.category}
                </h1>
                <div style = {{marginTop:150}}>           
              </div>
                <div className="questionModal">
                  <InstantFeedback
                    question={question}
                    showInstantFeedback={props.showInstantFeedback}
                    correctAnswer={correctAnswer}
                    incorrectAnswer={incorrectAnswer}
                    onQuestionSubmit={props.onQuestionSubmit}
                    userAnswer={[...userInput].pop()}
                  />
                </div>
            
                <div className="result-answer-wrapper">
                  <h3 dangerouslySetInnerHTML={rawMarkup(question && question.question)} />
                </div>
                <div style = {{marginTop:150}}>           
             </div>
                {/* {question && question.questionPic && <img src={question.questionPic} alt="image" />} */}
                {/* {question && renderTags(answerSelectionTypeState, question.correctAnswer.length, question.segment)} */}
                {question && renderAnswers(question, buttons)}
                {(showNextQuestionButton || props.allowNavigation)
                && (
                  
                <div className="questionBtnContainer">
                  {(props.allowNavigation && currentQuestionIndex > 0) && (
                    <button
                      onClick={() => nextQuestion(currentQuestionIndex - 2)}
                      className="prevQuestionBtn btn"
                      type="button"
                    >
                      PREV
                      {/* {props.appLocale.prevQuestionBtn} */}
                    </button>
                  )}
                  <button onClick={() => nextQuestion(currentQuestionIndex)} className="nextQuestionBtn btn" type="button">
                    {/* {props.appLocale.nextQuestionBtn} */}
                    NEXT
                  </button>
                </div>
                )}
              </div>
              )}
        {endQuiz && renderResult()}
        {/* {endQuiz && !showDefaultResultState && props.customResultPage !== undefined
                && props.customResultPage(questionSummary)} */}
      </div>
      )}
    </div>
  );
};

export default Core;
