import { NextResponse } from "next/server";
import { PDFDocument } from 'pdf-lib';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const pdfFile = formData.get('pdf') as File;
    
    if (!pdfFile) {
      return NextResponse.json(
        { error: "No PDF file provided" },
        { status: 400 }
      );
    }

    // Read the PDF file
    const pdfBytes = await pdfFile.arrayBuffer();
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();
    
    // Extract text from all pages
    let text = '';
    for (const page of pages) {
      const content = await page.getTextContent();
      text += content + '\n';
    }

    return NextResponse.json({ 
      success: true,
      text,
      filename: pdfFile.name 
    });
  } catch (error) {
    console.error("PDF Upload Error:", error);
    return NextResponse.json(
      { error: "Failed to process PDF" },
      { status: 500 }
    );
  }
} 