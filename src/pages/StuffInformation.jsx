import { Box, List, ListItem, ListItemIcon, ListItemText, Typography, useTheme, useThemeProps } from '@mui/material'
import React from 'react'
import { tokens } from '../assets/theme'
import { CallOutlined, ClassOutlined, PermIdentityOutlined, WorkOutlined } from '@mui/icons-material'
import { useQuery } from '@tanstack/react-query'
import { request } from '../api/request'
import { useParams } from 'react-router'
import CubeLoader from '../components/CubeLoader/CubeLoader'
import GridBox from '../components/GridBox'
import GridItem from '../components/GridItem'
import ChildCard from '../layouts/ChildCard'


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
        queryKey : [`get-stuff-${stuffID}-from-server`],
        queryFn : () => getStuffFromServer(stuffID),
    })


    if(getStuffQuery.isLoading) {
        return <CubeLoader />
    }

    if(getStuffQuery.isError){
        return 'error'
    }

    const stuffInformation = getStuffQuery.data.data.account
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
                        {stuffInformation.first_name} {stuffInformation.last_name}
                    </ListItemText>
                </ListItem>

                <ListItem>
                    <ListItemIcon>
                        <CallOutlined />
                    </ListItemIcon>
                    <ListItemText>
                        {stuffInformation.phone}
                    </ListItemText>
                </ListItem>

                <ListItem>
                    <ListItemIcon>
                        <WorkOutlined />
                    </ListItemIcon>
                    <ListItemText>
                        {stuffInformation.role}
                    </ListItemText>
                </ListItem>
                {
                    stuffInformation.role === 'teacher'
                    && (
                        <ListItem>
                            <ListItemIcon>
                                <ClassOutlined />
                            </ListItemIcon>
                            <ListItemText>
                                {stuffInformation.classRoom.name}
                            </ListItemText>
                        </ListItem>
                    )
                }
            </List>
        </Box>
        {
            stuffInformation.role === 'teacher'
            ? (
                <Box
                    sx={{
                        marginTop : '20px',
                    }}
                >
                    <GridBox spacing={2}>
                        {
                            stuffInformation.classRoom.children.map(child => (
                                <GridItem
                                    xs={12}
                                    sm={6}
                                    md={4}
                                    lg={3}
                                >
                                    <ChildCard child={child} childClassName={stuffInformation.classRoom.name} />
                                </GridItem>
                            ))
                        }
                    </GridBox>
                </Box>
            )
            : undefined
        }
    </>
  )
}

export default StuffInformation