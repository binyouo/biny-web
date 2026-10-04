const repository = "https://github.com/binyouo/Biny-Agent";

export const SITE = {
  name: "Biny",
  repo: repository,
  releases: `${repository}/releases`,
  releasesApi: "https://api.github.com/repos/binyouo/Biny-Agent/releases/latest",
  issues: `${repository}/issues`,
  npm: "@biny012/biny",
  npmPage: "https://www.npmjs.com/package/@biny012/biny",
  npmApi: "https://registry.npmjs.org/@biny012%2Fbiny/latest"
} as const;
