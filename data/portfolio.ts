import { PersonalInfo, Project, Experience, Skill } from '../types';

export const personalInfo: PersonalInfo = {
  name: 'Harsh Rawat',
  title: 'Problem Solver',
  bio: 'Waiting for AGI ... Experimenting without expectation ... Self-taught ... Never been to college',
  location: 'Bharat, Delhi',
  email: 'harshrawat.dev@gmail.com',
  //   phone: '+1 (555) 123-4567',
  website: 'https://www.harshraw.at/',
  github: 'https://github.com/Harshrawat27',
  linkedin: 'https://www.linkedin.com/in/harsh-rawat-037a59202/',
  twitter: 'https://x.com/Harshrwt27',
  avatar: '/profile.png',
};

export const projects: Project[] = [
  {
    id: '1',
    title: 'LearNoted',
    description:
      'Look up words instantly, highlight important content, and save video timestamps all in one dashboard. Your personal web learning assistant.',
    image:
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop',
    technologies: [
      'Next.js',
      'TypeScript',
      'PostgreSQL',
      'Stripe',
      'Tailwind CSS',
    ],
    githubUrl: 'https://github.com/Harshrawat27/LearNoted',
    liveUrl: 'https://www.learnoted.com/',
    featured: true,
    category: 'crome extension',
    year: 2024,
  },
  {
    id: '2',
    title: 'GitHubFolio',
    description:
      'Turn your GitHub profile into a stunning minimal portfolio website with just your username.',
    image:
      'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&h=400&fit=crop',
    technologies: ['React', 'Node.js', 'Socket.io', 'MongoDB', 'Material-UI'],
    githubUrl: 'https://github.com/Harshrawat27/GitHubFolio',
    liveUrl: 'https://www.githubfolio.com/',
    featured: true,
    category: 'web',
    year: 2025,
  },
  {
    id: '3',
    title: 'Weather Dashboard',
    description:
      'A responsive weather dashboard that provides detailed weather information, forecasts, and interactive maps using multiple weather APIs.',
    image:
      'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=600&h=400&fit=crop',
    technologies: ['Vue.js', 'TypeScript', 'Chart.js', 'OpenWeather API'],
    githubUrl: 'https://github.com/johndoe/weather-dashboard',
    liveUrl: 'https://weather.johndoe.dev',
    featured: false,
    category: 'web',
    year: 2023,
  },
  {
    id: '4',
    title: 'Mobile Fitness Tracker',
    description:
      'A React Native mobile app for tracking workouts, nutrition, and fitness goals with offline capability and data synchronization.',
    image:
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop',
    technologies: ['React Native', 'TypeScript', 'SQLite', 'Redux'],
    githubUrl: 'https://github.com/johndoe/fitness-tracker',
    featured: false,
    category: 'mobile',
    year: 2022,
  },
];

export const experiences: Experience[] = [
  {
    id: '1',
    company: 'TechCorp Inc.',
    position: 'Senior Full Stack Developer',
    startDate: '2022-01',
    description:
      'Lead development of enterprise web applications using React, Node.js, and AWS. Mentored junior developers and implemented CI/CD pipelines.',
    technologies: ['React', 'Node.js', 'AWS', 'PostgreSQL', 'Docker'],
    current: true,
  },
  {
    id: '2',
    company: 'StartupXYZ',
    position: 'Frontend Developer',
    startDate: '2020-06',
    endDate: '2021-12',
    description:
      'Developed responsive web applications and improved user experience. Collaborated with design team to implement pixel-perfect UI components.',
    technologies: ['React', 'TypeScript', 'Styled Components', 'Redux'],
    current: false,
  },
  {
    id: '3',
    company: 'Digital Agency',
    position: 'Junior Web Developer',
    startDate: '2019-01',
    endDate: '2020-05',
    description:
      'Built client websites using modern web technologies. Gained experience in full-stack development and project management.',
    technologies: ['HTML', 'CSS', 'JavaScript', 'PHP', 'MySQL'],
    current: false,
  },
];

export const skills: Skill[] = [
  // Frontend
  { name: 'React', level: 'expert', category: 'frontend' },
  { name: 'Nextjs', level: 'expert', category: 'frontend' },
  { name: 'Python', level: 'expert', category: 'frontend' },
  { name: 'Typescript', level: 'expert', category: 'frontend' },
  {
    name: 'Anything to solve a problem',
    level: 'expert',
    category: 'frontend',
  },
  //   { name: 'React', level: 'expert', category: 'frontend' },
  //   { name: 'Next.js', level: 'advanced', category: 'frontend' },
  //   { name: 'TypeScript', level: 'advanced', category: 'frontend' },
  //   { name: 'Vue.js', level: 'intermediate', category: 'frontend' },
  //   { name: 'Tailwind CSS', level: 'advanced', category: 'frontend' },

  //   // Backend
  //   { name: 'Node.js', level: 'advanced', category: 'backend' },
  //   { name: 'Express.js', level: 'advanced', category: 'backend' },
  //   { name: 'Python', level: 'intermediate', category: 'backend' },
  //   { name: 'GraphQL', level: 'intermediate', category: 'backend' },

  //   // Database
  //   { name: 'PostgreSQL', level: 'advanced', category: 'database' },
  //   { name: 'MongoDB', level: 'intermediate', category: 'database' },
  //   { name: 'Redis', level: 'intermediate', category: 'database' },

  //   // Tools
  //   { name: 'Git', level: 'expert', category: 'tools' },
  //   { name: 'Docker', level: 'intermediate', category: 'tools' },
  //   { name: 'AWS', level: 'intermediate', category: 'tools' },
  //   { name: 'Figma', level: 'intermediate', category: 'design' },
];
