import { useState } from 'react';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import { AppLayout } from '../components/AppLayout';
import { useLocalStorageState } from '../hooks/useLocalStorageState';
import {
  DEFAULT_PAGE_SIZE,
  LOCAL_STORAGE_COLUMNS_KEY,
  LOCAL_STORAGE_FILTERS_KEY,
  LOCAL_STORAGE_SETTINGS_KEY,
  PAGE_SIZE_OPTIONS,
} from '../constants/sales';
import type { SortField, SortOrder, UserSettings } from '../types/sales';

const DEFAULT_SETTINGS: UserSettings = {
  displayName: 'Muzafar',
  email: 'muzafar@salesdashboard.io',
  role: 'Sales Team',
  defaultPageSize: DEFAULT_PAGE_SIZE,
  defaultSortField: 'orderDate',
  defaultSortOrder: 'desc',
  emailNotifications: true,
  weeklySummaryEmail: true,
  lowStockAlerts: false,
  currency: 'INR',
};

const SORT_FIELD_OPTIONS: { value: SortField; label: string }[] = [
  { value: 'orderDate', label: 'Order Date' },
  { value: 'amount', label: 'Amount' },
  { value: 'quantity', label: 'Quantity' },
];

const SORT_ORDER_OPTIONS: { value: SortOrder; label: string }[] = [
  { value: 'desc', label: 'Descending' },
  { value: 'asc', label: 'Ascending' },
];

const CURRENCY_OPTIONS: UserSettings['currency'][] = ['INR', 'USD', 'EUR', 'GBP'];

type SectionId = 'profile' | 'preferences' | 'notifications' | 'data';

const NAV_ITEMS: { id: SectionId; label: string; danger?: boolean }[] = [
  { id: 'profile', label: 'My Profile' },
  { id: 'preferences', label: 'Preferences' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'data', label: 'Reset Local Data', danger: true },
];

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return `${first}${last}`.toUpperCase();
}

/** A single row: label + description on the left, a control on the right. Mirrors the
 *  "Enable Desktop Notification" style rows from the reference screenshot. */
function SettingRow({
  title,
  description,
  control,
  last = false,
}: {
  title: string;
  description?: string;
  control: React.ReactNode;
  last?: boolean;
}) {
  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
        sx={{ py: 2 }}
      >
        <Box sx={{ minWidth: 0, pr: 2 }}>
          <Typography variant="body2" fontWeight={600}>
            {title}
          </Typography>
          {description && (
            <Typography variant="caption" color="text.secondary">
              {description}
            </Typography>
          )}
        </Box>
        <Box sx={{ flexShrink: 0 }}>{control}</Box>
      </Stack>
      {!last && <Divider />}
    </Box>
  );
}

function SectionHeading({ title }: { title: string }) {
  return (
    <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 0.5 }}>
      {title}
    </Typography>
  );
}

