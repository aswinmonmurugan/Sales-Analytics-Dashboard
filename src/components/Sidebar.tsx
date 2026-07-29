import { Box, Chip, Drawer, Stack, Tooltip, Typography } from '@mui/material';
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';
import SpaceDashboardRoundedIcon from '@mui/icons-material/SpaceDashboardRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import InsightsRoundedIcon from '@mui/icons-material/InsightsRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import type { ReactNode } from 'react';
import { sidebarTokens } from '../theme';

interface NavItem {
  label: string;
  icon: ReactNode;
  active?: boolean;
  comingSoon?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', icon: <SpaceDashboardRoundedIcon fontSize="small" />, active: true },
  { label: 'Orders', icon: <ReceiptLongRoundedIcon fontSize="small" />, comingSoon: true },
  { label: 'Customers', icon: <GroupRoundedIcon fontSize="small" />, comingSoon: true },
  { label: 'Reports', icon: <InsightsRoundedIcon fontSize="small" />, comingSoon: true },
];

function NavRow({ item }: { item: NavItem }) {
  const row = (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1.5}
      sx={{
        px: 2,
        py: 1.1,
        mx: 1.5,
        borderRadius: 2,
        cursor: item.comingSoon ? 'default' : 'pointer',
        color: item.active ? sidebarTokens.activeText : sidebarTokens.textMuted,
        bgcolor: item.active ? sidebarTokens.activeBg : 'transparent',
        opacity: item.comingSoon ? 0.55 : 1,
        transition: 'background-color 140ms ease, color 140ms ease',
        '&:hover': item.comingSoon
          ? undefined
          : {
              bgcolor: item.active ? sidebarTokens.activeBg : sidebarTokens.hoverBg,
              color: item.active ? sidebarTokens.activeText : sidebarTokens.textPrimary,
            },
      }}
    >
      <Box sx={{ display: 'flex', color: 'inherit' }}>{item.icon}</Box>
      <Typography variant="body2" fontWeight={item.active ? 700 : 500} color="inherit" sx={{ flexGrow: 1 }}>
        {item.label}
      </Typography>
      {item.comingSoon && (
        <Chip
          label="Soon"
          size="small"
          sx={{
            height: 18,
            fontSize: '0.62rem',
            bgcolor: 'rgba(255,255,255,0.08)',
            color: sidebarTokens.textMuted,
          }}
        />
      )}
    </Stack>
  );

  return item.comingSoon ? (
    <Tooltip title="Coming soon" placement="right">
      <Box>{row}</Box>
    </Tooltip>
  ) : (
    row
  );
}

function SidebarContent() {
  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: sidebarTokens.background,
        color: sidebarTokens.textPrimary,
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1.25} sx={{ px: 3, py: 3 }}>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: sidebarTokens.activeBg,
            color: sidebarTokens.activeText,
          }}
        >
          <BarChartRoundedIcon fontSize="small" />
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="subtitle1" fontWeight={700} lineHeight={1.2} noWrap>
            Salesforge
          </Typography>
          <Typography variant="caption" sx={{ color: sidebarTokens.textMuted }} noWrap>
            Analytics Dashboard
          </Typography>
        </Box>
      </Stack>

      <Typography
        variant="caption"
        sx={{ px: 3.5, mb: 1, mt: 1, color: sidebarTokens.textMuted, letterSpacing: '0.08em', fontWeight: 700 }}
      >
        MENU
      </Typography>
      <Stack spacing={0.5} sx={{ flexGrow: 1 }}>
        {NAV_ITEMS.map((item) => (
          <NavRow key={item.label} item={item} />
        ))}
      </Stack>

      <Box sx={{ borderTop: `1px solid ${sidebarTokens.border}`, px: 1.5, py: 1.5 }}>
        <NavRow item={{ label: 'Settings', icon: <SettingsRoundedIcon fontSize="small" />, comingSoon: true }} />
      </Box>
    </Box>
  );
}

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Permanent sidebar on desktop */}
      <Box
        component="nav"
        sx={{
          display: { xs: 'none', md: 'block' },
          width: sidebarTokens.width,
          flexShrink: 0,
        }}
      >
        <Box sx={{ position: 'fixed', width: sidebarTokens.width, height: '100vh' }}>
          <SidebarContent />
        </Box>
      </Box>

      {/* Temporary drawer on mobile */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: sidebarTokens.width, boxSizing: 'border-box', border: 'none' },
        }}
      >
        <SidebarContent />
      </Drawer>
    </>
  );
}

export { sidebarTokens };
