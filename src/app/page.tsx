"use client"

import { useEffect, useState } from 'react';

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

        // Get all rect elements and update their opacity
        const rects = svgDoc.getElementsByTagName('rect');
        Array.from(rects).forEach((rect, index) => {
          rect.setAttribute('opacity', selectedRects.includes(index) ? '1' : '0.2');
        });

        // Convert the updated SVG back to string
        const serializer = new XMLSerializer();
        const updatedSvg = serializer.serializeToString(svgDoc);
        setSvgContent(updatedSvg);
      } catch (error) {
        console.error('Error updating SVG:', error);
      }
    };

    loadAndUpdateSvg();
  }, [selectedRects]); // Run effect when selectedRects changes

  const handleCheckboxChange = (index: number) => {
    setSelectedRects(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <main className="p-4">
      <div className="flex flex-col md:flex-row gap-4">
        {/* SVG display area */}
        <div className="flex-1">
          {svgContent && (
            <div
              dangerouslySetInnerHTML={{ __html: svgContent }}
              className="w-full h-auto"
            />
          )}
        </div>

        {/* Checkbox controls */}
        <div className="w-full md:w-64 space-y-2 bg-gray-100 p-4 rounded">
          <h2 className="text-lg font-bold mb-4">Pattern Selection</h2>
          {Array(12).fill(0).map((_, index) => (
            <label
              key={index}
              className="flex items-center space-x-2 cursor-pointer hover:bg-gray-200 p-2 rounded"
            >
              <input
                type="checkbox"
                checked={selectedRects.includes(index)}
                onChange={() => handleCheckboxChange(index)}
                className="w-4 h-4"
              />
              <span>Pattern {index + 1}</span>
            </label>
          ))}
        </div>
      </div>
    </main>
  );
}