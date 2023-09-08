import { Box, Button, IconButton, useMediaQuery, useTheme } from '@mui/material'
import React, { useContext } from 'react'
import { ColorModeContext} from '../assets/theme'
import { DarkModeOutlined, LightModeOutlined, LogoutOutlined } from '@mui/icons-material'
import { useLocation } from 'react-router'
import logo from '../assets/images/logo.png'

const Header = () => {
  const theme = useTheme()
  const colorMode = useContext(ColorModeContext)
  const {pathname} = useLocation()
  const isInAuthPage = pathname.includes('auth')
  const isInMedScreen = useMediaQuery('(max-width:767px)')
  return (
    <Box
      sx={{
        height : '80px',
        display : 'flex',
        alignItems : 'center',
        justifyContent : !isInAuthPage  && !isInMedScreen ? 'flex-end' : !isInAuthPage && isInMedScreen ? 'space-between' : 'space-between' ,
        borderRadius : '12px',
        padding : isInAuthPage ? '0 30px' : '0 6px',
        marginTop : '8px',
        marginBottom : '15px'
      }}
    >
      {
        isInAuthPage && (
          <Box>
            <img style={{width : '130px'}} src={logo} alt='logo'/>
          </Box>
        )
      }

      {
        !isInAuthPage && isInMedScreen &&  (
          <Box>
            <img style={{width : '130px'}} src={logo} alt='logo'/>
          </Box>
        )
      }
      
      <Box>
        <IconButton onClick={colorMode.toggleColorMode}>
          {
            theme.palette.mode === 'dark' 
            ? <DarkModeOutlined /> 
            : <LightModeOutlined color='secondary' />
          }
        </IconButton>
        <Button
          color='error'
        >
          logout
          <LogoutOutlined />
        </Button>
      </Box>
      
    </Box>
  )
}

export default Header