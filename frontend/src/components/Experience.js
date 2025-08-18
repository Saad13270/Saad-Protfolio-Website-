import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
// import { FiBriefcase } from 'react-icons/fi';
import api from '../utils/http';

const Experience = () => {
  const [experience, setExperience] = useState([]);
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [experienceRes, educationRes] = await Promise.all([
          api.get('/experience'),
          api.get('/education')
        ]);
        
        setExperience(experienceRes.data.experience);
        setEducation(educationRes.data.education);
        setLoading(false);
      } catch (err) {
        setError('Failed to load experience and education data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <section className="section bg-bg-primary">
        <div className="container-custom text-center">
          <div className="spinner mx-auto"></div>
          <p className="text-gray-400 mt-4">Loading experience and education data...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="section bg-bg-primary">
        <div className="container-custom text-center">
          <p className="text-neon-red">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section id="experience" className="section bg-bg-primary">
      <div className="container-custom">
        <motion.div
          ref={ref}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Section Header */}
          <div className="text-center mb-16">
            <motion.h2
              initial={{ y: 50, opacity: 0 }}
              animate={inView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="section-title text-gradient"
            >
              Experience & Education
            </motion.h2>
            <motion.p
              initial={{ y: 50, opacity: 0 }}
              animate={inView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="section-subtitle"
            >
              My professional journey and educational background
            </motion.p>
          </div>

          {/* Experience Timeline */}
          <div className="mb-16">
            <h3 className="text-3xl font-bold text-neon-yellow mb-8 text-center">Work Experience</h3>
            <div className="space-y-8">
              {experience.map((exp, index) => (
                <motion.div
                  key={index}
                  initial={{ x: index % 2 === 0 ? -50 : 50, opacity: 0 }}
                  animate={inView ? { x: 0, opacity: 1 } : { x: index % 2 === 0 ? -50 : 50, opacity: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                  className="timeline-item"
                >
                  <div className="card">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                      <h4 className="text-xl font-bold text-neon-yellow">{exp.title}</h4>
                      <span className="text-gray-400 text-sm">{exp.period}</span>
                    </div>
                    <h5 className="text-lg font-semibold text-gray-300 mb-3">{exp.company}</h5>
                    <p className="text-gray-400 mb-4 leading-relaxed">{exp.description}</p>
                    
                    {/* Technologies */}
                    <div className="mb-4">
                      <h6 className="text-sm font-semibold text-neon-yellow mb-2">Technologies:</h6>
                      <div className="flex flex-wrap gap-2">
                        {exp.technologies.map((tech, techIndex) => (
                          <span
                            key={techIndex}
                            className="px-2 py-1 bg-bg-secondary text-neon-yellow text-xs rounded border border-neon-yellow/30"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Achievements */}
                    <div>
                      <h6 className="text-sm font-semibold text-neon-yellow mb-2">Key Achievements:</h6>
                      <ul className="space-y-1">
                        {exp.achievements.map((achievement, achievementIndex) => (
                          <li key={achievementIndex} className="text-gray-400 text-sm flex items-start space-x-2">
                            <span className="text-neon-yellow mt-1">•</span>
                            <span>{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Education Timeline */}
          <div>
            <h3 className="text-3xl font-bold text-neon-yellow mb-8 text-center">Certification and Training</h3>
            <div className="space-y-8">
              {education.map((edu, index) => (
                <motion.div
                  key={index}
                  initial={{ x: index % 2 === 0 ? -50 : 50, opacity: 0 }}
                  animate={inView ? { x: 0, opacity: 1 } : { x: index % 2 === 0 ? -50 : 50, opacity: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                  className="timeline-item"
                >
                  <div className="card">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                      <h4 className="text-xl font-bold text-neon-yellow">{edu.name}</h4>
                      <span className="text-gray-400 text-sm">{edu.period}</span>
                    </div>
                    <h5 className="text-lg font-semibold text-gray-300 mb-3">{edu.institution}</h5>
                    <p className="text-gray-400 mb-4 leading-relaxed">{edu.description}</p>
                    
                    {/* Achievements */}
                    <div>
                      <h6 className="text-sm font-semibold text-neon-yellow mb-2">Achievements:</h6>
                      <ul className="space-y-1">
                        {edu.achievements.map((achievement, achievementIndex) => (
                          <li key={achievementIndex} className="text-gray-400 text-sm flex items-start space-x-2">
                            <span className="text-neon-yellow mt-1">•</span>
                            <span>{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Experience;
