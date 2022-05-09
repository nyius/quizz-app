# Quizz App

## Made by Joseph Scicluna

## View live on https://quizz-app-phi.vercel.app/

-   A simple quizz creation app.
-   Made with React, Tailwind, & Firebase.
-   Fully mobile responsive.

### -----

-   Allows visitors to browse newest quizzes and test their knowledge invarious subjects. Take a quiz, and see how well you did at the end!
-   Also lets users create an account, sign in, and create the own quizzes that they can share with friends and families.
-   When creating a quiz, users can set a name, questions for the quiz, as many answers as they want for each question, and then a correct answer for each question.
-   When viewing your profile, you're able to edit your existing quizzes, as well as delete them if you no longer need them.

### -----

-   I've completed this project enough for now, but may return to tidy it up in the future.
-   Some additions may include the ability to see users names that completed your quiz, as well as their individual scores
-   The ability to search quizzes by name
-   Categories for quizzes

### -----

-   Currently there are a few bugs that can break the app
-   (one such bug exists when you select a quiz option (say opt #1), submit your answer, and go to the next question.
    On the next question, you will automatically have a selected option radial input on the same opt# as the previous question. If you don't change this auto selected option and go to the next question, when you get to the end of the quiz, the app crashes on loading results page.
    I believe this is due in part to that automatically selected option and how react handles rendering inputs, and when hiding one question and displaying the next )
