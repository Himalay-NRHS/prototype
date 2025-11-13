# Magazines

Store magazine PDFs and cover images here.

## File Requirements

### PDF Files
- **Format**: `.pdf`
- **Naming**: Descriptive name (e.g., `Sigma_January_2024.pdf`)
- **Size**: Compress PDFs to keep under 10MB if possible

### Cover Images
- **Format**: `.jpeg`, `.jpg`, `.png`
- **Naming**: Match PDF name (e.g., `Sigma_January_2024_cover.jpeg`)
- **Size**: Recommended 600x800px (3:4 aspect ratio - book cover)
- **File Size**: Keep under 500KB

## How to Add a Magazine

### Step 1: Add Files
Place both PDF and cover image in this folder:
```
Frontend/public/components/magazines/
├── Sigma_January_2024.pdf
├── Sigma_January_2024_cover.jpeg
├── Sigma_June_2024.pdf
└── Sigma_June_2024_cover.jpeg
```

### Step 2: Convert to Base64 (for PDF)

**Option A: Using Online Tool**
1. Go to https://base64.guru/converter/encode/pdf
2. Upload your PDF
3. Copy the base64 string (starts with `data:application/pdf;base64,`)

**Option B: Using Browser Console**
```javascript
// Create file input
const input = document.createElement('input');
input.type = 'file';
input.accept = '.pdf';
input.onchange = (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = (event) => {
    console.log('PDF Base64:', event.target.result);
    // Copy this output
  };
  reader.readAsDataURL(file);
};
input.click();
```

### Step 3: Add to Database
Open browser console (F12) and run:

```javascript
const data = window.storage.get('sigma-club-data');
data.magazines.push({
  id: Date.now(),
  year: "2024",
  title: "Sigma January 2024 Edition",
  pdfData: "data:application/pdf;base64,JVBERi0xLj...", // Your base64 string
  coverImage: "/components/magazines/Sigma_January_2024_cover.jpeg",
  uploadDate: "2024-01-15",
  fileSize: "2.5 MB"
});
window.storage.set('sigma-club-data', data);
location.reload();
```

## Example Structure
```
magazines/
├── Sigma_January_2024.pdf
├── Sigma_January_2024_cover.jpeg
├── Sigma_June_2024.pdf
├── Sigma_June_2024_cover.jpeg
├── Sigma_December_2023.pdf
└── Sigma_December_2023_cover.jpeg
```

## Tips
- Keep PDF file sizes reasonable (compress if needed)
- Use consistent naming convention
- Cover images should be portrait orientation (3:4 ratio)
- Include year, month/edition in the title
- Test download functionality after adding

## Compression Tools
- **PDF**: https://www.ilovepdf.com/compress_pdf
- **Images**: https://tinypng.com/ or https://squoosh.app/
