import fs from 'fs'
import path from 'path'
import { NextRequest } from "next/server"

type CertificationLevel = 'Foundational' | 'Associate' | 'Professional' | 'Specialty';

interface Certification {
  id: number;
  name: string;
  description: string;
  level: CertificationLevel;
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

export const dynamic = 'force-dynamic'  // staticからdynamicに変更

export async function GET(request: NextRequest) {
  try {
    // クエリパラメータを取得
    const searchParams = request.nextUrl.searchParams;
    const certsParam = searchParams.get('certs');
    const certs = certsParam ? certsParam.toUpperCase().split(',') : [];

    // SVGファイルを読み込む
    const filePath = path.join(process.cwd(), 'public', 'default.svg');
    let svgContent = fs.readFileSync(filePath, 'utf-8');

    // 既存のrect要素を取得
    const rects = svgContent.match(/<rect[^>]*>/g) || [];

    // 各rect要素を処理
    rects.forEach((rect, index) => {
      const cert = AWS_CERTIFICATIONS[index];
      if (!cert) {
        return;
      }

      // 既存のopacity属性を削除
      const rectWithoutOpacity = rect.replace(/opacity="[^"]*"\s?/g, '');

      // 新しいopacityを設定
      const isHighlighted = certs.includes(cert.name);
      const opacity = isHighlighted ? "1.0" : "0.2";

      // rect要素を更新
      const updatedRect = rectWithoutOpacity.replace('<rect', `<rect opacity="${opacity}"`);
      svgContent = svgContent.replace(rect, updatedRect);
    });

    return new Response(svgContent, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'no-cache, no-store, must-revalidate',  // キャッシュ制御を変更
        'Pragma': 'no-cache',
        'Expires': '0'
      },
    });

  } catch (error) {
    console.error('Error processing request:', error);
    return new Response('Error processing request', { status: 500 });
  }
}