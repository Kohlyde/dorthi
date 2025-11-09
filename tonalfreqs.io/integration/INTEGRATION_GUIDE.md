# Integration Guide

## Overview

This guide demonstrates how to integrate tonalfreqs.io documents into web applications using polymorphic loading patterns.

## Polymorphic Document Loading

Polymorphism in this context refers to the ability to load and handle different document types through a unified interface, allowing for flexible and extensible document management.

## Implementation Examples

### 1. Basic Document Loader Class

```javascript
/**
 * Base DocumentLoader class - demonstrates polymorphic loading pattern
 */
class DocumentLoader {
    constructor(basePath = './tonalfreqs.io/docs/') {
        this.basePath = basePath;
        this.manifest = null;
    }

    /**
     * Load the manifest file
     */
    async loadManifest() {
        if (!this.manifest) {
            const response = await fetch('./tonalfreqs.io/manifest.json');
            this.manifest = await response.json();
        }
        return this.manifest;
    }

    /**
     * Get document by ID from manifest
     */
    async getDocumentMetadata(documentId) {
        const manifest = await this.loadManifest();
        return manifest.documents.find(doc => doc.id === documentId);
    }

    /**
     * Load a document by ID
     */
    async loadDocument(documentId) {
        const metadata = await this.getDocumentMetadata(documentId);
        if (!metadata) {
            throw new Error(`Document not found: ${documentId}`);
        }
        return await this.loadByPath(metadata.path);
    }

    /**
     * Load document by file path
     */
    async loadByPath(path) {
        const response = await fetch(path);
        if (!response.ok) {
            throw new Error(`Failed to load document: ${path}`);
        }
        return await response.blob();
    }
}
```

### 2. Specialized Document Loaders (Polymorphic Pattern)

```javascript
/**
 * PDF Document Loader - extends base loader with PDF-specific functionality
 */
class PDFDocumentLoader extends DocumentLoader {
    async loadPDF(documentId) {
        const blob = await this.loadDocument(documentId);
        return await this.renderPDF(blob);
    }

    async renderPDF(blob) {
        // Use PDF.js or similar library
        const url = URL.createObjectURL(blob);
        return {
            url: url,
            type: 'pdf',
            render: (container) => {
                const iframe = document.createElement('iframe');
                iframe.src = url;
                iframe.style.width = '100%';
                iframe.style.height = '100%';
                container.appendChild(iframe);
            }
        };
    }
}

/**
 * Image Document Loader - extends base loader for image handling
 */
class ImageDocumentLoader extends DocumentLoader {
    async loadImage(documentId) {
        const blob = await this.loadDocument(documentId);
        return await this.renderImage(blob);
    }

    async renderImage(blob) {
        const url = URL.createObjectURL(blob);
        return {
            url: url,
            type: 'image',
            render: (container) => {
                const img = document.createElement('img');
                img.src = url;
                img.style.maxWidth = '100%';
                img.style.height = 'auto';
                container.appendChild(img);
            }
        };
    }
}

/**
 * Text Document Loader - extends base loader for text content
 */
class TextDocumentLoader extends DocumentLoader {
    async loadText(documentId) {
        const blob = await this.loadDocument(documentId);
        const text = await blob.text();
        return {
            content: text,
            type: 'text',
            render: (container) => {
                const pre = document.createElement('pre');
                pre.textContent = text;
                pre.style.whiteSpace = 'pre-wrap';
                container.appendChild(pre);
            }
        };
    }
}
```

### 3. Document Factory (Factory Pattern with Polymorphism)

