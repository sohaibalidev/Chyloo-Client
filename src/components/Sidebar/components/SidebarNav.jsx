import { NavLink } from 'react-router-dom';

const SidebarNav = ({ navItems, isCollapsed }) => {
  return (
    <nav className='sidebar-nav'>
      {navItems.map(({ to, label, icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          title={isCollapsed ? label : ''}
        >
          {icon}
          {!isCollapsed && <span>{label}</span>}
        </NavLink>
      ))}
    </nav>
  );
};

export default SidebarNav;
