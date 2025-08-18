import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FiShield, FiZap, FiCode, FiTrendingUp, FiAward, FiUsers } from 'react-icons/fi';
import personalInfo from '../data/personalInfo';

const About = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const valueCards = [
    {
      icon: FiShield,
      title: "Security First",
      description: "Implementing security best practices from development to production",
      color: "text-neon-red"
    },
    {
      icon: FiZap,
      title: "Automation",
      description: "Streamlining processes through intelligent automation and CI/CD",
      color: "text-neon-yellow"
    },
    {
      icon: FiCode,
      title: "Infrastructure as Code",
      description: "Managing infrastructure through code for consistency and reliability",
      color: "text-neon-white"
    },
    {
      icon: FiTrendingUp,
      title: "Continuous Improvement",
      description: "Constantly evolving and improving systems and processes",
      color: "text-neon-yellow"
    },
    {
      icon: FiAward,
      title: "Excellence",
      description: "Delivering high-quality, secure, and scalable solutions",
      color: "text-neon-red"
    },
    {
      icon: FiUsers,
      title: "Collaboration",
      description: "Working closely with teams to achieve shared goals",
      color: "text-neon-white"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <section id="about" className="section bg-bg-secondary">
      <div className="container-custom">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={containerVariants}
        >
          {/* Section Header */}
          <div className="text-center mb-16">
            <motion.h2
              variants={cardVariants}
              className="section-title text-gradient"
            >
              About Me
            </motion.h2>
            <motion.p
              variants={cardVariants}
              className="section-subtitle"
            >
              Passionate about securing the future through innovative DevSecOps practices
            </motion.p>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            {/* Left Column - Bio */}
            <motion.div variants={cardVariants}>
              <div className="space-y-6">
                <h3 className="text-3xl font-bold text-neon-yellow mb-4">
                  {personalInfo.name}
                </h3>
                <p className="text-lg text-gray-300 leading-relaxed">
                  {personalInfo.about.summary}
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-neon-yellow font-semibold">Experience:</span>
                    <span className="text-gray-300">{personalInfo.about.experience}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className="text-neon-yellow font-semibold">Location:</span>
                    <span className="text-gray-300">{personalInfo.location}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className="text-neon-yellow font-semibold">Education:</span>
                    <span className="text-gray-300">
                      {personalInfo.about.education.degree} from {personalInfo.about.education.institution}
                    </span>
                  </div>
                </div>

                {/* Expertise Tags */}
                <div className="mt-6">
                  <h4 className="text-xl font-semibold text-neon-yellow mb-3">Areas of Expertise</h4>
                  <div className="flex flex-wrap gap-2">
                    {personalInfo.about.expertise.map((skill, index) => (
                      <motion.span
                        key={skill}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="px-3 py-1 bg-bg-card border border-neon-yellow/30 text-neon-yellow rounded-full text-sm"
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Column - Certification and Training */}
            <motion.div variants={cardVariants}>
              <div className="bg-bg-card rounded-xl p-6 border border-gray-800">
                <h4 className="text-2xl font-bold text-neon-yellow mb-6">Certification and Training</h4>
                <div className="space-y-4">
                  {personalInfo.about.certifications.map((cert, index) => (
                    <motion.div
                      key={cert}
                      initial={{ x: 50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center space-x-3 p-3 bg-bg-secondary rounded-lg border border-gray-700 hover:border-neon-yellow transition-colors duration-300"
                    >
                      <div className="w-2 h-2 bg-neon-yellow rounded-full"></div>
                      <span className="text-gray-300">{cert}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Value Cards */}
          <motion.div
            variants={cardVariants}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {valueCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.title}
                  variants={cardVariants}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="card card-hover text-center group"
                >
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-bg-secondary flex items-center justify-center group-hover:shadow-neon-yellow transition-all duration-300 ${card.color}`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-neon-yellow mb-3">
                    {card.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {card.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Fun Facts */}
          <motion.div
            variants={cardVariants}
            className="mt-16 text-center"
          >
            <h3 className="text-2xl font-bold text-neon-yellow mb-8">Fun Facts</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {personalInfo.funFacts.map((fact, index) => (
                <motion.div
                  key={fact}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-bg-card rounded-lg border border-gray-700 hover:border-neon-yellow transition-colors duration-300"
                >
                  <p className="text-gray-300">{fact}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;

