const express = require('express');
const router = express.Router();
const fs = require('fs-extra');
const path = require('path');

// GET /api/skills
router.get('/', async (req, res) => {
  try {
    const skillsPath = path.join(__dirname, '../data/skills.json');
    
    // Check if skills file exists
    if (!await fs.pathExists(skillsPath)) {
      return res.status(404).json({
        error: 'Skills data not found',
        message: 'Skills data file does not exist'
      });
    }

    // Read and return skills data
    const skillsData = await fs.readJson(skillsPath);
    
    if (validateSkillsData(skillsData)) {
      res.json({
        skills: skillsData,
        categories: Object.keys(skillsData),
        message: 'Skills data retrieved successfully'
      });
    } else {
      res.status(400).json({
        error: 'Invalid skills data',
        message: 'Skills data is not in the correct format'
      });
    }

  } catch (error) {
    console.error('Error fetching skills:', error);
    res.status(500).json({
      error: 'Failed to fetch skills',
      message: 'There was an error retrieving the skills data'
    });
  }
});

// GET /api/skills/:category
router.get('/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const skillsPath = path.join(__dirname, '../data/skills.json');
    
    if (!await fs.pathExists(skillsPath)) {
      return res.status(404).json({
        error: 'Skills data not found',
        message: 'Skills data file does not exist'
      });
    }

    const skillsData = await fs.readJson(skillsPath);
    
    if (!validateSkillsData(skillsData)) {
      return res.status(400).json({
        error: 'Invalid skills data',
        message: 'Skills data is not in the correct format'
      });
    }

    const categorySkills = skillsData[category];
    
    if (!categorySkills) {
      return res.status(404).json({
        error: 'Category not found',
        message: `Skills category '${category}' does not exist`,
        availableCategories: Object.keys(skillsData)
      });
    }

    res.json({
      category,
      skills: categorySkills,
      count: categorySkills.length,
      message: `Found ${categorySkills.length} skill(s) in category '${category}'`
    });

  } catch (error) {
    console.error(`Error fetching skills for category ${req.params.category}:`, error);
    res.status(500).json({
      error: 'Failed to fetch skills',
      message: 'There was an error retrieving the skills data'
    });
  }
});

// Helper function to validate skills data structure
function validateSkillsData(data) {
  if (!data || typeof data !== 'object') {
    return false;
  }

  // Check if data has at least one category
  const categories = Object.keys(data);
  if (categories.length === 0) {
    return false;
  }

  // Validate each category
  for (const category of categories) {
    if (!Array.isArray(data[category])) {
      return false;
    }

    // Validate each skill in the category
    for (const skill of data[category]) {
      if (!skill.name || typeof skill.name !== 'string') {
        return false;
      }
      
      if (skill.proficiency && (typeof skill.proficiency !== 'number' || skill.proficiency < 0 || skill.proficiency > 100)) {
        return false;
      }
    }
  }

  return true;
}

module.exports = router;

