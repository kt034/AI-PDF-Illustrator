import React, { useState, useCallback } from 'react';
import PDFViewer from './components/PDFViewer';
import ImageSidebar from './components/ImageSidebar';
import PageControls from './components/PageControls';
import { uploadPDF, summarizePage, generateImage } from './api';
import './index.css';

export default function App() {
  const [file, setFile] = useState(null);
  const [pages, setPages] = useState([]);       // extracted text per page
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [imageUrl, setImageUrl] = useState('');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const f = e.target.files[0];
    if (!f || f.type !== 'application/pdf') return;
    setFile(f);
    setUploading(true);
    setImageUrl('');
    setPages([]);
    try {
      const { data } = await uploadPDF(f);
      setPages(data.pages);
    } catch {
      setError('Failed to process PDF.');
    } finally {
      setUploading(false);
    }
  };

  const handlePageChange = useCallback((page, total) => {
    if (total) setTotalPages(total);
    setCurrentPage(page);
    setImageUrl('');   // clear image when turning page
    setPrompt('');
    setError('');
  }, []);

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    setImageUrl('');
    try {
      const pageText = pages[currentPage - 1] || '';
      const { data: sumData } = await summarizePage(pageText, currentPage);
      setPrompt(sumData.prompt);
      const { data: imgData } = await generateImage(sumData.prompt);
      setImageUrl(imgData.imageUrl);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>📖 PDF × AI Illustrator</h1>
        <label className="upload-btn">
          {uploading ? 'Processing…' : '+ Upload PDF'}
          <input type="file" accept="application/pdf" onChange={handleFileChange} hidden />
        </label>
      </header>

      {file ? (
        <main className="main-layout">
          <section className="pdf-section">
            <PDFViewer
              file={file}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              totalPages={totalPages}
            />
            {totalPages > 0 && (
              <PageControls
                current={currentPage}
                total={totalPages}
                onChange={(p) => handlePageChange(p)}
              />
            )}
          </section>
          <ImageSidebar
            imageUrl={imageUrl}
            prompt={prompt}
            loading={loading}
            error={error}
            onGenerate={handleGenerate}
          />
        </main>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">📂</div>
          <h2>Upload a PDF to get started</h2>
          <p>Each page gets a contextual AI illustration generated from its content.</p>
        </div>
      )}
    </div>
  );
}
