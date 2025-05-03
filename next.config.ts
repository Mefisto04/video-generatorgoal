// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   webpack: (config: any) => {
//     config.module.rules.push({
//       test: /\.py$/,
//       use: 'raw-loader',
//     });
//     return config;
//   },
// };

// export default nextConfig;


/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;