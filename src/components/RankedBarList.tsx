import { Box, Card, CardContent, LinearProgress, Skeleton, Stack, Typography } from '@mui/material';

export interface RankedBarListItem {
  key: string;
  label: string;
  value: number;
  displayValue: string;
  secondaryLabel?: string;
  color?: string;
}

interface RankedBarListProps {
  title: string;
  subtitle?: string;
  items: RankedBarListItem[];
  isLoading?: boolean;
  emptyMessage?: string;
}

export function RankedBarList({ title, subtitle, items, isLoading, emptyMessage }: RankedBarListProps) {
  const maxValue = Math.max(1, ...items.map((i) => i.value));

  return (
    <Card sx={{ borderRadius: 3, height: '100%' }}>
      <CardContent>
        <Typography variant="subtitle1" fontWeight={700}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {subtitle}
          </Typography>
        )}

        {isLoading ? (
          <Stack spacing={2.25} sx={{ mt: subtitle ? 0 : 2 }}>
            {Array.from({ length: 5 }).map((_, idx) => (
              <Box key={idx}>
                <Skeleton width="60%" height={20} />
                <Skeleton variant="rounded" height={8} sx={{ mt: 0.5, borderRadius: 4 }} />
              </Box>
            ))}
          </Stack>
        ) : items.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
            {emptyMessage ?? 'No data available.'}
          </Typography>
        ) : (
          <Stack spacing={2} sx={{ mt: subtitle ? 0.5 : 2 }}>
            {items.map((item) => (
              <Box key={item.key}>
                <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: 0.5 }}>
                  <Typography variant="body2" fontWeight={600} noWrap sx={{ mr: 1 }}>
                    {item.label}
                    {item.secondaryLabel && (
                      <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 0.75 }}>
                        {item.secondaryLabel}
                      </Typography>
                    )}
                  </Typography>
                  <Typography variant="body2" fontWeight={700} sx={{ fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>
                    {item.displayValue}
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={(item.value / maxValue) * 100}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: 'rgba(27, 35, 32, 0.06)',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 4,
                      bgcolor: item.color ?? 'primary.main',
                    },
                  }}
                />
              </Box>
            ))}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}
