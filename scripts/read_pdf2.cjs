const fs = require('fs');
const PDFParser = require("pdf2json");

const pdfParser = new PDFParser(this, 1);

pdfParser.on("pdfParser_dataError", errData => {
    console.error(errData.parserError);
    process.exit(1);
});
pdfParser.on("pdfParser_dataReady", pdfData => {
    fs.writeFileSync('c:\\Users\\utsav\\Desktop\\vo_nextApp\\Security_Audit_Report.txt', pdfParser.getRawTextContent());
    console.log('PDF text extracted successfully');
});

pdfParser.loadPDF('c:\\Users\\utsav\\Desktop\\vo_nextApp\\Security_Audit_Report.pdf');
