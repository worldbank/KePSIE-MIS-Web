module.exports.autoreload = {
  active: true,
  usePolling: false,
  dirs: [
    "api/models",
    "api/controllers",
    "api/services",
    "assets/app"
  ],
  ignored: [
    // Ignore all files with .ts extension
    "**.css"
  ]
};