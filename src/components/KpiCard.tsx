import { Box, Card, CardContent, Skeleton, Typography } from '@mui/material';
import type { ReactNode } from 'react';

interface KpiCardProps {
  label: string;
  value: string;
  icon: ReactNode;
  loading?: boolean;
  accentColor: string;
}

export function KpiCard({ label, value, icon, loading, accentColor }: KpiCardProps) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: `${accentColor}1A`,
            color: accentColor,
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="subtitle2" component="p" noWrap>
            {label}
          </Typography>
          {loading ? (
            <Skeleton width={100} height={32} />
          ) : (
            <Typography variant="h5" component="p" noWrap title={value}>
              {value}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
