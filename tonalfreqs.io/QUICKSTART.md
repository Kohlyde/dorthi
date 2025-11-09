# tonalfreqs.io - Quick Start Guide

## What is tonalfreqs.io?

The **tonalfreqs.io** directory in this repository serves as a structured document management system that enables polymorphic loading of important documents (PDFs, images, text files) into web applications.

## Key Files

### 1. `README.md`
Comprehensive overview of the tonalfreqs.io repository structure, purpose, and capabilities.

### 2. `manifest.json`
Central catalog of all documents with metadata including:
- Document IDs and titles
- Categories (ai, music-theory, notation, visual, reference)
- File paths and descriptions
- Tags for searchability
- Series information for multi-part documents

### 3. `integration/document-loader.js`
JavaScript implementation providing:
- `DocumentLoader` - Base class for loading documents
- `PDFDocumentLoader` - Specialized loader for PDF files
- `ImageDocumentLoader` - Specialized loader for images
- `TextDocumentLoader` - Specialized loader for text files
- `DocumentFactory` - Factory pattern for creating appropriate loaders
- `DorthiDocumentIntegration` - Integration with Dorthi AI Companion

### 4. `integration/INTEGRATION_GUIDE.md`
Detailed guide with:
- Code examples for all loaders
- Integration patterns
- Usage examples
- Best practices
- Performance optimization
- Security considerations

### 5. `index.html`
Working example of a document viewer application demonstrating:
- Document browsing by category
- Search functionality
- Dynamic document loading and rendering
- Responsive UI design

## Quick Usage

### In Browser (Standalone)

1. Serve the repository with a local web server:
```bash
python3 -m http.server 8000
```

2. Open `http://localhost:8000/tonalfreqs.io/index.html` in your browser

### Integration with Dorthi

```javascript
// Import the integration module
import { DorthiDocumentIntegration } from './tonalfreqs.io/integration/document-loader.js';

// Initialize
const integration = new DorthiDocumentIntegration();

// Display a document in the chat
const chatContainer = document.getElementById('chat');
await integration.displayInChat('dorthi-ai-companion', chatContainer);

// Load a document series
await integration.displaySeries('Origins of House Music', chatContainer);
```

### Basic Example

```javascript
import { DocumentFactory } from './tonalfreqs.io/integration/document-loader.js';

// Load and render a document
const viewer = document.getElementById('viewer');
await DocumentFactory.loadAndRender('origins-house-music-1', viewer);
```

## Document Categories

### AI & Companion Systems
- Dorthi AI Companion documentation

### Music Theory & History
- Origins of House Music (8-part series)
- Electronic music history

### Notation Systems
- Standard vs Camelot Notation (2-part series)
- DJ tools and key notation

### Visual Resources
- Color palettes and swatches
- Design resources
- Visual standards

## Available Documents

The manifest currently catalogs 17 documents:

- **1 AI document**: Dorthi AI Companion
- **9 Music theory documents**: Origins of House Music series
- **2 Notation documents**: Standard vs Camelot Notation
- **4 Visual resources**: Palettes and swatches
- **1 Reference document**: General reference

## Polymorphic Loading Pattern

The system uses polymorphism to handle different document types through a unified interface:

```javascript
// The factory automatically determines the correct loader
const loader = DocumentFactory.createLoader('pdf');  // Returns PDFDocumentLoader
const imageLoader = DocumentFactory.createLoader('png');  // Returns ImageDocumentLoader
const textLoader = DocumentFactory.createLoader('txt');  // Returns TextDocumentLoader

// All loaders share the same interface
const doc = await loader.loadDocument('document-id');
doc.render(container);
doc.cleanup();  // Clean up resources
```

## Benefits

1. **Centralized Management**: All documents cataloged in one place
2. **Type Safety**: Specialized loaders for each document type
3. **Lazy Loading**: Documents loaded only when needed
4. **Caching**: Reduces redundant network requests
5. **Clean Architecture**: Separation of concerns with clear interfaces
6. **Extensible**: Easy to add new document types or loaders

## Integration Points

### With Dorthi AI Companion
- Documents can be displayed in the chat interface
- Search and filter by tags or categories
- Series can be loaded sequentially
- Responsive to user queries

### With Web Applications
- Direct file access via manifest
- RESTful API patterns
- Dynamic imports
- Progressive loading

## Next Steps

1. **Add More Documents**: Place files in `../docs/` and update `manifest.json`
2. **Customize Loaders**: Extend base classes for specialized needs
3. **Enhance UI**: Modify `index.html` for custom styling
4. **Add Features**: Implement bookmarks, favorites, or annotations

## File Structure

```
tonalfreqs.io/
├── README.md                          # Main documentation
├── QUICKSTART.md                      # This file
├── manifest.json                      # Document catalog
├── index.html                         # Example viewer application
└── integration/
    ├── INTEGRATION_GUIDE.md          # Detailed integration guide
    └── document-loader.js            # JavaScript implementation
```

## Support

For questions or issues:
1. Review the `INTEGRATION_GUIDE.md` for detailed examples
2. Check the `manifest.json` for available documents
3. Examine `index.html` for a working implementation
4. Open an issue in the repository

## License

MIT © Kohlyde
