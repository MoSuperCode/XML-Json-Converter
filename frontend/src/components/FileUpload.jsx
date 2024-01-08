export default function FileUpload({ fetchUploadedFile, fetchXmlFile }) {
  const handleFileUpload = async (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    console.log("Uploaded file: ", file);

    // Hochladen der Datei
    const formData = new FormData();
    formData.append("json", file);

    try {
      const response = await fetch("http://localhost:8000/upload", {
        method: "POST",
        body: formData,
      });

      //Nachdem Hochgeladen Wurde, Fetch die Datei
      if (response.ok) {
        const fileName = file.name;
        fetchUploadedFile(fileName);
        try {
          fetchXmlFile();
        } catch (error) {
          console.error("Fehler beim Fetchen der XML Datei");
        }
      } else {
        console.error("Fehler beim Hochladen der Datei");
      }
    } catch (error) {
      console.error("Fehler beim Hochladen der Datei:", error);
    }
  };

  return (
    <div>
      <h1>Lade eine Json Datei hoch!</h1>
      <form encType="multipart/form-data">
        <div className="mb-3">
          <input
            className=" form-control btn btn-primary"
            type="file"
            name="json"
            onChange={handleFileUpload}
          />
        </div>
      </form>
    </div>
  );
}
