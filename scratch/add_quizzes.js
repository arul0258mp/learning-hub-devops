const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../frontend/data/courses.js');
let content = fs.readFileSync(filePath, 'utf8');

const defaultQuiz = `,
          quiz: [
            {
              question: "What is the key concept to remember from this topic?",
              options: ["Review the material", "Practice consistently", "All of the above", "None of the above"],
              answer: 2
            },
            {
              question: "How can you apply this knowledge effectively?",
              options: ["By ignoring it", "By building projects", "By memorizing only", "By taking breaks"],
              answer: 1
            },
            {
              question: "Which of the following best describes the core principle discussed?",
              options: ["It depends on the context", "It is a rigid rule", "It is a flexible guideline", "It is rarely used"],
              answer: 0
            }
          ]`;

// We use regex to match the suggestedQuestions array and append the quiz
const pattern = /(suggestedQuestions:\s*\[[\s\S]*?\])(?!\s*,\s*quiz:)/g;

content = content.replace(pattern, '$1' + defaultQuiz);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Quizzes injected successfully!');
