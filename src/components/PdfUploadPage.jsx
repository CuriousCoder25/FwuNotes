import React, { useState, useEffect } from "react";
import axios from "axios";
import UploadForm from "./UploadForm";
import UploadedList from "./UploadedList";
import PdfComp from "./PdfComp";
import Navbar from "./Navbar";

const PdfUploadPage = () => {
  const [allImage, setAllImage] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);

  useEffect(() => {
    getPdf();
  }, []);

  const getPdf = async () => {
    try {
      const result = await axios.get("https://soe-notes-pdf-backend.onrender.com/get-files");
      setAllImage(result.data.data);
    } catch (error) {
      console.error("Error fetching PDF files:", error);
    }
  };

  const showPdf = (pdf) => {
    setPdfFile(`https://soe-notes-pdf-backend.onrender.com/files/${pdf}`);
  };

  return (
    <>
      <Navbar />
      <div className="max-w-full mx-auto p-4">
        <div className="mt-20">
          <UploadForm getPdf={getPdf} />
        </div>
        <UploadedList allImage={allImage} showPdf={showPdf} />
        {pdfFile && <PdfComp pdfFile={pdfFile} />}
      </div>
    </>
  );
};

export default PdfUploadPage;
