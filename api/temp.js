const PDFDocument = require('pdf-lib')
const fs = require('fs')
const path = require('path')
const {google} = require('googleapis')
const readline = require('readline')
const dotenv = require('dotenv')


// folder to sign on google drive
//const folder = process.argv.slice(2)[0]
const folder = '/Users/lcassa/Downloads/drive-download-20210309T150803Z-001/'

dotenv.config()

// retrieve file from google drive 108g_k7PDpMNY_LIFPBxZx3_MlMUrCoNa

const pngImageBytes = fs.readFileSync('/Users/lcassa/Downloads/drive-download-20210309T150803Z-001/signature.png')

async function signPdf(file) {
    if(path.extname(file) !== '.pdf') return

    console.log(PDFDocument.load)
    const existingPdfBytes = fs.readFileSync(path.resolve(folder, file))

    // load existing pdf
    const pdfDoc = await PDFDocument.PDFDocument.load(existingPdfBytes)

    // Embed the PNG image bytes
    const pngImage = await pdfDoc.embedPng(pngImageBytes)

    // Get the width/height of the PNG image scaled down to 50% of its original size
    const pngDims = pngImage.scale(0.5)

    // Add a blank page to the document
    const page = pdfDoc.getPage(pdfDoc.getPageCount()-1)

    // Draw the PNG image near the lower right corner of the JPG image
    page.drawImage(pngImage, {
      x: page.getWidth() / 2 - pngDims.width / 2 + 200,
      y: page.getHeight() / 2 - pngDims.height - 60,
      width: pngDims.width,
      height: pngDims.height,
    })

    // Serialize the PDFDocument to bytes (a Uint8Array)
    const pdfBytes = await pdfDoc.save()
    fs.writeFileSync(path.resolve(folder, file), pdfBytes)
}

fs.readdirSync(folder).forEach(file => {
    // console.log(file)
    signPdf(file)
})