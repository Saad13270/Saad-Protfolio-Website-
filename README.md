# DevSecOps Engineer Portfolio Website

A modern, responsive portfolio website built with React, Node.js, and Docker, featuring dark theme with neon accents and comprehensive DevOps setup.

## 🚀 Tech Stack

- **Frontend**: React + Tailwind CSS + Framer Motion
- **Backend**: Node.js + Express.js
- **Deployment**: Docker + Docker Compose + Jenkins CI/CD
- **Styling**: Dark theme with yellow, white, and red neon accents

## 📁 Project Structure

```
portfolio/
├── frontend/                 # React application
├── backend/                  # Node.js API server
├── projects/                 # Isolated project JSON files
├── Dockerfile               # Frontend Dockerfile
├── docker-compose.yml       # Multi-service setup
├── Jenkinsfile              # CI/CD pipeline
└── README.md               # This file
```

## 🛠️ Local Development

### Prerequisites

- Node.js (v16+)
- npm or yarn
- Docker & Docker Compose
- Git

### Running Locally

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd portfolio
   ```

2. **Install dependencies**
   ```bash
   # Frontend
   cd frontend
   npm install
   
   # Backend
   cd ../backend
   npm install
   ```

3. **Start development servers**
   ```bash
   # Terminal 1 - Frontend (port 3000)
   cd frontend
   npm start
   
   # Terminal 2 - Backend (port 5000)
   cd backend
   npm start
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - API Health Check: http://localhost:5000/health

### Quick Start (Recommended)

Use the provided startup script to run both servers automatically:

```bash
# Make sure you're in the portfolio root directory
cd /home/saad/github/portfolio

# Run the startup script
./start-local.sh
```

This will:
- ✅ Install dependencies automatically
- ✅ Start backend on port 5000
- ✅ Start frontend on port 3000
- ✅ Test all API endpoints
- ✅ Open your browser to http://localhost:3000

### Manual Start

If you prefer to start servers manually:

```bash
# Terminal 1 - Start backend
cd backend
npm install
npm start

# Terminal 2 - Start frontend
cd frontend
npm install
npm start
```

## 🐳 Docker Deployment

### Building Images

```bash
# Build frontend image
docker build -t portfolio-frontend .

# Build backend image
docker build -t portfolio-backend ./backend
```

### Running with Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 🔧 Configuration & Customization

### Personal Information
The portfolio is now configured with Saad Ahmad's information:
- **Name**: Saad Ahmad
- **Title**: Cloud-Native & Automation Specialist
- **Email**: sayedsaadahmad254@gmail.com
- **Phone**: +92 3405030768
- **Location**: Mardan, Pakistan

### JSON-Based Data Management

All content is stored in `/backend/data/*.json` files, making it easy to update without touching code:

- **Skills**: `/backend/data/skills.json` - Technical skills and proficiency levels
- **Projects**: `/projects/*.json` - Project details and metadata
- **Blog Posts**: `/backend/data/blog.json` - LinkedIn articles and insights
- **Experience**: `/backend/data/experience.json` - Work experience timeline
- **Education**: `/backend/data/education.json` - Training & certifications

**Benefits:**
- ✅ No more "Failed to load..." errors
- ✅ Easy content updates by editing JSON files
- ✅ Dynamic data loading from APIs
- ✅ No code changes needed for content updates
- **GitHub**: https://github.com/Saad13270
- **LinkedIn**: https://www.linkedin.com/in/saad-ahmad-devops

### Updating Content

#### Projects
- Add new projects by creating JSON files in `/projects/`
- Follow the existing format in `project1.json`, `project2.json`, etc.
- Include: title, description, techStack, image, github, liveDemo, date, category, highlights, challenges, solutions

#### Blog Posts
- Update `frontend/src/data/personalInfo.js` in the `articles` array
- Include: title, description, link (LinkedIn post URL), date

#### Skills
- Modify `backend/data/skills.json` to update skill categories and proficiency levels
- Skills are organized by categories: Cloud & Infrastructure, CI/CD & Automation, Programming & Data, Monitoring & Analytics

### Replacing Placeholders

1. **Profile Information**
   - Replace `assets/profile.png` with your actual profile picture
   - Update `public/resume.pdf` with your resume
   - Edit personal info in `frontend/src/data/personalInfo.js`

2. **Contact Information**
   - Update email in `backend/config/email.js`
   - Replace social media links in `frontend/src/data/personalInfo.js`

