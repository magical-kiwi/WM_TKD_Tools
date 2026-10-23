import { GupQuiz } from '../gup_quiz.js';

const quizData = [
    { question: "Kap Kwon",                   a:"Hand techniques",                          b:"Middle part",                                     c:"Back fist",                     correct:"c"}, // 1
    { question: "Jang Kwon",                  a:"High punch",                               b:"Side defence",                                    c:"Heel of Palm",                  correct:"c"}, // 2
    { question: "Soo Do",                     a:"Knife Hand",                               b:"Humility",                                        c:"Philtrum",                      correct:"a"}, // 3
    { question: "Yuk Soo Do",                 a:"Relax or rest",                            b:"Ridge hand",                                      c:"Thank you",                     correct:"b"}, // 4
    { question: "Kwan Soo",                   a:"Meditation",                               b:"National flag",                                   c:"Spear hand",                    correct:"c"}, // 5
    { question: "Soo Ki",                     a:"Axe Kick",                                 b:"Attack",                                          c:"Hand techniques",               correct:"c"}, // 6
    { question: "Jok Ki",                     a:"Kick",                                     b:"Foot techniques",                                 c:"Diagonal kick",                 correct:"b"}, // 7
    { question: "Cha Ki",                     a:"National flag",                            b:"Elbow",                                           c:"Kick",                          correct:"c"}, // 8
    { question: "Ha Dan",                     a:"Low part",                                 b:"High block",                                      c:"Low knife hand defence",        correct:"a"}, // 9
    { question: "Choong Dan",                 a:"Middle part",                              b:"Centre punch",                                    c:"Warm up exercise",              correct:"a"}, // 10
    { question: "Sang Dan",                   a:"High part",                                b:"Endurance",                                       c:"Low part",                      correct:"a"}, // 11
    { question: "Ahp",                        a:"Front",                                    b:"Arm",                                             c:"Sit",                           correct:"a"}, // 12
    { question: "Yup",                        a:"Hand",                                     b:"Back",                                            c:"Side",                          correct:"c"}, // 13
    { question: "Dwi",                        a:"Hi part",                                  b:"Wheel kick",                                      c:"Back",                          correct:"c"}, // 14
    { question: "Ha Dan Mahk Ki",             a:"In to out block",                          b:"Low defence",                                     c:"Side punch",                    correct:"b"}, // 15
    { question: "Choon Dan Kong Kyuck",       a:"Mid section punch",                        b:"High block, fighting stance",                     c:"Spear hand punch",              correct:"a"}, // 16
    { question: "Sang Dan Kong Kyuck",        a:"High block, fighting stance",              b:"High punch",                                      c:"High 2 hand X block",           correct:"b"}, // 17
    { question: "Sang Dan Mahk Ki",           a:"Fighting stance",                          b:"High defence",                                    c:"Low defence",                   correct:"b"}, // 18
    { question: "Ahneso Phakuro Mahk Ki",     a:"Punching exercise in Horse riding stance", b:"Side punch",                                      c:"In to out block",               correct:"c"}, // 19
    { question: "Phakeso Ahnuro Mahk Ki",     a:"Crescent kick (in to out)",                b:"Out to in block",                                 c:"Horse riding stance",           correct:"b"}, // 20
    { question: "Choon Dan Hang Jin",         a:"Side Punch",                               b:"Spear hand",                                      c:"Ready stance",                  correct:"a"}, // 21
    { question: "Chun Kul Ssang Soo Mahk Ki", a:"Front stretch kick",                       b:"2 hand block, front stance",                      c:"High knife hand block",         correct:"b"}, // 22
    { question: "Hu Kul Ssang Soo Mahk Ki",   a:"Round house kick",                         b:"Knife hand block reverse punch, fighting stance", c:"2 hand block, fighting stance", correct:"c"}, // 23
    { question: "Hu Kul Sang Dan Mahk Ki",    a:"Ready stance",                             b:"Side defense",                                    c:"High block, fighting stance",   correct:"c"}, // 24
    { question: "Ssang Soo Sang Dan Mahk Ki", a:"Without the count",                        b:"High 2 hand X block",                             c:"Concentration",                 correct:"b"}  // 25
];

let quiz = new GupQuiz(document,'Red Belt Terminology Quiz', quizData);