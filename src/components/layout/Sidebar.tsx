import { NavLink } from 'react-router-dom';
import { sitemap } from '../../data/sitemap';
import { ILink } from '../../widgets/link';
import styles from './Sidebar.module.css';

const navItems: ILink[] = [
  {
    name: '账号与安全',
    href: sitemap.home,
  },
  {
    name: '会员订阅',
    href: sitemap.membership,
  },
];

export function Sidebar() {
  return (
    <nav className={`nav flex-column ${styles.sidebar}`}>
      {
        navItems.map((item, index) => (
          <NavLink
            to={item.href}
            key={index}
            className={({isActive}) => isActive ? `nav-link ${styles.active}` : 'nav-link'}
          >
            {item.name}
          </NavLink>
        ))
      }
    </nav>
  );
}
