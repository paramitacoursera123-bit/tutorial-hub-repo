import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, Upload, Save } from 'lucide-react';

// Sample tutorials data (same as in Tutorials.jsx)
const initialSampleTutorials = [
  {
    id: '1',
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
    thumbnail: "",
    videoUrl: "",
    sections: []
  },
  {
    id: '2',
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
    thumbnail: "",
    videoUrl: "",
    sections: []
  },
  {
    id: '3',
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

## Grid Lines

You can place items on the grid using line numbers.

\`\`\`css
.item1 {
  grid-column-start: 1;
  grid-column-end: 3;
}

.item2 {
  grid-row-start: 2;
  grid-row-end: 4;
}
\`\`\`

## Grid Areas

Define named grid areas and place items using grid-area.

\`\`\`css
.container {
  display: grid;
  grid-template-areas:
    "header header header"
    "sidebar main main"
    "footer footer footer";
}

.header {
  grid-area: header;
}

.sidebar {
  grid-area: sidebar;
}

.main {
  grid-area: main;
}

.footer {
  grid-area: footer;
}
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
\`\`\`
`,
    category: "CSS",
    readTime: 25,
    isPremium: false,
    authorName: "Tutorial Platform Team",
    createdAt: new Date(),
    thumbnail: "",
    videoUrl: "",
    sections: []
  }
];

function AdminDashboard() {
  const navigate = useNavigate();
  const [tutorials, setTutorials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTutorial, setEditingTutorial] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    category: '',
    readTime: 5,
    isPremium: false,
    thumbnail: '',
    videoUrl: '',
    sections: []
  });
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchTutorials();
  }, []);

  const fetchTutorials = async () => {
    // Load from localStorage first, then fall back to sample data
    const storedTutorials = localStorage.getItem('adminTutorials');
    if (storedTutorials) {
      setTutorials(JSON.parse(storedTutorials));
    } else {
      setTutorials(initialSampleTutorials);
      localStorage.setItem('adminTutorials', JSON.stringify(initialSampleTutorials));
    }
    setLoading(false);
  };

  const saveTutorialsToStorage = (updatedTutorials) => {
    setTutorials(updatedTutorials);
    localStorage.setItem('adminTutorials', JSON.stringify(updatedTutorials));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setUploading(true);

      // Simulate thumbnail upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const tutorialData = {
        ...formData,
        thumbnail: thumbnailFile ? URL.createObjectURL(thumbnailFile) : formData.thumbnail,
        authorName: 'Admin',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      let updatedTutorials;
      if (editingTutorial) {
        // Update existing tutorial
        updatedTutorials = tutorials.map(tutorial =>
          tutorial.id === editingTutorial.id
            ? { ...tutorialData, id: editingTutorial.id }
            : tutorial
        );
      } else {
        // Add new tutorial
        const newId = Date.now().toString();
        updatedTutorials = [...tutorials, { ...tutorialData, id: newId }];
      }

      saveTutorialsToStorage(updatedTutorials);
      resetForm();
    } catch (error) {
      console.error('Error saving tutorial:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (tutorial) => {
    setEditingTutorial(tutorial);
    setFormData({
      title: tutorial.title || '',
      description: tutorial.description || '',
      content: tutorial.content || '',
      category: tutorial.category || '',
      readTime: tutorial.readTime || 5,
      isPremium: tutorial.isPremium || false,
      thumbnail: tutorial.thumbnail || '',
      videoUrl: tutorial.videoUrl || '',
      sections: tutorial.sections || []
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this tutorial?')) return;

    const updatedTutorials = tutorials.filter(tutorial => tutorial.id !== id);
    saveTutorialsToStorage(updatedTutorials);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      content: '',
      category: '',
      readTime: 5,
      isPremium: false,
      thumbnail: '',
      videoUrl: '',
      sections: []
    });
    setThumbnailFile(null);
    setEditingTutorial(null);
    setShowForm(false);
  };

  const addSection = () => {
    setFormData({
      ...formData,
      sections: [...formData.sections, { title: '', content: '', videoUrl: '' }]
    });
  };

  const updateSection = (index, field, value) => {
    const updatedSections = [...formData.sections];
    updatedSections[index][field] = value;
    setFormData({ ...formData, sections: updatedSections });
  };

  const removeSection = (index) => {
    const updatedSections = formData.sections.filter((_, i) => i !== index);
    setFormData({ ...formData, sections: updatedSections });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Admin Dashboard
        </h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus size={18} />
          {showForm ? 'Cancel' : 'Add Tutorial'}
        </button>
      </div>

      {showForm && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            {editingTutorial ? 'Edit Tutorial' : 'Add New Tutorial'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category *
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Read Time (minutes)
                </label>
                <input
                  type="number"
                  value={formData.readTime}
                  onChange={(e) => setFormData({ ...formData, readTime: parseInt(e.target.value) })}
                  min={1}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Video URL (optional)
                </label>
                <input
                  type="url"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  placeholder="https://youtube.com/embed/..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Thumbnail
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setThumbnailFile(e.target.files[0])}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <Upload size={20} className="text-gray-400" />
              </div>
              {formData.thumbnail && (
                <img src={formData.thumbnail} alt="Thumbnail" className="mt-2 w-32 h-20 object-cover rounded" />
              )}
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPremium"
                checked={formData.isPremium}
                onChange={(e) => setFormData({ ...formData, isPremium: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="isPremium" className="text-sm text-gray-700 dark:text-gray-300">
                Mark as Premium Content
              </label>
            </div>
            
            {/* Content Sections */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Content Sections</h3>
                <button
                  type="button"
                  onClick={addSection}
                  className="btn btn-success flex items-center gap-2"
                >
                  <Plus size={16} />
                  Add Section
                </button>
              </div>
              
              {formData.sections.map((section, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-md p-4 mb-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium text-gray-900 dark:text-white">Section {index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeSection(index)}
                      className="btn-icon btn-icon-danger"
                      title="Remove Section"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Section title"
                      value={section.title}
                      onChange={(e) => updateSection(index, 'title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    
                    <textarea
                      placeholder="Section content (Markdown supported)"
                      value={section.content}
                      onChange={(e) => updateSection(index, 'content', e.target.value)}
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    
                    <input
                      type="url"
                      placeholder="Video URL (optional)"
                      value={section.videoUrl}
                      onChange={(e) => updateSection(index, 'videoUrl', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              ))}
              
              {formData.sections.length === 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Content (Markdown supported) *
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    required
                    rows={10}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              )}
            </div>
            
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={uploading}
                className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Save size={18} />
                {uploading ? 'Saving...' : (editingTutorial ? 'Update Tutorial' : 'Create Tutorial')}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tutorials List */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Manage Tutorials ({tutorials.length})
        </h2>
        
        {tutorials.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300">No tutorials found.</p>
        ) : (
          <div className="space-y-4">
            {tutorials.map(tutorial => (
              <div
                className="tutorial-tile cursor-pointer p-4 border rounded-md hover:shadow-lg transition-shadow hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => {
                  if (tutorial.id) {
                    console.log(`Navigating to tutorial: /tutorial/${tutorial.id}`);
                    navigate(`/tutorial/${tutorial.id}`);
                  } else {
                    console.error('Tutorial ID is undefined');
                  }
                }}
              >
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  {tutorial.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {tutorial.description}
                </p>
                {tutorial.isPremium && (
                  <span className="inline-block bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs px-2 py-1 rounded mt-1">
                    Premium
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;