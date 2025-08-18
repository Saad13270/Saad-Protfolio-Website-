import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FiExternalLink, FiCalendar, FiLinkedin } from 'react-icons/fi';
import api from '../utils/http';
import personalInfo from '../data/personalInfo';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get('/blog');
        setPosts(response.data.posts);
        setLoading(false);
      } catch (err) {
        setError('Failed to load blog posts');
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <section className="section bg-bg-primary">
        <div className="container-custom text-center">
          <div className="spinner mx-auto"></div>
          <p className="text-gray-400 mt-4">Loading blog posts...</p>
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
    <section id="blog" className="section bg-bg-primary">
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
              Blog & Insights
            </motion.h2>
            <motion.p
              initial={{ y: 50, opacity: 0 }}
              animate={inView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="section-subtitle"
            >
              Sharing insights on DevOps, automation, and AI-powered infrastructure
            </motion.p>
          </div>

          {/* Blog Posts Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                animate={inView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                whileHover={{ y: -10 }}
                className="card group"
              >
                <div className="p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <FiLinkedin className="w-5 h-5 text-neon-yellow" />
                    <span className="text-sm text-gray-400">LinkedIn Post</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-neon-yellow mb-3 group-hover:text-yellow-400 transition-colors duration-300">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-400 mb-4 leading-relaxed">
                    {post.excerpt || post.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <FiCalendar className="w-4 h-4" />
                      <span>{new Date(post.date).toLocaleDateString()}</span>
                    </div>
                    
                    <motion.a
                      href={post.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center space-x-2 text-neon-yellow hover:text-yellow-400 transition-colors duration-300"
                    >
                      <span>Read More</span>
                      <FiExternalLink className="w-4 h-4" />
                    </motion.a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Call to Action */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center mt-12"
          >
            <motion.a
              href={personalInfo.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary inline-flex items-center space-x-2"
            >
              <FiLinkedin className="w-5 h-5" />
              <span>Follow on LinkedIn</span>
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Blog;
