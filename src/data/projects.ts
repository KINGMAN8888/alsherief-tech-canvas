export interface Project {
  slug: string;
  emoji: string;
  title: string;
  description: string;
  tech: string[];
  link?: string;
  longDescription: string;
  features: string[];
  challenges: string;
  techDetails: string;
}

export const projects: Project[] = [
  {
    slug: "pc-master",
    emoji: "\u{1F5A5}\uFE0F",
    title: "PC Master Platform",
    description:
      "A comprehensive e-commerce platform for PC builds with AI-powered build suggestion assistant, 3D compatibility simulation, and inventory management.",
    tech: ["MERN Stack", "JWT Auth", "AI Integration"],
    link: "https://pc-master-files.onrender.com",
    longDescription:
      "PC Master is a full-featured e-commerce platform designed specifically for PC enthusiasts and builders. The platform provides an AI-powered build suggestion assistant that recommends compatible components based on user requirements such as budget, use case (gaming, workstation, content creation), and performance expectations. It includes a 3D compatibility simulation engine that visually verifies component fit before purchase, reducing return rates significantly. The inventory management system tracks stock levels in real-time across multiple suppliers.",
    features: [
      "AI-powered PC build recommendation engine",
      "3D component compatibility visualization",
      "Real-time inventory tracking across suppliers",
      "Secure user authentication with JWT tokens",
      "Shopping cart with saved builds feature",
      "Admin dashboard for product and order management",
      "Responsive design for mobile and desktop",
    ],
    challenges:
      "The biggest challenge was building the AI recommendation engine that could account for component compatibility, power requirements, and thermal constraints simultaneously. Implementing real-time price tracking across multiple suppliers also required careful API rate limiting and caching strategies.",
    techDetails:
      "Built with MongoDB for flexible product schemas, Express.js REST API, React frontend with Redux state management, and Node.js backend. JWT authentication secures user sessions. The AI engine uses a rule-based system combined with collaborative filtering to generate build recommendations.",
  },
  {
    slug: "smart-answer-ai",
    emoji: "\u{1F916}",
    title: "Smart Answer AI Bot",
    description:
      "A Telegram service bot for Arab students and expatriates in Russia \u2014 instant translation, CV writing, academic support, and logistics.",
    tech: ["Python", "Telegram API", "NLP"],
    link: "https://t.me/SmartAnswerAi_bot",
    longDescription:
      "Smart Answer AI Bot is a comprehensive Telegram-based service designed to assist Arab students and expatriates living in Russia. The bot provides instant Arabic-Russian-English translation, automated CV and cover letter generation tailored to the Russian job market, academic support including document translation and university application guidance, and logistics assistance for navigating daily life in Russia. The bot serves hundreds of active users and processes thousands of requests monthly.",
    features: [
      "Multi-language translation (Arabic, Russian, English)",
      "AI-powered CV and cover letter generation",
      "Academic document translation and formatting",
      "University application guidance and support",
      "Daily logistics assistance (navigation, services)",
      "Natural language understanding for context-aware responses",
      "24/7 automated availability",
    ],
    challenges:
      "Handling the nuances of Arabic-Russian translation was a significant challenge, especially with technical and academic terminology. Building a reliable NLP pipeline that could understand mixed-language queries (users often combine Arabic and Russian in a single message) required extensive training data and custom preprocessing.",
    techDetails:
      "Built with Python using the python-telegram-bot library. NLP processing leverages custom-trained models for language detection and intent classification. The translation engine combines API services with custom dictionaries for domain-specific terminology. Deployed on a VPS with automated monitoring and restart capabilities.",
  },
  {
    slug: "dom-dash-do",
    emoji: "\u2705",
    title: "Dom Dash Do",
    description: "A modern, fast to-do application with intuitive UX.",
    tech: ["React", "TypeScript", "Tailwind CSS", "Local Storage"],
    link: "",
    longDescription:
      "Dom Dash Do is a sleek, modern task management application built with a focus on speed and user experience. The app features an intuitive drag-and-drop interface for organizing tasks, priority levels with color coding, due date tracking with smart reminders, and category-based organization. All data is stored locally in the browser using Local Storage, ensuring privacy and instant access without server dependencies.",
    features: [
      "Drag-and-drop task reordering",
      "Priority levels with color-coded indicators",
      "Due date tracking and overdue alerts",
      "Category and tag-based organization",
      "Local Storage persistence for privacy",
      "Dark and light theme support",
      "Keyboard shortcuts for power users",
    ],
    challenges:
      "Implementing smooth drag-and-drop functionality with proper state management while keeping the app performant was the main challenge. Ensuring data persistence with Local Storage while handling edge cases like storage limits and data migration between versions required careful planning.",
    techDetails:
      "Built with React and TypeScript for type safety. Tailwind CSS provides the styling system with custom theme configuration. State management uses React hooks with context for global state. Local Storage is used for persistence with a migration system for schema changes.",
  },
  {
    slug: "al-tawasul",
    emoji: "\u{1F310}",
    title: "Al-Tawasul Platform",
    description:
      "A social networking application with a chat and interaction system.",
    tech: ["Docker", "Prisma", "VPS Hosting"],
    longDescription:
      "Al-Tawasul is a social networking platform designed for community interaction and real-time communication. The platform features a comprehensive chat system with support for direct messages, group chats, and broadcast channels. Users can create profiles, share posts, comment, and interact through a familiar social media interface. The platform is containerized with Docker for consistent deployments and uses Prisma ORM for type-safe database operations.",
    features: [
      "Real-time messaging with WebSocket support",
      "User profiles with customizable avatars",
      "Post creation with text, images, and links",
      "Comment and reaction system",
      "Group chat and broadcast channels",
      "User search and friend request system",
      "Admin moderation tools",
    ],
    challenges:
      "Building a reliable real-time messaging system that scales with concurrent users was the primary challenge. Managing WebSocket connections, handling message delivery guarantees, and implementing proper connection recovery required extensive testing and optimization.",
    techDetails:
      "Containerized with Docker for deployment consistency. Prisma ORM provides type-safe database access with PostgreSQL. The real-time messaging layer uses WebSockets with fallback to long polling. Deployed on a VPS with Nginx reverse proxy and SSL termination.",
  },
  {
    slug: "python-hub",
    emoji: "\u{1F40D}",
    title: "Python Hub Platform",
    description:
      "An educational platform for programming students, including tests and a payment gateway.",
    tech: ["Python", "Web", "Payments"],
    longDescription:
      "Python Hub is an educational platform designed to teach programming through structured courses, interactive coding exercises, and assessments. The platform includes a built-in code editor for practice, automated test grading, progress tracking, and a payment gateway for premium course access. Students can follow curated learning paths from beginner to advanced Python programming, with each module including video lessons, reading materials, and hands-on projects.",
    features: [
      "Structured learning paths from beginner to advanced",
      "Interactive code editor with real-time execution",
      "Automated test grading and feedback",
      "Progress tracking and achievement badges",
      "Payment gateway for premium courses",
      "Certificate generation upon course completion",
      "Discussion forums for student interaction",
    ],
    challenges:
      "Implementing a secure code execution environment that prevents malicious code while providing a smooth user experience was critical. Integrating the payment gateway with proper handling of subscriptions, refunds, and regional payment methods required careful attention to security and compliance.",
    techDetails:
      "Built with Python using Django framework for the backend. The code execution sandbox uses containerized environments for security. Payment processing integrates with multiple gateways for regional support. The frontend uses modern JavaScript with server-side rendering for SEO.",
  },
];
