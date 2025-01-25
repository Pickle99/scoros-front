import { useState } from 'react';
import './index.css';

function App() {
  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);
  const [sortOrder, setSortOrder] = useState<string>('top');
  const [output1Url, setOutput1Url] = useState<string>('');
  const [output2Url, setOutput2Url] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [messageText, setMessageText] = useState<boolean>(false);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFile: React.Dispatch<React.SetStateAction<File | null>>
  ) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!file1 || !file2) {
      setError('Please upload both files.');
      return;
    }

    const formData = new FormData();
    formData.append('input1', file1);
    formData.append('input2', file2);
    formData.append('sortOrder', sortOrder);

    try {
      const response = await fetch('http://localhost:8000/compare', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to process files.');
      }

      const result = await response.json();
      setOutput1Url(result.output_file1);
      setOutput2Url(result.output_file2);
      if(result.output_file1 === null && result.output_file1 === null) setMessageText(true)
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    }
  };

  return (
    <div className="container">
      <h1 className="title">File Comparator</h1>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="file1">Upload File 1:</label>
          <input
            type="file"
            id="file1"
            accept=".txt"
            onChange={(e) => handleFileChange(e, setFile1)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="file2">Upload File 2:</label>
          <input
            type="file"
            id="file2"
            accept=".txt"
            onChange={(e) => handleFileChange(e, setFile2)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="sortOrder">Sort Special Characters:</label>
          <select
            id="sortOrder"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="select"
          >
            <option value="top">Special Characters at the Top</option>
            <option value="bottom">Special Characters at the End</option>
          </select>
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit" className="button">
          Compare Files
        </button>
      </form>
      <div className="results">
        {output1Url && (
          <a
            href={`http://localhost:8000/${output1Url}`}
            download
            target="_blank"
            className="download-link"
          >
            Download File 1 (Unique to File 1)
          </a>
        )}
        {output2Url && (
          <a
            href={`http://localhost:8000/${output2Url}`}
            download
            target="_blank"
            className="download-link"
          >
            Download File 2 (Unique to File 2)
          </a>
        )}
        {messageText && (
          <p>Both inputs are the same, nothing unique has been found.</p>
        )}
      </div>
    </div>
  );
}

export default App;
