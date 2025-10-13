import { NavLink } from 'react-router-dom';

const BottomNav = ({ navItems }) => {
  return (
    <nav className='bottom-nav'>
      {navItems.map(({ to, label, icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) => `bottom-nav-link ${isActive ? 'active' : ''}`}
        >
          {icon}
          <span className='bottom-nav-label'>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNav;
