# Contributing Guide

## Development Workflow

### 1. Making Changes

When you make changes to the codebase, follow these steps:

```bash
# Make your changes
git checkout -b feature/your-feature

# Make changes to the code
# ...

# Build to ensure everything works
npm run build
```

### 2. Creating a Changeset

After making changes, create a changeset to describe what changed:

```bash
npm run changeset
```

This will prompt you to:
1. Select the type of change (major, minor, patch)
2. Write a summary of the changes

The changeset will be stored in `.changeset/` directory.

#### Change Types

- **Major**: Breaking changes that require users to update their code
- **Minor**: New features that are backwards compatible
- **Patch**: Bug fixes and minor improvements

### 3. Commit Your Changes

```bash
git add .
git commit -m "feat: add awesome feature"
git push origin feature/your-feature
```

### 4. Versioning and Publishing

When ready to release:

```bash
# Update version and CHANGELOG.md based on changesets
npm run version

# Commit the version changes
git add .
git commit -m "chore: version packages"

# Publish to npm
npm run release
```

## Changesets Workflow

### Quick Reference

```bash
# Create a changeset
npm run changeset

# Update versions based on changesets
npm run version

# Build and publish to npm
npm run release
```

### Example: Adding a New Feature

```bash
# 1. Create feature branch
git checkout -b feat/interactive-cli

# 2. Make changes
# ... code changes ...

# 3. Build and test
npm run build

# 4. Create changeset
npm run changeset
# Select: minor
# Summary: "Added interactive CLI setup with framework detection"

# 5. Commit
git add .
git commit -m "feat: add interactive CLI setup"
git push origin feat/interactive-cli

# 6. After PR is merged to main
git checkout main
git pull

# 7. Version
npm run version
git add .
git commit -m "chore: version packages"
git push

# 8. Publish
npm run release
```

## Scripts

- `npm run build` - Build the project
- `npm run changeset` - Create a new changeset
- `npm run version` - Update version based on changesets
- `npm run release` - Build and publish to npm
- `npm run unpublish` - Unpublish from npm (use with caution)

## GitHub Actions

This repository uses GitHub Actions for CI/CD:

### CI Workflow

- Runs on every push and pull request
- Tests on Node.js 18 and 20
- Builds the project and verifies outputs

### Release Workflow

- Runs on pushes to `main` branch
- Automatically creates release PRs when changesets are detected
- Publishes to npm when release PR is merged
- Requires `NPM_TOKEN` secret to be set in GitHub repository settings

### Setting Up NPM_TOKEN

1. Go to [npmjs.com](https://www.npmjs.com/) and log in
2. Go to Access Tokens in your account settings
3. Create a new Automation token
4. Add it as `NPM_TOKEN` secret in your GitHub repository settings

## Best Practices

1. Always create a changeset for user-facing changes
2. Write clear and descriptive changeset summaries
3. Test your changes before creating a changeset
4. Use conventional commit messages
5. Keep changesets focused on a single feature or fix
6. Wait for CI to pass before merging PRs
7. Release PR will be created automatically by GitHub Actions
