# API Reference

## Classes

### DocumentLoader

Base class for loading documents from the tonalfreqs.io repository.

#### Constructor

```javascript
new DocumentLoader(basePath = './docs/')
```

**Parameters:**
- `basePath` (string): Base path for document loading

#### Methods

##### `loadManifest()`

Load and parse the document manifest.

```javascript
const manifest = await loader.loadManifest();
```

**Returns:** `Promise<Object>` - The manifest object

---

##### `getDocumentMetadata(documentId)`

Get metadata for a specific document.

```javascript
const metadata = await loader.getDocumentMetadata('dorthi-ai-companion');
```

**Parameters:**
- `documentId` (string): Document identifier

**Returns:** `Promise<Object|null>` - Document metadata or null if not found

---

##### `loadDocument(documentId)`

Load a document by its ID.

```javascript
const blob = await loader.loadDocument('origins-house-music-1');
```

**Parameters:**
- `documentId` (string): Document identifier

**Returns:** `Promise<Blob>` - Document blob

---

##### `loadByPath(path)`

Load a document by file path.

```javascript
const blob = await loader.loadByPath('../docs/palette.txt');
```

**Parameters:**
- `path` (string): Relative or absolute path to document

**Returns:** `Promise<Blob>` - Document blob

---

##### `getDocumentsByCategory(category)`

Get all documents in a category.

```javascript
const musicDocs = await loader.getDocumentsByCategory('music-theory');
```

**Parameters:**
- `category` (string): Category identifier

**Returns:** `Promise<Array>` - Array of document metadata objects

---

##### `searchByTags(tags)`

Search documents by tags.

```javascript
const docs = await loader.searchByTags(['notation', 'camelot']);
```

**Parameters:**
- `tags` (Array<string>): Array of tags to search for

**Returns:** `Promise<Array>` - Array of matching documents

---

##### `getSeriesDocuments(seriesName)`

Get all documents in a series, sorted by part number.

```javascript
const series = await loader.getSeriesDocuments('Origins of House Music');
```

**Parameters:**
- `seriesName` (string): Name of the series

**Returns:** `Promise<Array>` - Array of documents sorted by part number

---

##### `clearCache()`

Clear the document cache.

```javascript
loader.clearCache();
```

---

##### `getCategories()`

Get all available categories.

```javascript
const categories = await loader.getCategories();
```

**Returns:** `Promise<Array>` - Array of category objects

---

##### `getSeries()`

Get all available series.

```javascript
const series = await loader.getSeries();
```

**Returns:** `Promise<Array>` - Array of series objects

---

### PDFDocumentLoader

Extends `DocumentLoader` with PDF-specific functionality.

#### Constructor

```javascript
new PDFDocumentLoader(basePath = './docs/')
```

#### Methods

##### `loadPDF(documentId)`

Load and prepare a PDF document.

```javascript
const pdfDoc = await pdfLoader.loadPDF('dorthi-ai-companion');
```

**Parameters:**
- `documentId` (string): Document identifier

**Returns:** `Promise<Object>` - PDF document object with:
  - `url` (string): Blob URL
  - `type` (string): 'pdf'
  - `metadata` (Object): Document metadata
  - `render(container)`: Function to render PDF in container
  - `cleanup()`: Function to revoke blob URL

**Example:**
```javascript
const doc = await pdfLoader.loadPDF('origins-house-music-1');
doc.render(document.getElementById('viewer'));
// ... later ...
doc.cleanup();
```

---

### ImageDocumentLoader

Extends `DocumentLoader` with image-specific functionality.

#### Constructor

```javascript
new ImageDocumentLoader(basePath = './docs/')
```

#### Methods

##### `loadImage(documentId)`

Load and prepare an image document.

```javascript
const imageDoc = await imageLoader.loadImage('doroty-swatch');
```

**Parameters:**
- `documentId` (string): Document identifier

**Returns:** `Promise<Object>` - Image document object with:
  - `url` (string): Blob URL
  - `type` (string): 'image'
  - `metadata` (Object): Document metadata
  - `render(container)`: Function to render image in container
  - `cleanup()`: Function to revoke blob URL

---

### TextDocumentLoader

Extends `DocumentLoader` with text-specific functionality.

#### Constructor

```javascript
new TextDocumentLoader(basePath = './docs/')
```

#### Methods

##### `loadText(documentId)`

Load and prepare a text document.

```javascript
const textDoc = await textLoader.loadText('palette-txt');
```

**Parameters:**
- `documentId` (string): Document identifier

**Returns:** `Promise<Object>` - Text document object with:
  - `content` (string): Text content
  - `type` (string): 'text'
  - `metadata` (Object): Document metadata
  - `render(container)`: Function to render text in container

---

### DocumentFactory

Factory class for creating appropriate loaders based on document type.

#### Static Methods

##### `createLoader(documentType, basePath)`

Create a specialized loader for the given document type.

```javascript
const loader = DocumentFactory.createLoader('pdf', './docs/');
```

**Parameters:**
- `documentType` (string): Type of document ('pdf', 'png', 'jpg', 'txt', etc.)
- `basePath` (string): Base path for documents

**Returns:** `DocumentLoader` - Appropriate loader instance

---

##### `loadAndRender(documentId, container, basePath)`

Load and render a document in one step.

