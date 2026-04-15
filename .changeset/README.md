# Changesets

This project uses [changesets](https://github.com/changesets/changesets) for versioning and publishing.

## Workflow

1. Make your changes
2. Run `bun run changeset`
3. Select change type (patch/minor/major)
4. Write a summary
5. Commit the `.changeset/*.md` file
6. When merged to `main`, CI creates a "Version Packages" PR
7. Merge that PR to publish to npm
