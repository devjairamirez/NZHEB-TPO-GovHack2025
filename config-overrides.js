module.exports = {
  style: {
    postcss: {
      plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
      ],
    },
  },
};

const { override, addPostcssPlugins } = require('customize-cra');
module.exports = override(
  addPostcssPlugins([
    require('tailwindcss'),
    require('autoprefixer'),
  ])
);