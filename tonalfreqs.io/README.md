# tonalfreqs.io

## Overview

The **tonalfreqs.io** repository serves as a centralized document hub for music theory, tonal analysis, and audio frequency resources. This repository houses critical documents that are dynamically integrated into web applications through polymorphic document loading patterns.

## Purpose

This repository is designed to:
- Store and organize important music theory and audio analysis documents
- Provide a structured approach to document management
- Enable dynamic document integration into web interfaces
- Support polymorphic loading of resources across multiple applications

## Document Categories

### Music Theory & History
- Origins of House Music (comprehensive multi-part series)
- Historical context and evolution of electronic music

### Notation Systems
- Standard vs Camelot Notation comparison guides
- Key notation references for DJs and music producers

### Visual Resources
- Color palettes for audio visualization
- Design swatches and theming resources
- PDF documentation for visual standards

### AI Companion Documentation
- Dorthi AI Companion specifications
- Integration guides and API documentation

## Integration with Web Applications

### Polymorphic Document Loading

Documents in this repository can be dynamically loaded into web applications using various methods:

1. **Direct File References**: Documents are accessible via relative or absolute paths
2. **Dynamic Import**: JavaScript-based loading for on-demand access
3. **API Integration**: RESTful endpoints for programmatic document retrieval
4. **Lazy Loading**: Performance-optimized loading strategies

### Example Integration Pattern

```javascript
// Polymorphic document loader
class DocumentLoader {
    constructor(baseUrl = './tonalfreqs.io/docs/') {
        this.baseUrl = baseUrl;
    }
    
    async loadDocument(documentName) {
        const response = await fetch(`${this.baseUrl}${documentName}`);
        return await response.blob();
    }
    
    async loadPDF(documentName) {
        return await this.loadDocument(documentName);
    }
}

// Usage
const loader = new DocumentLoader();
const houseMusic = await loader.loadPDF('Origins of House Music.pdf');
```

## Repository Structure

```
tonalfreqs.io/
├── README.md              # This file
├── docs/                  # Primary document storage
│   ├── music-theory/      # Music theory documents
│   ├── notation/          # Notation system guides
│   ├── visual/            # Visual resources and palettes
│   └── ai/                # AI companion documentation
├── manifest.json          # Document index and metadata
└── integration/           # Integration examples and guides
```

## Document Manifest

All documents are cataloged in `manifest.json` with metadata including:
- Document title
- Category
- File path
- Description
- Tags for searchability
- Version information

## Usage Guidelines

### Adding New Documents

1. Place documents in the appropriate category folder under `docs/`
2. Update `manifest.json` with document metadata
3. Ensure proper file naming conventions (descriptive, no spaces in critical paths)
4. Add any necessary integration documentation

### Accessing Documents

Documents can be accessed through:
- Direct file system access (for local development)
- Web server paths (for deployed applications)
- API endpoints (for programmatic access)
- CDN distribution (for optimized delivery)

## Integration with Dorthi

The Dorthi AI Companion application integrates these documents to provide:
- Music theory reference materials
- Visual theming resources
- Real-time document access during user interactions
- Context-aware document recommendations

## Technical Specifications

### Supported File Formats
- PDF (primary documentation format)
- PNG/JPG (visual resources)
- ASE (Adobe Swatch Exchange)
- TXT (plain text references)

### Browser Compatibility
- Modern browsers with ES6+ support
- PDF.js for in-browser PDF rendering
- Fetch API for document loading

### Performance Considerations
- Lazy loading for large documents
- Caching strategies for frequently accessed files
- Progressive loading for multi-part documents

## Contributing

To contribute documents or integration patterns:
1. Fork the repository
2. Add your documents to the appropriate category
3. Update the manifest.json file
4. Submit a pull request with description

## License

MIT © Kohlyde

## Related Projects

- [Dorthi AI Companion](https://kohlyde.github.io/dorthi/)
- Dorothy Prime Final Interface

## Contact

For questions or suggestions regarding document management or integration patterns, please open an issue in the repository.