export function SettingsPage() {
  const [settings, setSettings] = useLocalStorageState<UserSettings>(LOCAL_STORAGE_SETTINGS_KEY, DEFAULT_SETTINGS);
  const [draft, setDraft] = useState<UserSettings>(settings);
  const [activeSection, setActiveSection] = useState<SectionId>('profile');
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'info' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const isDirty = JSON.stringify(draft) !== JSON.stringify(settings);

  const updateDraft = (patch: Partial<UserSettings>) => setDraft((prev) => ({ ...prev, ...patch }));

  const handleSave = () => {
    setSettings(draft);
    setSnackbar({ open: true, message: 'Settings saved successfully.', severity: 'success' });
  };

  const handleDiscard = () => setDraft(settings);

  const handleResetLocalData = () => {
    setSettings(DEFAULT_SETTINGS);
    setDraft(DEFAULT_SETTINGS);
    localStorage.removeItem(LOCAL_STORAGE_FILTERS_KEY);
    localStorage.removeItem(LOCAL_STORAGE_COLUMNS_KEY);
    setSnackbar({ open: true, message: 'Local preferences and saved filters were reset.', severity: 'info' });
  };

  return (
    <AppLayout title="Settings" subtitle="Manage your profile, preferences, and notifications">
      <Paper
        variant="outlined"
        sx={{
          borderRadius: 3,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          minHeight: 560,
          overflow: 'hidden',
        }}
      >
        {/* Sidebar nav — mirrors the left rail in the reference screenshot */}
        <Box
          sx={{
            width: { xs: '100%', md: 240 },
            flexShrink: 0,
            borderRight: { md: '1px solid' },
            borderBottom: { xs: '1px solid', md: 'none' },
            borderColor: 'divider',
            py: 1.5,
          }}
        >
          <List sx={{ px: 1.5 }}>
            {NAV_ITEMS.map((item) => {
              const selected = activeSection === item.id;
              return (
                <ListItemButton
                  key={item.id}
                  selected={selected && !item.danger}
                  onClick={() => setActiveSection(item.id)}
                  sx={{
                    borderRadius: 2,
                    mb: 0.5,
                    color: item.danger ? 'error.main' : undefined,
                    '&.Mui-selected': {
                      bgcolor: 'primary.main',
                      color: 'primary.contrastText',
                      '&:hover': { bgcolor: 'primary.dark' },
                    },
                  }}
                >
                  <ListItemText
                    primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: selected ? 600 : 500 }}
                    primary={item.label}
                  />
                </ListItemButton>
              );
            })}
          </List>
        </Box>

        {/* Content panel */}
        <Box sx={{ flex: 1, p: { xs: 2.5, md: 3.5 }, display: 'flex', flexDirection: 'column' }}>
          {activeSection === 'profile' && (
            <Box>
              <SectionHeading title="My Profile" />
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Your name and email as shown across the dashboard.
              </Typography>

              <Stack direction="row" alignItems="center" spacing={2} sx={{ py: 2 }}>
                <Avatar sx={{ width: 56, height: 56, bgcolor: 'primary.main', fontSize: '1.1rem' }}>
                  {getInitials(draft.displayName || '?')}
                </Avatar>
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="body2" fontWeight={600} noWrap>
                    {draft.displayName || 'Unnamed user'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" noWrap>
                    {draft.email || 'No email set'}
                  </Typography>
                </Box>
              </Stack>
              <Divider />

              <SettingRow
                title="Display name"
                description="Shown in the top bar and on shared reports"
                control={
                  <TextField
                    size="small"
                    value={draft.displayName}
                    onChange={(e) => updateDraft({ displayName: e.target.value })}
                    sx={{ width: 240 }}
                  />
                }
              />
              <SettingRow
                title="Email"
                description="Used for sign-in and notifications"
                control={
                  <TextField
                    size="small"
                    type="email"
                    value={draft.email}
                    onChange={(e) => updateDraft({ email: e.target.value })}
                    sx={{ width: 240 }}
                  />
                }
              />
              <SettingRow
                title="Role"
                description="Displayed on your profile card"
                last
                control={
                  <TextField
                    size="small"
                    value={draft.role}
                    onChange={(e) => updateDraft({ role: e.target.value })}
                    sx={{ width: 240 }}
                  />
                }
              />
            </Box>
          )}

          {activeSection === 'preferences' && (
            <Box>
              <SectionHeading title="Preferences" />
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Defaults used when you open the Orders table.
              </Typography>

              <SettingRow
                title="Default rows per page"
                description="How many orders load on each page"
                control={
                  <Select
                    size="small"
                    value={draft.defaultPageSize}
                    onChange={(e) => updateDraft({ defaultPageSize: Number(e.target.value) })}
                    sx={{ width: 180 }}
                  >
                    {PAGE_SIZE_OPTIONS.map((size) => (
                      <MenuItem key={size} value={size}>
                        {size}
                      </MenuItem>
                    ))}
                  </Select>
                }
              />
              <SettingRow
                title="Default sort field"
                description="Column used to sort the Orders table"
                control={
                  <Select
                    size="small"
                    value={draft.defaultSortField}
                    onChange={(e) => updateDraft({ defaultSortField: e.target.value as SortField })}
                    sx={{ width: 180 }}
                  >
                    {SORT_FIELD_OPTIONS.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </MenuItem>
                    ))}
                  </Select>
                }
              />
              <SettingRow
                title="Default sort order"
                description="Ascending or descending by default"
                control={
                  <Select
                    size="small"
                    value={draft.defaultSortOrder}
                    onChange={(e) => updateDraft({ defaultSortOrder: e.target.value as SortOrder })}
                    sx={{ width: 180 }}
                  >
                    {SORT_ORDER_OPTIONS.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </MenuItem>
                    ))}
                  </Select>
                }
              />
              <SettingRow
                title="Currency"
                description="Used to format amounts across the dashboard"
                last
                control={
                  <Select
                    size="small"
                    value={draft.currency}
                    onChange={(e) => updateDraft({ currency: e.target.value as UserSettings['currency'] })}
                    sx={{ width: 180 }}
                  >
                    {CURRENCY_OPTIONS.map((c) => (
                      <MenuItem key={c} value={c}>
                        {c}
                      </MenuItem>
                    ))}
                  </Select>
                }
              />
            </Box>
          )}

          {activeSection === 'notifications' && (
            <Box>
              <SectionHeading title="Notifications" />
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Choose what you'd like to be notified about.
              </Typography>

              <SettingRow
                title="Email notifications"
                description="Get notified about order status changes"
                control={
                  <Switch
                    checked={draft.emailNotifications}
                    onChange={(e) => updateDraft({ emailNotifications: e.target.checked })}
                  />
                }
              />
              <SettingRow
                title="Weekly summary email"
                description="A digest of sales performance every Monday"
                control={
                  <Switch
                    checked={draft.weeklySummaryEmail}
                    onChange={(e) => updateDraft({ weeklySummaryEmail: e.target.checked })}
                  />
                }
              />
              <SettingRow
                title="Low stock alerts"
                description="Notify me when a product category is trending down"
                last
                control={
                  <Switch
                    checked={draft.lowStockAlerts}
                    onChange={(e) => updateDraft({ lowStockAlerts: e.target.checked })}
                  />
                }
              />
            </Box>
          )}

          {activeSection === 'data' && (
            <Box>
              <SectionHeading title="Reset Local Data" />
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Locally saved filters, column choices, and preferences live only in this browser.
              </Typography>

              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                justifyContent="space-between"
                alignItems={{ sm: 'center' }}
                spacing={1.5}
                sx={{ p: 2, borderRadius: 2, bgcolor: 'rgba(179, 67, 43, 0.06)' }}
              >
                <Box>
                  <Typography variant="body2" fontWeight={600}>
                    Reset local dashboard data
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Clears saved filters, table columns, and settings on this device
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  startIcon={<DeleteOutlineRoundedIcon />}
                  onClick={handleResetLocalData}
                  sx={{ flexShrink: 0 }}
                >
                  Reset
                </Button>
              </Stack>
            </Box>
          )}

          {/* Save bar — only relevant for editable sections */}
          {activeSection !== 'data' && (
            <Stack
              direction="row"
              justifyContent="flex-end"
              spacing={1.5}
              sx={{ mt: 'auto', pt: 3 }}
            >
              <Button variant="text" onClick={handleDiscard} disabled={!isDirty}>
                Discard changes
              </Button>
              <Button variant="contained" startIcon={<SaveRoundedIcon />} onClick={handleSave} disabled={!isDirty}>
                Save changes
              </Button>
            </Stack>
          )}
        </Box>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3500}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </AppLayout>
  );
}