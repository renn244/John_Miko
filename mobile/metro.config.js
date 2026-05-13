const { getDefaultConfig } = require('expo/metro-config');
const { withUniwindConfig } = require('uniwind/metro');

const config = getDefaultConfig(__dirname);

// ✅ SVG TRANSFORMER CONFIG (THIS PART WAS WRONG BEFORE)
config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve('react-native-svg-transformer'),
};

config.resolver = {
  ...config.resolver,
  assetExts: config.resolver.assetExts.filter(ext => ext !== 'svg'),
  sourceExts: [...config.resolver.sourceExts, 'svg'],
};

// ✅ THEN wrap with Uniwind
module.exports = withUniwindConfig(config, {
  cssEntryFile: './global.css',
  dtsFile: './uniwind-types.d.ts',
});