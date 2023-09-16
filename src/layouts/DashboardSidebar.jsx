import { Box, IconButton, Typography, useTheme } from '@mui/material'
import React, { useState } from 'react'
import { Menu, MenuItem, Sidebar, sidebarClasses } from 'react-pro-sidebar'
import { tokens } from '../assets/theme'
import Logo from '../assets/images/logo.png'
import { ChildFriendlyOutlined, ClassOutlined, CloseOutlined, DashboardOutlined, EscalatorWarning, EventOutlined, GolfCourseOutlined, ImageOutlined, ImportContactsOutlined, LeaderboardOutlined, MenuOutlined, PeopleOutlined, QuestionMarkOutlined, SchoolOutlined } from '@mui/icons-material'
import {Link, useLocation} from 'react-router-dom'
import { setOpenSidebar, useJawadAuthController } from '../context'

const MyItem = ({ title, to, icon }) => {
  const location = useLocation()
  const [, dispatch] = useJawadAuthController()
  return (
    <MenuItem
      active={location.pathname ===  title.toLowerCase() || location.pathname.includes(title.toLowerCase())}
      icon={icon}
      component={<Link to={to} />}
      onClick={() => {
        setOpenSidebar(dispatch , false)
      }}
    >
      <Typography
      >
        {
          title
        }
      </Typography>
    </MenuItem>
  );
}

const DashboardSidebar = () => {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)
  const [controller] = useJawadAuthController()
  return (
    <Sidebar
      collapsed = {false}
      rootStyles={{
        borderRight : 'none',
        position : 'fixed',
        borderLeft : 'none !important',
        zIndex : '10',
        backgroundColor : colors.blueAccent[900],
        height : '100vh',
        left : controller.openSidebar ? '5px' : '-250px',
        // position : 'sticky',
        top : '10px',
        height : 'calc(100vh - 20px)',
        borderRadius : '10px',
        [`.${sidebarClasses.container}`] : {
          borderRadius : '12px !important',
          backgroundColor : 'transparent',
          boxShadow : `0px 0px 15px -6px  ${colors.primary[600]}`,
          paddingTop : '10px'
        },
        '& .ps-menu-button' : {
          transition : '0.3s !important',
          marginBottom : '10px !important'
        },
        '& .ps-menu-button.ps-active' : {
          color : `${colors.yellowAccent[500]} !important`,
        },
        '& .ps-menu-button:hover' : {
          color : `${colors.yellowAccent[400]} !important`,
          backgroundColor : 'transparent !important'
        },
      }}
    >

      
      <Box
        mb={'20px'}
        sx={{
          display :'flex',
          alignItems : 'center',
          flexDirection : 'column'
        }}
      >
        <Box
          width={'150px'}
        >
          <img style={{width : '100%'}} src={Logo} alt='logo' />
        </Box>
      </Box>

      <Menu>
        <MyItem title={'Dashboard'} to={'/dashboard'} icon={<DashboardOutlined />} />
        <MyItem title={'Parents'} to={'/parents'} icon={<PeopleOutlined />} />
        <MyItem title={'Stuffs'} to={'/stuffs'} icon={<LeaderboardOutlined />} />
        <MyItem title={'Classes'} to={'/classes'} icon={<ClassOutlined />} />
        <MyItem title={'Courses'} to={'/courses'} icon={<GolfCourseOutlined />} />
        <MyItem title={'Childrens'} to={'/childrens'} icon={<SchoolOutlined />} />
        <MyItem title={'Age-Sections'} to={'/age-sections'} icon={<EscalatorWarning />} />
        <MyItem title={'FAQs'} to={'/faqs'} icon={<QuestionMarkOutlined />} />
        <MyItem title={'Events'} to={'/events'} icon={<EventOutlined />} />
        <MyItem title={'Status'} to={'/status'} icon={<ImportContactsOutlined />} />
        <MyItem title={'Images'} to={'/images'} icon={<ImageOutlined />} />
      </Menu>
      
    </Sidebar>
  )
}

export default DashboardSidebar