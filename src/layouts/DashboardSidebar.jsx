import { Box, IconButton, Typography, useTheme } from '@mui/material'
import React, { useState } from 'react'
import { Menu, MenuItem, Sidebar, sidebarClasses } from 'react-pro-sidebar'
import { tokens } from '../assets/theme'
import Logo from '../assets/images/logo.png'
import { ChildFriendlyOutlined, ClassOutlined, CloseOutlined, DashboardOutlined, EventOutlined, GolfCourseOutlined, ImageOutlined, ImportContactsOutlined, LeaderboardOutlined, MenuOutlined, PeopleOutlined, QuestionMarkOutlined, SchoolOutlined } from '@mui/icons-material'
import {Link, useLocation} from 'react-router-dom'

const MyItem = ({ title, to, icon }) => {
  const location = useLocation()
  const bla = 'jawad'
  return (
    <MenuItem
      active={location.pathname ===  title.toLowerCase() || location.pathname.includes(title.toLowerCase())}
      icon={icon}
      component={<Link to={to} />}
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
  const [collabsed , setCollabsed] = useState(false)
  return (
    <Sidebar
      collapsed = {collabsed}
      breakPoint='md'
      rootStyles={{
        borderRight : 'none',
        borderLeft : 'none !important',
        height : '100vh',
        position : 'sticky',
        top : '0',
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

      {
        collabsed
        ? (
          <Box
            sx={{
              display : 'flex',
              alignItems : 'center',
              justifyContent : 'center',
              marginBottom : '10px'
            }}
          >
            <IconButton
              onClick={() => setCollabsed(false)}
            >
              <MenuOutlined color='secondary' />
            </IconButton>
          </Box>
        )
        : (
          <Box
            sx={{
              display : 'flex',
              alignItems : 'center',
              justifyContent : 'flex-end',
            }}  
          >
            <IconButton
              onClick={() => setCollabsed(true)}
            >
              <CloseOutlined color='secondary' />

            </IconButton>
          </Box>
        )
      }
      {
        !collabsed
        ? (
          <>
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
          </>
        )
        : undefined
      }

      <Menu>
        <MyItem title={'Dashboard'} to={'/dashboard'} icon={<DashboardOutlined />} />
        <MyItem title={'Parents'} to={'/parents'} icon={<PeopleOutlined />} />
        <MyItem title={'Stuffs'} to={'/stuffs'} icon={<LeaderboardOutlined />} />
        <MyItem title={'Classes'} to={'/classes'} icon={<ClassOutlined />} />
        <MyItem title={'Courses'} to={'/courses'} icon={<GolfCourseOutlined />} />
        <MyItem title={'Childrens'} to={'/childrens'} icon={<SchoolOutlined />} />
        <MyItem title={'FAQs'} to={'/faqs'} icon={<QuestionMarkOutlined />} />
        <MyItem title={'Events'} to={'/events'} icon={<EventOutlined />} />
        <MyItem title={'Status'} to={'/status'} icon={<ImportContactsOutlined />} />
        <MyItem title={'Images'} to={'/images'} icon={<ImageOutlined />} />
      </Menu>
      
    </Sidebar>
  )
}

export default DashboardSidebar