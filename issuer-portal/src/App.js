import React, { useState } from "react";

function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [year, setYear] = useState("");
  const [issuer, setIssuer] = useState("");

  const handleFileUpload = (e) => {
    const uploaded = e.target.files[0];
    setFile(uploaded);

    if (uploaded) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(uploaded);
    }
  };

  const generateCredential = () => {
    if (!file || !name || !course || !year || !issuer) {
      alert("Please fill all fields and upload certificate");
      return;
    }

    const credential = {
      studentName: name,
      course: course,
      year: year,
      issuer: issuer,
      certificate: preview,
      issuedAt: new Date().toISOString()
    };

    localStorage.setItem("latestCredential", JSON.stringify(credential));
    alert("Credential created! Ready for signing!");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-10">
      <h1 className="text-4xl font-bold text-blue-400 mb-8">
        Issuer Portal
      </h1>

      <div className="space-y-4 max-w-xl">
        <input
          type="file"
          onChange={handleFileUpload}
          className="block w-full text-white"
        />

        {preview && (
          <img src={preview} alt="Preview" className="mt-4 w-64 border" />
        )}

        <input
          type="text"
          placeholder="Student Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 bg-gray-800 rounded"
        />

        <input
          type="text"
          placeholder="Course"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
          className="w-full p-3 bg-gray-800 rounded"
        />

        <input
          type="text"
          placeholder="Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="w-full p-3 bg-gray-800 rounded"
        />

        <input
          type="text"
          placeholder="Issuer Name"
          value={issuer}
          onChange={(e) => setIssuer(e.target.value)}
          className="w-full p-3 bg-gray-800 rounded"
        />

        <button
          onClick={generateCredential}
          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded font-semibold"
        >
          Generate Credential JSON
        </button>
      </div>
    </div>
  );
}

export default App;