```javascript
/**
 * Document Factory - creates appropriate loader based on document type
 */
class DocumentFactory {
    static createLoader(documentType, basePath) {
        switch(documentType.toLowerCase()) {
            case 'pdf':
                return new PDFDocumentLoader(basePath);
            case 'image':
            case 'png':
            case 'jpg':
            case 'jpeg':
                return new ImageDocumentLoader(basePath);
            case 'text':
            case 'txt':
                return new TextDocumentLoader(basePath);
            default:
                return new DocumentLoader(basePath);
        }
    }

    static async loadAndRender(documentId, container) {
        const baseLoader = new DocumentLoader();
        const metadata = await baseLoader.getDocumentMetadata(documentId);
        
        // Determine file type from filename
        const extension = metadata.filename.split('.').pop();
        const loader = this.createLoader(extension);
        
        // Load and render
        if (extension === 'pdf') {
            const doc = await loader.loadPDF(documentId);
            doc.render(container);
        } else if (['png', 'jpg', 'jpeg'].includes(extension)) {
            const doc = await loader.loadImage(documentId);
            doc.render(container);
        } else if (extension === 'txt') {
            const doc = await loader.loadText(documentId);
            doc.render(container);
        }
    }
}
```

### 4. Integration with Dorthi AI Companion

```javascript
/**
 * Dorthi Document Integration
 */
class DorthiDocumentIntegration {
    constructor() {
        this.documentLoader = new DocumentLoader();
        this.factory = DocumentFactory;
    }

    /**
     * Search documents by category
     */
    async getDocumentsByCategory(category) {
        const manifest = await this.documentLoader.loadManifest();
        return manifest.documents.filter(doc => doc.category === category);
    }

    /**
     * Search documents by tags
     */
    async searchByTags(tags) {
        const manifest = await this.documentLoader.loadManifest();
        return manifest.documents.filter(doc => 
            tags.some(tag => doc.tags.includes(tag))
        );
    }

    /**
     * Load document series
     */
    async loadSeries(seriesName) {
        const manifest = await this.documentLoader.loadManifest();
        const seriesDocs = manifest.documents
            .filter(doc => doc.series && doc.series.name === seriesName)
            .sort((a, b) => a.series.part - b.series.part);
        return seriesDocs;
    }

    /**
     * Render document in Dorthi interface
     */
    async displayInChat(documentId, chatContainer) {
        const metadata = await this.documentLoader.getDocumentMetadata(documentId);
        
        // Create message bubble
        const messageDiv = document.createElement('div');
        messageDiv.className = 'msg bot';
        
        // Add document info
        const infoDiv = document.createElement('div');
        infoDiv.innerHTML = `
            <strong>${metadata.title}</strong><br>
            <small>${metadata.description}</small>
        `;
        messageDiv.appendChild(infoDiv);
        
        // Add document viewer
        const viewerDiv = document.createElement('div');
        viewerDiv.style.marginTop = '10px';
        await this.factory.loadAndRender(documentId, viewerDiv);
        messageDiv.appendChild(viewerDiv);
        
        chatContainer.appendChild(messageDiv);
    }
}
```

## Usage Examples

### Example 1: Load a Single Document

```javascript
// Initialize the loader
const loader = new PDFDocumentLoader();

// Load the Dorthi AI Companion documentation
const doc = await loader.loadPDF('dorthi-ai-companion');

// Render in a container
const container = document.getElementById('document-viewer');
doc.render(container);
```

### Example 2: Load a Document Series

```javascript
const integration = new DorthiDocumentIntegration();

// Load all parts of Origins of House Music
const series = await integration.loadSeries('Origins of House Music');

// Display each part
for (const doc of series) {
    console.log(`Part ${doc.series.part}: ${doc.title}`);
    await integration.displayInChat(doc.id, chatContainer);
}
```

### Example 3: Search and Display Documents

```javascript
const integration = new DorthiDocumentIntegration();

// Search for music theory documents
const musicDocs = await integration.getDocumentsByCategory('music-theory');

// Search by tags
const notationDocs = await integration.searchByTags(['notation', 'camelot']);

// Display results
for (const doc of notationDocs) {
    await integration.displayInChat(doc.id, chatContainer);
}
```

### Example 4: Lazy Loading for Performance