```javascript
await DocumentFactory.loadAndRender('dorthi-ai-companion', viewerDiv);
```

**Parameters:**
- `documentId` (string): Document identifier
- `container` (HTMLElement): Container element for rendering
- `basePath` (string): Base path for documents (optional)

**Returns:** `Promise<Object>` - Rendered document object

---

### DorthiDocumentIntegration

Integration class for Dorthi AI Companion application.

#### Constructor

```javascript
new DorthiDocumentIntegration(basePath)
```

**Parameters:**
- `basePath` (string): Base path for documents (optional)

#### Methods

##### `displayInChat(documentId, chatContainer)`

Display a document in the Dorthi chat interface.

```javascript
await integration.displayInChat('origins-house-music-1', chatDiv);
```

**Parameters:**
- `documentId` (string): Document identifier
- `chatContainer` (HTMLElement): Chat container element

**Returns:** `Promise<void>`

---

##### `displaySeries(seriesName, chatContainer)`

Display all documents in a series in the chat.

```javascript
await integration.displaySeries('Origins of House Music', chatDiv);
```

**Parameters:**
- `seriesName` (string): Name of the series
- `chatContainer` (HTMLElement): Chat container element

**Returns:** `Promise<void>`

---

##### `cleanup()`

Clean up all loaded documents.

```javascript
integration.cleanup();
```

---

##### `getSuggestions(tags)`

Get document suggestions based on tags.

```javascript
const suggestions = await integration.getSuggestions(['house', 'music-history']);
```

**Parameters:**
- `tags` (Array<string>): Array of tags

**Returns:** `Promise<Array>` - Matching documents

---

## Document Metadata Structure

```javascript
{
  id: string,                    // Unique identifier
  title: string,                 // Display title
  category: string,              // Category ID
  subcategory: string,           // Subcategory
  filename: string,              // File name
  path: string,                  // Relative path
  description: string,           // Description
  fileSize: string,              // File size
  tags: Array<string>,           // Tags for searching
  version: string,               // Version number
  series?: {                     // Optional series info
    name: string,                // Series name
    part: number,                // Part number
    totalParts: number           // Total parts in series
  }
}
```

## Manifest Structure

```javascript
{
  version: string,               // Manifest version
  name: string,                  // Repository name
  description: string,           // Description
  lastUpdated: string,           // ISO date string
  documents: Array<Document>,    // Array of documents
  categories: Array<Category>,   // Array of categories
  series: Array<Series>          // Array of series
}
```

## Category Structure

```javascript
{
  id: string,                    // Category identifier
  name: string,                  // Display name
  description: string            // Category description
}
```

## Series Structure

```javascript
{
  name: string,                  // Series name
  totalParts: number,            // Total parts
  description: string            // Series description
}
```

## Usage Examples

### Basic Document Loading

```javascript
import { DocumentLoader } from './integration/document-loader.js';

const loader = new DocumentLoader();
const blob = await loader.loadDocument('dorthi-ai-companion');
const url = URL.createObjectURL(blob);
// Use the blob URL
```

### Load and Render PDF

```javascript
import { PDFDocumentLoader } from './integration/document-loader.js';

const loader = new PDFDocumentLoader();
const doc = await loader.loadPDF('origins-house-music-1');
const container = document.getElementById('viewer');
doc.render(container);
```

### Factory Pattern

```javascript
import { DocumentFactory } from './integration/document-loader.js';

const container = document.getElementById('viewer');
await DocumentFactory.loadAndRender('doroty-swatch', container);
```

### Search and Filter

```javascript
import { DocumentLoader } from './integration/document-loader.js';

const loader = new DocumentLoader();

// By category
const musicDocs = await loader.getDocumentsByCategory('music-theory');

// By tags
const djDocs = await loader.searchByTags(['camelot', 'dj-tools']);

// By series
const houseSeries = await loader.getSeriesDocuments('Origins of House Music');
```

### Dorthi Integration

```javascript
import { DorthiDocumentIntegration } from './integration/document-loader.js';

const integration = new DorthiDocumentIntegration();
const chatContainer = document.getElementById('chat');

// Display single document
await integration.displayInChat('dorthi-ai-companion', chatContainer);

// Display series
await integration.displaySeries('Standard vs Camelot Notation', chatContainer);

// Get suggestions
const suggestions = await integration.getSuggestions(['house', 'music-history']);
suggestions.forEach(doc => {
  console.log(doc.title);
});

// Cleanup when done
integration.cleanup();
```

## Error Handling

All async methods may throw errors. Always use try-catch:

```javascript
try {
  const doc = await loader.loadDocument('non-existent-doc');
} catch (error) {
  console.error('Failed to load document:', error);
  // Handle error appropriately
}
```

## Memory Management

Always clean up blob URLs when done:

```javascript
const doc = await pdfLoader.loadPDF('document-id');
doc.render(container);

// Later, when document is no longer needed:
doc.cleanup();
```

Or use the integration's cleanup method:

```javascript
const integration = new DorthiDocumentIntegration();
// ... use integration ...
integration.cleanup();  // Cleans up all loaded documents
```

## Browser Compatibility

- Modern browsers with ES6+ support
- Fetch API required
- Blob API required
- URL.createObjectURL() required

## License

MIT © Kohlyde
