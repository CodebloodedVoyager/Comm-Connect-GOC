import { GoogleGenerativeAI } from "@google/generative-ai"
import { type NextRequest, NextResponse } from "next/server"

interface RoadmapStep {
  level: string
  title: string
  description: string
  skills: string[]
  topics: {
    name: string
    subtopics: string[]
    resources: string[]
    estimatedHours: number
  }[]
  duration: string
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export async function POST(request: NextRequest) {
  const maxRetries = 3
  const baseDelay = 1000 // 1 second

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const { technology, currentKnowledge } = await request.json()

      if (!technology || !currentKnowledge) {
        return NextResponse.json({ error: "Technology and current knowledge are required" }, { status: 400 })
      }

      if (!process.env.GEMINI_API_KEY) {
        console.log("No Gemini API key found, using fallback roadmap")
        return NextResponse.json({
          roadmap: generateFallbackRoadmap(technology),
          technology,
          currentKnowledge,
          fallback: true,
        })
      }

      // Get the generative model
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

      // Create a detailed prompt for roadmap generation
      const prompt = `Create a personalized learning roadmap for someone who wants to learn ${getTechnologyName(technology)}.

Current Knowledge: ${currentKnowledge}

Please generate a structured learning roadmap with exactly 3 levels (Beginner, Intermediate, Advanced). 

For each level, provide:
1. A clear title for that learning phase
2. A description of what they'll accomplish in this phase
3. 5-6 specific skills they need to learn
4. 4-5 detailed topics, where each topic includes:
   - Topic name
   - 3-5 subtopics to cover within that topic
   - 2-3 recommended learning resources (books, courses, tutorials)
   - Estimated study hours for that topic
5. Estimated duration for completing this level

Format your response as a JSON array with this exact structure:
[
  {
    "level": "Beginner",
    "title": "Phase Title",
    "description": "What they'll learn and accomplish",
    "skills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5"],
    "topics": [
      {
        "name": "Topic Name",
        "subtopics": ["Subtopic 1", "Subtopic 2", "Subtopic 3", "Subtopic 4"],
        "resources": ["Resource 1", "Resource 2", "Resource 3"],
        "estimatedHours": 20
      }
    ],
    "duration": "X-Y months"
  }
]

Make the subtopics very specific and actionable. Resources should include a mix of free and paid options like courses, books, documentation, and tutorials. Estimated hours should be realistic for mastering each topic.`

      // Generate the roadmap with timeout
      const result = (await Promise.race([
        model.generateContent(prompt),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Request timeout")), 30000)),
      ])) as any

      const response = await result.response
      let roadmapText = response.text().trim()

      // Clean up the response to extract JSON
      roadmapText = roadmapText
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim()

      let roadmap: RoadmapStep[]
      try {
        roadmap = JSON.parse(roadmapText)
      } catch (parseError) {
        console.error("Failed to parse roadmap JSON:", parseError)
        // Use fallback on parse error
        roadmap = generateFallbackRoadmap(technology)
      }

      // Validate the roadmap structure
      if (!Array.isArray(roadmap) || roadmap.length !== 3) {
        roadmap = generateFallbackRoadmap(technology)
      }

      return NextResponse.json({
        roadmap,
        technology,
        currentKnowledge,
      })
    } catch (error) {
      console.error(`Gemini API error (attempt ${attempt}):`, error)

      // Check if it's the last attempt
      if (attempt === maxRetries) {
        // Provide more specific error messages and fallback
        if (error instanceof Error) {
          if (error.message.includes("overloaded") || error.message.includes("503")) {
            console.log("API overloaded, using fallback roadmap")
            return NextResponse.json({
              roadmap: generateFallbackRoadmap(technology),
              technology,
              currentKnowledge,
              fallback: true,
              message: "AI service is currently busy. Here's a comprehensive roadmap based on industry standards.",
            })
          }
          if (error.message.includes("API_KEY")) {
            return NextResponse.json({ error: "Invalid API key configuration" }, { status: 401 })
          }
          if (error.message.includes("quota")) {
            return NextResponse.json({
              roadmap: generateFallbackRoadmap(technology),
              technology,
              currentKnowledge,
              fallback: true,
              message: "API quota exceeded. Here's a comprehensive roadmap based on industry standards.",
            })
          }
        }

        // Final fallback for any other error
        return NextResponse.json({
          roadmap: generateFallbackRoadmap(technology),
          technology,
          currentKnowledge,
          fallback: true,
          message: "Unable to generate AI roadmap. Here's a comprehensive roadmap based on industry standards.",
        })
      }

      // Wait before retrying (exponential backoff)
      const delay = baseDelay * Math.pow(2, attempt - 1)
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }

  // This should never be reached, but just in case
  return NextResponse.json({
    roadmap: generateFallbackRoadmap(technology || "web-dev"),
    technology: technology || "web-dev",
    currentKnowledge: currentKnowledge || "beginner",
    fallback: true,
    message: "Service temporarily unavailable. Here's a comprehensive roadmap based on industry standards.",
  })
}

function getTechnologyName(techKey: string): string {
  const techNames: Record<string, string> = {
    "web-dev": "Web Development",
    "mobile-dev": "Mobile Development",
    "ai-ml": "AI/Machine Learning",
    "data-science": "Data Science",
    devops: "DevOps",
    "ui-ux": "UI/UX Design",
    blockchain: "Blockchain/Web3",
  }
  return techNames[techKey] || "Web Development"
}

