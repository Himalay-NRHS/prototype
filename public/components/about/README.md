# About Section Images

Place team photos here for the About page.

## File Format
- **Format**: `.jpeg`, `.jpg`, `.png`, or `.webp`
- **Naming**: Any descriptive name (e.g., `team.jpeg`, `team2.jpeg`, `annual-fest-2024.jpeg`)
- **Size**: Recommended 1200x800px or similar landscape ratio
- **File Size**: Keep under 1MB for best performance

## Current Images
- team.jpeg
- team2.jpeg

## How to Add More Images

1. Place your image file in this folder
2. Open browser console (F12) and run:

```javascript
const data = window.storage.get('sigma-club-data');
data.aboutImages.push('your-image-name.jpeg');
window.storage.set('sigma-club-data', data);
location.reload();
```

## Example
```
Frontend/public/components/about/
├── team.jpeg
├── team2.jpeg
└── event-2024.jpeg
```

All images in the `aboutImages` array will be displayed in a grid on the About page.