```javascript
class LazyDocumentLoader extends DocumentLoader {
    constructor(basePath) {
        super(basePath);
        this.cache = new Map();
    }

    async loadDocument(documentId) {
        // Check cache first
        if (this.cache.has(documentId)) {
            return this.cache.get(documentId);
        }

        // Load and cache
        const doc = await super.loadDocument(documentId);
        this.cache.set(documentId, doc);
        return doc;
    }

    clearCache() {
        this.cache.clear();
    }
}
```

## Integration with HTML

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Tonalfreqs.io Document Viewer</title>
</head>
<body>
    <div id="app">
        <div id="sidebar">
            <h3>Documents</h3>
            <ul id="document-list"></ul>
        </div>
        <div id="viewer-container"></div>
    </div>

    <script type="module">
        import { DocumentFactory, DorthiDocumentIntegration } from './integration.js';

        const integration = new DorthiDocumentIntegration();
        
        // Load manifest and populate sidebar
        const manifest = await integration.documentLoader.loadManifest();
        const listEl = document.getElementById('document-list');
        
        manifest.documents.forEach(doc => {
            const li = document.createElement('li');
            li.textContent = doc.title;
            li.style.cursor = 'pointer';
            li.onclick = async () => {
                const container = document.getElementById('viewer-container');
                container.innerHTML = '';
                await DocumentFactory.loadAndRender(doc.id, container);
            };
            listEl.appendChild(li);
        });
    </script>
</body>
</html>
```

## Best Practices

1. **Lazy Loading**: Only load documents when needed to optimize performance
2. **Caching**: Cache frequently accessed documents to reduce network requests
3. **Error Handling**: Always implement proper error handling for failed document loads
4. **Progressive Enhancement**: Provide fallbacks for unsupported document types
5. **Memory Management**: Clean up blob URLs when documents are no longer needed
6. **Accessibility**: Ensure document viewers are accessible with proper ARIA labels

## Performance Optimization

```javascript
// Example: Progressive loading for large PDFs
class ProgressivePDFLoader extends PDFDocumentLoader {
    async loadPDFProgressive(documentId, onProgress) {
        const metadata = await this.getDocumentMetadata(documentId);
        const response = await fetch(metadata.path);
        
        const reader = response.body.getReader();
        const contentLength = +response.headers.get('Content-Length');
        
        let receivedLength = 0;
        let chunks = [];
        
        while(true) {
            const {done, value} = await reader.read();
            
            if (done) break;
            
            chunks.push(value);
            receivedLength += value.length;
            
            // Report progress
            const progress = (receivedLength / contentLength) * 100;
            onProgress(progress);
        }
        
        // Combine chunks
        const blob = new Blob(chunks, { type: 'application/pdf' });
        return await this.renderPDF(blob);
    }
}
```

## Security Considerations

1. **Validate document sources**: Only load documents from trusted sources
2. **Sanitize user input**: When searching or filtering documents
3. **Content Security Policy**: Configure CSP headers appropriately
4. **CORS**: Ensure proper CORS configuration for cross-origin document loading

## Troubleshooting

### Common Issues

**Issue**: Document fails to load
```javascript
// Solution: Add error handling and retry logic
async loadDocumentWithRetry(documentId, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await this.loadDocument(documentId);
        } catch (error) {
            if (i === maxRetries - 1) throw error;
            await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        }
    }
}
```

**Issue**: Memory leaks with blob URLs
```javascript
// Solution: Revoke blob URLs when done
class ManagedDocumentLoader extends DocumentLoader {
    constructor(basePath) {
        super(basePath);
        this.blobUrls = [];
    }

    createBlobUrl(blob) {
        const url = URL.createObjectURL(blob);
        this.blobUrls.push(url);
        return url;
    }

    cleanup() {
        this.blobUrls.forEach(url => URL.revokeObjectURL(url));
        this.blobUrls = [];
    }
}
```

## Next Steps

1. Implement the document loaders in your application
2. Customize the rendering logic for your UI framework
3. Add analytics to track document usage
4. Implement search and filtering features
5. Add document preview capabilities