3. **Projects**
   - Add/remove project JSON files in `/projects/`
   - Each project should follow the format in `projects/project1.json`
   - Backend automatically aggregates all JSON files

4. **Skills**
   - Update skills in `backend/data/skills.json`
   - Modify skill categories and proficiency levels

### Environment Variables

Create `.env` files for both frontend and backend:

**Frontend (.env)**
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_ENVIRONMENT=development
```

**Backend (.env)**
```env
PORT=5000
NODE_ENV=development
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-app-password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
```

## 🚀 Production Deployment

### Vercel Deployment (Recommended)

1. **Prepare for Vercel**
   ```bash
   # Build the frontend
   cd frontend
   npm run build
   ```

2. **Deploy to Vercel**
   - Connect your GitHub repository to Vercel
   - Set build command: `cd frontend && npm install && npm run build`
   - Set output directory: `frontend/build`
   - Set root directory: `frontend`

3. **Environment Variables**
   - Add `REACT_APP_API_URL` pointing to your backend API
   - Add any other required environment variables

4. **Custom Domain (Optional)**
   - Configure your custom domain in Vercel dashboard
   - Update DNS settings as instructed

### AWS ECS Deployment

1. **Build and push to ECR**
   ```bash
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com
   
   docker tag portfolio-frontend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/portfolio-frontend:latest
   docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/portfolio-frontend:latest
   ```

2. **Update ECS task definition**
   - Use the ECR image URIs
   - Configure environment variables
   - Set up load balancer

3. **Deploy to ECS**
   ```bash
   aws ecs update-service --cluster portfolio-cluster --service portfolio-service --force-new-deployment
   ```

### AWS Amplify Deployment

1. **Connect repository to Amplify**
2. **Configure build settings**
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm install
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: build
       files:
         - '**/*'
   ```

## 🔄 Jenkins CI/CD Pipeline

### Pipeline Configuration

The `Jenkinsfile` includes the following stages:
1. **Checkout**: Clone repository
2. **Install**: Install dependencies
3. **Build**: Build frontend and backend
4. **Test**: Run unit tests
5. **Docker Build**: Build Docker images
6. **Push**: Push to container registry
7. **Deploy**: Deploy to target environment

### Jenkins Setup

1. **Install Jenkins plugins**
   - Docker Pipeline
   - AWS ECS
   - Credentials Binding

2. **Configure credentials**
   - AWS credentials
   - Docker registry credentials
   - SSH keys for deployment

3. **Create pipeline job**
   - Point to repository
   - Use Jenkinsfile from SCM
   - Configure environment variables

## 📊 Monitoring & Logging

### Application Monitoring

- **Frontend**: React DevTools, Lighthouse audits
- **Backend**: Node.js monitoring with PM2
- **Infrastructure**: AWS CloudWatch, Docker logs

### Log Management

```bash
# View application logs
docker-compose logs -f frontend
docker-compose logs -f backend

# View system logs
journalctl -u docker
```

## 🔒 Security Considerations

1. **Environment Variables**: Never commit sensitive data
2. **Docker Security**: Use non-root users in containers
3. **API Security**: Implement rate limiting and CORS
4. **HTTPS**: Use SSL certificates in production
5. **Dependencies**: Regular security audits with `npm audit`

## 🧪 Testing

### Frontend Testing
```bash
cd frontend
npm test
npm run test:coverage
```

### Backend Testing
```bash
cd backend
npm test
npm run test:coverage
```

## 📈 Performance Optimization

1. **Frontend**
   - Code splitting with React.lazy()
   - Image optimization
   - Bundle analysis with webpack-bundle-analyzer

2. **Backend**
   - Caching with Redis
   - Database query optimization
   - PM2 clustering

3. **Infrastructure**
   - CDN for static assets
   - Load balancing
   - Auto-scaling groups

## 🐛 Troubleshooting

### Common Issues

1. **Port conflicts**
   ```bash
   # Check port usage
   lsof -i :3000
   lsof -i :5000
   ```

2. **Docker issues**
   ```bash
   # Clean up Docker
   docker system prune -a
   docker volume prune
   ```

3. **Node modules issues**
   ```bash
   # Clear cache
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

## 📞 Support

For issues and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review Docker and Jenkins logs

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Note**: Remember to replace all placeholder values (emails, social links, profile picture, resume) before deploying to production!
