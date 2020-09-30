// next.config.js
const pathToPolyfills = './polyfills.js'

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const withSourceMaps = require('@zeit/next-source-maps')
module.exports = withBundleAnalyzer(
  withSourceMaps({
    webpack(config, options) {

      const originalEntry = config.entry
      config.entry = async () => {
        const entries = await originalEntry()
        Object.keys(entries).forEach(pageBundleEntryJs => {
          let sourceFilesIncluded = entries[pageBundleEntryJs]
          if (!Array.isArray(sourceFilesIncluded)) {
            sourceFilesIncluded = entries[pageBundleEntryJs] = [sourceFilesIncluded]
          }
          if (!sourceFilesIncluded.some(file => file.includes('polyfills'))) {
            sourceFilesIncluded.unshift(pathToPolyfills)
          }
        })
        return entries
      }

      return config
    }
  })
)