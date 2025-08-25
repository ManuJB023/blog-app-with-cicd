# Blog App with Testing + CI/CD Pipeline

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/yourusername/blog-app-with-cicd)
[![Coverage](https://img.shields.io/badge/coverage-80%25-green)](https://github.com/yourusername/blog-app-with-cicd)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

A full-stack blog application built with React, AWS CDK, and comprehensive testing + CI/CD pipeline implementation following Test-Driven Development (TDD) and DevOps best practices.

> **Note**: This is a demonstration project showcasing modern software development practices. AWS resources were temporarily deployed for testing and validation, then cleaned up to avoid ongoing costs. The application was successfully deployed and tested on AWS infrastructure.

## 📋 Project Overview

This project demonstrates a complete modern software development lifecycle including:

- **Frontend Development**: React 18 with TypeScript
- **Backend Architecture**: Serverless AWS infrastructure
- **Infrastructure as Code**: AWS CDK for reproducible deployments
- **Testing Strategy**: Test-driven development with comprehensive coverage
- **DevOps Practices**: Automated CI/CD pipeline with GitHub Actions
- **Cost Management**: Automated resource cleanup

## 🏗 Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React App     │    │   API Gateway   │    │   Lambda Func   │
│   (Frontend)    │◄──►│     (REST)      │◄──►│     (Node.js)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                                              │
         ▼                                              ▼
┌─────────────────┐                            ┌─────────────────┐
│   S3 Static     │                            │   DynamoDB      │
│   Website       │                            │   (Database)    │
└─────────────────┘                            └─────────────────┘
```

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern React with hooks and TypeScript
- **React Router** - Client-side routing and navigation
- **Axios** - HTTP client for API communication
- **CSS3** - Responsive styling and modern UI components

### Backend & Infrastructure
- **AWS CDK** - Infrastructure as Code framework
- **AWS Lambda** - Serverless API functions (Node.js 18.x)
- **API Gateway** - REST API management with CORS
- **DynamoDB** - NoSQL database for blog posts
- **S3** - Static website hosting

### Testing & Quality
- **Jest** - Testing framework with 80%+ coverage requirement
- **React Testing Library** - Component testing utilities
- **TypeScript** - Static type checking
- **ESLint** - Code quality and consistency

### DevOps & CI/CD
- **GitHub Actions** - Automated CI/CD pipeline
- **AWS CLI** - Deployment automation
- **CDK CLI** - Infrastructure deployment and management

## 🚀 Deployment Results

The project was successfully deployed and tested with the following results:

### Successful Deployment
- ✅ **Frontend**: Successfully deployed to S3 static website hosting
- ✅ **API**: Lambda function deployed with API Gateway integration
- ✅ **Database**: DynamoDB table created with proper permissions
- ✅ **Infrastructure**: All AWS resources created via CDK

### API Testing Results
```bash
# GET /posts - Successfully returned empty array initially
$ curl https://api-endpoint/posts
[]

# POST /posts - Successfully created blog post
$ curl -X POST https://api-endpoint/posts -d '{"title":"Test Post","content":"...","author":"Test"}'
{"id":"uuid","title":"Test Post",...,"createdAt":"2025-08-23T02:01:09.092Z"}

# GET /posts - Successfully returned created posts
$ curl https://api-endpoint/posts
[{"id":"uuid","title":"Test Post",...}]
```

### Frontend Functionality Verified
- ✅ Blog post creation form
- ✅ Post listing with responsive design
- ✅ Navigation between pages
- ✅ API integration with error handling
- ✅ Real-time data display

### Resource Cleanup
- ✅ All AWS resources successfully destroyed
- ✅ No ongoing costs incurred
- ✅ Proper cleanup automation demonstrated

## 📁 Project Structure

```
blog-app-with-cicd/
├── frontend/                 # React frontend application
│   ├── public/              # Static assets and HTML template
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── BlogList/    # Blog listing component
│   │   │   ├── BlogPost/    # Individual post component
│   │   │   ├── CreatePost/  # Post creation form
│   │   │   └── Layout/      # Page layout wrapper
│   │   ├── services/        # API service layer
│   │   ├── types/           # TypeScript type definitions
│   │   └── __tests__/       # Component tests
│   ├── package.json         # Frontend dependencies
│   └── tsconfig.json        # TypeScript configuration
├── infrastructure/          # AWS CDK infrastructure
│   ├── lib/                # CDK stack definitions
│   │   └── blog-app-stack.ts
│   ├── bin/                # CDK app entry point
│   │   └── blog-app.ts
│   ├── lambda/             # Lambda function code
│   │   ├── index.js        # API handler
│   │   └── package.json    # Lambda dependencies
│   ├── test/               # Infrastructure tests
│   ├── cdk.json           # CDK configuration
│   └── tsconfig.json      # TypeScript configuration
├── .github/
│   └── workflows/          # GitHub Actions CI/CD pipeline
│       └── ci-cd.yml
├── .gitignore             # Comprehensive git ignore rules
├── README.md              # This documentation
└── package.json           # Root project configuration
```

## 🧪 Testing Strategy

### Test-Driven Development (TDD) Approach
1. **Write Tests First** - Tests written before implementation
2. **Implement Features** - Code written to pass tests
3. **Refactor** - Code improved while maintaining test coverage

### Test Coverage Requirements
- **80%+ Code Coverage** enforced via Jest configuration
- **Component Testing** with React Testing Library
- **Integration Testing** for API endpoints
- **Infrastructure Testing** for CDK stacks

### Test Commands
```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run CI tests (non-interactive)
npm run test:ci
```

## 🔧 Local Development Setup

### Prerequisites
- Node.js 18+ and npm
- AWS CLI configured with appropriate permissions
- AWS CDK CLI installed globally

### Setup Commands
```bash
# Clone repository
git clone https://github.com/yourusername/blog-app-with-cicd.git
cd blog-app-with-cicd

# Install all dependencies
npm run install:all

# Start development servers
npm start

# Run tests
npm test

# Build project
npm run build
```

## 🚀 Deployment Process

### 1. Infrastructure Deployment
```bash
cd infrastructure
npx cdk bootstrap  # First time only
npx cdk deploy
```

### 2. Frontend Deployment
```bash
cd frontend
npm run build
aws s3 sync build/ s3://bucket-name --delete
```

### 3. Resource Cleanup
```bash
cd infrastructure
npx cdk destroy
```

## 🔄 CI/CD Pipeline

The GitHub Actions workflow provides:

### Automated Testing
- **Frontend Tests** - Jest and React Testing Library
- **Infrastructure Tests** - CDK stack validation
- **Build Verification** - Ensures deployable artifacts

### Deployment Automation
- **Infrastructure Deployment** - CDK stack deployment
- **Frontend Deployment** - S3 static site deployment
- **Resource Cleanup** - Automatic AWS resource cleanup

### Pipeline Triggers
- **Pull Requests** - Run tests and validation
- **Main Branch Push** - Full deployment cycle
- **Cleanup** - Automatic resource destruction

## 📊 Project Outcomes

### Technical Achievements
- ✅ **Full-Stack Application** - Working React + AWS serverless backend
- ✅ **Infrastructure as Code** - Reproducible AWS infrastructure
- ✅ **Test-Driven Development** - 80%+ test coverage maintained
- ✅ **DevOps Pipeline** - Automated CI/CD with GitHub Actions
- ✅ **Cost Management** - Successful resource cleanup automation

### Learning Outcomes
- Modern React development with TypeScript
- AWS serverless architecture design
- Infrastructure as Code with CDK
- Test-driven development practices
- DevOps and CI/CD implementation
- Cloud cost management strategies

### Industry Best Practices Demonstrated
- **Security**: IAM roles with least privilege access
- **Scalability**: Serverless architecture with auto-scaling
- **Maintainability**: TypeScript, comprehensive testing, documentation
- **Cost Efficiency**: Pay-per-use serverless model with cleanup
- **DevOps**: Automated testing, deployment, and infrastructure management

## 📝 API Documentation

### Endpoints
| Method | Endpoint | Description | Response |
|--------|----------|-------------|----------|
| GET | `/posts` | Get all blog posts | Array of blog posts |
| GET | `/posts/{id}` | Get specific post | Single blog post |
| POST | `/posts` | Create new post | Created blog post |
| DELETE | `/posts/{id}` | Delete post | 204 No Content |

### Blog Post Schema
```typescript
interface BlogPost {
  id: string;           // UUID
  title: string;        // Post title
  content: string;      // Post content
  author: string;       // Author name
  createdAt: string;    // ISO timestamp
  updatedAt: string;    // ISO timestamp
  tags: string[];       // Array of tags
}
```

## 🤝 Contributing

This project demonstrates modern development practices. Key areas for enhancement:

### Potential Improvements
- **Authentication** - Add AWS Cognito user management
- **Enhanced UI** - Implement rich text editor
- **Search** - Add post search functionality
- **Comments** - User comment system
- **Analytics** - Usage tracking and metrics
- **Monitoring** - CloudWatch dashboards
- **Security** - Content validation and sanitization

### Development Workflow
1. Fork the repository
2. Create feature branch
3. Write tests first (TDD approach)
4. Implement functionality
5. Ensure tests pass and coverage maintained
6. Submit pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 Project Status: COMPLETE

This project successfully demonstrates:
- ✅ **Full-stack development** with modern technologies
- ✅ **Cloud architecture** using AWS serverless services  
- ✅ **Infrastructure as Code** with AWS CDK
- ✅ **Test-driven development** with comprehensive coverage
- ✅ **DevOps practices** with automated CI/CD pipeline
- ✅ **Cost management** with successful resource cleanup

**Built with modern software development practices and cloud-native architecture.**

## 🙏 Acknowledgments

- **AWS CDK Team** - Infrastructure as Code framework
- **React Team** - Frontend framework
- **Jest Team** - Testing framework
- **GitHub Actions** - CI/CD platform

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/blog-app-with-cicd/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/blog-app-with-cicd/discussions)
- **Email**: mbauka@pm.me

---

**Built with ❤️ using TDD and DevOps best practices**