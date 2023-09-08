import { Box, List, ListItem, ListItemIcon, ListItemText, Typography, useTheme, useThemeProps } from '@mui/material'
import React from 'react'
import { tokens } from '../assets/theme'
import { CallOutlined, PermIdentityOutlined, WorkOutlined } from '@mui/icons-material'
import { useQuery } from '@tanstack/react-query'
import { request } from '../api/request'
import { useParams } from 'react-router'
import CubeLoader from '../components/CubeLoader/CubeLoader'


const getStuffFromServer = (id) => {
    return request({
        url : `/accounts/${id}`
    })
}

const StuffInformation = () => {
    const theme = useTheme()
    const colors = tokens(theme.palette.mode)
    const {stuffID} = useParams()
    const getStuffQuery = useQuery({
        queryKey : ['get-studd-from-server'],
        queryFn : () => getStuffFromServer(stuffID)
    })


    if(getStuffQuery.isLoading) {
        return <CubeLoader />
    }

    if(getStuffQuery.isError){
        return 'error'
    }

    console.log(getStuffQuery.data.data)
  return (
    <>
        <Box>
            <Typography
                sx={{
                    textTransform : 'capitalize',
                    color : colors.greenBlueAccent[500]
                }}
                variant='h3'
            >
                identity informations
            </Typography>

            <List>
                <ListItem>
                    <ListItemIcon>
                        <PermIdentityOutlined />
                    </ListItemIcon>
                    <ListItemText>
                        stuff full name
                    </ListItemText>
                </ListItem>

                <ListItem>
                    <ListItemIcon>
                        <CallOutlined />
                    </ListItemIcon>
                    <ListItemText>
                        phone number
                    </ListItemText>
                </ListItem>

                <ListItem>
                    <ListItemIcon>
                        <WorkOutlined />
                    </ListItemIcon>
                    <ListItemText>
                        position 
                    </ListItemText>
                </ListItem>
            </List>
        </Box>
    </>
  )
}

export default StuffInformation