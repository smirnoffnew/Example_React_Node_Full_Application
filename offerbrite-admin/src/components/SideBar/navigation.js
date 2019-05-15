import usersIcon from 'assets/icons/users-icon.png';
import companiesIcon from 'assets/icons/companies-icon.png';
import offersIcon from 'assets/icons/offers-icon.png';
import notificationsIcon from 'assets/icons/notifications-icon.png';
import analyticsIcon from 'assets/icons/analytics-icon.png';
import settingsIcon from 'assets/icons/settings-icon.png';
import reportsIcon from 'assets/icons/reports-icon.png';

export default [
  {
    to: '/admin/users',
    title: 'Users',
    icon: usersIcon,
  },
  {
    to: '/admin/companies',
    title: 'Companies',
    icon: companiesIcon,
  },
  {
    to: '/admin/offers',
    title: 'Offers',
    icon: offersIcon,
  },
  {
    to: '/admin/notifications',
    title: 'Notifications',
    icon: notificationsIcon,
  },
  {
    to: '/admin/analytics',
    title: 'Analytics',
    icon: analyticsIcon,
  },
  {
    to: '/admin/settings',
    title: 'Settings',
    icon: settingsIcon,
  },
  {
    to: '/admin/reports',
    title: 'Reports',
    icon: reportsIcon,
    withBadge: true,
  },
];
