const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const app = express();
const PORT = 5000;

// ✅ IMPORTANT: allow chrome extension to access backend
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());

// serve pdf files
app.use("/pdfs", express.static(path.join(__dirname, "pdfs")));

// generate pdf
app.post("/api/generate-pdf", (req, res) => {
  const { text } = req.body;

  const id = crypto.randomUUID();
  const fileName = `${id}.pdf`;
  const filePath = path.join(__dirname, "pdfs", fileName);

  const doc = new PDFDocument();
  const stream = fs.createWriteStream(filePath);

  doc.pipe(stream);
  doc.text(text);
  doc.end();

  stream.on("finish", () => {
    res.json({
      downloadUrl: `http://localhost:5000/pdfs/${fileName}`
    });
  });
});

// homepage
app.get("/", (req, res) => {
  fs.readdir(path.join(__dirname, "pdfs"), (err, files) => {
    if (err) return res.send("No PDFs yet");
    res.send(files.map(f => `<a href="/pdfs/${f}">${f}</a>`).join("<br>"));
  });
});

app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});
