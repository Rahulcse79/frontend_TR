import React from 'react';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import * as RiIcons from 'react-icons/ri';
import { FaServer, FaAddressCard, FaPhoneAlt } from 'react-icons/fa';
import { MdNetworkCell, MdChecklist, MdFileUpload } from 'react-icons/md';
import { RiCalendarScheduleFill } from 'react-icons/ri';
import { CiTimer } from 'react-icons/ci';
import { IoSettings, IoLogOutOutline } from 'react-icons/io5';
import { BsTelephoneFill } from 'react-icons/bs';
import { LiaHistorySolid } from 'react-icons/lia';
import { AiOutlineOrderedList } from 'react-icons/ai';
import { SiServerfault } from "react-icons/si";
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const CookieName = process.env.REACT_APP_COOKIENAME || "auto provision";

const SidebarDataPage = () => {
  const navigate = useNavigate();

  const logOutCall = async () => {
    Cookies.remove(CookieName); 
    await new Promise(resolve => setTimeout(resolve, 500));
    navigate("/");
  };

  const SidebarData = [
    {
      title: 'Dashboard',
      path: '/home',
      icon: <AiIcons.AiFillHome style={{ color: '#4CAF50' }} />
    },
    {
      title: <span style={{ fontSize: '14px' }}>Device Detail</span>,
      icon: <BsTelephoneFill style={{ color: '#2196F3' }} />,
      iconClosed: <RiIcons.RiArrowDownSFill style={{ color: '#2196F3' }} />,
      iconOpened: <RiIcons.RiArrowUpSFill style={{ color: '#2196F3' }} />,
      subNav: [
        {
          title: 'Online Devices',
          path: "/online-devices",
          icon: <BsTelephoneFill style={{ color: '#00BCD4' }} />
        },
        {
          title: 'Listing Device',
          path: '/listing-devices',
          icon: <AiOutlineOrderedList style={{ color: '#009688' }} />
        },
        {
          title: 'Listing file',
          path: '/fileUploadList',
          icon: <MdFileUpload style={{ color: '#03A9F4' }} />
        }
      ]
    },
    {
      section: 'Device Management'
    },
    {
      title: <span style={{ fontSize: '14px' }}>Provision IP phone</span>,
      icon: <FaPhoneAlt style={{ color: '#9C27B0' }} />,
      iconClosed: <RiIcons.RiArrowDownSFill style={{ color: '#9C27B0' }} />,
      iconOpened: <RiIcons.RiArrowUpSFill style={{ color: '#9C27B0' }} />,
      subNav: [
        {
          title: 'Coral IP Phones',
          path: '/Ip-Phone-Provisioning',
          icon: <IoIcons.IoIosPaper style={{ color: '#673AB7' }} />
        },
        {
          title: 'Backup config',
          path: '/Backup_config',
          icon: <IoIcons.IoIosPaper style={{ color: '#795548' }} />
        },
        {
          title: 'Cisco CP-3905',
          path: '/cisco_CP-3905',
          icon: <IoIcons.IoIosPaper style={{ color: '#607D8B' }} />
        }
      ]
    },
    {
      title: 'Servers',
      icon: <FaServer style={{ color: '#FF9800' }} />,
      iconClosed: <RiIcons.RiArrowDownSFill style={{ color: '#FF9800' }} />,
      iconOpened: <RiIcons.RiArrowUpSFill style={{ color: '#FF9800' }} />,
      subNav: [
        {
          title: '5G core',
          path: '/linux-provisioning',
          icon: <MdNetworkCell style={{ color: '#E91E63' }} />
        },
        {
          title: 'Call Server',
          path: '/call-server',
          icon: <FaServer style={{ color: '#FF5722' }} />
        },
        {
          title: 'Add IPAddress to server',
          path: '/add-IPAddress',
          icon: <FaAddressCard style={{ color: '#3F51B5' }} />
        }
      ]
    },
    {
      section: 'Scheduling'
    },
    {
      title: 'Scheduling',
      icon: <RiCalendarScheduleFill style={{ color: '#00BCD4' }} />,
      iconClosed: <RiIcons.RiArrowDownSFill style={{ color: '#00BCD4' }} />,
      iconOpened: <RiIcons.RiArrowUpSFill style={{ color: '#00BCD4' }} />,
      subNav: [
        {
          title: 'Auto Scheduling',
          path: '/time-schedule',
          icon: <CiTimer style={{ color: '#03A9F4' }} />
        },
        {
          title: 'Auto Update List',
          path: '/auto-update',
          icon: <MdChecklist style={{ color: '#4CAF50' }} />
        }
      ]
    },
    {
      section: 'System Settings'
    },
    {
      title: 'System Settings',
      path: '/system-setting',
      icon: <IoSettings style={{ color: '#607D8B' }} />
    },
    {
      title: 'Fault',
      path: '/faults',
      icon: <SiServerfault style={{ color: '#F44336' }} />
    },
    {
      title: 'History',
      path: '/history',
      icon: <LiaHistorySolid style={{ color: '#3F51B5' }} />
    },
    {
      section: 'Logout'
    },
    {
      title: 'Logout',
      onClick: logOutCall,
      icon: <IoLogOutOutline style={{ color: '#F44336' }} />
    }
  ];

  return SidebarData;
};

export default SidebarDataPage;
