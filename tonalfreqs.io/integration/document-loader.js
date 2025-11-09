/**
 * tonalfreqs.io Document Loading System
 * Polymorphic document loader implementation for web applications
 * 
 * @version 1.0.0
 * @license MIT
 */

/**
 * Base DocumentLoader class
 * Provides core functionality for loading documents from the tonalfreqs.io repository
 */
export class DocumentLoader {
    constructor(basePath = './docs/') {
        this.basePath = basePath;
        this.manifestPath = './tonalfreqs.io/manifest.json';
        this.manifest = null;
        this.cache = new Map();
    }

    /**
     * Load and parse the document manifest
     * @returns {Promise<Object>} The manifest object
     */
    async loadManifest() {
        if (!this.manifest) {
            try {
                const response = await fetch(this.manifestPath);
                if (!response.ok) throw new Error(`Manifest load failed: ${response.status}`);
                this.manifest = await response.json();
            } catch (error) {
                console.error('Failed to load manifest:', error);
                throw error;
            }
        }
        return this.manifest;
    }

    /**
     * Get document metadata by ID
     * @param {string} documentId - Document identifier
     * @returns {Promise<Object|null>} Document metadata or null
     */
    async getDocumentMetadata(documentId) {
        const manifest = await this.loadManifest();
        return manifest.documents.find(doc => doc.id === documentId) || null;
    }

    /**
     * Load a document by its ID
     * @param {string} documentId - Document identifier
     * @returns {Promise<Blob>} Document blob
     */
    async loadDocument(documentId) {
        // Check cache
        if (this.cache.has(documentId)) {
            return this.cache.get(documentId);
        }

        const metadata = await this.getDocumentMetadata(documentId);
        if (!metadata) {
            throw new Error(`Document not found: ${documentId}`);
        }

        const blob = await this.loadByPath(metadata.path);
        this.cache.set(documentId, blob);
        return blob;
    }

    /**
     * Load document by file path
     * @param {string} path - Relative or absolute path to document
     * @returns {Promise<Blob>} Document blob
     */
    async loadByPath(path) {
        try {
            const response = await fetch(path);
            if (!response.ok) throw new Error(`HTTP ${response.status}: ${path}`);
            return await response.blob();
        } catch (error) {
            console.error(`Failed to load document: ${path}`, error);
            throw error;
        }
    }

    /**
     * Search documents by category
     * @param {string} category - Category identifier
     * @returns {Promise<Array>} Array of matching documents
     */
    async getDocumentsByCategory(category) {
        const manifest = await this.loadManifest();
        return manifest.documents.filter(doc => doc.category === category);
    }

    /**
     * Search documents by tags
     * @param {Array<string>} tags - Array of tags to search for
     * @returns {Promise<Array>} Array of matching documents
     */
    async searchByTags(tags) {
        const manifest = await this.loadManifest();
        return manifest.documents.filter(doc =>
            tags.some(tag => doc.tags.includes(tag))
        );
    }

    /**
     * Get all documents in a series
     * @param {string} seriesName - Name of the series
     * @returns {Promise<Array>} Array of documents sorted by part number
     */
    async getSeriesDocuments(seriesName) {
        const manifest = await this.loadManifest();
        return manifest.documents
            .filter(doc => doc.series && doc.series.name === seriesName)
            .sort((a, b) => a.series.part - b.series.part);
    }

    /**
     * Clear the document cache
     */
    clearCache() {
        this.cache.clear();
    }

    /**
     * Get all available categories
     * @returns {Promise<Array>} Array of category objects
     */
    async getCategories() {
        const manifest = await this.loadManifest();
        return manifest.categories || [];
    }

    /**
     * Get all available series
     * @returns {Promise<Array>} Array of series objects
     */
    async getSeries() {
        const manifest = await this.loadManifest();
        return manifest.series || [];
    }
}

/**
 * PDF Document Loader
 * Specialized loader for PDF documents with rendering capabilities
 */
export class PDFDocumentLoader extends DocumentLoader {
    /**
     * Load and prepare a PDF document
     * @param {string} documentId - Document identifier
     * @returns {Promise<Object>} Document object with rendering method
     */
    async loadPDF(documentId) {
        const blob = await this.loadDocument(documentId);
        const metadata = await this.getDocumentMetadata(documentId);
        return this.createPDFObject(blob, metadata);
    }

