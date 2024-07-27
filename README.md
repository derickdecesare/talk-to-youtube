# YouTube Chat Extension

This Chrome extension adds a chat sidebar to YouTube pages, allowing users to interact while watching videos.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (v14 or later recommended)
- npm (comes with Node.js)
- Git
- Google Chrome browser

### Setting up the development environment

1. Clone the repository:

   ```
   git clone https://github.com/your-username/youtube-chat-extension.git
   cd youtube-chat-extension
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Create your branch (replace 'your-name' with your actual name):
   ```
   git checkout -b your-name
   ```

### Building the extension

To build the extension, run:

```
npm run build
```

This will create a `dist` folder with the built extension.

### Loading the extension in Chrome

1. Open Google Chrome and navigate to `chrome://extensions`
2. Enable "Developer mode" by toggling the switch in the top right corner
3. Click "Load unpacked" and select the `dist` folder from your project directory

The extension should now be loaded and visible in your Chrome browser.

### Development workflow

1. Make your changes in the `src` directory
2. Run `npm run build` to rebuild the extension
3. Refresh the extension in `chrome://extensions` by clicking the refresh button
4. Reload any YouTube pages to see your changes

## Project Structure

- `src/`: Source files
  - `popup/`: Popup UI components
  - `contentScript/`: Content script files
  - `options/`: Options page files
  - `static/`: Static files (manifest, icons)
- `dist/`: Built extension files (created after building)
- `webpack.config.js`: Webpack configuration
- `tailwind.config.js`: Tailwind CSS configuration
- `tsconfig.json`: TypeScript configuration

## Key Features

- Chat sidebar on YouTube pages
- Keyboard shortcut (Cmd+K or Ctrl+K) to toggle sidebar
- Resizable sidebar
- Dark theme UI

## Contributing

1. Ensure you're working on your own branch
2. Make your changes and commit them:
   ```
   git add .
   git commit -m "Description of changes"
   ```
3. Push to your branch:
   ```
   git push origin your-branch-name
   ```
4. Create a pull request from your branch to main

## Troubleshooting

If you encounter any issues:

1. Ensure all dependencies are installed (`npm install`)
2. Clear Chrome's extension cache and reload the extension
3. Check the console for any error messages

For any persistent problems, please open an issue in the GitHub repository.
