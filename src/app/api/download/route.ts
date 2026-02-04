import { NextRequest, NextResponse } from 'next/server';
import PptxGenJS from 'pptxgenjs';

interface PitchSlide {
  title: string;
  content: string;
  notes?: string;
}

interface PitchDeck {
  companyName: string;
  tagline: string;
  slides: PitchSlide[];
}

export async function POST(request: NextRequest) {
  try {
    const pitchDeck: PitchDeck = await request.json();
    
    const pptx = new PptxGenJS();
    
    // Set presentation properties
    pptx.title = `${pitchDeck.companyName} - Pitch Deck`;
    pptx.author = 'PitchCraft AI';
    pptx.company = pitchDeck.companyName;
    pptx.layout = 'LAYOUT_16x9';

    // Define colors
    const primaryColor = '7C3AED'; // Violet
    const secondaryColor = '4F46E5'; // Indigo
    const textColor = '1E293B'; // Slate 800
    const lightGray = 'F1F5F9'; // Slate 100

    // Create cover slide
    const coverSlide = pptx.addSlide();
    coverSlide.background = { color: primaryColor };
    
    coverSlide.addText(pitchDeck.companyName, {
      x: 0.5,
      y: 2.5,
      w: '90%',
      h: 1.5,
      fontSize: 54,
      bold: true,
      color: 'FFFFFF',
      align: 'center',
    });

    coverSlide.addText(pitchDeck.tagline, {
      x: 0.5,
      y: 4,
      w: '90%',
      h: 0.8,
      fontSize: 24,
      color: 'FFFFFF',
      align: 'center',
    });

    // Create content slides
    pitchDeck.slides.forEach((slideData, index) => {
      // Skip if it's the cover slide data
      if (index === 0 && slideData.title.toLowerCase().includes('capa')) {
        return;
      }

      const slide = pptx.addSlide();
      
      // Add gradient-like header bar
      slide.addShape('rect', {
        x: 0,
        y: 0,
        w: '100%',
        h: 1.2,
        fill: { color: primaryColor },
      });

      // Slide number
      slide.addText(`${index + 1}`, {
        x: 0.3,
        y: 0.25,
        w: 0.6,
        h: 0.6,
        fontSize: 18,
        bold: true,
        color: 'FFFFFF',
        align: 'center',
        valign: 'middle',
        fill: { color: secondaryColor },
        shape: 'ellipse',
      });

      // Title
      slide.addText(slideData.title, {
        x: 1.1,
        y: 0.3,
        w: 8,
        h: 0.6,
        fontSize: 28,
        bold: true,
        color: 'FFFFFF',
      });

      // Content
      slide.addText(slideData.content, {
        x: 0.5,
        y: 1.5,
        w: 9,
        h: 3.5,
        fontSize: 18,
        color: textColor,
        valign: 'top',
        bullet: slideData.content.includes('•'),
      });

      // Notes section if available
      if (slideData.notes) {
        slide.addShape('rect', {
          x: 0.5,
          y: 4.8,
          w: 9,
          h: 0.7,
          fill: { color: 'FEF3C7' }, // Amber 100
          line: { color: 'F59E0B', width: 1 },
        });

        slide.addText(`💡 ${slideData.notes}`, {
          x: 0.7,
          y: 4.9,
          w: 8.6,
          h: 0.5,
          fontSize: 12,
          color: '92400E', // Amber 800
        });
      }
    });

    // Add closing slide
    const closingSlide = pptx.addSlide();
    closingSlide.background = { color: secondaryColor };
    
    closingSlide.addText('Obrigado!', {
      x: 0.5,
      y: 2,
      w: '90%',
      h: 1,
      fontSize: 48,
      bold: true,
      color: 'FFFFFF',
      align: 'center',
    });

    closingSlide.addText(`Vamos conversar sobre ${pitchDeck.companyName}`, {
      x: 0.5,
      y: 3.2,
      w: '90%',
      h: 0.6,
      fontSize: 24,
      color: 'FFFFFF',
      align: 'center',
    });

    closingSlide.addText('Criado com PitchCraft AI', {
      x: 0.5,
      y: 5,
      w: '90%',
      h: 0.4,
      fontSize: 12,
      color: 'C4B5FD', // Violet 300
      align: 'center',
    });

    // Generate the PPTX file
    const pptxBuffer = await pptx.write({ outputType: 'nodebuffer' }) as Buffer;
    const uint8Array = new Uint8Array(pptxBuffer);

    return new NextResponse(uint8Array, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'Content-Disposition': `attachment; filename="${pitchDeck.companyName.replace(/\s+/g, '-')}-pitch-deck.pptx"`,
      },
    });
  } catch (error) {
    console.error('Error generating PPTX:', error);
    return NextResponse.json(
      { error: 'Failed to generate PPTX file' },
      { status: 500 }
    );
  }
}
