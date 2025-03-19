import { NavLink, NavLinkProps } from 'react-router-dom'

const baseStyle = 'hover:text-yellow-400 hover:underline'
const inActiveStyle = 'text-yellow-200'
const activeStyle = 'text-yellow-400 underline'

export default function CustomNavLink({ children, ...props }: NavLinkProps) {
  return (
    <NavLink
      {...props}
      className={({ isActive }) =>
        isActive
          ? activeStyle + ' ' + baseStyle
          : inActiveStyle + ' ' + baseStyle
      }
    >
      {children}
    </NavLink>
  )
}
