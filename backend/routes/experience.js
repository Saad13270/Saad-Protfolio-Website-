const express = require('express');
const router = express.Router();
const fs = require('fs-extra');
const path = require('path');

// GET /api/experience
router.get('/', async (req, res) => {
  try {
    const experiencePath = path.join(__dirname, '../data/experience.json');
    
    // Check if experience file exists
    if (!await fs.pathExists(experiencePath)) {
      return res.status(404).json({
        error: 'Experience data not found',
        message: 'Experience data file does not exist'
      });
    }

    // Read and return experience data
    const experienceData = await fs.readJson(experiencePath);
    
    if (validateExperienceData(experienceData)) {
      // Sort by period (newest first)
      const sortedExperienceData = experienceData.sort((a, b) => {
        const dateA = new Date(a.period.split(' - ')[0]);
        const dateB = new Date(b.period.split(' - ')[0]);
        return dateB - dateA;
      });
      
      res.json({
        experience: sortedExperienceData,
        count: sortedExperienceData.length,
        message: 'Experience data retrieved successfully'
      });
    } else {
      res.status(400).json({
        error: 'Invalid experience data',
        message: 'Experience data is not in the correct format'
      });
    }

  } catch (error) {
    console.error('Error fetching experience:', error);
    res.status(500).json({
      error: 'Failed to fetch experience',
      message: 'There was an error retrieving the experience data'
    });
  }
});

// GET /api/experience/categories/:category
router.get('/categories/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const experiencePath = path.join(__dirname, '../data/experience.json');
    
    if (!await fs.pathExists(experiencePath)) {
      return res.status(404).json({
        error: 'Experience data not found',
        message: 'Experience data file does not exist'
      });
    }

    const experienceData = await fs.readJson(experiencePath);
    
    if (!validateExperienceData(experienceData)) {
      return res.status(400).json({
        error: 'Invalid experience data',
        message: 'Experience data is not in the correct format'
      });
    }

    const filteredExperience = experienceData.filter(exp => 
      exp.category && exp.category.toLowerCase() === String(category).toLowerCase()
    );

    filteredExperience.sort((a, b) => {
      const dateA = new Date(a.period.split(' - ')[0]);
      const dateB = new Date(b.period.split(' - ')[0]);
      return dateB - dateA;
    });

    res.json({
      experience: filteredExperience,
      category,
      count: filteredExperience.length,
      message: `Found ${filteredExperience.length} experience(s) in category '${category}'`
    });

  } catch (error) {
    console.error(`Error fetching experience for category ${req.params.category}:`, error);
    res.status(500).json({
      error: 'Failed to fetch experience',
      message: 'There was an error retrieving the experience data'
    });
  }
});

// GET /api/experience/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const experiencePath = path.join(__dirname, '../data/experience.json');
    
    if (!await fs.pathExists(experiencePath)) {
      return res.status(404).json({
        error: 'Experience data not found',
        message: 'Experience data file does not exist'
      });
    }

    const experienceData = await fs.readJson(experiencePath);
    
    if (!validateExperienceData(experienceData)) {
      return res.status(400).json({
        error: 'Invalid experience data',
        message: 'Experience data is not in the correct format'
      });
    }

    const experience = experienceData.find(exp => exp.id === id);
    
    if (!experience) {
      return res.status(404).json({
        error: 'Experience not found',
        message: `Experience with ID '${id}' does not exist`
      });
    }

    res.json({
      experience,
      message: 'Experience retrieved successfully'
    });

  } catch (error) {
    console.error(`Error fetching experience ${req.params.id}:`, error);
    res.status(500).json({
      error: 'Failed to fetch experience',
      message: 'There was an error retrieving the experience'
    });
  }
});

// Helper function to validate experience data structure
function validateExperienceData(data) {
  if (!Array.isArray(data)) {
    return false;
  }

  for (const exp of data) {
    if (!exp.id || !exp.title || !exp.company || !exp.period || !exp.description) {
      return false;
    }
    
    if (typeof exp.id !== 'string' || 
        typeof exp.title !== 'string' || 
        typeof exp.company !== 'string' || 
        typeof exp.period !== 'string' || 
        typeof exp.description !== 'string') {
      return false;
    }

    if (exp.technologies && !Array.isArray(exp.technologies)) {
      return false;
    }

    if (exp.achievements && !Array.isArray(exp.achievements)) {
      return false;
    }
  }

  return true;
}

module.exports = router;

