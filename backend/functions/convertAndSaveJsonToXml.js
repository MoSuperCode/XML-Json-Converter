const fs = require("fs");

module.exports = function convertAndSaveJsonToXml(
  inputJsonFilePath,
  outputXmlFilePath
) {
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
};
