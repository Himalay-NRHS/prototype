# Sigma Club Website

A stunning, production-ready React website for Sigma Club featuring animated gradients, glass morphism UI, and comprehensive club management features.

## ✨ Features

- **Animated Gradient Background**: Mesmerizing 20-second color transitions
- **Glass Morphism UI**: Modern semi-transparent cards with backdrop blur
- **Event Management**: Live countdown timers and QR code registration
- **Member & Alumni Showcase**: Year-wise organization with LinkedIn integration
- **Timeline**: Visual journey of club milestones
- **Magazine Archive**: Year-wise PDF display with downloadable content
- **Fully Responsive**: Optimized for mobile, tablet, and desktop

## 🚀 Quick Start

```bash
cd Frontend
npm install
npm run dev
```

## 📁 Project Structure

```
Frontend/
├── components/
│   ├── members/
│   │   ├── 1styear/
│   │   ├── 2ndyear/
│   │   ├── 3rdyear/
│   │   └── 4thyear/
│   ├── alumni/
│   │   └── {batch}/
│   └── about/
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
└── package.json
```

## 📸 Photo Management

### Members
1. Place photos in `components/members/{year}year/` folder
2. Name format: `Full_Name.jpeg` (e.g., `John_Doe.jpeg`)
3. The website automatically extracts the name from the filename

**Example:**
```
components/members/3rdyear/Debarghya_Pramanik.jpeg
```

### Alumni
1. Place photos in `components/alumni/{batch}/` folder
2. Name format: `Full_Name.jpeg`

**Example:**
```
components/alumni/2020/Jane_Smith.jpeg
```

### About Page
1. Place team photos in `components/about/` folder
2. Any name format (e.g., `team.jpeg`, `team2.jpeg`)

## 💾 Data Management

All data is stored in `window.storage` (localStorage). Use browser console (F12) to manage data:

### Add an Event
```javascript
const data = window.storage.get('sigma-club-data');
data.events.push({
  id: Date.now(),
  title: "Tech Workshop 2025",
  date: "2025-12-15",
  time: "18:00",
  venue: "Main Auditorium",
  description: "Join us for an exciting tech workshop.",
  image: "data:image/jpeg;base64,...",
  registrationLink: "https://forms.google.com/..."
});
window.storage.set('sigma-club-data', data);
location.reload();
```

### Add a Member
```javascript
const data = window.storage.get('sigma-club-data');
data.members.push({
  id: Date.now(),
  name: "John Doe",
  year: "1st", // Options: "1st", "2nd", "3rd", "4th"
  photo: "John_Doe.jpeg",
  linkedin: "https://linkedin.com/in/johndoe"
});
window.storage.set('sigma-club-data', data);
location.reload();
```

### Add an Alumni
```javascript
const data = window.storage.get('sigma-club-data');
data.alumni.push({
  id: Date.now(),
  name: "Jane Smith",
  batch: "2020",
  photo: "Jane_Smith.jpeg",
  linkedin: "https://linkedin.com/in/janesmith",
  currentRole: "Software Engineer at Google"
});
window.storage.set('sigma-club-data', data);
location.reload();
```

### Add About Images
```javascript
const data = window.storage.get('sigma-club-data');
data.aboutImages.push('new-team-photo.jpeg');
window.storage.set('sigma-club-data', data);
location.reload();
```

### View All Data
```javascript
const data = window.storage.get('sigma-club-data');
console.log(JSON.stringify(data, null, 2));
```

### Reset Data
```javascript
localStorage.removeItem('sigma-club-data');
location.reload();
```

## 🎨 Design Features

- **Color Palette**: Blue (#0066FF, #001F3F, #00D4FF) and Purple (#581c87, #6b21a8, #9333ea)
- **Animations**: Smooth, GPU-accelerated transitions
- **Typography**: Inter font family with gradient text effects
- **Responsive**: Mobile-first design with breakpoints at 768px and 1024px

## 🔧 Tech Stack

- React 18
- Vite
- Tailwind CSS
- Lucide React (icons)
- QR Server API (for QR code generation)

## 📱 Pages

1. **Home**: Upcoming and past events with countdown timers
2. **About**: Team photos and club description
3. **Members**: Year-wise member directory (1st-4th year)
4. **Alumni**: Batch-wise alumni directory with flip cards
5. **Timeline**: Chronological club milestones
6. **Magazines**: Year-wise magazine archive with PDF downloads

## 🎯 Key Features

### Event Registration
- QR code generation for Google Forms
- Direct form links
- Downloadable QR codes
- Live countdown timers with color coding

### Member Management
- Year-wise organization
- Search functionality
- LinkedIn integration
- Automatic name extraction from filenames

### Alumni Showcase
- Batch filtering
- Flip cards with LinkedIn on back
- Current role display
- Featured alumni support

## 🌐 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## 📝 License

MIT

## 🤝 Contributing

This is a club project. For updates, contact the Sigma Club team.
