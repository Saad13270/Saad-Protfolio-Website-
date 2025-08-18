const express = require('express');
const router = express.Router();
const fs = require('fs-extra');
const path = require('path');

// GET /api/projects
router.get('/', async (req, res) => {
  try {
    const projectsDir = path.join(__dirname, '../../projects');
    
    // Check if projects directory exists
    if (!await fs.pathExists(projectsDir)) {
      return res.status(404).json({
        error: 'Projects directory not found',
        message: 'Projects directory does not exist'
      });
    }

    // Read all JSON files from projects directory
    const files = await fs.readdir(projectsDir);
    const jsonFiles = files.filter(file => file.endsWith('.json'));

    if (jsonFiles.length === 0) {
      return res.json({
        projects: [],
        message: 'No projects found'
      });
    }

    // Read and parse each JSON file
    const projects = [];
    for (const file of jsonFiles) {
      try {
        const filePath = path.join(projectsDir, file);
        const projectData = await fs.readJson(filePath);
        
        // Validate project data structure
        if (validateProjectData(projectData)) {
          projects.push({
            ...projectData,
            id: path.parse(file).name // Use filename without extension as ID
          });
        } else {
          console.warn(`Invalid project data in ${file}`);
        }
      } catch (error) {
        console.error(`Error reading project file ${file}:`, error);
      }
    }

    // Sort projects by date (newest first)
    projects.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json({
      projects,
      count: projects.length,
      message: `Found ${projects.length} project(s)`
    });

  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({
      error: 'Failed to fetch projects',
      message: 'There was an error retrieving the projects'
    });
  }
});

// Helper to validate and resolve project file path safely
function resolveProjectPathSafe(id) {
  const baseDir = path.join(__dirname, '../../projects');
  // allow only safe characters
  if (!/^[a-zA-Z0-9_-]+$/.test(id)) {
    return { error: 'Invalid project id' };
  }
  const candidate = path.join(baseDir, `${id}.json`);
  const resolved = path.resolve(candidate);
  if (!resolved.startsWith(path.resolve(baseDir))) {
    return { error: 'Invalid project id' };
  }
  return { path: resolved };
}

// GET /api/projects/categories/:category
router.get('/categories/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const projectsDir = path.join(__dirname, '../../projects');
    
    if (!await fs.pathExists(projectsDir)) {
      return res.status(404).json({
        error: 'Projects directory not found',
        message: 'Projects directory does not exist'
      });
    }

    const files = await fs.readdir(projectsDir);
    const jsonFiles = files.filter(file => file.endsWith('.json'));

    const filteredProjects = [];
    for (const file of jsonFiles) {
      try {
        const filePath = path.join(projectsDir, file);
        const projectData = await fs.readJson(filePath);
        
        if (validateProjectData(projectData) && 
            projectData.category && 
            projectData.category.toLowerCase() === String(category).toLowerCase()) {
          filteredProjects.push({
            ...projectData,
            id: path.parse(file).name
          });
        }
      } catch (error) {
        console.error(`Error reading project file ${file}:`, error);
      }
    }

    filteredProjects.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json({
      projects: filteredProjects,
      category,
      count: filteredProjects.length,
      message: `Found ${filteredProjects.length} project(s) in category '${category}'`
    });

  } catch (error) {
    console.error(`Error fetching projects for category ${req.params.category}:`, error);
    res.status(500).json({
      error: 'Failed to fetch projects',
      message: 'There was an error retrieving the projects'
    });
  }
});

// GET /api/projects/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const resolved = resolveProjectPathSafe(id);
    if (resolved.error) {
      return res.status(400).json({ error: resolved.error });
    }
    const projectPath = resolved.path;

    // Check if project file exists
    if (!await fs.pathExists(projectPath)) {
      return res.status(404).json({
        error: 'Project not found',
        message: `Project with ID '${id}' does not exist`
      });
    }

    // Read and return project data
    const projectData = await fs.readJson(projectPath);
    
    if (validateProjectData(projectData)) {
      res.json({
        ...projectData,
        id
      });
    } else {
      res.status(400).json({
        error: 'Invalid project data',
        message: 'Project data is not in the correct format'
      });
    }

  } catch (error) {
    console.error(`Error fetching project ${req.params.id}:`, error);
    res.status(500).json({
      error: 'Failed to fetch project',
      message: 'There was an error retrieving the project'
    });
  }
});

// Helper function to validate project data structure
function validateProjectData(data) {
  const requiredFields = ['title', 'description', 'techStack', 'image'];
  const optionalFields = ['github', 'liveDemo', 'date', 'category', 'featured'];
  
  // Check required fields
  for (const field of requiredFields) {
    if (!data[field]) {
      return false;
    }
  }

  // Validate data types
  if (typeof data.title !== 'string' || 
      typeof data.description !== 'string' || 
      !Array.isArray(data.techStack)) {
    return false;
  }

  return true;
}

module.exports = router;

