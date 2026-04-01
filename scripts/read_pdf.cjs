const fs = require('fs');
const pdfModule = require('pdf-parse');

const pdfParser = typeof pdfModule === 'function' ? pdfModule : (pdfModule.default || pdfModule);

const pdfPath = 'c:\\Users\\utsav\\Desktop\\vo_nextApp\\Security_Audit_Report.pdf';
const txtPath = 'c:\\Users\\utsav\\Desktop\\vo_nextApp\\Security_Audit_Report.txt';
const errorPath = 'c:\\Users\\utsav\\Desktop\\vo_nextApp\\error.json';

try {
    let dataBuffer = fs.readFileSync(pdfPath);
    pdfParser(dataBuffer).then(function(data) {
        fs.writeFileSync(txtPath, data.text, 'utf8');
        console.log('PDF text extracted');
    }).catch(function(error) {
        fs.writeFileSync(errorPath, JSON.stringify(error, Object.getOwnPropertyNames(error)));
        console.error('PDF Parse Error');
        process.exit(1);
    });
} catch (e) {
    fs.writeFileSync(errorPath, JSON.stringify(e, Object.getOwnPropertyNames(e)));
    console.error('Sync Error');
    process.exit(1);
}
