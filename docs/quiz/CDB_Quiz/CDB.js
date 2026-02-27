import { Quiz } from '../quiz_common.js';

const quizData = [
    {
      "question": "Tang Soo Do",
      "a": "The art we are studying",
      "b": "Our martial art",
      "c": "Korean karate",
      "correct": "the art we are studying"
    },
    {
      "question": "Kwan Chang Nim",
      "a": "Chief Instructor",
      "b": "Grandmaster",
      "c": "Examiner",
      "correct": "grandmaster"
    },
    {
      "question": "Sah Bum Nim",
      "a": "Instructor",
      "b": "Leader",
      "c": "Teacher",
      "correct": "instructor"
    },
    {
      "question": "Dan",
      "a": "Instructor",
      "b": "Highest Grade in Class",
      "c": "Black Belt",
      "correct": "black belt"
    },
    {
      "question": "Gup",
      "a": "Colour Belt",
      "b": "Student",
      "c": "Lower Grade",
      "correct": "colour belt"
    },
    {
      "question": "Dojang",
      "a": "Club",
      "b": "Training Hall or Studio",
      "c": "Uniform",
      "correct": "training hall or studio"
    },
    {
      "question": "Do Bohk",
      "a": "Training Hall or Studio",
      "b": "Way of Life",
      "c": "Uniform",
      "correct": "uniform"
    },
    {
      "question": "Dee",
      "a": "Belt",
      "b": "Back",
      "c": "Uniform",
      "correct": "belt"
    },
    {
      "question": "Sun Bae",
      "a": "Gup Member",
      "b": "Junior Member",
      "c": "Senior Member",
      "correct": "senior member"
    },
    {
      "question": "Sae Kye Tang Soo Do Hyup Hoi",
      "a": "World Tang So Do Flag",
      "b": "World Tang Soo Do Assoc",
      "c": "Basic Form",
      "correct": "world tang soo do assoc"
    }
  ];

let quiz = new Quiz(document,'Cho Dan Bo Terminology Quiz', quizData);