# Blog App with Testing + CI/CD Pipeline

[![CI/CD Pipeline](https://github.com/yourusername/blog-app-with-cicd/workflows/CI/CD%20Pipeline/badge.svg)](https://github.com/yourusername/blog-app-with-cicd/actions)
[![Coverage](https://codecov.io/gh/yourusername/blog-app-with-cicd/branch/main/graph/badge.svg)](https://codecov.io/gh/yourusername/blog-app-with-cicd)

A full-stack blog application built with React, AWS CDK, and comprehensive testing + CI/CD pipeline implementation following Test-Driven Development (TDD) and DevOps best practices.

## 🚀 Live Demo

- **Frontend**: [https://your-cloudfront-url.cloudfront.net](https://your-cloudfront-url.cloudfront.net)
- **API**: [https://your-api-id.execute-api.us-east-1.amazonaws.com/prod](https://your-api-id.execute-api.us-east-1.amazonaws.com/prod)

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React App     │    │   API Gateway   │    │   Lambda Func   │
│   (Frontend)    │◄──►│     (REST)      │◄──►│     (Node.js)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                                              │
         ▼                                              ▼
┌─────────────────┐                            ┌─────────────────┐
│   CloudFront    │                            │   DynamoDB      │
│     (CDN)       │                            │   (Database)    │
└─────────────────┘                            └─────────────────┘
         │
         ▼
┌─────────────────┐
│       S3        │
│  (Static Host)  │
└─────────────────┘
```

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with TypeScript
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **CSS3** - Responsive styling

### Backend & Infrastructure
- **AWS CDK** - Infrastructure as Code
- **AWS Lambda** - Serverless API functions
- **API Gateway** - REST API management
- **DynamoDB** - NoSQL database
- **S3** - Static website hosting
- **CloudFront** - Content delivery network

### Testing
- **Jest** - Testing framework
- **React Testing Library** - React component testing
- **80%+ Coverage** - Enforced code coverage

### CI/CD
- **GitHub Actions** - Automated workflows
- **AWS CLI** - Deployment automation
- **Codecov** - Coverage reporting

## 📋 Prerequisites

- Node.js 18+ and npm
- AWS CLI configured with appropriate permissions
- AWS CDK CLI installed globally (`npm install -g aws-cdk`)
- Git for version control

## 🚀 Quick Start

### 1. Clone and Setup
```bash
git clone https://github.com/yourusername/blog-app-with-cicd.git
cd blog-app-with-cicd

# Install root dependencies
npm install

# Install frontend dependencies
cd frontend && npm install

# Install infrastructure dependencies
cd ../infrastructure && npm install
```

### 2. Local Development
```bash
# From root directory - starts both frontend and backend
npm start

# Or run individually:
npm run start:frontend  # React dev server on http://localhost:3000
npm run start:api      # Local API development
```

### 3. Testing
```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run frontend tests only
cd frontend && npm test

# Run infrastructure tests
cd infrastructure && npm test
```

### 4. Build & Deploy
```bash
# Build entire project
npm run build

# Deploy to AWS (requires AWS credentials)
npm run deploy

# Clean up AWS resources
npm run destroy
```

## 🧪 Testing Strategy

This project implements **Test-Driven Development (TDD)** with comprehensive testing:

### Test Types
- **Unit Tests** - Individual component/function testing
- **Integration Tests** - Component interaction testing
- **End-to-End Tests** - Full user workflow testing

### Coverage Requirements
- **80%+ Code Coverage** enforced
- **Branch Coverage** included
- **Function Coverage** tracked

### Test Commands
```bash
# Watch mode for development
npm test

# CI mode with coverage
npm run test:ci

# Coverage report
npm run test:coverage
```

## 🏗️ Infrastructure

### AWS Resources Created
- **S3 Bucket** - Static website hosting
- **CloudFront Distribution** - CDN and HTTPS
- **Lambda Function** - API backend
- **API Gateway** - REST API endpoints
- **DynamoDB Table** - Blog posts storage

### CDK Commands
```bash
cd infrastructure

# Bootstrap CDK (first time only)
npx cdk bootstrap

# Preview changes
npx cdk diff

# Deploy infrastructure
npx cdk deploy

# Destroy all resources
npx cdk destroy
```

## 📁 Project Structure

```
blog-app-with-cicd/
├── frontend/                 # React frontend application
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── BlogList/
│   │   │   ├── BlogPost/
│   │   │   ├── CreatePost/
│   │   │   └── Layout/
│   │   ├── services/        # API service layer
│   │   ├── types/           # TypeScript type definitions
│   │   ├── hooks/           # Custom React hooks
│   │   └── __tests__/       # Test files
│   └── package.json
├── infrastructure/          # AWS CDK infrastructure
│   ├── lib/                # CDK stack definitions
│   ├── lambda/             # Lambda function code
│   ├── test/               # Infrastructure tests
│   └── package.json
├── .github/
│   └── workflows/          # GitHub Actions CI/CD
├── docs/                   # Additional documentation
├── .gitignore
├── README.md
└── package.json            # Root package.json
```

## 🔄 CI/CD Pipeline

### Workflow Triggers
- **Push to main** - Full deployment
- **Push to develop** - Testing only
- **Pull Requests** - Testing and validation

### Pipeline Stages

1. **Test Frontend**
   - Install dependencies
   - Run unit/integration tests
   - Generate coverage reports
   - Upload to Codecov

2. **Test Infrastructure**
   - Install CDK dependencies
   - Validate CDK synthesis
   - Run infrastructure tests

3. **Build & Deploy** (main branch only)
   - Build React application
   - Deploy infrastructure via CDK
   - Deploy frontend to S3
   - Invalidate CloudFront cache

4. **Cleanup** (configurable)
   - Destroy AWS resources to save costs
   - Runs after successful deployment

### GitHub Secrets Required

```bash
# AWS Credentials
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key

# Deployment Configuration
S3_BUCKET_NAME=your-s3-bucket-name
CLOUDFRONT_DISTRIBUTION_ID=your-distribution-id
```

## 🔧 Configuration

### Environment Variables

#### Frontend (.env)
```bash
REACT_APP_API_URL=https://your-api-gateway-url.execute-api.us-east-1.amazonaws.com/prod
```

#### Infrastructure
```bash
AWS_REGION=us-east-1
CDK_DEFAULT_ACCOUNT=your-aws-account-id
```

### Customization

#### Modify API Endpoints
Edit `frontend/src/services/api.ts` to change API behavior.

#### Update Infrastructure
Modify `infrastructure/lib/blog-app-stack.ts` for AWS resource changes.

#### Adjust Testing
Update `frontend/package.json` jest configuration for coverage thresholds.

## 📊 API Endpoints

### Blog Posts API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/posts` | Get all blog posts |
| GET | `/posts/{id}` | Get single blog post |
| POST | `/posts` | Create new blog post |
| PUT | `/posts/{id}` | Update blog post |
| DELETE | `/posts/{id}` | Delete blog post |

### Example API Usage

```bash
# Get all posts
curl https://your-api-url/posts

# Create a post
curl -X POST https://your-api-url/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Blog Post",
    "content": "Post content here",
    "author": "Author Name",
    "tags": ["react", "aws"]
  }'
```

## 🐛 Troubleshooting

### Common Issues

#### Frontend Build Fails
```bash
# Clear node modules and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install
```

#### CDK Deployment Fails
```bash
# Check AWS credentials
aws sts get-caller-identity

# Bootstrap CDK if needed
cd infrastructure
npx cdk bootstrap
```

#### Tests Failing
```bash
# Update snapshots if UI changed
cd frontend
npm test -- --updateSnapshot

# Check coverage thresholds
npm run test:coverage
```

### AWS Costs

This project uses AWS services that may incur costs:
- **Lambda** - First 1M requests free
- **DynamoDB** - On-demand pricing
- **S3** - Storage and transfer costs
- **CloudFront** - CDN transfer costs
- **API Gateway** - Request-based pricing

💡 **Cost Optimization**: The CI/CD pipeline includes an automatic cleanup step to destroy resources after testing.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Write tests for your changes
4. Ensure all tests pass (`npm test`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Development Guidelines

- Follow TDD practices - write tests first
- Maintain 80%+ code coverage
- Use TypeScript for type safety
- Follow existing code style
- Update documentation for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

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