import { useState } from 'react';
import { Box, Card, CardContent, Skeleton, Stack, Typography, useTheme } from '@mui/material';
import { formatCurrency } from '../utils/format';
import type { MonthlyRevenue } from '../types/sales';

interface RevenueTrendChartProps {
  data: MonthlyRevenue[];
  isLoading?: boolean;
}

const WIDTH = 720;
const HEIGHT = 260;
const PADDING_LEFT = 8;
const PADDING_RIGHT = 8;
const PADDING_TOP = 16;
const PADDING_BOTTOM = 32;

export function RevenueTrendChart({ data, isLoading }: RevenueTrendChartProps) {
  const theme = useTheme();
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const plotWidth = WIDTH - PADDING_LEFT - PADDING_RIGHT;
  const plotHeight = HEIGHT - PADDING_TOP - PADDING_BOTTOM;

  const maxValue = Math.max(1, ...data.map((d) => d.totalSales));

  const points = data.map((d, idx) => {
    const x = data.length > 1 ? PADDING_LEFT + (idx / (data.length - 1)) * plotWidth : PADDING_LEFT + plotWidth / 2;
    const y = PADDING_TOP + plotHeight - (d.totalSales / maxValue) * plotHeight;
    return { x, y, d };
  });

  const linePath = points.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath =
    points.length > 0
      ? `${linePath} L ${points[points.length - 1].x} ${PADDING_TOP + plotHeight} L ${points[0].x} ${
          PADDING_TOP + plotHeight
        } Z`
      : '';

  const hovered = hoverIndex !== null ? points[hoverIndex] : null;

  return (
    <Card sx={{ borderRadius: 3, height: '100%' }}>
      <CardContent>
        <Typography variant="subtitle1" fontWeight={700}>
          Revenue Trend
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Monthly sales over the last 12 months
        </Typography>

        {isLoading ? (
          <Skeleton variant="rounded" height={260} sx={{ borderRadius: 2 }} />
        ) : data.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ py: 6, textAlign: 'center' }}>
            No revenue data available.
          </Typography>
        ) : (
          <Box sx={{ position: 'relative' }}>
            <svg
              viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
              width="100%"
              height={HEIGHT}
              role="img"
              aria-label="Monthly revenue trend chart"
              onMouseLeave={() => setHoverIndex(null)}
            >
              <defs>
                <linearGradient id="revenue-area-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={theme.palette.primary.main} stopOpacity={0.28} />
                  <stop offset="100%" stopColor={theme.palette.primary.main} stopOpacity={0} />
                </linearGradient>
              </defs>

              {/* Horizontal gridlines */}
              {[0, 0.25, 0.5, 0.75, 1].map((t) => (
                <line
                  key={t}
                  x1={PADDING_LEFT}
                  x2={WIDTH - PADDING_RIGHT}
                  y1={PADDING_TOP + plotHeight * t}
                  y2={PADDING_TOP + plotHeight * t}
                  stroke="#E4E2DA"
                  strokeWidth={1}
                />
              ))}

              <path d={areaPath} fill="url(#revenue-area-fill)" stroke="none" />
              <path d={linePath} fill="none" stroke={theme.palette.primary.main} strokeWidth={2.5} />

              {points.map((p, idx) => (
                <g key={p.d.month}>
                  <rect
                    x={p.x - plotWidth / Math.max(data.length, 1) / 2}
                    y={PADDING_TOP}
                    width={plotWidth / Math.max(data.length, 1)}
                    height={plotHeight}
                    fill="transparent"
                    onMouseEnter={() => setHoverIndex(idx)}
                  />
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={hoverIndex === idx ? 5 : 3}
                    fill={theme.palette.primary.main}
                    stroke="#fff"
                    strokeWidth={1.5}
                  />
                  {(idx === 0 || idx === points.length - 1 || idx % 2 === 0) && (
                    <text
                      x={p.x}
                      y={HEIGHT - 8}
                      fontSize={10}
                      fill={theme.palette.text.secondary}
                      textAnchor="middle"
                    >
                      {p.d.label.split(' ')[0]}
                    </text>
                  )}
                </g>
              ))}
            </svg>

            {hovered && (
              <Stack
                sx={{
                  position: 'absolute',
                  left: `${(hovered.x / WIDTH) * 100}%`,
                  top: 0,
                  transform: 'translateX(-50%)',
                  bgcolor: 'text.primary',
                  color: 'background.paper',
                  borderRadius: 1.5,
                  px: 1.25,
                  py: 0.75,
                  pointerEvents: 'none',
                  minWidth: 120,
                }}
              >
                <Typography variant="caption" fontWeight={700}>
                  {hovered.d.label}
                </Typography>
                <Typography variant="caption">{formatCurrency(hovered.d.totalSales)}</Typography>
                <Typography variant="caption" sx={{ opacity: 0.75 }}>
                  {hovered.d.totalOrders} orders
                </Typography>
              </Stack>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
