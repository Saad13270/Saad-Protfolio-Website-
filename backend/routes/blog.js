const express = require('express');
const router = express.Router();
const fs = require('fs-extra');
const path = require('path');

// GET /api/blog
router.get('/', async (req, res) => {
  try {
    const blogPath = path.join(__dirname, '../data/blog.json');
    
    // Check if blog file exists
    if (!await fs.pathExists(blogPath)) {
      return res.status(404).json({
        error: 'Blog data not found',
        message: 'Blog data file does not exist'
      });
    }

    // Read and return blog data
    const blogData = await fs.readJson(blogPath);
    
    if (validateBlogData(blogData)) {
      // Sort by date (newest first)
      const sortedBlogData = blogData.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      res.json({
        posts: sortedBlogData,
        count: sortedBlogData.length,
        message: 'Blog posts retrieved successfully'
      });
    } else {
      res.status(400).json({
        error: 'Invalid blog data',
        message: 'Blog data is not in the correct format'
      });
    }

  } catch (error) {
    console.error('Error fetching blog posts:', error);
    res.status(500).json({
      error: 'Failed to fetch blog posts',
      message: 'There was an error retrieving the blog data'
    });
  }
});

// GET /api/blog/categories/:category
router.get('/categories/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const blogPath = path.join(__dirname, '../data/blog.json');
    
    if (!await fs.pathExists(blogPath)) {
      return res.status(404).json({
        error: 'Blog data not found',
        message: 'Blog data file does not exist'
      });
    }

    const blogData = await fs.readJson(blogPath);
    
    if (!validateBlogData(blogData)) {
      return res.status(400).json({
        error: 'Invalid blog data',
        message: 'Blog data is not in the correct format'
      });
    }

    const filteredPosts = blogData.filter(post => 
      post.category && post.category.toLowerCase() === String(category).toLowerCase()
    );

    // Sort by date (newest first)
    filteredPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json({
      posts: filteredPosts,
      category,
      count: filteredPosts.length,
      message: `Found ${filteredPosts.length} post(s) in category '${category}'`
    });

  } catch (error) {
    console.error(`Error fetching blog posts for category ${req.params.category}:`, error);
    res.status(500).json({
      error: 'Failed to fetch blog posts',
      message: 'There was an error retrieving the blog posts'
    });
  }
});

// GET /api/blog/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const blogPath = path.join(__dirname, '../data/blog.json');
    
    if (!await fs.pathExists(blogPath)) {
      return res.status(404).json({
        error: 'Blog data not found',
        message: 'Blog data file does not exist'
      });
    }

    const blogData = await fs.readJson(blogPath);
    
    if (!validateBlogData(blogData)) {
      return res.status(400).json({
        error: 'Invalid blog data',
        message: 'Blog data is not in the correct format'
      });
    }

    const post = blogData.find(post => post.id === id);
    
    if (!post) {
      return res.status(404).json({
        error: 'Post not found',
        message: `Blog post with ID '${id}' does not exist`
      });
    }

    res.json({
      post,
      message: 'Blog post retrieved successfully'
    });

  } catch (error) {
    console.error(`Error fetching blog post ${req.params.id}:`, error);
    res.status(500).json({
      error: 'Failed to fetch blog post',
      message: 'There was an error retrieving the blog post'
    });
  }
});

// Helper function to validate blog data structure
function validateBlogData(data) {
  if (!Array.isArray(data)) {
    return false;
  }

  for (const post of data) {
    if (!post.id || !post.title || !post.description || !post.link || !post.date) {
      return false;
    }
    
    if (typeof post.id !== 'string' || 
        typeof post.title !== 'string' || 
        typeof post.description !== 'string' || 
        typeof post.link !== 'string' || 
        typeof post.date !== 'string') {
      return false;
    }
  }

  return true;
}

module.exports = router;