    /**
     * Create a PDF document object
     * @param {Blob} blob - PDF blob
     * @param {Object} metadata - Document metadata
     * @returns {Object} PDF document object
     */
    createPDFObject(blob, metadata) {
        const url = URL.createObjectURL(blob);
        return {
            url,
            type: 'pdf',
            metadata,
            render: (container) => {
                const iframe = document.createElement('iframe');
                iframe.src = url;
                iframe.style.width = '100%';
                iframe.style.height = '600px';
                iframe.style.border = 'none';
                iframe.title = metadata ? metadata.title : 'PDF Document';
                container.appendChild(iframe);
                return iframe;
            },
            cleanup: () => {
                URL.revokeObjectURL(url);
            }
        };
    }
}

/**
 * Image Document Loader
 * Specialized loader for image documents
 */
export class ImageDocumentLoader extends DocumentLoader {
    /**
     * Load and prepare an image document
     * @param {string} documentId - Document identifier
     * @returns {Promise<Object>} Document object with rendering method
     */
    async loadImage(documentId) {
        const blob = await this.loadDocument(documentId);
        const metadata = await this.getDocumentMetadata(documentId);
        return this.createImageObject(blob, metadata);
    }

    /**
     * Create an image document object
     * @param {Blob} blob - Image blob
     * @param {Object} metadata - Document metadata
     * @returns {Object} Image document object
     */
    createImageObject(blob, metadata) {
        const url = URL.createObjectURL(blob);
        return {
            url,
            type: 'image',
            metadata,
            render: (container) => {
                const img = document.createElement('img');
                img.src = url;
                img.style.maxWidth = '100%';
                img.style.height = 'auto';
                img.alt = metadata ? metadata.title : 'Image';
                container.appendChild(img);
                return img;
            },
            cleanup: () => {
                URL.revokeObjectURL(url);
            }
        };
    }
}

/**
 * Text Document Loader
 * Specialized loader for text documents
 */
export class TextDocumentLoader extends DocumentLoader {
    /**
     * Load and prepare a text document
     * @param {string} documentId - Document identifier
     * @returns {Promise<Object>} Document object with rendering method
     */
    async loadText(documentId) {
        const blob = await this.loadDocument(documentId);
        const text = await blob.text();
        const metadata = await this.getDocumentMetadata(documentId);
        return this.createTextObject(text, metadata);
    }

    /**
     * Create a text document object
     * @param {string} text - Text content
     * @param {Object} metadata - Document metadata
     * @returns {Object} Text document object
     */
    createTextObject(text, metadata) {
        return {
            content: text,
            type: 'text',
            metadata,
            render: (container) => {
                const pre = document.createElement('pre');
                pre.textContent = text;
                pre.style.whiteSpace = 'pre-wrap';
                pre.style.wordWrap = 'break-word';
                pre.style.fontFamily = 'monospace';
                pre.style.padding = '1rem';
                pre.style.backgroundColor = '#f5f5f5';
                pre.style.borderRadius = '4px';
                pre.style.overflow = 'auto';
                container.appendChild(pre);
                return pre;
            }
        };
    }
}

/**
 * Document Factory
 * Creates appropriate loader based on document type
 */
export class DocumentFactory {
    /**
     * Create a specialized loader for the given document type
     * @param {string} documentType - Type of document (pdf, image, text, etc.)
     * @param {string} basePath - Base path for documents
     * @returns {DocumentLoader} Appropriate loader instance
     */
    static createLoader(documentType, basePath) {
        const type = documentType.toLowerCase();
        
        if (type === 'pdf') {
            return new PDFDocumentLoader(basePath);
        } else if (['png', 'jpg', 'jpeg', 'gif', 'svg', 'image'].includes(type)) {
            return new ImageDocumentLoader(basePath);
        } else if (['txt', 'text', 'md', 'markdown'].includes(type)) {
            return new TextDocumentLoader(basePath);
        }
        
        return new DocumentLoader(basePath);
    }

