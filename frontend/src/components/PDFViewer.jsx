import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

// Point to the worker — Vite will resolve this from node_modules
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

export default function PDFViewer({ file, currentPage, onPageChange, totalPages }) {
  const canvasRef = useRef(null);
  const [pdfDoc, setPdfDoc] = useState(null);

  useEffect(() => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      const typedArray = new Uint8Array(e.target.result);
      const doc = await pdfjsLib.getDocument({ data: typedArray }).promise;
      setPdfDoc(doc);
      onPageChange(1, doc.numPages);
    };
    reader.readAsArrayBuffer(file);
  }, [file]);

  useEffect(() => {
    if (!pdfDoc || !canvasRef.current) return;
    renderPage(currentPage);
  }, [pdfDoc, currentPage]);

  // const renderPage = async (pageNum) => {
  //   const page = await pdfDoc.getPage(pageNum);
  //   const viewport = page.getViewport({ scale: 1.4 });
  //   const canvas = canvasRef.current;
  //   canvas.width = viewport.width;
  //   canvas.height = viewport.height;
  //   await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
  // };

  const renderTaskRef = useRef(null);

const renderPage = async (pageNum) => {

  if (renderTaskRef.current) {
    renderTaskRef.current.cancel();
  }

  const page = await pdfDoc.getPage(pageNum);

  const viewport = page.getViewport({
    scale: 1.4
  });

  const canvas = canvasRef.current;

  canvas.width = viewport.width;
  canvas.height = viewport.height;

  const renderTask = page.render({
    canvasContext: canvas.getContext('2d'),
    viewport
  });

  renderTaskRef.current = renderTask;

  try {
    await renderTask.promise;
  } catch (err) {
    if (err.name !== 'RenderingCancelledException') {
      console.error(err);
    }
  }
};

  return (
    <div className="pdf-canvas-wrap">
      <canvas ref={canvasRef} />
    </div>
  );
}
