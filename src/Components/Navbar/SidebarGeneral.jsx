import { Sidebar as ProSidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import Logo_reducido from "../../assets/logos/logo_sjl_2.png"
import Logo from "../../assets/logos/logo_sjl.png"
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import { Fragment, useState } from 'react';
import { Typography } from '@mui/material';
import MapRoundedIcon from '@mui/icons-material/MapRounded';
import TravelExploreRoundedIcon from '@mui/icons-material/TravelExploreRounded';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import StayCurrentPortraitRoundedIcon from '@mui/icons-material/StayCurrentPortraitRounded';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LocalHospitalRoundedIcon from '@mui/icons-material/LocalHospitalRounded';
import { Link } from 'react-router-dom';

const Sidebar = ({ toggled, setToggled }) => {
    const [Collapsed, setCollapsed] = useState(false)

    const MenuItems = [
        {
            id: 1,
            label: 'Dashboard',
            icon: DashboardIcon,
            link: '/',
            target: '_self'
        },
        {
            id: 2,
            label: 'Mapas',
            icon: MapRoundedIcon,

            children: [
                { id: 1, label: 'Vigilancia', icon: TravelExploreRoundedIcon, link: '/vigilancia', target: '_blank' },
                { id: 2, label: 'Emergencias', icon: LocalHospitalRoundedIcon, link: '/emergencias', target: '_self' },
            ],
        },
        {
            id: 3,
            label: 'Administración',
            icon: TuneRoundedIcon,
            children: [
                {
                    id: 1, label: 'Celulares', icon: StayCurrentPortraitRoundedIcon, children: [
                        { id: 1, label: 'Lista', link: '/celular', target: '_self' },
                        { id: 2, label: 'Desactivados', link: '/celular/desactivados', target: '_self' },
                        { id: 3, label: 'Sin senal', link: '/celular/sin-señal', target: '_self' },
                    ]
                },
            ],
        }
    ]

    return (
        <div className='relative h-full w-max bg-slate-500 z-[1200]'>
            <ProSidebar
                backgroundColor='#ffffff'
                className='shadow h-full'
                breakPoint='md'
                collapsed={Collapsed}
                toggled={toggled}
                onBackdropClick={() => setToggled(false)}
                rootStyles={{
                    color: themes.light.sidebar.color,
                }}
            >
                <Link to={"/"} className='flex justify-center items-center h-[90px]' style={{ marginBottom: '24px', marginTop: '16px' }}>
                    <img src={Logo} alt="Logo reducido" className='w-full max-w-[230px]' />
                </Link>
                {
                    MenuItems.map((item) => (
                        item.children ? (
                            <Fragment key={item.id} >
                                <div style={{ padding: '0 24px', marginBottom: '8px', marginTop: '32px' }}>
                                    <Typography
                                        variant="body2"
                                        className='text-nowrap flex items-center gap-1'
                                        fontWeight={600}
                                        style={{ opacity: Collapsed ? 0 : 0.7, letterSpacing: '0.5px' }}
                                    >
                                        <item.icon />{item.label}
                                    </Typography>
                                </div>
                                <Menu menuItemStyles={menuItemStyles}>
                                    {item.children?.map((child) => (
                                        child?.children ? (
                                            <SubMenu key={child.id} label={child.label} icon={<child.icon />}>
                                                {child.children.map((child) => (
                                                    <MenuItem key={child.id} component={<Link to={child.link} target={child.target} />}>
                                                        {child.label}
                                                    </MenuItem>
                                                ))}
                                            </SubMenu>
                                        ) : (
                                            <MenuItem key={child.id} component={<Link to={child.link} target={child.target} />} icon={<child.icon />}>
                                                {child.label}
                                            </MenuItem>
                                        )
                                    ))}
                                </Menu>
                            </Fragment>
                        )
                            :
                            (
                                <Menu menuItemStyles={menuItemStyles} key={item.id}>
                                    <MenuItem component={<Link to={item.link} target={item.target} />} icon={<item.icon />}>
                                        {item.label}
                                    </MenuItem>
                                </Menu>
                            )
                    ))
                }

                <Menu >

                </Menu>
            </ProSidebar>
            <div
                className='justify-center items-center absolute cursor-pointer top-[100px] right-[-10px] rounded-full h-6 w-6 bg-[#0098e5] text-white z-10 hidden md:flex'
                onClick={() => setCollapsed(!Collapsed)}
            >
                <ChevronRightRoundedIcon
                    className={`transition-transform duration-300 ${Collapsed ? '' : 'rotate-180'}`}
                />
            </div>
        </div>

    )
}

export default Sidebar


const themes = {
    light: {
        sidebar: {
            backgroundColor: '#ffffff',
            color: '#607489',
        },
        menu: {
            menuContent: '#fbfcfd',
            icon: '#0098e5',
            hover: {
                backgroundColor: '#c5e4ff',
                color: '#44596e',
            },
            disabled: {
                color: '#9fb6cf',
            },
        },
    },
};

const menuItemStyles = {
    root: {
        fontSize: '13px',
        fontWeight: 400,
    },
    icon: {
        color: themes.light.menu.icon,
    },
    SubMenuExpandIcon: {
        color: '#b6b7b9',
    },
    subMenuContent: {
        backgroundColor: 'transparent',
    },
    button: {
        '&:hover': {
            backgroundColor: themes.light.menu.hover.backgroundColor,
            color: themes.light.menu.hover.color,
        },
    },
    label: {
        fontWeight: 600,
    },
};
