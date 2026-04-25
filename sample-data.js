// Sample data for the tutorial platform
// Run this in Firebase Console > Firestore Database > Add document

const sampleTutorials = [
  {
    title: "Getting Started with React",
    description: "Learn the fundamentals of React development including components, props, state, and hooks.",
    content: `# Getting Started with React

React is a popular JavaScript library for building user interfaces. This tutorial will guide you through the basics.

## What is React?

React is a declarative, efficient, and flexible JavaScript library for building user interfaces. It lets you compose complex UIs from small and isolated pieces of code called "components."

## Installation

\`\`\`bash
npm create vite@latest my-react-app --template react
cd my-react-app
npm install
npm run dev
\`\`\`

## Your First Component

\`\`\`jsx
function Welcome(props) {
  return <h1>Hello, {props.name}!</h1>;
}

function App() {
  return (
    <div>
      <Welcome name="World" />
    </div>
  );
}
\`\`\`

## Next Steps

- Learn about [JSX](https://reactjs.org/docs/introducing-jsx.html)
- Understand [components and props](https://reactjs.org/docs/components-and-props.html)
- Explore [state and lifecycle](https://reactjs.org/docs/state-and-lifecycle.html)
`,
    category: "React",
    readTime: 15,
    isPremium: false,
    authorName: "Tutorial Platform Team",
    createdAt: new Date(),
    updatedAt: new Date(),
    thumbnail: "", // Add a thumbnail URL if available
    videoUrl: "", // Add a YouTube embed URL if available
    sections: []
  },
  {
    title: "JavaScript ES6+ Features",
    description: "Master modern JavaScript features including arrow functions, destructuring, promises, and async/await.",
    content: `# JavaScript ES6+ Features

ES6 (ECMAScript 2015) and later versions introduced many powerful features to JavaScript. Let's explore the most important ones.

## Arrow Functions

Arrow functions provide a concise syntax for writing function expressions.

\`\`\`javascript
// Traditional function
function add(a, b) {
  return a + b;
}

// Arrow function
const add = (a, b) => a + b;

// Arrow function with body
const multiply = (a, b) => {
  const result = a * b;
  return result;
};
\`\`\`

## Destructuring

Destructuring allows you to unpack values from arrays or properties from objects into distinct variables.

\`\`\`javascript
// Array destructuring
const [first, second] = [1, 2, 3];
console.log(first); // 1
console.log(second); // 2

// Object destructuring
const { name, age } = { name: 'John', age: 30 };
console.log(name); // 'John'
console.log(age); // 30
\`\`\`

## Promises and Async/Await

Promises represent the eventual completion (or failure) of an asynchronous operation.

\`\`\`javascript
// Promise
const fetchData = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('Data fetched!');
    }, 1000);
  });
};

// Async/Await
const getData = async () => {
  try {
    const result = await fetchData();
    console.log(result);
  } catch (error) {
    console.error(error);
  }
};
\`\`\`

## Template Literals

Template literals provide an easy way to interpolate variables and expressions into strings.

\`\`\`javascript
const name = 'World';
const greeting = \`Hello, \${name}!\`;

const multiline = \`
  This is a
  multiline string
\`;
\`\`\`

## Modules

ES6 modules allow you to export and import code between files.

\`\`\`javascript
// math.js
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;

// main.js
import { add, subtract } from './math.js';
console.log(add(5, 3)); // 8
\`\`\`
`,
    category: "JavaScript",
    readTime: 20,
    isPremium: false,
    authorName: "Tutorial Platform Team",
    createdAt: new Date(),
    updatedAt: new Date(),
    thumbnail: "",
    videoUrl: "",
    sections: []
  },
  {
    title: "CSS Grid Layout Complete Guide",
    description: "Learn CSS Grid layout system for creating complex, responsive web layouts with ease.",
    content: `# CSS Grid Layout Complete Guide

CSS Grid Layout is a two-dimensional layout method for the web. It lets you lay content out in rows and columns.

## Grid Container

To create a grid container, set the display property to grid or inline-grid.

\`\`\`css
.container {
  display: grid;
}
\`\`\`

## Grid Tracks

Define rows and columns using grid-template-rows and grid-template-columns.

\`\`\`css
.container {
  display: grid;
  grid-template-columns: 100px 200px 100px;
  grid-template-rows: 50px 100px;
}
\`\`\`

## Grid Gap

Add space between grid items using grid-gap, grid-row-gap, or grid-column-gap.

\`\`\`css
.container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 20px;
}
\`\`\`

## Positioning Grid Items

Use grid-column and grid-row to position items on the grid.

\`\`\`css
.item {
  grid-column: 1 / 3; /* Start at column 1, end at column 3 */
  grid-row: 2 / 4; /* Start at row 2, end at row 4 */
}
\`\`\`

## Grid Areas

Name sections of your grid and place items using grid-template-areas.

\`\`\`css
.container {
  display: grid;
  grid-template-columns: 1fr 3fr 1fr;
  grid-template-rows: auto;
  grid-template-areas: "header header header"
                       "sidebar main aside"
                       "footer footer footer";
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.aside { grid-area: aside; }
.footer { grid-area: footer; }
\`\`\`

## Responsive Grids

Use media queries and grid properties to create responsive layouts.

\`\`\`css
.container {
  display: grid;
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .container {
    grid-template-columns: 200px 1fr;
  }
}

@media (min-width: 1024px) {
  .container {
    grid-template-columns: 200px 1fr 200px;
  }
}
\`\`\`

## Grid Auto-Flow

Control how items are placed automatically with grid-auto-flow.

\`\`\`css
.container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-auto-flow: row; /* Items flow row by row (default) */
  /* grid-auto-flow: column; Items flow column by column */
}
\`\`\`
`,
    category: "CSS",
    readTime: 25,
    isPremium: false,
    authorName: "Tutorial Platform Team",
    createdAt: new Date(),
    updatedAt: new Date(),
    thumbnail: "",
    videoUrl: "",
    sections: []
  }
];

// To add these to your Firestore database:
// 1. Go to Firebase Console > Firestore Database
// 2. Click "Add document" for each tutorial
// 3. Use "tutorials" as the collection ID
// 4. Copy the data from each object above

export default sampleTutorials;