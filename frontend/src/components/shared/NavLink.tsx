import { Link } from "react-router-dom"
type Props={
    to: string;
    bg: string;
    text: string;
    textColor: string;
    onClick?: ()=>Promise<void>;
}

const NavLink = (props:Props) => {
    const {to, text, bg, textColor}=props
    return (
        <Link to={to} style={{background: bg, color: textColor}} className="nav-link">{text}</Link>
    )
}

export default NavLink