import { Link } from 'react-router-dom';
import { BookOpen, Users, Award, Zap } from 'lucide-react';
import TypewriterText from '../components/TypewriterText';
import ScrollAnimation from '../components/ScrollAnimation';

function Home() {
  const features = [
    {
      icon: <BookOpen className="w-8 h-8 text-primary-600" />,
      title: 'Comprehensive Tutorials',
      description: 'Learn from detailed, step-by-step tutorials covering various technologies and frameworks.'
    },
    {
      icon: <Users className="w-8 h-8 text-primary-600" />,
      title: 'Community Driven',
      description: 'Join a community of learners and share your knowledge with others.'
    },
    {
      icon: <Award className="w-8 h-8 text-primary-600" />,
      title: 'Track Progress',
      description: 'Monitor your learning journey with progress tracking and completion badges.'
    },
    {
      icon: <Zap className="w-8 h-8 text-primary-600" />,
      title: 'Interactive Content',
      description: 'Engage with videos, code snippets, and interactive examples.'
    }
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-12">
        <TypewriterText />
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto mt-8 animate-fadeInUp" style={{ animationDelay: '1200ms' }}>
          Discover comprehensive tutorials, track your progress, and join a community of learners.
          Start your learning journey today!
        </p>
        <div className="space-x-4 animate-fadeInUp" style={{ animationDelay: '1400ms' }}>
          <Link to="/tutorials" className="btn btn-primary text-lg px-8 py-3">
            Browse Tutorials
          </Link>
          <Link to="/register" className="btn btn-secondary text-lg px-8 py-3">
            Get Started
          </Link>
        </div>
      </section>

      {/* Features Section with Scroll Animation */}
      <ScrollAnimation>
        <section className="py-12">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Why Choose Our Platform?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card text-center transform transition-all duration-500 hover:scale-105 hover:shadow-2xl"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </ScrollAnimation>

      {/* CTA Section */}
      <ScrollAnimation>
        <section className="bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-700 dark:to-primary-800 rounded-lg p-8 text-center text-white shadow-lg hover:shadow-2xl transition-shadow duration-300">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Learning?
          </h2>
          <p className="text-xl mb-6 opacity-90">
            Join thousands of learners who are already mastering new skills.
          </p>
          <Link to="/register" className="btn bg-white text-primary-600 hover:bg-gray-100 text-lg px-8 py-3">
            Create Free Account
          </Link>
        </section>
      </ScrollAnimation>
    </div>
  );
}

export default Home;