const express = require('express');
const router = express.Router();
const fs = require('fs-extra');
const path = require('path');

// GET /api/education
router.get('/', async (req, res) => {
  try {
    const educationPath = path.join(__dirname, '../data/education.json');
    
    // Check if education file exists
    if (!await fs.pathExists(educationPath)) {
      return res.status(404).json({
        error: 'Education data not found',
        message: 'Education data file does not exist'
      });
    }

    // Read and return education data
    const educationData = await fs.readJson(educationPath);
    
    if (validateEducationData(educationData)) {
      // Sort by period (newest first)
      const sortedEducationData = educationData.sort((a, b) => {
        const dateA = new Date(a.period.split(' - ')[0]);
        const dateB = new Date(b.period.split(' - ')[0]);
        return dateB - dateA;
      });
      
      res.json({
        education: sortedEducationData,
        count: sortedEducationData.length,
        message: 'Education data retrieved successfully'
      });
    } else {
      res.status(400).json({
        error: 'Invalid education data',
        message: 'Education data is not in the correct format'
      });
    }

  } catch (error) {
    console.error('Error fetching education:', error);
    res.status(500).json({
      error: 'Failed to fetch education',
      message: 'There was an error retrieving the education data'
    });
  }
});

// GET /api/education/categories/:category
router.get('/categories/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const educationPath = path.join(__dirname, '../data/education.json');
    
    if (!await fs.pathExists(educationPath)) {
      return res.status(404).json({
        error: 'Education data not found',
        message: 'Education data file does not exist'
      });
    }

    const educationData = await fs.readJson(educationPath);
    
    if (!validateEducationData(educationData)) {
      return res.status(400).json({
        error: 'Invalid education data',
        message: 'Education data is not in the correct format'
      });
    }

    const filteredEducation = educationData.filter(edu => 
      edu.category && edu.category.toLowerCase() === String(category).toLowerCase()
    );

    filteredEducation.sort((a, b) => {
      const dateA = new Date(a.period.split(' - ')[0]);
      const dateB = new Date(b.period.split(' - ')[0]);
      return dateB - dateA;
    });

    res.json({
      education: filteredEducation,
      category,
      count: filteredEducation.length,
      message: `Found ${filteredEducation.length} education(s) in category '${category}'`
    });

  } catch (error) {
    console.error(`Error fetching education for category ${req.params.category}:`, error);
    res.status(500).json({
      error: 'Failed to fetch education',
      message: 'There was an error retrieving the education data'
    });
  }
});

// GET /api/education/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const educationPath = path.join(__dirname, '../data/education.json');
    
    if (!await fs.pathExists(educationPath)) {
      return res.status(404).json({
        error: 'Education data not found',
        message: 'Education data file does not exist'
      });
    }

    const educationData = await fs.readJson(educationPath);
    
    if (!validateEducationData(educationData)) {
      return res.status(400).json({
        error: 'Invalid education data',
        message: 'Education data is not in the correct format'
      });
    }

    const education = educationData.find(edu => edu.id === id);
    
    if (!education) {
      return res.status(404).json({
        error: 'Education not found',
        message: `Education with ID '${id}' does not exist`
      });
    }

    res.json({
      education,
      message: 'Education retrieved successfully'
    });

  } catch (error) {
    console.error(`Error fetching education ${req.params.id}:`, error);
    res.status(500).json({
      error: 'Failed to fetch education',
      message: 'There was an error retrieving the education'
    });
  }
});

// GET /api/education/types/:type
router.get('/types/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const educationPath = path.join(__dirname, '../data/education.json');
    
    if (!await fs.pathExists(educationPath)) {
      return res.status(404).json({
        error: 'Education data not found',
        message: 'Education data file does not exist'
      });
    }

    const educationData = await fs.readJson(educationPath);
    
    if (!validateEducationData(educationData)) {
      return res.status(400).json({
        error: 'Invalid education data',
        message: 'Education data is not in the correct format'
      });
    }

    const filteredEducation = educationData.filter(edu => 
      edu.type && edu.type.toLowerCase() === type.toLowerCase()
    );

    // Sort by period (newest first)
    filteredEducation.sort((a, b) => {
      const dateA = new Date(a.period.split(' - ')[0]);
      const dateB = new Date(b.period.split(' - ')[0]);
      return dateB - dateA;
    });

    res.json({
      education: filteredEducation,
      type,
      count: filteredEducation.length,
      message: `Found ${filteredEducation.length} education(s) of type '${type}'`
    });

  } catch (error) {
    console.error(`Error fetching education for type ${req.params.type}:`, error);
    res.status(500).json({
      error: 'Failed to fetch education',
      message: 'There was an error retrieving the education data'
    });
  }
});

// Helper function to validate education data structure
function validateEducationData(data) {
  if (!Array.isArray(data)) {
    return false;
  }

  for (const edu of data) {
    if (!edu.id || !edu.type || !edu.name || !edu.institution || !edu.period) {
      return false;
    }
    
    if (typeof edu.id !== 'string' || 
        typeof edu.type !== 'string' || 
        typeof edu.name !== 'string' || 
        typeof edu.institution !== 'string' || 
        typeof edu.period !== 'string') {
      return false;
    }

    if (edu.achievements && !Array.isArray(edu.achievements)) {
      return false;
    }
  }

  return true;
}

module.exports = router;

