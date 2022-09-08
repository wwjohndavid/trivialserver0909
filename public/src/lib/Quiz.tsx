import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import Core from './Core';
import defaultLocale from './Locale';
import './styles.css';

interface Question {
  
  type: string;
  difficulty: string;
  category: string;
  question: string;
  answers: Array<string>;
  correctAnswer: string;
  point:number;
  func1: Function ;
}

interface Props {
  quiz: MemberQuiz;
  disableSynopsis:boolean;
  shuffle:boolean;
  revealAnswerOnSubmit:boolean;
  allowNavigation:boolean;
  onComplete:Function;
  onQuestionSubmit:Function; 
  continueTillCorrect:boolean;
  customResultPage:Function;
  showInstantFeedback:boolean;
  showDefaultResult:boolean;
}

interface MemberQuiz{
  quizTitle: string;
  quizSynopsis: string;
  nrOfQuestions: number;
  questions: Array<Question>;
  
}


export const Quiz : React.FC<Props> = (props)=>
// quiz, shuffle, showDefaultResult, onComplete, customResultPage,
//   showInstantFeedback, continueTillCorrect, revealAnswerOnSubmit,
//   allowNavigation, onQuestionSubmit, disableSynopsis
{
    const [start, setStart] = useState(false);
    const [questions, setQuestions] = useState(props.quiz.questions);
    const nrOfQuestions = 10;
  
    const shuffleQuestions = useCallback((q) => {
      for (let i = q.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [q[i], q[j]] = [q[j], q[i]];
      }
      q.length = nrOfQuestions;
      return q;
    }, []);
  
    useEffect(() => {
      if (props.disableSynopsis) setStart(true);
    }, []);
  
    useEffect(() => {
      if (props.shuffle) {
        setQuestions(shuffleQuestions(props.quiz));
      } else {
        props.quiz.questions.length = nrOfQuestions;
        setQuestions(props.quiz.questions);
      }
  
      setQuestions(questions.map((question, index) => ({
        ...question,
        questionIndex: index + 1,
      })));
    }, [start]);
  
    const validateQuiz = (q) => {
      if (!q) {
        console.error('Quiz object is required.');
        return false;
      }
  
      for (let i = 0; i < questions.length; i += 1) {
        const {
          question, type, answers, correctAnswer, category,
        } = questions[i];
        if (!question) {
          console.error("Field 'question' is required.");
          return false;
        }
  
        if (!type) {
          console.error("Field 'type' is required.");
          return false;
        }
        if (type !== 'boolean' && type !== 'photo') {
          console.error("The value of 'type' is either 'boolean' or 'photo'.");
          return false;
        }
  
        if (!answers) {
          console.error("Field 'answers' is required.");
          return false;
        }
        if (!Array.isArray(answers)) {
          console.error("Field 'answers' has to be an Array");
          return false;
        }
  
        if (!correctAnswer) {
          console.error("Field 'correctAnswer' is required.");
          return false;
        }
  
        // let selectType = answerSelectionType;
  
        // if (!answerSelectionType) {
        //   // Default single to avoid code breaking due to automatic version upgrade
        //   console.warn('Field answerSelectionType should be defined since v0.3.0. Use single by default.');
        //   selectType = answerSelectionType || 'single';
        // }
  
        // if (selectType === 'single' && !(typeof selectType === 'string' || selectType instanceof String)) {
        //   console.error('answerSelectionType is single but expecting String in the field correctAnswer');
        //   return false;
        // }
  
        // if (selectType === 'multiple' && !Array.isArray(correctAnswer)) {
        //   console.error('answerSelectionType is multiple but expecting Array in the field correctAnswer');
        //   return false;
        // }
      }
  
      return true;
    };
  
    // if (!validateQuiz(quiz)) {
    //   return (null);
    // }
  
    const appLocale = {
      ...defaultLocale,
      // ...quiz.appLocale,
    };
  
    return (
      <div className="react-quiz-container">
        {!start
            && (
          <div>
            <h2>{props.quiz.quizTitle}</h2>
            <div>{appLocale.landingHeaderText.replace('<questionLength>', '10')}</div>
            {props.quiz.quizSynopsis
              && (
              <div className="quiz-synopsis">
                {props.quiz.quizSynopsis}
              </div>
              )}
            <div className="startQuizWrapper">
              <button onClick={() => setStart(true)} className="startQuizBtn btn">{appLocale.startQuizBtn}</button>
            </div>
          </div>
        )} 
            
        {start && (
          <Core
            questions={questions}
            showDefaultResult={props.showDefaultResult}
            onComplete={props.onComplete}
            customResultPage={props.customResultPage}
            showInstantFeedback={props.showInstantFeedback}
            continueTillCorrect={props.continueTillCorrect}
            revealAnswerOnSubmit={props.revealAnswerOnSubmit}
            allowNavigation={props.allowNavigation}
            appLocale={appLocale}
            onQuestionSubmit={props.onQuestionSubmit}
          />
        )}
      </div>
    );
  // return <h2>Hello component !</h2>;
};

export default Quiz;
