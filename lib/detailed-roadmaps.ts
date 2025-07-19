interface DetailedTopic {
  name: string
  subtopics: string[]
  resources: string[]
  estimatedHours: number
}

interface DetailedRoadmapStep {
  level: string
  title: string
  description: string
  skills: string[]
  topics: DetailedTopic[]
  duration: string
}

export const detailedRoadmaps: Record<string, DetailedRoadmapStep[]> = {
  "web-dev": [
    {
      level: "Beginner",
      title: "Frontend Fundamentals",
      description: "Master the core building blocks of web development with HTML, CSS, and JavaScript.",
      skills: [
        "HTML5 Semantic Elements",
        "CSS Grid & Flexbox",
        "JavaScript ES6+",
        "DOM Manipulation",
        "Responsive Design",
      ],
      topics: [
        {
          name: "HTML5 & Semantic Web",
          subtopics: [
            "Document structure and DOCTYPE declarations",
            "Semantic elements (header, nav, main, article, section, aside, footer)",
            "Forms and advanced input types with validation",
            "Accessibility attributes (ARIA roles, labels, alt text)",
            "Meta tags for SEO and social media optimization",
          ],
          resources: [
            "MDN Web Docs - HTML Complete Guide",
            "freeCodeCamp Responsive Web Design Course",
            "HTML5 Boilerplate Documentation and Best Practices",
          ],
          estimatedHours: 25,
        },
        {
          name: "CSS Fundamentals & Advanced Layout",
          subtopics: [
            "Box model, margin collapse, and positioning systems",
            "Flexbox for one-dimensional layouts and alignment",
            "CSS Grid for complex two-dimensional layouts",
            "Responsive design with mobile-first approach",
            "CSS animations, transitions, and transform properties",
          ],
          resources: [
            "CSS Grid Garden (Interactive Learning Game)",
            "Flexbox Froggy (Interactive Learning Game)",
            "Kevin Powell's CSS YouTube Channel (Complete Playlist)",
          ],
          estimatedHours: 35,
        },
        {
          name: "JavaScript Core Concepts",
          subtopics: [
            "Variables, data types, and type coercion",
            "Functions, arrow functions, and scope chain",
            "Arrays and objects with modern methods",
            "Control structures and error handling",
            "ES6+ features (destructuring, spread, template literals)",
          ],
          resources: [
            "JavaScript.info - The Modern JavaScript Tutorial",
            "Eloquent JavaScript (Free Online Book)",
            "freeCodeCamp JavaScript Algorithms and Data Structures",
          ],
          estimatedHours: 40,
        },
        {
          name: "DOM Manipulation & Browser APIs",
          subtopics: [
            "Selecting and modifying DOM elements efficiently",
            "Event listeners, event delegation, and custom events",
            "Form validation and dynamic form handling",
            "Local storage, session storage, and cookies",
            "Fetch API for HTTP requests and promise handling",
          ],
          resources: [
            "MDN DOM Manipulation Complete Guide",
            "JavaScript30 by Wes Bos (30 Day Challenge)",
            "The Odin Project - DOM Manipulation Lessons",
          ],
          estimatedHours: 30,
        },
      ],
      duration: "2-3 months",
    },
    {
      level: "Intermediate",
      title: "Modern Frontend Development",
      description: "Learn popular frameworks, build tools, and modern development practices.",
      skills: [
        "React.js or Vue.js Framework",
        "Component-Based Architecture",
        "State Management Solutions",
        "Build Tools and Bundlers",
        "Version Control with Git",
      ],
      topics: [
        {
          name: "React.js Fundamentals",
          subtopics: [
            "JSX syntax and component creation",
            "Props, state, and component lifecycle",
            "Event handling and conditional rendering",
            "Lists, keys, and component composition",
            "Hooks (useState, useEffect, useContext, custom hooks)",
          ],
          resources: [
            "React Official Documentation and Tutorial",
            "Scrimba React Course (Interactive)",
            "Full Stack Open - React Section (University of Helsinki)",
          ],
          estimatedHours: 45,
        },
        {
          name: "State Management & Data Flow",
          subtopics: [
            "Local component state vs global state",
            "Context API for prop drilling solutions",
            "Redux Toolkit for complex state management",
            "State normalization and immutable updates",
            "Async actions and middleware (Redux Thunk/Saga)",
          ],
          resources: [
            "Redux Toolkit Official Documentation",
            "Dave Gray's Redux Toolkit Tutorial",
            "Egghead.io Redux Course by Dan Abramov",
          ],
          estimatedHours: 35,
        },
        {
          name: "Modern Build Tools & Development Workflow",
          subtopics: [
            "Webpack configuration and optimization",
            "Vite for fast development and building",
            "Babel for JavaScript transpilation",
            "ESLint and Prettier for code quality",
            "Package management with npm/yarn",
          ],
          resources: [
            "Webpack Official Documentation and Guides",
            "Vite.js Documentation and Examples",
            "JavaScript Tooling Course by Frontend Masters",
          ],
          estimatedHours: 25,
        },
        {
          name: "API Integration & Async Programming",
          subtopics: [
            "RESTful API consumption patterns",
            "Async/await and Promise handling",
            "Error handling and loading states",
            "Data fetching libraries (Axios, React Query)",
            "Authentication and protected routes",
          ],
          resources: [
            "MDN Async JavaScript Guide",
            "React Query Documentation and Examples",
            "JavaScript Promises and Async/Await Course",
          ],
          estimatedHours: 30,
        },
      ],
      duration: "3-4 months",
    },
    {
      level: "Advanced",
      title: "Full-Stack Development & Production",
      description: "Expand to backend development, databases, and deployment strategies.",
      skills: [
        "Node.js & Express.js",
        "Database Design & Management",
        "RESTful API Development",
        "Authentication & Authorization",
        "Cloud Deployment & DevOps",
      ],
      topics: [
        {
          name: "Backend Development with Node.js",
          subtopics: [
            "Node.js runtime and event loop understanding",
            "Express.js server setup and middleware",
            "Routing, controllers, and MVC architecture",
            "File system operations and stream handling",
            "Environment variables and configuration management",
          ],
          resources: [
            "Node.js Official Documentation",
            "Express.js Complete Guide by Academind",
            "The Complete Node.js Developer Course (Udemy)",
          ],
          estimatedHours: 40,
        },
        {
          name: "Database Design & Integration",
          subtopics: [
            "SQL fundamentals and database design principles",
            "MongoDB and NoSQL database concepts",
            "Database relationships and normalization",
            "ORM/ODM usage (Sequelize, Mongoose)",
            "Database optimization and indexing strategies",
          ],
          resources: [
            "MongoDB University Free Courses",
            "SQL Tutorial by W3Schools",
            "Database Design Course by Stanford (Free)",
          ],
          estimatedHours: 35,
        },
        {
          name: "Authentication & Security",
          subtopics: [
            "JWT tokens and session management",
            "Password hashing and security best practices",
            "OAuth 2.0 and third-party authentication",
            "CORS, CSRF, and XSS protection",
            "Rate limiting and API security",
          ],
          resources: ["Auth0 Documentation and Guides", "OWASP Security Guidelines", "Node.js Security Best Practices"],
          estimatedHours: 30,
        },
        {
          name: "Deployment & Production Optimization",
          subtopics: [
            "Cloud platforms (Vercel, Netlify, AWS, Heroku)",
            "CI/CD pipelines and automated deployment",
            "Performance optimization and caching strategies",
            "Monitoring, logging, and error tracking",
            "Scaling applications and load balancing",
          ],
          resources: [
            "Vercel Deployment Documentation",
            "AWS Free Tier Learning Path",
            "Web Performance Optimization Guide",
          ],
          estimatedHours: 35,
        },
      ],
      duration: "4-6 months",
    },
  ],
  "ai-ml": [
    {
      level: "Beginner",
      title: "AI/ML Mathematical Foundations",
      description: "Build a strong foundation in mathematics, statistics, and programming for AI/ML.",
      skills: [
        "Python Programming for Data Science",
        "Statistics & Probability Theory",
        "Linear Algebra & Calculus",
        "Data Manipulation with Pandas",
        "Data Visualization Techniques",
      ],
      topics: [
        {
          name: "Python Programming for Data Science",
          subtopics: [
            "Python syntax, data structures, and control flow",
            "NumPy for numerical computing and array operations",
            "Pandas for data manipulation and analysis",
            "Matplotlib and Seaborn for data visualization",
            "Jupyter notebooks and development environment setup",
          ],
          resources: [
            "Python for Data Science Handbook (Free Online)",
            "Kaggle Learn Python Course",
            "Automate the Boring Stuff with Python (Free Book)",
          ],
          estimatedHours: 45,
        },
        {
          name: "Statistics & Probability Fundamentals",
          subtopics: [
            "Descriptive statistics (mean, median, mode, variance)",
            "Probability distributions and Bayes' theorem",
            "Hypothesis testing and statistical significance",
            "Correlation vs causation and statistical inference",
            "Central limit theorem and sampling distributions",
          ],
          resources: [
            "Khan Academy Statistics and Probability",
            "Think Stats by Allen B. Downey (Free Book)",
            "StatQuest YouTube Channel by Josh Starmer",
          ],
          estimatedHours: 40,
        },
        {
          name: "Linear Algebra for Machine Learning",
          subtopics: [
            "Vectors, matrices, and basic operations",
            "Matrix multiplication and inverse operations",
            "Eigenvalues, eigenvectors, and decomposition",
            "Principal Component Analysis (PCA) mathematics",
            "Vector spaces and linear transformations",
          ],
          resources: [
            "3Blue1Brown Linear Algebra Series (YouTube)",
            "Linear Algebra by Gilbert Strang (MIT OpenCourseWare)",
            "Khan Academy Linear Algebra Course",
          ],
          estimatedHours: 35,
        },
        {
          name: "Data Preprocessing & Exploration",
          subtopics: [
            "Data cleaning and handling missing values",
            "Exploratory data analysis (EDA) techniques",
            "Feature scaling and normalization methods",
            "Outlier detection and treatment strategies",
            "Data visualization for pattern recognition",
          ],
          resources: [
            "Pandas Documentation and Tutorials",
            "Data Cleaning with Python Course (DataCamp)",
            "Exploratory Data Analysis with Python",
          ],
          estimatedHours: 30,
        },
      ],
      duration: "3-4 months",
    },
    {
      level: "Intermediate",
      title: "Core Machine Learning Algorithms",
      description: "Master fundamental ML algorithms and learn to implement them effectively.",
      skills: [
        "Supervised Learning Algorithms",
        "Unsupervised Learning Techniques",
        "Scikit-learn Framework",
        "Feature Engineering Methods",
        "Model Evaluation & Validation",
      ],
      topics: [
        {
          name: "Supervised Learning Algorithms",
          subtopics: [
            "Linear and logistic regression implementation",
            "Decision trees and ensemble methods (Random Forest)",
            "Support Vector Machines (SVM) and kernel methods",
            "k-Nearest Neighbors (k-NN) and distance metrics",
            "Naive Bayes and probabilistic classifiers",
          ],
          resources: [
            "Hands-On Machine Learning by Aurélien Géron",
            "Scikit-learn Documentation and Examples",
            "Andrew Ng's Machine Learning Course (Coursera)",
          ],
          estimatedHours: 50,
        },
        {
          name: "Unsupervised Learning & Clustering",
          subtopics: [
            "K-means clustering and cluster validation",
            "Hierarchical clustering and dendrograms",
            "DBSCAN and density-based clustering",
            "Principal Component Analysis (PCA) implementation",
            "t-SNE and dimensionality reduction techniques",
          ],
          resources: [
            "Pattern Recognition and Machine Learning (Bishop)",
            "Unsupervised Learning Course (Stanford CS229)",
            "Clustering Algorithms Comparison Guide",
          ],
          estimatedHours: 35,
        },
        {
          name: "Feature Engineering & Selection",
          subtopics: [
            "Feature creation and transformation techniques",
            "Handling categorical variables (encoding methods)",
            "Feature selection algorithms and importance ranking",
            "Dealing with high-dimensional data",
            "Time series feature engineering",
          ],
          resources: [
            "Feature Engineering for Machine Learning Book",
            "Kaggle Feature Engineering Course",
            "Feature Selection Techniques Guide",
          ],
          estimatedHours: 30,
        },
        {
          name: "Model Evaluation & Hyperparameter Tuning",
          subtopics: [
            "Cross-validation strategies and techniques",
            "Performance metrics for classification and regression",
            "Bias-variance tradeoff and overfitting prevention",
            "Grid search and random search optimization",
            "Model interpretation and explainability (SHAP, LIME)",
          ],
          resources: [
            "Model Evaluation Guide (Scikit-learn)",
            "Hyperparameter Optimization Techniques",
            "Interpretable Machine Learning Book (Free)",
          ],
          estimatedHours: 25,
        },
      ],
      duration: "4-5 months",
    },
    {
      level: "Advanced",
      title: "Deep Learning & Specialization",
      description: "Master neural networks, deep learning frameworks, and choose your specialization area.",
      skills: [
        "Neural Networks & Deep Learning",
        "TensorFlow/PyTorch Frameworks",
        "Computer Vision Applications",
        "Natural Language Processing",
        "MLOps & Model Deployment",
      ],
      topics: [
        {
          name: "Deep Neural Networks",
          subtopics: [
            "Perceptron and multi-layer neural networks",
            "Backpropagation algorithm and gradient descent",
            "Activation functions and network architecture design",
            "Regularization techniques (dropout, batch normalization)",
            "Convolutional Neural Networks (CNN) architecture",
          ],
          resources: [
            "Deep Learning by Ian Goodfellow (Free Online)",
            "Deep Learning Specialization (Coursera)",
            "Fast.ai Practical Deep Learning Course",
          ],
          estimatedHours: 60,
        },
        {
          name: "Computer Vision with Deep Learning",
          subtopics: [
            "Image preprocessing and data augmentation",
            "CNN architectures (LeNet, AlexNet, ResNet, VGG)",
            "Object detection and image segmentation",
            "Transfer learning and pre-trained models",
            "Generative Adversarial Networks (GANs) basics",
          ],
          resources: [
            "CS231n: Convolutional Neural Networks (Stanford)",
            "PyTorch Computer Vision Tutorial",
            "OpenCV Python Documentation",
          ],
          estimatedHours: 45,
        },
        {
          name: "Natural Language Processing",
          subtopics: [
            "Text preprocessing and tokenization techniques",
            "Word embeddings (Word2Vec, GloVe, FastText)",
            "Recurrent Neural Networks (RNN, LSTM, GRU)",
            "Transformer architecture and attention mechanisms",
            "BERT, GPT, and modern language models",
          ],
          resources: [
            "Natural Language Processing with Python (NLTK Book)",
            "Hugging Face Transformers Documentation",
            "CS224n: Natural Language Processing (Stanford)",
          ],
          estimatedHours: 50,
        },
        {
          name: "MLOps & Production Deployment",
          subtopics: [
            "Model versioning and experiment tracking (MLflow)",
            "Containerization with Docker for ML applications",
            "Model serving and API development (FastAPI, Flask)",
            "Continuous integration/deployment for ML pipelines",
            "Model monitoring and performance tracking in production",
          ],
          resources: [
            "MLOps Specialization (Coursera)",
            "Made With ML - MLOps Course",
            "Kubernetes for Machine Learning Guide",
          ],
          estimatedHours: 40,
        },
      ],
      duration: "6-8 months",
    },
  ],
  // Add other technologies with similar detailed structure...
}
