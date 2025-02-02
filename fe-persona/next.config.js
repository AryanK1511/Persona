module.exports = {
    reactStrictMode: true,
    // ...other configurations...
    async headers() {
        return [
            {
                source: "/(.*)",
                headers: [
                    {
                        key: "Content-Security-Policy",
                        value: "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com",
                    },
                ],
            },
        ];
    },
};
