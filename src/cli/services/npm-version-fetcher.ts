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

/**
 * Fetch package information from npm registry with retry logic
 */
async function fetchPackageInfo(retries = 3): Promise<NpmRegistryResponse> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(REGISTRY_URL, {
        signal: AbortSignal.timeout(10000)
      })

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Package ${PACKAGE_NAME} not found in registry`)
        }
        throw new Error(`Registry returned status ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      if (i === retries - 1) throw error
      // Exponential backoff: 1s, 2s, 3s
      await new Promise(r => setTimeout(r, 1000 * (i + 1)))
    }
  }
  throw new Error('Failed to fetch package info after retries')
}

/**
 * Fetch available versions sorted by publish date (newest first)
 * @param count Number of versions to return (default: 10)
 * @returns Array of version info with publish dates
 */
export async function fetchAvailableVersions(count = 10): Promise<VersionInfo[]> {
  const data = await fetchPackageInfo()
  const latestVersion = data['dist-tags'].latest

  const versions = Object.keys(data.versions)
    .filter(v => !semver.prerelease(v)) // Filter stable only
    .filter(version => data.time[version]) // Ensure time data exists (TypeScript safety)
    .map(version => ({
      version,
      publishedAt: new Date(data.time[version]!),
      isLatest: version === latestVersion
    }))
    .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
    .slice(0, count)

  return versions
}

/**
 * Get the latest stable version from npm registry
 * @returns Latest version string (e.g., "0.0.2")
 */
export async function getLatestVersion(): Promise<string> {
  const data = await fetchPackageInfo()
  return data['dist-tags'].latest
}

/**
 * Check if a specific version exists in npm registry
 * @param version Version to check
 * @returns True if version exists
 */
export async function versionExists(version: string): Promise<boolean> {
  const data = await fetchPackageInfo()
  return version in data.versions
}
