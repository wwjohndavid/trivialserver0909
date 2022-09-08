# react-quiz-component

:orange_book: React Quiz Component
[![NPM version](https://img.shields.io/npm/v/react-quiz-component.svg)](https://www.npmjs.com/package/react-quiz-component) [![License](https://img.shields.io/npm/l/react-quiz-component.svg)](https://github.com/wingkwong/react-quiz-component/blob/master/LICENSE) [![Total NPM Download](https://img.shields.io/npm/dt/react-quiz-component.svg)](https://www.npmjs.com/package/react-quiz-component)

react-quiz-component is a ReactJS component allowing users to attempt a quiz.

## Features

- API input
- Quiz landing page showing title, synopsis and number of questions
- Scoring System

## Installing

```
npm i react-quiz-component
```

## Importing react-quiz-component

```
import Quiz from 'react-quiz-component';
```

## Defining Your Quiz Source

The quiz source is a JSON object. You can use [react-quiz-form](https://github.com/wingkwong/react-quiz-form/) to generate it.

```javascript

```

## Passing to Quiz container

```javascript
 import { quiz } from './quiz';
 ...
 <Quiz quiz={quiz}/>
```

## Shuffling question set

```javascript
 import { quiz } from './quiz';
 ...
 <Quiz quiz={quiz} shuffle={true}/>
```

## Disabling Default Result Page

```javascript
 import { quiz } from './quiz';
 ...
 <Quiz quiz={quiz} showDefaultResult={false}/>
```

## Enabling Custom Result Page

- In order to enable custom result page, showDefaultResult has to be false.

```javascript
 import { quiz } from './quiz';
 ...
  const renderCustomResultPage = (obj) => {
    console.log(obj);
    return (
      <div>
        This is a custom result page. You can use obj to render your custom result page
      </div>
    )
  }
 ...
  <Quiz quiz={quiz} showDefaultResult={false} customResultPage={renderCustomResultPage}/>
```

## Enabling onComplete Action

```javascript
 import { quiz } from './quiz';
 ...
  const setQuizResult = (obj) => {
    console.log(obj);
    // YOUR LOGIC GOES HERE
  }
 ...
  <Quiz quiz={quiz} showDefaultResult={false} onComplete={setQuizResult}/>
```

## Showing Instant Feedback

```javascript
 import { quiz } from './quiz';
 ...
  <Quiz quiz={quiz} showInstantFeedback={true}/>
```

## Answering the same question till it is correct

```javascript
 import { quiz } from './quiz';
 ...
  <Quiz quiz={quiz} continueTillCorrect={true}/>
```

## Contribution

- Clone the repository
- Run `npm install`
- Run `npm run dev`
- Run `npm run lint`
- Make a PR to `develop` and describe the changes

## Demo

The demo is available at https://triviaproject0908.herokuapp.com/

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
