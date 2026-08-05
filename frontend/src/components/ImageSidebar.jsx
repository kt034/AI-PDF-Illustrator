import React from 'react';
export default function ImageSidebar({ imageUrl, prompt, loading, error, onGenerate }) {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>🎨 AI Illustration</h3>
        <button
          className="gen-btn"
          onClick={onGenerate}
          disabled={loading}
        >
          {loading ? 'Generating…' : '✨ Generate for this page'}
        </button>
      </div>

      <div className="sidebar-body">
        {loading && (
          <div className="skeleton-wrap">
            <div className="skeleton" />
            <p className="hint">Generating illustration using FLUX AI...</p>
          </div>
        )}

        {error && !loading && (
          <div className="error-box">⚠️ {error}</div>
        )}

        {imageUrl && !loading && (
          <>
            <img src={imageUrl} alt="AI-generated illustration" className="gen-image" />
            {prompt && (
              <details className="prompt-detail">
                <summary>View prompt</summary>
                <p>{prompt}</p>
              </details>
            )}
          </>
        )}

        {!imageUrl && !loading && !error && (
          <div className="placeholder">
            <span>📄</span>
            <p>Navigate to a page and click Generate to create a contextual illustration.</p>
          </div>
        )}
      </div>
    </div>
  );
}
