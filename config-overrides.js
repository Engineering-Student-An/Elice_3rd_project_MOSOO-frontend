module.exports = function override(config) {
    config.resolve.fallback = {
        "net": false,
        "tls": false,
        "fs": false,
        "http": require.resolve("stream-http"),
        "https": require.resolve("https-browserify"),
        "stream": require.resolve("stream-browserify")
    };
    return config;
};