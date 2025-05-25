import { PersonalInfo, Project, Experience, Skill, BlogPost } from '../types';

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
    githubUrl: 'https://github.com/johndoe/task-manager',
    liveUrl: 'https://github.com/Harshrawat27/GitHubFolio',
    featured: true,
    category: 'web',
    year: 2023,
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

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Building Scalable React Applications: Best Practices and Patterns',
    excerpt:
      'Learn the essential patterns and best practices for building large-scale React applications that are maintainable and performant.',
    content: `
# Building Scalable React Applications: Best Practices and Patterns

Building large-scale React applications requires careful planning and adherence to best practices. In this post, we'll explore the key patterns and techniques that will help you create maintainable and scalable React applications.

## 1. Component Architecture

### Atomic Design Principles
Organize your components using atomic design principles:
- **Atoms**: Basic building blocks (buttons, inputs)
- **Molecules**: Simple groups of UI elements
- **Organisms**: Complex UI components
- **Templates**: Page-level objects that place components into layout
- **Pages**: Specific instances of templates

### Example Component Structure
\`\`\`
src/
  components/
    atoms/
      Button/
      Input/
    molecules/
      SearchBar/
      Card/
    organisms/
      Header/
      ProductList/
    templates/
      PageLayout/
    pages/
      HomePage/
      ProductPage/
\`\`\`

## 2. State Management

### Choose the Right Tool
- **Local State**: Use \`useState\` for component-specific state
- **Global State**: Use Context API for simple global state
- **Complex State**: Use Redux Toolkit or Zustand for complex applications

### Example with Context API
\`\`\`jsx
const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
\`\`\`

## 3. Performance Optimization

### React.memo and useMemo
Prevent unnecessary re-renders:

\`\`\`jsx
const ExpensiveComponent = React.memo(({ data }) => {
  const processedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      processed: true
    }));
  }, [data]);

  return <div>{/* render processed data */}</div>;
});
\`\`\`

### Code Splitting
Use dynamic imports for lazy loading:

\`\`\`jsx
const LazyComponent = lazy(() => import('./LazyComponent'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </Suspense>
  );
}
\`\`\`

## 4. Testing Strategy

### Unit Testing
Test individual components in isolation:

\`\`\`jsx
import { render, screen } from '@testing-library/react';
import Button from './Button';

test('renders button with text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});
\`\`\`

### Integration Testing
Test component interactions and data flow.

## 5. Error Handling

### Error Boundaries
Implement error boundaries to catch and handle errors gracefully:

\`\`\`jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}
\`\`\`

## Conclusion

Building scalable React applications is about more than just writing code—it's about creating a sustainable architecture that can grow with your project. By following these patterns and best practices, you'll be well-equipped to handle the challenges of large-scale development.

Remember to:
- Keep components small and focused
- Manage state appropriately
- Optimize for performance
- Write comprehensive tests
- Handle errors gracefully

Happy coding!
    `,
    publishDate: '2024-01-15',
    readTime: 8,
    tags: ['React', 'JavaScript', 'Frontend', 'Best Practices'],
    featured: true,
  },
  {
    id: '2',
    title: 'The Future of Web Development: Trends to Watch in 2024',
    excerpt:
      'Explore the emerging trends and technologies that are shaping the future of web development in 2024 and beyond.',
    content: `
# The Future of Web Development: Trends to Watch in 2024

The web development landscape is constantly evolving, and 2024 promises to bring exciting new trends and technologies. Let's explore what's on the horizon for developers.

## 1. AI-Powered Development Tools

### Code Generation and Assistance
AI tools like GitHub Copilot and ChatGPT are revolutionizing how we write code:
- Automated code completion
- Bug detection and fixes
- Documentation generation
- Code review assistance

### Impact on Development Workflow
\`\`\`javascript
// AI-assisted code generation example
function generateUserProfile(userData) {
  // AI can suggest optimal data structures and validation
  return {
    id: userData.id,
    name: userData.name,
    email: userData.email,
    preferences: userData.preferences || {}
  };
}
\`\`\`

## 2. WebAssembly (WASM) Growth

### Performance-Critical Applications
WebAssembly enables near-native performance in browsers:
- Image/video processing
- Gaming applications
- Scientific computing
- Crypto operations

### Language Diversity
Languages compiling to WASM:
- Rust
- C/C++
- Go
- AssemblyScript

## 3. Edge Computing and Serverless

### Edge Functions
Deploy functions closer to users for better performance:
- Reduced latency
- Better user experience
- Global distribution

### Serverless Adoption
Benefits of serverless architecture:
- Automatic scaling
- Pay-per-use pricing
- Reduced operational overhead
- Focus on business logic

## 4. Progressive Web Apps (PWAs) Evolution

### Enhanced Capabilities
PWAs are becoming more powerful:
- File system access
- Hardware integration
- Advanced caching strategies
- Background sync

### Mobile-First Development
PWAs bridge the gap between web and native:
- App-like experience
- Offline functionality
- Push notifications
- Installation prompts

## 5. Component-Driven Development

### Design Systems
Standardized component libraries:
- Consistent UI/UX
- Faster development
- Better collaboration
- Maintainable code

### Tools and Frameworks
Popular tools for component development:
- Storybook
- Bit
- Figma
- Design tokens

## 6. Micro-Frontends Architecture

### Scalable Team Organization
Break large applications into smaller, manageable pieces:
- Independent deployment
- Technology diversity
- Team autonomy
- Reduced complexity

### Implementation Strategies
\`\`\`javascript
// Module federation example
const ModuleFederationPlugin = require('@module-federation/webpack');

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'header',
      filename: 'remoteEntry.js',
      exposes: {
        './Header': './src/Header'
      }
    })
  ]
};
\`\`\`

## 7. Web3 and Blockchain Integration

### Decentralized Applications (dApps)
Web3 technologies are becoming mainstream:
- Smart contracts integration
- Cryptocurrency payments
- NFT marketplaces
- Decentralized storage

### Development Tools
Popular Web3 development tools:
- MetaMask integration
- Web3.js and Ethers.js
- IPFS for storage
- Hardhat for smart contracts

## 8. Sustainability and Green Computing

### Performance Optimization
Focus on reducing carbon footprint:
- Optimized bundle sizes
- Efficient algorithms
- Reduced server requests
- Green hosting providers

### Measuring Impact
Tools for measuring web sustainability:
- Website Carbon Calculator
- Lighthouse sustainability audits
- Core Web Vitals optimization

## Conclusion

The future of web development is exciting and full of opportunities. As developers, staying updated with these trends will help us build better, more efficient, and more user-friendly applications.

Key takeaways:
- Embrace AI tools for productivity
- Consider WebAssembly for performance-critical tasks
- Adopt edge computing for better user experience
- Build with sustainability in mind
- Stay curious and keep learning

The web platform continues to evolve, and these trends will shape how we build applications in the coming years. Which trend are you most excited about?
    `,
    publishDate: '2024-01-08',
    readTime: 6,
    tags: ['Web Development', 'Trends', 'Technology', 'Future'],
    featured: false,
  },
];