    /**
     * Load and render a document
     * @param {string} documentId - Document identifier
     * @param {HTMLElement} container - Container element for rendering
     * @param {string} basePath - Base path for documents
     * @returns {Promise<Object>} Rendered document object
     */
    static async loadAndRender(documentId, container, basePath) {
        const baseLoader = new DocumentLoader(basePath);
        const metadata = await baseLoader.getDocumentMetadata(documentId);
        
        if (!metadata) {
            throw new Error(`Document not found: ${documentId}`);
        }

        // Determine file type from filename
        const extension = metadata.filename.split('.').pop().toLowerCase();
        const loader = this.createLoader(extension, basePath);

        let doc;
        if (extension === 'pdf') {
            doc = await loader.loadPDF(documentId);
        } else if (['png', 'jpg', 'jpeg', 'gif', 'svg'].includes(extension)) {
            doc = await loader.loadImage(documentId);
        } else if (['txt', 'md'].includes(extension)) {
            doc = await loader.loadText(documentId);
        } else {
            throw new Error(`Unsupported document type: ${extension}`);
        }

        doc.render(container);
        return doc;
    }
}

/**
 * Dorthi Integration
 * Specialized integration for the Dorthi AI Companion application
 */
export class DorthiDocumentIntegration {
    constructor(basePath) {
        this.documentLoader = new DocumentLoader(basePath);
        this.loadedDocuments = new Map();
    }

    /**
     * Display a document in the Dorthi chat interface
     * @param {string} documentId - Document identifier
     * @param {HTMLElement} chatContainer - Chat container element
     * @returns {Promise<void>}
     */
    async displayInChat(documentId, chatContainer) {
        const metadata = await this.documentLoader.getDocumentMetadata(documentId);
        
        if (!metadata) {
            console.error(`Document not found: ${documentId}`);
            return;
        }

        // Create message bubble
        const messageDiv = document.createElement('div');
        messageDiv.className = 'msg bot';
        messageDiv.style.maxWidth = '80%';

        // Add document info header
        const infoDiv = document.createElement('div');
        infoDiv.innerHTML = `
            <strong>${metadata.title}</strong><br>
            <small style="color: #999;">${metadata.description}</small>
            <div style="margin-top: 8px;">
                ${metadata.tags.map(tag => `<span style="background: #333; padding: 2px 6px; border-radius: 3px; font-size: 0.75rem; margin-right: 4px;">${tag}</span>`).join('')}
            </div>
        `;
        messageDiv.appendChild(infoDiv);

        // Add document viewer
        const viewerDiv = document.createElement('div');
        viewerDiv.style.marginTop = '12px';
        
        try {
            const doc = await DocumentFactory.loadAndRender(documentId, viewerDiv);
            this.loadedDocuments.set(documentId, doc);
        } catch (error) {
            viewerDiv.innerHTML = `<p style="color: #f44;">Error loading document: ${error.message}</p>`;
        }

        messageDiv.appendChild(viewerDiv);
        chatContainer.appendChild(messageDiv);
        
        // Scroll to new message
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    /**
     * Display a document series in the chat
     * @param {string} seriesName - Name of the series
     * @param {HTMLElement} chatContainer - Chat container element
     * @returns {Promise<void>}
     */
    async displaySeries(seriesName, chatContainer) {
        const seriesDocs = await this.documentLoader.getSeriesDocuments(seriesName);
        
        for (const doc of seriesDocs) {
            await this.displayInChat(doc.id, chatContainer);
        }
    }

    /**
     * Clean up all loaded documents
     */
    cleanup() {
        for (const doc of this.loadedDocuments.values()) {
            if (doc.cleanup) {
                doc.cleanup();
            }
        }
        this.loadedDocuments.clear();
        this.documentLoader.clearCache();
    }

    /**
     * Get document suggestions based on tags
     * @param {Array<string>} tags - Tags to search for
     * @returns {Promise<Array>} Matching documents
     */
    async getSuggestions(tags) {
        return await this.documentLoader.searchByTags(tags);
    }
}

// Export all classes
export default {
    DocumentLoader,
    PDFDocumentLoader,
    ImageDocumentLoader,
    TextDocumentLoader,
    DocumentFactory,
    DorthiDocumentIntegration
};
