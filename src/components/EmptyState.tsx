import { Box, Typography } from '@mui/material';
import InboxRoundedIcon from '@mui/icons-material/InboxRounded';

interface EmptyStateProps {
  title?: string;
  description?: string;
}

export function EmptyState({
  title = 'No orders found',
  description = 'Try adjusting your search or filters to find what you are looking for.',
}: EmptyStateProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        px: 2,
        color: 'text.secondary',
      }}
    >
      <InboxRoundedIcon sx={{ fontSize: 48, mb: 1.5, opacity: 0.5 }} />
      <Typography variant="subtitle1" fontWeight={600} color="text.primary">
        {title}
      </Typography>
      <Typography variant="body2" sx={{ mt: 0.5, maxWidth: 320, textAlign: 'center' }}>
        {description}
      </Typography>
    </Box>
  );
}
