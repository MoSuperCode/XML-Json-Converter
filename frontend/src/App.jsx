import "./App.css";
import { useState } from "react";
import FileUpload from "./components/FileUpload";
import JsonPreview from "./components/JsonPreview";
import XmlPreview from "./components/XmlPreview";

function App() {
  const [jsonData, setJsonData] = useState(null);
  const [xmlData, setXmlData] = useState(null);

  const fetchUploadedFile = (fileName) => {
    fetch(`http://localhost:8000/getfile/${fileName}`)
      .then((response) => response.json())
      .then((data) => {
        const formattedData = JSON.stringify(data, null, 2);
        setJsonData(formattedData);
      })
      .catch((error) => {
        console.error("Fehler beim Laden der JSON-Daten:", error);
        setJsonData("Es ist ein Fehler beim Anzeigen der Daten passiert.");
      }, []);
  };

  const fetchXmlFile = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/getxmlfile/output.xml`
      );
      if (!response.ok) {
        throw new Error(`Server returned error: ${response.status}`);
      }
      const xmlData = await response.text(); // Verwenden Sie await mit text()
      setXmlData(xmlData);
    } catch (err) {
      console.error("Fehler beim Fetchen der XML-Daten: ", err);
      setXmlData("Fehler beim Anzeigen der XML-Daten.");
    }
  };

  return (
    <div>
      <FileUpload
        fetchXmlFile={fetchXmlFile}
        fetchUploadedFile={fetchUploadedFile}
      />
      <div className="container preview">
        <div className="row">
          <div className="col-sm json">
            <JsonPreview jsonData={jsonData} />
          </div>
          <div className="col-sm xml">
            <XmlPreview xmlData={xmlData} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
