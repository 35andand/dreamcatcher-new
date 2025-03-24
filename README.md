# DreamCatcher - Local Dream Journal

A privacy-focused web application for recording and managing your dreams. All data is stored locally on your device using IndexedDB, ensuring your dreams remain private.

## Features

- 📝 Record your dreams with title and content
- 📅 Select the date when your dream occurred
- 🗓 Dreams are organized chronologically (newest first)
- 🔍 View a list of all your dreams
- ✏️ Edit existing dream entries
- 🗑 Delete dreams you no longer want to keep
- 💾 Export dreams as a JSON file for backup
- 📤 Import dreams from a JSON file
- 🔒 All data stored locally in your browser with IndexedDB
- 🌙 Dark theme designed for comfortable nighttime use

## Technologies Used

- [Next.js 14](https://nextjs.org/) - React framework
- [React](https://reactjs.org/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) - Local database

## Getting Started

1. Clone this repository:
   ```
   git clone https://github.com/yourusername/dream-catcher.git
   cd dream-catcher
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run the development server:
   ```
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Privacy

DreamCatcher is designed with privacy as a core principle:

- No server backend - everything runs in your browser
- Your dreams are stored only on your device using IndexedDB
- No analytics or tracking of any kind
- No data ever leaves your computer (unless you manually export it)

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
