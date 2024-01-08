const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const { parseString, Builder } = require("xml2js");
const dotenv = require("dotenv");

function jsonToXml(jsonData) {
  const builder = new Builder();
  const xml = builder.buildObject(jsonData);
  return xml;
}
function convertAndSaveJsonToXml(inputJsonFilePath, outputXmlFilePath) {
  fs.readFile(inputJsonFilePath, "utf-8", (err, data) => {
    if (err) {
      console.error("Error reading the JSON file:", err);
      return;
    }
    try {
      const jsonData = JSON.parse(data);
      const xmlData = jsonToXml(jsonData);

      fs.writeFile(outputXmlFilePath, xmlData, (err) => {
        if (err) {
          console.error("Error writing the XML file:", err);
          return;
        }
        console.log(`XML file has been saved: ${outputXmlFilePath}`);
      });
    } catch (parseErr) {
      console.error("Error parsing JSON data:", parseErr);
    }
  });
}

const inputJsonFilePath = "./uploads/data.json";
const outputXmlFilePath = "./uploads/xml/output.xml";

const app = express();
app.use(cors()); // Aktiviere CORS

app.use(express.static("uploads"));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Verwende den Originalnamen der Datei
  },
});

const upload = multer({ storage: storage });

app.post("/upload", upload.single("json"), (req, res) => {
  const uploadedFile = req.file;
  if (!uploadedFile) {
    return res.status(400).send("Es wurde keine Datei hochgeladen.");
  }

  console.log("Datei hochgeladen: ", uploadedFile.originalname);

  res.status(200).send("Datei erfolgreich hochgeladen.");
});

app.get("/getfile/:fileName", (req, res) => {
  const fileName = req.params.fileName;
  const filePath = path.join(__dirname, "uploads", fileName);

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Fehler beim Lesen der Datei: 1 ", err);
      return res.status(500).send("Fehler beim Lesen der Datei 2");
    }
    res.status(200).send(data);
    convertAndSaveJsonToXml(inputJsonFilePath, outputXmlFilePath);
  });
});

app.get("/getxmlfile/output.xml", async (req, res) => {
  const filePath = "./uploads/xml/output.xml";

  try {
    const data = fs.readFile(filePath, "utf8");
    xmlDat = await convertAndSaveJsonToXml(data, outputXmlFilePath); // Stellen Sie sicher, dass diese Funktion ein Promise zurückgibt
    res.status(200).send(xmlDat);
  } catch (err) {
    console.error("Fehler beim Lesen oder Konvertieren der Datei: ", err);
    res.status(500).send("Fehler beim Verarbeiten der Datei");
  }
});

const PORT = 8000;
app.listen(PORT, () => console.log("Server listening on port", PORT));
