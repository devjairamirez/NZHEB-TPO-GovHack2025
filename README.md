# NZHEB-TPO-GovHack2025

## Overview
This project is a web application built with React and Tailwind CSS. It provides data analysis and dashboard features for GovHack 2025.

## Prerequisites
- Node.js (v18 or higher recommended)
- npm (comes with Node.js)

## Installation
1. Clone the repository:
   ```powershell
   git clone https://github.com/devjairamirez/NZHEB-TPO-GovHack2025.git
   cd NZHEB-TPO-GovHack2025
   ```
2. Install dependencies:
   ```powershell
   npm install
   ```

## Running the Application
To start the development server:
```powershell
npm start
```
This will launch the app in your default browser at [http://localhost:3000](http://localhost:3000).

## Building for Production
To build the app for production:
```powershell
npm run build
```
The optimized build will be in the `build/` directory.

## Project Structure
- `src/` - Source code (React components, styles, etc.)
- `public/` - Static files and `index.html`
- `package.json` - Project metadata and scripts
- `tailwind.config.js` - Tailwind CSS configuration

## Tailwind CSS (CLI Setup)
This project uses the Tailwind CLI for building CSS.

### Setup
1. Install Tailwind CSS:
   ```powershell
   npm install -D tailwindcss
   npx tailwindcss init
   ```
2. Create `src/tailwind.css` with:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```
3. Add this build script to your `package.json`:
   ```json
   "build:css": "npx tailwindcss -i ./src/tailwind.css -o ./src/index.css --minify"
   ```
4. Update your build script:
   ```json
   "build": "npm run build:css && react-scripts build"
   ```
5. Import `src/index.css` in your main JS entry file.

### Building CSS
To build Tailwind CSS:
```powershell
npm run build:css
```
This will generate the final CSS in `src/index.css`.

### Full Production Build
```powershell
npm run build
```
This will build CSS and then the React app for deployment.

## Additional Notes
- Make sure you have internet access to install dependencies.
- For any issues, check the npm logs or raise an issue in the repository.

## License
See `LICENSE` for details.
