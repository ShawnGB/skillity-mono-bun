import { createRequire } from 'module';
import { readFileSync } from 'fs';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { format } from 'date-fns';
import { CATEGORY_LABELS } from '@skillity/shared';
import { getWorkshop } from '@/lib/workshops.server';

const require = createRequire(import.meta.url);

const interFont = readFileSync(
  require.resolve('@fontsource/inter/files/inter-latin-400-normal.woff'),
);
const frauncesFont = readFileSync(
  require.resolve('@fontsource/fraunces/files/fraunces-latin-400-normal.woff'),
);

export async function loader({ params }: { params: { id: string } }) {
  const { id } = params;

  let workshop;
  try {
    workshop = await getWorkshop('', id);
  } catch {
    return new Response('Not found', { status: 404 });
  }

  const title = workshop.title;
  const category = CATEGORY_LABELS[workshop.category] ?? '';
  const location = workshop.location ?? '';
  const date = workshop.startsAt
    ? format(new Date(workshop.startsAt), 'MMM d, yyyy')
    : '';
  const price =
    workshop.ticketPrice > 0 ? `€${workshop.ticketPrice}` : 'Free';

  const metaItems = [location, date, price].filter(Boolean);

  const svg = await satori(
    <div
      style={{
        width: '1200px',
        height: '630px',
        backgroundColor: '#F5EDE0',
        display: 'flex',
        flexDirection: 'column',
        padding: '60px',
        fontFamily: 'Inter',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0px' }}>
          <span
            style={{ fontFamily: 'Fraunces', fontSize: '26px', color: '#AB3415' }}
          >
            u
          </span>
          <span style={{ fontFamily: 'Inter', fontSize: '22px', color: '#9A8A7A' }}>
            /
          </span>
          <span style={{ fontFamily: 'Inter', fontSize: '22px', color: '#1A1208' }}>
            skillity
          </span>
        </div>
        {category ? (
          <div
            style={{
              backgroundColor: '#AB3415',
              color: '#F5EDE0',
              borderRadius: '100px',
              padding: '8px 20px',
              fontSize: '18px',
              fontFamily: 'Inter',
            }}
          >
            {category}
          </div>
        ) : null}
      </div>

      <div style={{ flex: 1, display: 'flex' }} />

      <div
        style={{
          fontFamily: 'Fraunces',
          fontSize: title.length > 40 ? '68px' : '84px',
          color: '#1A1208',
          textTransform: 'uppercase',
          lineHeight: 0.9,
          letterSpacing: '-2px',
          maxWidth: '1000px',
        }}
      >
        {title}
      </div>

      <div
        style={{
          display: 'flex',
          gap: '8px',
          marginTop: '36px',
          alignItems: 'center',
        }}
      >
        {metaItems.map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {i > 0 && (
              <span style={{ color: '#C4B4A4', fontSize: '20px' }}>·</span>
            )}
            <span
              style={{
                fontSize: '22px',
                color: i === metaItems.length - 1 ? '#AB3415' : '#7A6A5A',
                fontFamily: 'Inter',
              }}
            >
              {item}
            </span>
          </div>
        ))}
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Inter',
          data: interFont.buffer.slice(
            interFont.byteOffset,
            interFont.byteOffset + interFont.byteLength,
          ),
          weight: 400,
          style: 'normal',
        },
        {
          name: 'Fraunces',
          data: frauncesFont.buffer.slice(
            frauncesFont.byteOffset,
            frauncesFont.byteOffset + frauncesFont.byteLength,
          ),
          weight: 400,
          style: 'normal',
        },
      ],
    },
  );

  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } });
  const png = new Uint8Array(resvg.render().asPng());

  return new Response(png, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=86400, immutable',
    },
  });
}
