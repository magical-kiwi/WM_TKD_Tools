import { GupQuiz } from '../gup_quiz.js';

const quizData = [
    { question: "Tang Soo Do",                  a:"The art we study",     b:"Grandmaster",                   c:"Association flag",        correct:"a"}, // 1
    { question: "Kwan Chang Nim",               a:"Grandmaster",          b:"National flag",                 c:"Attention",               correct:"a"}, // 2
    { question: "Sah Bum Nim",                  a:"Bow to instructor",    b:"Association flag",              c:"Instructor or teacher",   correct:"c"}, // 3
    { question: "Dan",                          a:"Black belt",           b:"Return",                        c:"Turn",                    correct:"a"}, // 4
    { question: "Gup",                          a:"Grandmaster",          b:"Black belt",                    c:"Colour belt",             correct:"c"}, // 5
    { question: "Dojang",                       a:"Salute to flag",       b:"Training hall or studio",       c:"Testing (Gup and Dan)",   correct:"b"}, // 6
    { question: "Do Bohk",                      a:"Belt",                 b:"Uniform/Suit",                  c:"Sit",                     correct:"b"}, // 7
    { question: "Dee",                          a:"Uniform/suit",         b:"Belt",                          c:"Training hall or studio", correct:"b"}, // 8
    { question: "Hyung",                        a:"Form/Pattern",         b:"Breaking",                      c:"Hand techniques",         correct:"a"}, // 9
    { question: "Il Soo Sik Dae Ryun",          a:"1 step sparring",      b:"Form/Pattern",                  c:"Integrity",               correct:"a"}, // 10
];

let quiz = new GupQuiz(document,'Green Belt Terminology Quiz', quizData);