import { useState } from 'react';
import { Button, Checkbox, FormControlLabel, Menu, MenuItem } from '@mui/material';
import ViewColumnRoundedIcon from '@mui/icons-material/ViewColumnRounded';
import type { ColumnVisibility } from './SalesTable';

interface ColumnVisibilityMenuProps {
  value: ColumnVisibility;
  onChange: (value: ColumnVisibility) => void;
}

const LABELS: { key: keyof ColumnVisibility; label: string }[] = [
  { key: 'category', label: 'Category' },
  { key: 'quantity', label: 'Quantity' },
  { key: 'orderDate', label: 'Order Date' },
];

export function ColumnVisibilityMenu({ value, onChange }: ColumnVisibilityMenuProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  return (
    <>
      <Button
        variant="outlined"
        color="inherit"
        size="small"
        startIcon={<ViewColumnRoundedIcon />}
        onClick={(e) => setAnchorEl(e.currentTarget)}
      >
        Columns
      </Button>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
        {LABELS.map(({ key, label }) => (
          <MenuItem
            key={key}
            onClick={() => onChange({ ...value, [key]: !value[key] })}
            dense
          >
            <FormControlLabel
              control={<Checkbox checked={value[key]} size="small" />}
              label={label}
              onClick={(e) => e.preventDefault()}
              sx={{ pointerEvents: 'none' }}
            />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
