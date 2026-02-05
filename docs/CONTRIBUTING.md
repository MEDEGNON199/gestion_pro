# 🤝 Contributing to TaskFlow

Thank you for your interest in contributing to TaskFlow! This guide will help you get started with contributing to our project.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contributing Guidelines](#contributing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Documentation](#documentation)

---

## 📜 Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please read it before contributing.

### Our Pledge
- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Respect different viewpoints and experiences

---

## 🚀 Getting Started

### Ways to Contribute
- 🐛 **Bug Reports** - Help us identify and fix issues
- 💡 **Feature Requests** - Suggest new features or improvements
- 📝 **Documentation** - Improve our docs and guides
- 🔧 **Code Contributions** - Fix bugs or implement features
- 🎨 **Design** - Improve UI/UX and visual design
- 🧪 **Testing** - Write tests and improve test coverage

### Before You Start
1. Check existing [issues](https://github.com/yourusername/taskflow/issues) and [pull requests](https://github.com/yourusername/taskflow/pulls)
2. Read our [roadmap](ROADMAP.md) to understand project direction
3. Join our [Discord community](https://discord.gg/taskflow) for discussions

---

## 💻 Development Setup

### Prerequisites
- Node.js 18+
- PostgreSQL 12+
- Git

### Setup Steps
1. **Fork the repository**
   ```bash
   # Click "Fork" on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/taskflow.git
   cd taskflow
   ```

2. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/original-owner/taskflow.git
   ```

3. **Install dependencies**
   ```bash
   # Backend
   cd taskflow-api
   npm install
   
   # Frontend
   cd ../taskflow-frontend
   npm install
   ```

4. **Set up environment**
   ```bash
   # Copy example files and configure
   cp taskflow-api/.env.example taskflow-api/.env
   cp taskflow-frontend/.env.example taskflow-frontend/.env
   ```

5. **Set up database**
   ```bash
   # Create database and run migrations
   cd taskflow-api
   npm run migration:run
   ```

6. **Start development servers**
   ```bash
   # Terminal 1 - Backend
   cd taskflow-api
   npm run start:dev
   
   # Terminal 2 - Frontend
   cd taskflow-frontend
   npm run dev
   ```

---

## 📝 Contributing Guidelines

### Issue Guidelines

**Bug Reports:**
- Use the bug report template
- Include steps to reproduce
- Provide system information
- Add screenshots if applicable

**Feature Requests:**
- Use the feature request template
- Explain the problem you're solving
- Describe your proposed solution
- Consider alternative solutions

### Branch Naming
Use descriptive branch names:
- `feature/user-authentication`
- `bugfix/login-validation`
- `docs/api-documentation`
- `refactor/database-queries`

### Commit Messages
Follow conventional commits format:
```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(auth): add Google OAuth integration
fix(tasks): resolve task assignment bug
docs(api): update authentication endpoints
```

---

## 🔄 Pull Request Process

### Before Submitting
1. **Sync with upstream**
   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```

2. **Create feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Write clean, readable code
   - Follow coding standards
   - Add tests for new features
   - Update documentation

4. **Test your changes**
   ```bash
   # Run backend tests
   cd taskflow-api
   npm run test
   npm run test:e2e
   
   # Run frontend tests
   cd taskflow-frontend
   npm run test
   ```

5. **Commit and push**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   git push origin feature/your-feature-name
   ```

### Pull Request Template
Use our PR template and include:
- **Description** of changes
- **Type of change** (bug fix, feature, etc.)
- **Testing** performed
- **Screenshots** (if UI changes)
- **Breaking changes** (if any)

### Review Process
1. **Automated checks** must pass
2. **Code review** by maintainers
3. **Testing** in review environment
4. **Approval** and merge

---

## 🎨 Coding Standards

### TypeScript/JavaScript
- Use TypeScript for all new code
- Follow ESLint configuration
- Use Prettier for formatting
- Prefer functional programming patterns
- Use meaningful variable names

### React/Frontend
- Use functional components with hooks
- Follow component naming conventions
- Use TypeScript interfaces for props
- Implement proper error boundaries
- Optimize for performance

### NestJS/Backend
- Use decorators appropriately
- Implement proper error handling
- Use DTOs for validation
- Follow REST API conventions
- Write comprehensive tests

### Database
- Use TypeORM entities
- Write proper migrations
- Index frequently queried columns
- Use transactions for complex operations

### CSS/Styling
- Use Tailwind CSS classes
- Follow mobile-first approach
- Maintain consistent spacing
- Use semantic color names
- Ensure accessibility compliance

---

## 🧪 Testing

### Testing Requirements
- **Unit tests** for all new functions
- **Integration tests** for API endpoints
- **E2E tests** for critical user flows
- **Component tests** for React components

### Running Tests
```bash
# Backend tests
cd taskflow-api
npm run test              # Unit tests
npm run test:watch        # Watch mode
npm run test:cov          # Coverage report
npm run test:e2e          # E2E tests

# Frontend tests
cd taskflow-frontend
npm run test              # Unit tests
npm run test:watch        # Watch mode
npm run test:coverage     # Coverage report
```

### Writing Tests
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)
- Mock external dependencies
- Test edge cases and error conditions

**Example:**
```typescript
describe('AuthService', () => {
  it('should create user with valid data', async () => {
    // Arrange
    const userData = { email: 'test@example.com', password: 'password123' };
    
    // Act
    const result = await authService.register(userData);
    
    // Assert
    expect(result).toBeDefined();
    expect(result.user.email).toBe(userData.email);
  });
});
```

---

## 📚 Documentation

### Documentation Standards
- Write clear, concise documentation
- Include code examples
- Update docs with code changes
- Use proper markdown formatting

### Types of Documentation
- **API Documentation** - Endpoint descriptions
- **User Guides** - How-to guides for users
- **Developer Docs** - Technical implementation details
- **Architecture Docs** - System design and structure

### Documentation Locations
- `README.md` - Project overview
- `docs/` - Detailed documentation
- Code comments - Inline documentation
- JSDoc - Function/class documentation

---

## 🏷️ Labels and Milestones

### Issue Labels
- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Improvements to documentation
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention needed
- `priority: high` - High priority issue
- `status: in progress` - Currently being worked on

### Milestones
- Version releases (v1.0.0, v1.1.0)
- Feature milestones
- Bug fix releases

---

## 🎯 Development Workflow

### Typical Workflow
1. **Pick an issue** from the backlog
2. **Assign yourself** to the issue
3. **Create branch** from main
4. **Implement changes** with tests
5. **Update documentation** if needed
6. **Submit pull request**
7. **Address review feedback**
8. **Merge after approval**

### Communication
- Comment on issues you're working on
- Ask questions in Discord or GitHub discussions
- Provide updates on progress
- Help review other contributors' PRs

---

## 🏆 Recognition

### Contributors
All contributors are recognized in:
- `CONTRIBUTORS.md` file
- GitHub contributors page
- Release notes
- Annual contributor highlights

### Becoming a Maintainer
Active contributors may be invited to become maintainers based on:
- Quality of contributions
- Community involvement
- Technical expertise
- Commitment to the project

---

## 📞 Getting Help

### Resources
- **Documentation**: [docs.taskflow.com](https://docs.taskflow.com)
- **Discord**: [Join our community](https://discord.gg/taskflow)
- **GitHub Discussions**: [Project discussions](https://github.com/yourusername/taskflow/discussions)
- **Email**: dev@taskflow.com

### Mentorship
New contributors can request mentorship:
- Tag `@mentors` in issues
- Join #mentorship channel in Discord
- Attend weekly contributor calls

---

## 📄 License

By contributing to TaskFlow, you agree that your contributions will be licensed under the same license as the project (MIT License).

---

<div align="center">
  <p>🙏 Thank you for contributing to TaskFlow!</p>
  <p>Together, we're building something amazing! 🚀</p>
</div>