function generateFallbackRoadmap(technology: string): RoadmapStep[] {
  const fallbackRoadmaps: Record<string, RoadmapStep[]> = {
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
              "Document structure and DOCTYPE",
              "Semantic elements (header, nav, main, article, section)",
              "Forms and input validation",
              "Accessibility attributes (ARIA, alt text)",
              "Meta tags and SEO basics",
            ],
            resources: ["MDN Web Docs - HTML Guide", "freeCodeCamp HTML Course", "HTML5 Boilerplate Documentation"],
            estimatedHours: 25,
          },
          {
            name: "CSS Fundamentals & Layout",
            subtopics: [
              "Box model and positioning",
              "Flexbox layout system",
              "CSS Grid for complex layouts",
              "Responsive design with media queries",
              "CSS animations and transitions",
            ],
            resources: [
              "CSS Grid Garden (interactive game)",
              "Flexbox Froggy (interactive game)",
              "Kevin Powell's CSS YouTube Channel",
            ],
            estimatedHours: 35,
          },
          {
            name: "JavaScript Fundamentals",
            subtopics: [
              "Variables, data types, and operators",
              "Functions and scope",
              "Arrays and objects manipulation",
              "Control structures (loops, conditionals)",
              "Error handling with try/catch",
            ],
            resources: [
              "JavaScript.info tutorial",
              "Eloquent JavaScript (free book)",
              "freeCodeCamp JavaScript Course",
            ],
            estimatedHours: 40,
          },
          {
            name: "DOM Manipulation & Events",
            subtopics: [
              "Selecting and modifying DOM elements",
              "Event listeners and event handling",
              "Form validation and submission",
              "Dynamic content creation",
              "Browser APIs (localStorage, fetch)",
            ],
            resources: ["MDN DOM Manipulation Guide", "JavaScript30 by Wes Bos", "The Odin Project DOM lessons"],
            estimatedHours: 30,
          },
        ],
        duration: "2-3 months",
      },
      {
        level: "Intermediate",
        title: "Modern Frontend Framework",
        description: "Learn a popular frontend framework and modern development tools.",
        skills: ["React.js or Vue.js", "Component Architecture", "State Management", "Build Tools", "Version Control"],
        topics: [
          {
            name: "React.js Fundamentals",
            subtopics: [
              "JSX syntax and components",
              "State and props management",
              "Component lifecycle methods",
              "Event handling in React",
              "Conditional rendering",
            ],
            resources: ["React Official Documentation", "Scrimba React Course", "Codecademy React Course"],
            estimatedHours: 40,
          },
          {
            name: "State Management with Redux",
            subtopics: [
              "Redux store and reducers",
              "Actions and dispatching",
              "Connecting components to Redux",
              "Asynchronous actions with Thunk",
              "Selectors and memoization",
            ],
            resources: ["Redux Official Documentation", "Redux Toolkit Tutorial", "Egghead.io Redux Course"],
            estimatedHours: 30,
          },
          {
            name: "React Router and Navigation",
            subtopics: [
              "Setting up React Router",
              "Defining routes and links",
              "Passing parameters in routes",
              "Nested routes and layouts",
              "Programmatic navigation",
            ],
            resources: [
              "React Router Official Documentation",
              "React Router Tutorial by Tyler McGinnis",
              "Simple React Router Examples",
            ],
            estimatedHours: 20,
          },
          {
            name: "API Integration with Fetch",
            subtopics: [
              "Making API requests with fetch",
              "Handling responses and errors",
              "Setting request headers",
              "Using async/await for API calls",
              "Data transformation and mapping",
            ],
            resources: [
              "MDN Fetch API Documentation",
              "How to Use the Fetch API by DigitalOcean",
              "React API Integration Tutorial",
            ],
            estimatedHours: 25,
          },
        ],
        duration: "3-4 months",
      },
      {
        level: "Advanced",
        title: "Full-Stack Development",
        description: "Expand to backend development and deployment strategies.",
        skills: ["Node.js & Express", "Database Design", "API Development", "Authentication", "Cloud Deployment"],
        topics: [
          {
            name: "Node.js and Express.js",
            subtopics: [
              "Setting up a Node.js environment",
              "Creating an Express.js server",
              "Defining routes and middleware",
              "Handling requests and responses",
              "Using environment variables",
            ],
            resources: [
              "Node.js Official Documentation",
              "Express.js Official Documentation",
              "Node.js Tutorial by W3Schools",
            ],
            estimatedHours: 35,
          },
          {
            name: "Database Design with MongoDB",
            subtopics: [
              "Understanding NoSQL databases",
              "Designing MongoDB schemas",
              "Performing CRUD operations",
              "Indexing and querying data",
              "Data modeling best practices",
            ],
            resources: ["MongoDB Official Documentation", "MongoDB University Courses", "Mongoose.js Documentation"],
            estimatedHours: 30,
          },
          {
            name: "API Development with REST",
            subtopics: [
              "Designing RESTful APIs",
              "Implementing API endpoints",
              "Handling authentication and authorization",
              "Validating request data",
              "Documenting APIs with Swagger",
            ],
            resources: [
              "REST API Tutorial by RESTful API",
              "Building APIs with Node.js by Scotch.io",
              "Swagger Documentation",
            ],
            estimatedHours: 25,
          },
          {
            name: "Authentication and Security",
            subtopics: [
              "Implementing user authentication",
              "Using JWT for authorization",
              "Hashing passwords with bcrypt",
              "Protecting against common web vulnerabilities",
              "Implementing rate limiting",
            ],
            resources: ["Passport.js Documentation", "JSON Web Token (JWT) Documentation", "OWASP Security Guide"],
            estimatedHours: 30,
          },
        ],
        duration: "4-6 months",
      },
    ],
    "mobile-dev": [
      {
        level: "Beginner",
        title: "Mobile Development Basics",
        description: "Choose your platform and learn the fundamentals of mobile app development.",
        skills: [
          "Platform Choice (iOS/Android)",
          "UI/UX Principles",
          "Basic App Structure",
          "Navigation",
          "Local Storage",
        ],
        topics: [
          {
            name: "Introduction to Mobile Development",
            subtopics: [
              "Choosing between iOS and Android",
              "Setting up the development environment",
              "Understanding mobile app architecture",
              "Basic UI components and layouts",
              "Mobile app lifecycle",
            ],
            resources: [
              "Official Android Documentation",
              "Official iOS Documentation",
              "Mobile App Development Tutorial by Tutorialspoint",
            ],
            estimatedHours: 25,
          },
          {
            name: "UI/UX Design Principles",
            subtopics: [
              "Understanding user-centered design",
              "Creating wireframes and mockups",
              "Designing for different screen sizes",
              "Using color and typography effectively",
              "Accessibility considerations",
            ],
            resources: [
              "The Design of Everyday Things by Don Norman",
              "UI Design Principles by Smashing Magazine",
              "UX Design Process by Interaction Design Foundation",
            ],
            estimatedHours: 20,
          },
          {
            name: "Basic App Structure and Navigation",
            subtopics: [
              "Creating a basic app project",
              "Implementing navigation patterns",
              "Using navigation controllers",
              "Handling user input",
              "Displaying data in lists and tables",
            ],
            resources: [
              "Android Navigation Tutorial",
              "iOS Navigation Tutorial",
              "React Native Navigation Documentation",
            ],
            estimatedHours: 30,
          },
          {
            name: "Local Storage and Data Persistence",
            subtopics: [
              "Storing data locally on the device",
              "Using shared preferences",
              "Working with SQLite databases",
              "Implementing data encryption",
              "Managing data persistence",
            ],
            resources: [
              "Android Shared Preferences Tutorial",
              "iOS Core Data Tutorial",
              "React Native AsyncStorage Documentation",
            ],
            estimatedHours: 25,
          },
        ],
        duration: "2-3 months",
      },
      {
        level: "Intermediate",
        title: "Advanced Mobile Features",
        description: "Implement complex features and integrate with device capabilities.",
        skills: [
          "API Integration",
          "Push Notifications",
          "Camera & Media",
          "Location Services",
          "Performance Optimization",
        ],
        topics: [
          {
            name: "API Integration and Data Fetching",
            subtopics: [
              "Making API requests",
              "Handling JSON data",
              "Using RESTful APIs",
              "Implementing data caching",
              "Error handling and retries",
            ],
            resources: ["Android Retrofit Tutorial", "iOS URLSession Tutorial", "React Native Fetch API Documentation"],
            estimatedHours: 30,
          },
          {
            name: "Push Notifications",
            subtopics: [
              "Setting up push notifications",
              "Sending notifications from the server",
              "Handling notification events",
              "Customizing notification appearance",
              "Implementing background processing",
            ],
            resources: [
              "Android Firebase Cloud Messaging Documentation",
              "iOS Apple Push Notification Service Documentation",
              "React Native Push Notifications Tutorial",
            ],
            estimatedHours: 25,
          },
          {
            name: "Camera and Media Integration",
            subtopics: [
              "Accessing the device camera",
              "Capturing photos and videos",
              "Working with media files",
              "Implementing image processing",
              "Streaming media content",
            ],
            resources: [
              "Android CameraX Documentation",
              "iOS AVFoundation Documentation",
              "React Native Camera Documentation",
            ],
            estimatedHours: 30,
          },
          {
            name: "Location Services and Maps",
            subtopics: [
              "Accessing device location",
              "Using GPS and other location providers",
              "Displaying maps",
              "Implementing geocoding",
              "Tracking user location",
            ],
            resources: [
              "Android Location Services Documentation",
              "iOS Core Location Documentation",
              "React Native Maps Documentation",
            ],
            estimatedHours: 25,
          },
        ],
        duration: "3-4 months",
      },
      {
        level: "Advanced",
        title: "Production & Distribution",
        description: "Prepare your app for production and learn distribution strategies.",
        skills: ["App Store Guidelines", "Testing & QA", "Analytics", "Monetization", "Cross-Platform Development"],
        topics: [
          {
            name: "App Store Guidelines and Compliance",
            subtopics: [
              "Understanding app store review guidelines",
              "Complying with privacy policies",
              "Implementing data security measures",
              "Handling user data responsibly",
              "Avoiding common app rejection reasons",
            ],
            resources: [
              "Apple App Store Review Guidelines",
              "Google Play Store Policy",
              "Mobile App Security Checklist",
            ],
            estimatedHours: 20,
          },
          {
            name: "Testing and Quality Assurance",
            subtopics: [
              "Writing unit tests",
              "Performing UI testing",
              "Implementing end-to-end testing",
              "Using testing frameworks",
              "Automating testing processes",
            ],
            resources: [
              "Android Testing Documentation",
              "iOS Testing Documentation",
              "React Native Testing Library Documentation",
            ],
            estimatedHours: 30,
          },
          {
            name: "Analytics and Performance Monitoring",
            subtopics: [
              "Integrating analytics tools",
              "Tracking user behavior",
              "Monitoring app performance",
              "Identifying performance bottlenecks",
              "Optimizing app performance",
            ],
            resources: [
              "Google Analytics for Mobile Apps",
              "Firebase Analytics Documentation",
              "New Relic Mobile Monitoring",
            ],
            estimatedHours: 25,
          },
          {
            name: "Monetization Strategies",
            subtopics: [
              "Implementing in-app purchases",
              "Using advertising",
              "Offering subscriptions",
              "Exploring freemium models",
              "Balancing monetization and user experience",
            ],
            resources: [
              "Google Play Billing Library Documentation",
              "Apple StoreKit Documentation",
              "Mobile App Monetization Strategies by App Annie",
            ],
            estimatedHours: 20,
          },
        ],
        duration: "3-4 months",
      },
    ],
    "ai-ml": [
      {
        level: "Beginner",
        title: "AI/ML Foundations",
        description: "Build a strong foundation in mathematics and programming for AI/ML.",
        skills: [
          "Python Programming",
          "Statistics & Probability",
          "Linear Algebra",
          "Data Manipulation",
          "Data Visualization",
        ],
        topics: [
          {
            name: "Python Programming Fundamentals",
            subtopics: [
              "Variables, data types, and operators",
              "Control flow (if/else, loops)",
              "Functions and modules",
              "Object-oriented programming",
              "Error handling",
            ],
            resources: ["Python Official Documentation", "Python Tutorial by W3Schools", "Codecademy Python Course"],
            estimatedHours: 40,
          },
          {
            name: "Statistics and Probability",
            subtopics: [
              "Descriptive statistics",
              "Probability distributions",
              "Hypothesis testing",
              "Confidence intervals",
              "Regression analysis",
            ],
            resources: [
              "Statistics by David Freedman",
              "Khan Academy Statistics and Probability Course",
              "OpenIntro Statistics",
            ],
            estimatedHours: 35,
          },
          {
            name: "Linear Algebra",
            subtopics: [
              "Vectors and matrices",
              "Matrix operations",
              "Eigenvalues and eigenvectors",
              "Linear transformations",
              "Singular value decomposition",
            ],
            resources: [
              "Linear Algebra by Gilbert Strang",
              "Khan Academy Linear Algebra Course",
              "3Blue1Brown Linear Algebra Series",
            ],
            estimatedHours: 30,
          },
          {
            name: "Data Manipulation with Pandas",
            subtopics: [
              "Data structures (Series, DataFrame)",
              "Data cleaning and preprocessing",
              "Data filtering and selection",
              "Data aggregation and grouping",
              "Data merging and joining",
            ],
            resources: [
              "Pandas Official Documentation",
              "Pandas Tutorial by DataCamp",
              "Pandas Cookbook by Theodore Petrou",
            ],
            estimatedHours: 35,
          },
        ],
        duration: "3-4 months",
      },
      {
        level: "Intermediate",
        title: "Machine Learning Algorithms",
        description: "Learn core ML algorithms and frameworks.",
        skills: [
          "Supervised Learning",
          "Unsupervised Learning",
          "Scikit-learn",
          "Feature Engineering",
          "Model Evaluation",
        ],
        topics: [
          {
            name: "Supervised Learning",
            subtopics: [
              "Linear regression",
              "Logistic regression",
              "Decision trees",
              "Support vector machines",
              "Ensemble methods (Random Forest, Gradient Boosting)",
            ],
            resources: [
              "Scikit-learn Documentation",
              "Machine Learning by Tom Mitchell",
              "Elements of Statistical Learning by Hastie, Tibshirani, and Friedman",
            ],
            estimatedHours: 45,
          },
          {
            name: "Unsupervised Learning",
            subtopics: [
              "Clustering (K-means, hierarchical clustering)",
              "Dimensionality reduction (PCA, t-SNE)",
              "Association rule mining",
              "Anomaly detection",
              "Recommender systems",
            ],
            resources: [
              "Scikit-learn Documentation",
              "Pattern Recognition and Machine Learning by Christopher Bishop",
              "Introduction to Information Retrieval by Manning, Raghavan, and Schütze",
            ],
            estimatedHours: 40,
          },
          {
            name: "Feature Engineering",
            subtopics: [
              "Data cleaning and preprocessing",
              "Feature scaling and normalization",
              "Feature selection",
              "Feature extraction",
              "Handling missing data",
            ],
            resources: [
              "Feature Engineering for Machine Learning by Alice Zheng and Amanda Casari",
              "Scikit-learn Documentation",
              "DataCamp Feature Engineering Course",
            ],
            estimatedHours: 35,
          },
          {
            name: "Model Evaluation and Selection",
            subtopics: [
              "Cross-validation",
              "Bias-variance tradeoff",
              "Performance metrics (accuracy, precision, recall, F1-score)",
              "ROC curves and AUC",
              "Model selection techniques",
            ],
            resources: [
              "Scikit-learn Documentation",
              "Evaluating Machine Learning Models by Alice Zheng",
              "Machine Learning Mastery Blog",
            ],
            estimatedHours: 30,
          },
        ],
        duration: "4-5 months",
      },
      {
        level: "Advanced",
        title: "Deep Learning & Specialization",
        description: "Dive into neural networks and choose your specialization.",
        skills: ["Neural Networks", "TensorFlow/PyTorch", "Computer Vision", "NLP", "MLOps", "Model Deployment"],
        topics: [
          {
            name: "Neural Networks",
            subtopics: [
              "Perceptrons and activation functions",
              "Multilayer perceptrons",
              "Backpropagation",
              "Optimization algorithms (gradient descent, Adam)",
              "Regularization techniques",
            ],
            resources: [
              "Deep Learning by Ian Goodfellow, Yoshua Bengio, and Aaron Courville",
              "Neural Networks and Deep Learning by Michael Nielsen",
              "TensorFlow Documentation",
            ],
            estimatedHours: 50,
          },
          {
            name: "Convolutional Neural Networks (CNNs)",
            subtopics: [
              "Convolutional layers",
              "Pooling layers",
              "CNN architectures (LeNet, AlexNet, VGGNet, ResNet)",
              "Object detection",
              "Image segmentation",
            ],
            resources: [
              "Convolutional Neural Networks by Stanford CS231n",
              "TensorFlow Documentation",
              "PyTorch Documentation",
            ],
            estimatedHours: 45,
          },
          {
            name: "Recurrent Neural Networks (RNNs)",
            subtopics: [
              "Recurrent layers",
              "Long Short-Term Memory (LSTM)",
              "Gated Recurrent Unit (GRU)",
              "Sequence-to-sequence models",
              "Natural language processing",
            ],
            resources: [
              "Recurrent Neural Networks by Stanford CS231n",
              "TensorFlow Documentation",
              "PyTorch Documentation",
            ],
            estimatedHours: 40,
          },
          {
            name: "Model Deployment",
            subtopics: [
              "Containerization (Docker)",
              "Cloud deployment (AWS, Azure, GCP)",
              "Model serving (TensorFlow Serving, TorchServe)",
              "API development (Flask, FastAPI)",
              "Monitoring and logging",
            ],
            resources: ["TensorFlow Serving Documentation", "TorchServe Documentation", "Docker Documentation"],
            estimatedHours: 35,
          },
        ],
        duration: "6-8 months",
      },
    ],
    "data-science": [
      {
        level: "Beginner",
        title: "Data Science Fundamentals",
        description: "Learn the basics of data analysis and statistical thinking.",
        skills: ["Python/R Programming", "Statistics", "Data Cleaning", "Exploratory Data Analysis", "SQL"],
        topics: [
          {
            name: "Python for Data Science",
            subtopics: [
              "Data structures (lists, dictionaries)",
              "Control flow (loops, conditionals)",
              "Functions and modules",
              "NumPy for numerical computing",
              "Pandas for data manipulation",
            ],
            resources: ["Python Official Documentation", "NumPy Documentation", "Pandas Documentation"],
            estimatedHours: 40,
          },
          {
            name: "Statistics for Data Science",
            subtopics: [
              "Descriptive statistics",
              "Probability distributions",
              "Hypothesis testing",
              "Confidence intervals",
              "Regression analysis",
            ],
            resources: [
              "Statistics by David Freedman",
              "Khan Academy Statistics and Probability Course",
              "OpenIntro Statistics",
            ],
            estimatedHours: 35,
          },
          {
            name: "Data Cleaning and Preprocessing",
            subtopics: [
              "Handling missing data",
              "Data transformation",
              "Data normalization",
              "Data encoding",
              "Outlier detection",
            ],
            resources: [
              "Data Cleaning with Python by Jason Brownlee",
              "Data Preprocessing with Scikit-learn",
              "Missing Data Imputation Techniques",
            ],
            estimatedHours: 30,
          },
          {
            name: "Exploratory Data Analysis (EDA)",
            subtopics: [
              "Data visualization with Matplotlib and Seaborn",
              "Summary statistics",
              "Correlation analysis",
              "Data distribution analysis",
              "Hypothesis generation",
            ],
            resources: ["Matplotlib Documentation", "Seaborn Documentation", "EDA Techniques by Towards Data Science"],
            estimatedHours: 35,
          },
        ],
        duration: "2-3 months",
      },
      {
        level: "Intermediate",
        title: "Advanced Analytics",
        description: "Master advanced analytical techniques and visualization.",
        skills: ["Machine Learning", "Data Visualization", "A/B Testing", "Time Series Analysis", "Big Data Tools"],
        topics: [
          {
            name: "Machine Learning Algorithms",
            subtopics: [
              "Supervised learning (regression, classification)",
              "Unsupervised learning (clustering, dimensionality reduction)",
              "Model evaluation and selection",
              "Feature engineering",
              "Hyperparameter tuning",
            ],
            resources: [
              "Scikit-learn Documentation",
              "Machine Learning by Tom Mitchell",
              "Elements of Statistical Learning by Hastie, Tibshirani, and Friedman",
            ],
            estimatedHours: 45,
          },
          {
            name: "Data Visualization",
            subtopics: [
              "Advanced plotting techniques with Matplotlib and Seaborn",
              "Interactive visualizations with Plotly and Bokeh",
              "Dashboard design with Tableau and Power BI",
              "Geospatial data visualization",
              "Data storytelling",
            ],
            resources: ["Plotly Documentation", "Bokeh Documentation", "Tableau Documentation"],
            estimatedHours: 40,
          },
          {
            name: "A/B Testing",
            subtopics: [
              "Experimental design",
              "Hypothesis testing",
              "Statistical significance",
              "Sample size calculation",
              "A/B testing tools",
            ],
            resources: [
              "Trustworthy Online Controlled Experiments by Kohavi, Tang, and Xu",
              "A/B Testing by Ronny Kohavi",
              "Optimizely Documentation",
            ],
            estimatedHours: 30,
          },
          {
            name: "Time Series Analysis",
            subtopics: [
              "Time series decomposition",
              "Stationarity and differencing",
              "ARIMA models",
              "Forecasting techniques",
              "Time series visualization",
            ],
            resources: [
              "Time Series Analysis by James Hamilton",
              "Forecasting: Principles and Practice by Hyndman and Athanasopoulos",
              "Statsmodels Documentation",
            ],
            estimatedHours: 35,
          },
        ],
        duration: "4-5 months",
      },
      {
        level: "Advanced",
        title: "Data Science in Production",
        description: "Learn to deploy and maintain data science solutions.",
        skills: ["MLOps", "Cloud Platforms", "Data Engineering", "Model Monitoring", "Business Intelligence"],
        topics: [
          {
            name: "MLOps",
            subtopics: [
              "Model deployment",
              "Model monitoring",
              "Continuous integration and continuous delivery (CI/CD)",
              "Model versioning",
              "Automated testing",
            ],
            resources: [
              "MLOps: Continuous Delivery and Automation Pipelines in Machine Learning by Treveil et al.",
              "MLOps Principles by Google",
              "Kubeflow Documentation",
            ],
            estimatedHours: 45,
          },
          {
            name: "Cloud Platforms",
            subtopics: [
              "Amazon Web Services (AWS)",
              "Microsoft Azure",
              "Google Cloud Platform (GCP)",
              "Cloud storage",
              "Cloud computing",
            ],
            resources: ["AWS Documentation", "Azure Documentation", "GCP Documentation"],
            estimatedHours: 40,
          },
          {
            name: "Data Engineering",
            subtopics: [
              "Data pipelines",
              "Extract, transform, load (ETL)",
              "Data warehousing",
              "Data lakes",
              "Big data technologies (Spark, Hadoop)",
            ],
            resources: [
              "Designing Data-Intensive Applications by Martin Kleppmann",
              "The Data Warehouse Toolkit by Ralph Kimball and Margy Ross",
              "Spark Documentation",
            ],
            estimatedHours: 35,
          },
          {
            name: "Business Intelligence",
            subtopics: [
              "Data visualization",
              "Dashboard design",
              "Key performance indicators (KPIs)",
              "Data storytelling",
              "Business analytics",
            ],
            resources: [
              "Tableau Documentation",
              "Power BI Documentation",
              "Information Dashboard Design by Stephen Few",
            ],
            estimatedHours: 30,
          },
        ],
        duration: "4-6 months",
      },
    ],
    devops: [
      {
        level: "Beginner",
        title: "DevOps Fundamentals",
        description: "Understand the DevOps culture and basic tools.",
        skills: ["Linux Administration", "Version Control", "Basic Scripting", "Networking Basics", "Cloud Concepts"],
        topics: [
          {
            name: "Linux Administration",
            subtopics: [
              "Command-line interface (CLI)",
              "File system navigation",
              "User and group management",
              "Package management",
              "Process management",
            ],
            resources: [
              "The Linux Command Line by William Shotts",
              "Linux Administration Handbook by Nemeth et al.",
              "Linux Foundation Courses",
            ],
            estimatedHours: 40,
          },
          {
            name: "Version Control with Git",
            subtopics: [
              "Git basics (commit, push, pull)",
              "Branching and merging",
              "Conflict resolution",
              "Remote repositories (GitHub, GitLab, Bitbucket)",
              "Git workflows",
            ],
            resources: ["Pro Git by Scott Chacon and Ben Straub", "Git Documentation", "GitHub Learning Lab"],
            estimatedHours: 35,
          },
          {
            name: "Basic Scripting with Bash",
            subtopics: [
              "Shell scripting basics",
              "Variables and operators",
              "Control flow (if/else, loops)",
              "Functions",
              "Command-line tools",
            ],
            resources: [
              "Bash Scripting Tutorial by LinuxCommand.org",
              "Advanced Bash-Scripting Guide by Mendel Cooper",
              "Bash Documentation",
            ],
            estimatedHours: 30,
          },
          {
            name: "Networking Basics",
            subtopics: ["TCP/IP model", "IP addressing", "Subnetting", "Routing", "DNS"],
            resources: [
              "Computer Networking: A Top-Down Approach by Kurose and Ross",
              "Networking for Dummies by Doug Lowe",
              "Cisco Networking Academy",
            ],
            estimatedHours: 35,
          },
        ],
        duration: "2-3 months",
      },
      {
        level: "Intermediate",
        title: "CI/CD & Automation",
        description: "Implement continuous integration and deployment pipelines.",
        skills: [
          "Docker & Containers",
          "CI/CD Pipelines",
          "Infrastructure as Code",
          "Configuration Management",
          "Monitoring",
        ],
        topics: [
          {
            name: "Docker and Containerization",
            subtopics: [
              "Docker basics (images, containers, volumes)",
              "Docker Compose",
              "Docker networking",
              "Container orchestration (Kubernetes)",
              "Container security",
            ],
            resources: ["Docker Documentation", "Docker Tutorial by Katacoda", "Kubernetes Documentation"],
            estimatedHours: 40,
          },
          {
            name: "CI/CD Pipelines with Jenkins",
            subtopics: [
              "Jenkins basics (jobs, plugins)",
              "Pipeline as code",
              "Automated testing",
              "Deployment strategies",
              "Integration with other tools",
            ],
            resources: [
              "Jenkins Documentation",
              "Jenkins Tutorial by CloudBees",
              "Continuous Delivery by Jez Humble and David Farley",
            ],
            estimatedHours: 35,
          },
          {
            name: "Infrastructure as Code with Terraform",
            subtopics: [
              "Terraform basics (resources, providers)",
              "Terraform modules",
              "State management",
              "Infrastructure automation",
              "Cloud infrastructure provisioning",
            ],
            resources: [
              "Terraform Documentation",
              "Terraform Tutorial by HashiCorp",
              "Infrastructure as Code by Kief Morris",
            ],
            estimatedHours: 30,
          },
          {
            name: "Configuration Management with Ansible",
            subtopics: [
              "Ansible basics (playbooks, roles)",
              "Idempotency",
              "Configuration automation",
              "System configuration",
              "Application deployment",
            ],
            resources: ["Ansible Documentation", "Ansible Tutorial by Red Hat", "Ansible for DevOps by Jeff Geerling"],
            estimatedHours: 35,
          },
        ],
        duration: "3-4 months",
      },
      {
        level: "Advanced",
        title: "Advanced DevOps & SRE",
        description: "Master advanced DevOps practices and site reliability engineering.",
        skills: ["Kubernetes", "Service Mesh", "Observability", "Security (DevSecOps)", "Disaster Recovery"],
        topics: [
          {
            name: "Kubernetes Orchestration",
            subtopics: [
              "Kubernetes architecture",
              "Deployments and services",
              "Networking in Kubernetes",
              "Scaling and high availability",
              "Security in Kubernetes",
            ],
            resources: [
              "Kubernetes Documentation",
              "Kubernetes in Action by Marko Lukša",
              "Certified Kubernetes Administrator (CKA) Certification",
            ],
            estimatedHours: 45,
          },
          {
            name: "Service Mesh with Istio",
            subtopics: [
              "Service mesh architecture",
              "Traffic management",
              "Security in service mesh",
              "Observability in service mesh",
              "Integration with Kubernetes",
            ],
            resources: ["Istio Documentation", "Istio Tutorial by Google", "Service Mesh in Action by Christian Posta"],
            estimatedHours: 40,
          },
          {
            name: "Observability",
            subtopics: [
              "Monitoring and alerting",
              "Logging and tracing",
              "Metrics collection",
              "Visualization",
              "Root cause analysis",
            ],
            resources: [
              "The Site Reliability Workbook by Google",
              "Monitoring Distributed Systems by Kyle Kingsbury",
              "Prometheus Documentation",
            ],
            estimatedHours: 35,
          },
          {
            name: "Security (DevSecOps)",
            subtopics: [
              "Security scanning",
              "Vulnerability management",
              "Compliance",
              "Identity and access management",
              "Security automation",
            ],
            resources: ["DevSecOps by Shannon Lietz", "The Phoenix Project by Gene Kim et al.", "OWASP Documentation"],
            estimatedHours: 30,
          },
        ],
        duration: "4-6 months",
      },
    ],
    "ui-ux": [
      {
        level: "Beginner",
        title: "Design Fundamentals",
        description: "Learn the core principles of user interface and experience design.",
        skills: ["Design Principles", "Color Theory", "Typography", "Layout & Composition", "Design Tools"],
        topics: [
          {
            name: "Design Principles",
            subtopics: ["Visual hierarchy", "Balance", "Contrast", "Emphasis", "Unity"],
            resources: [
              "The Design of Everyday Things by Don Norman",
              "Universal Principles of Design by Lidwell, Holden, and Butler",
              "Refactoring UI by Adam Wathan and Steve Schoger",
            ],
            estimatedHours: 30,
          },
          {
            name: "Color Theory",
            subtopics: ["Color wheel", "Color harmonies", "Color psychology", "Color accessibility", "Color palettes"],
            resources: ["Interaction of Color by Josef Albers", "Color and Meaning by Faber Birren", "Adobe Color"],
            estimatedHours: 25,
          },
          {
            name: "Typography",
            subtopics: [
              "Typefaces and fonts",
              "Type anatomy",
              "Type hierarchy",
              "Readability and legibility",
              "Font pairing",
            ],
            resources: [
              "The Elements of Typographic Style by Robert Bringhurst",
              "Thinking with Type by Ellen Lupton",
              "Google Fonts",
            ],
            estimatedHours: 30,
          },
          {
            name: "Layout and Composition",
            subtopics: ["Grid systems", "White space", "Visual flow", "Balance", "Proximity"],
            resources: [
              "Grid Systems in Graphic Design by Josef Müller-Brockmann",
              "Layout Workbook by Kristin Cullen",
              "Refactoring UI by Adam Wathan and Steve Schoger",
            ],
            estimatedHours: 25,
          },
        ],
        duration: "2-3 months",
      },
      {
        level: "Intermediate",
        title: "User Research & Prototyping",
        description: "Understand users and create interactive prototypes.",
        skills: [
          "User Research Methods",
          "Wireframing",
          "Prototyping",
          "Usability Testing",
          "Information Architecture",
        ],
        topics: [
          {
            name: "User Research Methods",
            subtopics: ["User interviews", "Surveys", "Usability testing", "A/B testing", "Analytics"],
            resources: [
              "The User Experience Team of One by Leah Buley",
              "Interviewing Users by Steve Portigal",
              "Measuring the User Experience by Tullis and Albert",
            ],
            estimatedHours: 35,
          },
          {
            name: "Wireframing",
            subtopics: [
              "Low-fidelity wireframes",
              "Mid-fidelity wireframes",
              "High-fidelity wireframes",
              "Wireframing tools",
              "User flows",
            ],
            resources: [
              "Wireframing Essentials by UXPin",
              "The Guide to Wireframing by Balsamiq",
              "Mockplus Wireframing Tutorial",
            ],
            estimatedHours: 30,
          },
          {
            name: "Prototyping",
            subtopics: [
              "Interactive prototypes",
              "Prototyping tools",
              "User testing",
              "Iteration",
              "Microinteractions",
            ],
            resources: [
              "Prototyping for Designers by Todd Zaki Warfel",
              "Don't Make Me Think by Steve Krug",
              "InVision Prototyping Tutorial",
            ],
            estimatedHours: 35,
          },
          {
            name: "Usability Testing",
            subtopics: ["Test planning", "Test execution", "Data analysis", "Reporting", "Iteration"],
            resources: [
              "Rocket Surgery Made Easy by Steve Krug",
              "Handbook of Usability Testing by Rubin and Chisnell",
              "Usability.gov",
            ],
            estimatedHours: 30,
          },
        ],
        duration: "3-4 months",
      },
      {
        level: "Advanced",
        title: "Advanced UX & Strategy",
        description: "Master advanced UX concepts and design strategy.",
        skills: [
          "Design Systems",
          "Accessibility",
          "Mobile Design",
          "Design Strategy",
          "Cross-functional Collaboration",
        ],
        topics: [
          {
            name: "Design Systems",
            subtopics: ["Component libraries", "Style guides", "Design tokens", "Documentation", "Governance"],
            resources: ["Atomic Design by Brad Frost", "Design Systems by Alla Kholmatova", "Material Design"],
            estimatedHours: 40,
          },
          {
            name: "Accessibility",
            subtopics: [
              "WCAG guidelines",
              "ARIA attributes",
              "Screen readers",
              "Keyboard navigation",
              "Color contrast",
            ],
            resources: [
              "Web Content Accessibility Guidelines (WCAG)",
              "A Web for Everyone by Whitney Quesenbery and Sarah Horton",
              "Deque University",
            ],
            estimatedHours: 35,
          },
          {
            name: "Mobile Design",
            subtopics: [
              "Responsive design",
              "Adaptive design",
              "Mobile-first design",
              "Touch interactions",
              "Mobile patterns",
            ],
            resources: [
              "Mobile First by Luke Wroblewski",
              "Designing Mobile Interfaces by Steven Hoober and Eric Berkman",
              "Material Design for Mobile",
            ],
            estimatedHours: 30,
          },
          {
            name: "Design Strategy",
            subtopics: ["User research", "Competitive analysis", "Business goals", "Metrics", "Roadmaps"],
            resources: ["Lean UX by Jeff Gothelf and Josh Seiden", "The Mom Test by Rob Fitzpatrick", "Strategyzer"],
            estimatedHours: 35,
          },
        ],
        duration: "3-4 months",
      },
    ],
    blockchain: [
      {
        level: "Beginner",
        title: "Blockchain Basics",
        description: "Understand blockchain technology and cryptocurrency fundamentals.",
        skills: ["Blockchain Concepts", "Cryptocurrency", "Wallet Management", "Basic Cryptography", "Ethereum Basics"],
        topics: [
          {
            name: "Blockchain Concepts",
            subtopics: [
              "Distributed ledgers",
              "Consensus mechanisms",
              "Immutability",
              "Decentralization",
              "Cryptography",
            ],
            resources: [
              "Blockchain Basics by Daniel Drescher",
              "Mastering Bitcoin by Andreas Antonopoulos",
              "Coursera Blockchain Specialization",
            ],
            estimatedHours: 30,
          },
          {
            name: "Cryptocurrency",
            subtopics: ["Bitcoin", "Ethereum", "Altcoins", "Tokenomics", "Exchanges"],
            resources: [
              "Mastering Bitcoin by Andreas Antonopoulos",
              "Mastering Ethereum by Andreas Antonopoulos and Gavin Wood",
              "CoinMarketCap",
            ],
            estimatedHours: 25,
          },
          {
            name: "Wallet Management",
            subtopics: ["Hot wallets", "Cold wallets", "Hardware wallets", "Seed phrases", "Security"],
            resources: ["Bitcoin.org Wallet Guide", "Ethereum.org Wallet Guide", "Ledger Hardware Wallet"],
            estimatedHours: 20,
          },
          {
            name: "Basic Cryptography",
            subtopics: [
              "Hashing",
              "Encryption",
              "Digital signatures",
              "Public-key cryptography",
              "Private-key cryptography",
            ],
            resources: [
              "Cryptography Engineering by Niels Ferguson, Bruce Schneier, and Tadayoshi Kohno",
              "Understanding Cryptography by Christof Paar and Jan Pelzl",
              "Khan Academy Cryptography Course",
            ],
            estimatedHours: 25,
          },
        ],
        duration: "2-3 months",
      },
      {
        level: "Intermediate",
        title: "Smart Contract Development",
        description: "Learn to develop and deploy smart contracts.",
        skills: ["Solidity Programming", "Smart Contracts", "Web3.js", "DApp Development", "Testing & Security"],
        topics: [
          {
            name: "Solidity Programming",
            subtopics: ["Syntax", "Data types", "Control structures", "Functions", "Contracts"],
            resources: ["Solidity Documentation", "CryptoZombies", "Remix IDE"],
            estimatedHours: 40,
          },
          {
            name: "Smart Contracts",
            subtopics: ["ERC-20 tokens", "ERC-721 tokens", "Decentralized exchanges", "Oracles", "Security"],
            resources: ["OpenZeppelin", "ConsenSys Diligence", "Trail of Bits"],
            estimatedHours: 35,
          },
          {
            name: "Web3.js",
            subtopics: ["Connecting to Ethereum", "Sending transactions", "Reading data", "Event listeners", "Filters"],
            resources: ["Web3.js Documentation", "Truffle Framework", "Ganache"],
            estimatedHours: 30,
          },
          {
            name: "DApp Development",
            subtopics: ["Frontend", "Backend", "Deployment", "Testing", "User experience"],
            resources: ["React", "Vue.js", "Angular"],
            estimatedHours: 35,
          },
        ],
        duration: "4-5 months",
      },
      {
        level: "Advanced",
        title: "DeFi & Advanced Web3",
        description: "Build complex decentralized applications and understand DeFi.",
        skills: ["DeFi Protocols", "NFTs", "Layer 2 Solutions", "Cross-chain Development", "Tokenomics"],
        topics: [
          {
            name: "DeFi Protocols",
            subtopics: ["Lending", "Borrowing", "Yield farming", "Decentralized exchanges", "Stablecoins"],
            resources: ["Compound", "Aave", "Uniswap"],
            estimatedHours: 40,
          },
          {
            name: "NFTs",
            subtopics: ["ERC-721", "ERC-1155", "Marketplaces", "Metadata", "Royalties"],
            resources: ["OpenSea", "Rarible", "SuperRare"],
            estimatedHours: 35,
          },
          {
            name: "Layer 2 Solutions",
            subtopics: ["Rollups", "Sidechains", "State channels", "Plasma", "Validium"],
            resources: ["Polygon", "Optimism", "Arbitrum"],
            estimatedHours: 30,
          },
          {
            name: "Cross-chain Development",
            subtopics: [
              "Bridges",
              "Atomic swaps",
              "Interoperability",
              "Cross-chain messaging",
              "Cross-chain governance",
            ],
            resources: ["Cosmos", "Polkadot", "Chainlink"],
            estimatedHours: 35,
          },
        ],
        duration: "4-6 months",
      },
    ],
  }

  return fallbackRoadmaps[technology] || fallbackRoadmaps["web-dev"]
}
