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
    { question: "Sun Bae",                      a:"Senior member",        b:"Instructor",                    c:"Uniform/suit",            correct:"a"}, // 9
    { question: "Sae Kye Tang Soo Do Hyup Hoi", a:"Association flag",     b:"World Tang Soo Do Association", c:"National flag",           correct:"b"}, // 10
    { question: "Shim Sa Kwan Nim",             a:"Examiner",             b:"Grandmaster",                   c:"Instructor",              correct:"a"}, // 11
    { question: "Shim Sa",                      a:"Integrity",            b:"Testing (Gup and Dan)",         c:"Self defence",            correct:"b"}, // 12
    { question: "Hu Bae",                       a:"Black belt",           b:"Junior member",                 c:"Examiner",                correct:"b"}, // 13
    { question: "Kukgi",                        a:"No retreat in battle", b:"Concentration",                 c:"National flag",           correct:"c"}, // 14
    { question: "Hyup Hoi Ki",                  a:"Sit",                  b:"Turn to the rear",              c:"Association flag",        correct:"c"}, // 15
    { question: "Choon Bee Woon Dong",          a:"Warm up exercise",     b:"High 2 hand X block",           c:"Foot techniques",         correct:"a"}, // 16
    { question: "Hyung",                        a:"Form/Pattern",         b:"Breaking",                      c:"Hand techniques",         correct:"a"}, // 17
    { question: "Il Soo Sik Dae Ryun",          a:"1 step sparring",      b:"Form/Pattern",                  c:"Integrity",               correct:"a"}, // 18
    { question: "Ja Yu Dae Ryun",               a:"Free sparring",        b:"Warm up exercise",              c:"Self Control",            correct:"a"}, // 19
    { question: "Ho Sin Sul",                   a:"Free sparring",        b:"Self defence",                  c:"Breaking",                correct:"b"}, // 20
    { question: "Kyuck Pa",                     a:"Punch",                b:"Kick",                          c:"Breaking",                correct:"c"}, // 21
    { question: "Ko Dan Ja",                    a:"Senior Dan holder",    b:"Self defence",                  c:"Association flag",        correct:"a"}, // 22
    { question: "Yu Dan Ja",                    a:"Sit",                  b:"Begin",                         c:"Dan holder",              correct:"c"}, // 23
    { question: "Yu Gup Ja",                    a:"Black belt holder",    b:"Gup holder",                    c:"master",                  correct:"b"}, // 24
    { question: "Cho Bo Ja",                    a:"Attention",            b:"Beginner",                      c:"Energy",                  correct:"b"}  // 25
];

let quiz = new GupQuiz(document,'Brown Belt Terminology Quiz', quizData);