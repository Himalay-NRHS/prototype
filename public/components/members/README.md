# Members Photos

Organize member photos by year in their respective folders.

## Folder Structure
```
members/
├── 1styear/
├── 2ndyear/
├── 3rdyear/
└── 4thyear/
```

## File Naming Convention
**IMPORTANT**: Use the format `First_Last.jpeg` or `Full_Name.jpeg`

The website will automatically extract the name from the filename:
- `John_Doe.jpeg` → displays as "John Doe"
- `Debarghya_Pramanik.jpeg` → displays as "Debarghya Pramanik"
- `Mary_Jane_Watson.jpeg` → displays as "Mary Jane Watson"

## File Requirements
- **Format**: `.jpeg` or `.jpg` (preferred)
- **Naming**: `Full_Name.jpeg` (underscores will be converted to spaces)
- **Size**: Recommended 800x800px (square aspect ratio)
- **File Size**: Keep under 500KB

## How to Add a Member

### Step 1: Add Photo
Place the photo in the appropriate year folder:
```
Frontend/public/components/members/3rdyear/John_Doe.jpeg
```

### Step 2: Add to Database
Open browser console (F12) and run:

```javascript
const data = window.storage.get('sigma-club-data');
data.members.push({
  id: Date.now(),
  name: "John Doe",
  year: "3rd",
  photo: "John_Doe.jpeg",
  linkedin: "https://linkedin.com/in/johndoe"
});
window.storage.set('sigma-club-data', data);
location.reload();
```

## Example Structure
```
members/
├── 1styear/
│   ├── Alice_Smith.jpeg
│   └── Bob_Johnson.jpeg
├── 2ndyear/
│   └── Charlie_Brown.jpeg
├── 3rdyear/
│   ├── Debarghya_Pramanik.jpeg
│   └── David_Lee.jpeg
└── 4thyear/
    └── Eve_Wilson.jpeg
```

## Tips
- Use consistent naming: First_Last.jpeg
- Ensure photos are well-lit and professional
- Square photos work best (1:1 aspect ratio)
- Compress images before uploading
