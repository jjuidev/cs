# npm Registry API & Package Update Mechanisms Research

**Research Date:** 2026-02-01
**Package:** @jjuidev/cs
**Current Version:** 0.0.2

## 1. npm Registry API

### Endpoints

**Get Package Metadata (all versions):**
```
GET https://registry.npmjs.org/{package-name}
```

**Get Specific Version:**
```
GET https://registry.npmjs.org/{package-name}/{version}
```

**Get Latest Version:**
```
GET https://registry.npmjs.org/{package-name}/latest
```

### Example Usage

```javascript
// Fetch all package metadata
const response = await fetch('https://registry.npmjs.org/@jjuidev/cs');
const data = await response.json();

// Response structure:
// {
//   "name": "@jjuidev/cs",
//   "versions": {
//     "0.0.1": { ... },
//     "0.0.2": { ... },
//     ...
//   },
//   "dist-tags": {
//     "latest": "0.0.2"
//   },
//   "time": {
//     "0.0.1": "2024-01-01T00:00:00.000Z",
//     "0.0.2": "2024-01-15T00:00:00.000Z"
//   }
// }
```

### Get 10 Newest Versions

```javascript
const response = await fetch('https://registry.npmjs.org/@jjuidev/cs');
const data = await response.json();

// Extract versions with timestamps
const versions = Object.keys(data.versions).map(version => ({
  version,
  publishedAt: new Date(data.time[version])
}));

// Sort by publish date (newest first)
versions.sort((a, b) => b.publishedAt - a.publishedAt);

// Get top 10
const newest10 = versions.slice(0, 10);
```

## 2. Package Update Mechanisms

### Update Global Package

**Using child_process.spawn:**
```javascript
const { spawn } = require('child_process');

function updatePackage(packageName, version) {
  return new Promise((resolve, reject) => {
    const npm = spawn('npm', ['install', '-g', `${packageName}@${version}`], {
      stdio: 'inherit'
    });

    npm.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Update failed with code ${code}`));
    });
  });
}

// Usage
await updatePackage('@jjuidev/cs', '1.0.0');
```

**Using child_process.execSync:**
```javascript
const { execSync } = require('child_process');

function updatePackageSync(packageName, version) {
  try {
    execSync(`npm install -g ${packageName}@${version}`, {
      stdio: 'inherit'
    });
    return true;
  } catch (error) {
    console.error('Update failed:', error.message);
    return false;
  }
}
```

### npm update vs npm install -g

- **`npm update -g @jjuidev/cs`**: Updates to latest within semver range defined in package.json
- **`npm install -g @jjuidev/cs@latest`**: Installs latest version explicitly
- **`npm install -g @jjuidev/cs@1.0.0`**: Installs specific version

**Recommendation:** Use `npm install -g {package}@{version}` for precise control.

## 3. Version Management

### Using semver Library

```javascript
const semver = require('semver');

// Compare versions
semver.gt('1.2.3', '1.0.0'); // true
semver.lt('1.0.0', '1.2.3'); // true
semver.eq('1.0.0', '1.0.0'); // true

// Sort versions
const versions = ['1.2.3', '1.0.0', '2.0.0-beta', '1.1.0'];
versions.sort(semver.rcompare); // ['2.0.0-beta', '1.2.3', '1.1.0', '1.0.0']

// Validate version
semver.valid('1.2.3'); // '1.2.3'
semver.valid('invalid'); // null

// Handle pre-release
semver.prerelease('1.2.3-beta.1'); // ['beta', 1]
semver.prerelease('1.2.3'); // null
```

### Filtering Versions

```javascript
const semver = require('semver');

// Filter stable versions only
const stableVersions = versions.filter(v => !semver.prerelease(v));

// Filter by range
const compatibleVersions = versions.filter(v => semver.satisfies(v, '^1.0.0'));
```

## 4. Error Handling & Rate Limiting

### npm Registry Considerations

- **Rate Limiting:** npm registry has rate limits but they're generous for CLI tools
- **No Authentication Required:** Public package queries don't need auth
- **Fallback Strategy:** Cache version list, retry on failure

```javascript
async function fetchPackageInfo(packageName, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(`https://registry.npmjs.org/${packageName}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Package ${packageName} not found`);
        }
        throw new Error(`Registry returned ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}
```

## 5. Implementation Recommendations

### For `cs update` Command

```javascript
// 1. Fetch current installed version
const currentVersion = require('../package.json').version;

// 2. Fetch available versions from registry
const response = await fetch('https://registry.npmjs.org/@jjuidev/cs');
const data = await response.json();

// 3. Get 10 newest stable versions
const versions = Object.keys(data.versions)
  .filter(v => !semver.prerelease(v))
  .sort(semver.rcompare)
  .slice(0, 10);

// 4. Present to user (interactive selection)
// Use inquirer or similar

// 5. Execute update
execSync(`npm install -g @jjuidev/cs@${selectedVersion}`, { stdio: 'inherit' });
```

## Unresolved Questions

None. All research topics covered with actionable implementation paths.

---

**Sources:**
- npm Registry API: https://registry.npmjs.org
- semver documentation: https://www.npmjs.com/package/semver
- Node.js child_process: https://nodejs.org/api/child_process.html
