# Phase 02: Implement Version Fetcher

## Context Links

- [Plan Overview](./plan.md)
- [npm Registry API Research](./research/researcher-npm-registry-api.md)
- [Codebase Summary](../docs/codebase-summary.md)
- [Code Standards](../docs/code-standards.md)

## Overview

| Field | Value |
|-------|-------|
| Date | 2026-02-01 |
| Priority | P1 |
| Status | pending |
| Effort | 45m |

Create service to fetch available package versions from npm registry.

## Key Insights

From research:
- npm registry API: `GET https://registry.npmjs.org/@jjuidev/cs`
- Response contains `versions` object and `time` object with publish dates
- Use `dist-tags.latest` for latest version
- Sort by publish date using `time` field for newest versions
- Implement retry logic for network resilience

## Requirements

### Functional
- Fetch all versions from npm registry
- Get latest version tag
- Return 10 newest versions sorted by publish date
- Validate version exists in registry

### Non-Functional
- Retry on network failure (3 attempts)
- Timeout handling (10s)
- Filter out prerelease versions by default

## Architecture

```typescript
// npm-version-fetcher.ts
export interface VersionInfo {
  version: string
  publishedAt: Date
  isLatest: boolean
}

export async function fetchAvailableVersions(): Promise<VersionInfo[]>
export async function getLatestVersion(): Promise<string>
export async function versionExists(version: string): Promise<boolean>
```

## Related Code Files

**Create:**
- `/Users/tandm/Documents/jjuidev/npm/cs/src/cli/services/npm-version-fetcher.ts`

## Implementation Steps

1. Create services directory if not exists

2. Create npm-version-fetcher.ts with:
   ```typescript
   import semver from 'semver'

   const REGISTRY_URL = 'https://registry.npmjs.org/@jjuidev/cs'
   const PACKAGE_NAME = '@jjuidev/cs'

   interface NpmRegistryResponse {
     name: string
     versions: Record<string, unknown>
     'dist-tags': { latest: string }
     time: Record<string, string>
   }

   export interface VersionInfo {
     version: string
     publishedAt: Date
     isLatest: boolean
   }

   async function fetchPackageInfo(retries = 3): Promise<NpmRegistryResponse> {
     for (let i = 0; i < retries; i++) {
       try {
         const response = await fetch(REGISTRY_URL, {
           signal: AbortSignal.timeout(10000)
         })

         if (!response.ok) {
           if (response.status === 404) {
             throw new Error(`Package ${PACKAGE_NAME} not found`)
           }
           throw new Error(`Registry returned ${response.status}`)
         }

         return await response.json()
       } catch (error) {
         if (i === retries - 1) throw error
         await new Promise(r => setTimeout(r, 1000 * (i + 1)))
       }
     }
     throw new Error('Failed to fetch package info')
   }

   export async function fetchAvailableVersions(count = 10): Promise<VersionInfo[]> {
     const data = await fetchPackageInfo()
     const latestVersion = data['dist-tags'].latest

     const versions = Object.keys(data.versions)
       .filter(v => !semver.prerelease(v)) // Filter stable only
       .map(version => ({
         version,
         publishedAt: new Date(data.time[version]),
         isLatest: version === latestVersion
       }))
       .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
       .slice(0, count)

     return versions
   }

   export async function getLatestVersion(): Promise<string> {
     const data = await fetchPackageInfo()
     return data['dist-tags'].latest
   }

   export async function versionExists(version: string): Promise<boolean> {
     const data = await fetchPackageInfo()
     return version in data.versions
   }
   ```

3. Add exports to services index (if exists)

## Todo List

- [ ] Create src/cli/services directory
- [ ] Implement fetchPackageInfo with retry logic
- [ ] Implement fetchAvailableVersions
- [ ] Implement getLatestVersion
- [ ] Implement versionExists
- [ ] Verify build passes

## Success Criteria

- Can fetch versions from npm registry
- Returns correct latest version
- Sorts by publish date (newest first)
- Handles network errors with retry
- Filters prerelease versions

## Risk Assessment

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Network timeout | Medium | Retry with exponential backoff |
| Registry unavailable | Low | Clear error message to user |
| Rate limiting | Very Low | Generous limits for CLI tools |

## Security Considerations

- Use HTTPS only
- No authentication required for public packages
- Validate response structure before use

## Next Steps

Proceed to Phase 03: Implement Update Action Handler
