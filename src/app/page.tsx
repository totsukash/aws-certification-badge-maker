"use client";

import { useEffect, useState } from 'react';

type CertificationLevel = 'Foundational' | 'Associate' | 'Professional' | 'Specialty';

interface Certification {
  id: number;
  name: string;
  description: string;
  level: CertificationLevel;
}

interface ColorScheme {
  selected: string;
  unselected: string;
  badge: string;
}

interface LevelColors {
  [key: string]: ColorScheme;
}

const AWS_CERTIFICATIONS: Certification[] = [
  { id: 0, name: 'AIF', description: 'AI Practitioner', level: 'Foundational' },
  { id: 1, name: 'CLF', description: 'Cloud Practitioner', level: 'Foundational' },
  { id: 2, name: 'SOA', description: 'SysOps Administrator Associate', level: 'Associate' },
  { id: 3, name: 'DEA', description: 'Data Engineer Associate', level: 'Associate' },
  { id: 4, name: 'MLA', description: 'Machine Learning Engineer Associate', level: 'Associate' },
  { id: 5, name: 'DVA', description: 'Developer Associate', level: 'Associate' },
  { id: 6, name: 'SAP', description: 'Solutions Architect Professional', level: 'Professional' },
  { id: 7, name: 'DOP', description: 'DevOps Engineer Professional', level: 'Professional' },
  { id: 8, name: 'SAA', description: 'Solutions Architect Associate', level: 'Associate' },
  { id: 9, name: 'ANS', description: 'Advanced Networking Specialty', level: 'Specialty' },
  { id: 10, name: 'MLS', description: 'Machine Learning Specialty', level: 'Specialty' },
  { id: 11, name: 'SCS', description: 'Security - Specialty', level: 'Specialty' },
];

const baseColors: LevelColors = {
  'Foundational': {
    selected: 'bg-gray-700 text-white',
    unselected: 'bg-gray-200 text-gray-800',
    badge: 'bg-gray-100 text-gray-900'
  },
  'Associate': {
    selected: 'bg-blue-600 text-white',
    unselected: 'bg-blue-200 text-blue-800',
    badge: 'bg-blue-100 text-blue-900'
  },
  'Professional': {
    selected: 'bg-teal-600 text-white',
    unselected: 'bg-teal-200 text-teal-800',
    badge: 'bg-teal-100 text-teal-900'
  },
  'Specialty': {
    selected: 'bg-indigo-600 text-white',
    unselected: 'bg-indigo-200 text-indigo-800',
    badge: 'bg-indigo-100 text-indigo-900'
  }
};

const getLevelColor = (level: CertificationLevel, isSelected: boolean): string => {
  return isSelected ? baseColors[level].selected : baseColors[level].unselected;
};

const getBadgeColor = (level: CertificationLevel): string => {
  return baseColors[level].badge;
};

export default function Home() {
  const [selectedRects, setSelectedRects] = useState<number[]>([]);
  const [svgContent, setSvgContent] = useState<string>('');

  useEffect(() => {
    const loadAndUpdateSvg = async () => {
      try {
        const response = await fetch('/default.svg');
        const text = await response.text();
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(text, 'image/svg+xml');
        const svgElement = svgDoc.documentElement;
        svgElement.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        svgElement.setAttribute('width', '100%');
        svgElement.setAttribute('height', '100%');
        const rects = svgDoc.getElementsByTagName('rect');
        Array.from(rects).forEach((rect, index) => {
          rect.setAttribute('opacity', selectedRects.includes(index) ? '1' : '0.2');
        });
        const serializer = new XMLSerializer();
        const updatedSvg = serializer.serializeToString(svgDoc);
        setSvgContent(updatedSvg);
      } catch (error) {
        console.error('Error updating SVG:', error);
      }
    };
    loadAndUpdateSvg();
  }, [selectedRects]);

  const handleSelection = (id: number): void => {
    setSelectedRects(prev =>
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  const exportToPNG = () => {
    const svgElement = document.querySelector('svg');
    if (!svgElement) return;

    // Get original SVG dimensions from viewBox
    const viewBox = svgElement.getAttribute('viewBox');
    if (!viewBox) return;
    const [, , width, height] = viewBox.split(' ').map(Number);

    // Create high-resolution canvas (2x original SVG dimensions)
    const canvas = document.createElement('canvas');
    canvas.width = width * 2;
    canvas.height = height * 2;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Prepare SVG for conversion
    const clonedSvg = svgElement.cloneNode(true) as SVGElement;
    clonedSvg.setAttribute('width', width.toString());
    clonedSvg.setAttribute('height', height.toString());

    // Create an image from the SVG
    const img = new Image();
    const svgBlob = new Blob([clonedSvg.outerHTML], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      // Set image smoothing for better quality
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Draw the image at 2x scale for higher resolution
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Convert canvas to high-quality PNG
      const pngUrl = canvas.toDataURL('image/png', 1.0);
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = 'aws-certifications.png';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(url);
    };

    img.src = url;
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full max-w-full mx-auto p-4 sm:p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">AWS Certification Explorer</h1>
          <p className="mt-1 text-sm text-gray-500">Select certifications to explore their patterns</p>
        </div>

        <div className="mb-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {AWS_CERTIFICATIONS.map((cert) => {
              const isSelected = selectedRects.includes(cert.id);
              return (
                <button
                  key={cert.id}
                  onClick={() => handleSelection(cert.id)}
                  className={`
                    flex flex-col p-3 rounded-lg transition-all duration-200 ease-in-out h-24
                    ${getLevelColor(cert.level, isSelected)}
                    ${isSelected ? 'shadow-md scale-102' : 'shadow hover:shadow-sm'}
                  `}
                >
                  <div className="flex flex-col items-start space-y-1 w-full">
                    <span className="text-lg font-bold leading-tight">{cert.name}</span>
                    <span className="text-xs leading-tight opacity-90">{cert.description}</span>
                    <span className={`
                      mt-1 px-1.5 py-0.5 text-xs font-medium rounded
                      ${getBadgeColor(cert.level)}
                    `}>
                      {cert.level}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200">
          <div className="w-full max-w-full aspect-[2/1]">
            {svgContent && (
              <div
                dangerouslySetInnerHTML={{ __html: svgContent }}
                className="w-full h-full"
              />
            )}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-4">
            <span>
              {selectedRects.length} of {AWS_CERTIFICATIONS.length} certifications selected
            </span>
            <button
              onClick={exportToPNG}
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-500 transition-colors"
            >
              Export PNG
            </button>
          </div>
          {selectedRects.length > 0 && (
            <button
              onClick={() => setSelectedRects([])}
              className="text-blue-600 hover:text-blue-500"
            >
              Clear selection
            </button>
          )}
        </div>
      </div>
    </div>
  );
}