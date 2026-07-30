import { Box, Button, Typography } from '@mui/material';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';

interface ErrorStateProps {
  message?: string;
  onRetry: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
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
      <ErrorOutlineRoundedIcon sx={{ fontSize: 48, mb: 1.5, color: 'error.main' }} />
      <Typography variant="subtitle1" fontWeight={600} color="text.primary">
        Something went wrong
      </Typography>
      <Typography variant="body2" sx={{ mt: 0.5, mb: 2, maxWidth: 360, textAlign: 'center' }}>
        {message ?? 'We could not load your sales data. Please try again.'}
      </Typography>
      <Button variant="outlined" startIcon={<RefreshRoundedIcon />} onClick={onRetry}>
        Retry
      </Button>
    </Box>
  );
}
