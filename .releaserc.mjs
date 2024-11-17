export default {
  branches: ['main',
    {
      "name": "alpha",
      "prerelease": true
    }],
  plugins: [
    ['@semantic-release/commit-analyzer', { preset: "conventionalcommits" }],
    ['@semantic-release/release-notes-generator', { preset: "conventionalcommits" }],
    '@semantic-release/npm',
    '@semantic-release/github',
    '@semantic-release/git'
  ],
  tagFormat: 'v${version}'
} 