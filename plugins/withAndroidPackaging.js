const { withAppBuildGradle } = require("@expo/config-plugins");

module.exports = function withAndroidPackaging(config) {
  return withAppBuildGradle(config, (config) => {
    const buildGradle = config.modResults.contents;

    if (buildGradle.includes("META-INF/versions/9/OSGI-INF/MANIFEST.MF")) {
      return config;
    }

    const packagingBlock = `
    packaging {
        resources {
            excludes += [
                'META-INF/versions/9/OSGI-INF/MANIFEST.MF',
                'META-INF/DEPENDENCIES',
                'META-INF/LICENSE',
                'META-INF/LICENSE.txt',
                'META-INF/NOTICE',
                'META-INF/NOTICE.txt',
            ]
        }
    }
`;

    config.modResults.contents = buildGradle.replace(
      /^(android \{[\s\S]*?)\n\}/m,
      `$1\n${packagingBlock}\n}`
    );

    return config;
  });
};