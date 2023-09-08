import { Box, Button, List, ListItem, ListItemIcon, ListItemText, Typography, useTheme } from '@mui/material'
import React from 'react'
import GridBox from '../components/GridBox'
import GridItem from '../components/GridItem'
import { tokens } from '../assets/theme'
import { NoteOutlined } from '@mui/icons-material'

const ReadableCards = () => {
    const theme = useTheme()
    const colors = tokens(theme.palette.mode)
  return (
    <Box
        sx={{
            margin : '30px 0',
        }}
    >
        <GridBox spacing={4}>
            <GridItem xs={12}  md={7}>
                <Box
                    sx={{
                        padding : '20px 5px',
                        borderRadius : '8px',
                        backgroundImage : `linear-gradient(90deg , ${colors.primary[500]} , ${colors.primary[400]})`,
                    }}
                >
                    <Typography
                        variant='h4'
                        sx={{
                            textTransform : 'capitalize'
                        }}
                    >
                        public information about system
                    </Typography>
                    <Typography
                        sx={{
                            lineHeight : '1.5',
                            color : colors.grey[200],
                            margin : '10px 0'
                        }}

                        variant='h5'
                    >
                        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ducimus fugit
                        laudantium ullam unde perferendis doloremque, maiores laborum totam,
                        voluptatum reprehenderit quos commodi error, fugiat facere velit eaque
                        beatae? Nemo, culpa.
                    </Typography>
                    <Typography
                        sx={{
                            color : colors.yellowAccent[500],
                            margin : '10px 0',
                            textTransform : 'capitalize ',
                            position : 'relative',
                            width : 'fit-content',
                            "&::before" :{
                                content : '""',
                                position : 'absolute',
                                width : '30%',
                                height : '1px',
                                backgroundColor : colors.yellowAccent[500],
                                left : '0',
                                bottom : '-4px'
                            }
                        }}
                        variant='h5'
                    >
                        important infromation for admin
                    </Typography>
                    <List>
                        <ListItem
                            
                        >
                            <ListItemIcon>
                                <NoteOutlined/>
                            </ListItemIcon>
                            <ListItemText
                                sx={{
                                    textTransform : 'capitalize'
                                }}
                            >
                            dont give you creadintials for anybody else
                            </ListItemText>
                        </ListItem>
                        <ListItem
                            
                        >
                            <ListItemIcon>
                                <NoteOutlined/>
                            </ListItemIcon>
                            <ListItemText
                            sx={{
                                textTransform : 'capitalize'
                            }}
                            >
                            when you perform any action you will not be able to go back , so take care while working in dashboard
                            </ListItemText>
                        </ListItem>
                        <ListItem
                            
                        >
                            <ListItemIcon>
                                <NoteOutlined/>
                            </ListItemIcon>
                            <ListItemText
                            sx={{
                                textTransform : 'capitalize'
                            }}
                            >
                                spent some time to read any popup will face you , we put it to tell you about somthing important
                            </ListItemText>
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                                <NoteOutlined/>
                            </ListItemIcon>
                            <ListItemText
                            sx={{
                                textTransform : 'capitalize'
                            }}
                            >
                            any button in dsahboard perform an action , if there are an buttom you dont know what it's fancunality dont click it randomly , please ask technical support to keep your data seaf
                            </ListItemText>
                        </ListItem>
                    </List>
                    
                </Box>
            </GridItem>
            <GridItem xs={12} md={5}>
                <Box
                    sx={{
                        backgroundColor : colors.yellowAccent[500],
                        borderRadius : '12px',
                        justifyContent : 'center',
                        padding : '15px',
                        height : '100%'
                    }}
                >
                    <Box
                        sx={{
                            backgroundColor : colors.primary[500],
                            borderRadius : '12px',
                            display : 'flex',
                            alignItems : 'center',
                            justifyContent : 'center',
                            flexDirection : 'column',
                            height : '100%',
                            padding : '5px'
                        }}
                    >
                        <Typography
                            sx={{
                                textAlign : 'center',
                                lineHeight : '1.5',
                                color : colors.grey[200],
                                marginBottom : '10px'
                            }}
                            variant='h5'
                        >
                            if you are'nt visit settings page yet , what you wait , visit it right now there are a lot of cute things watting for you
                        </Typography>
                        <Button color='secondary'>move on</Button>
                    </Box>
                </Box>
            </GridItem>
        </GridBox>
    </Box>
  )
}

export default ReadableCards