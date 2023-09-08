import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Snackbar, Typography, useTheme } from '@mui/material'
import React , { useState } from 'react'
import Image from '../assets/images/avatar-04.png'

import { tokens } from '../assets/theme'
import { DeleteOutlined, LinkOutlined } from '@mui/icons-material'
import { Link } from 'react-router-dom'
import { request } from '../api/request'
import { useMutation } from '@tanstack/react-query'
import CubeLoader from '../components/CubeLoader/CubeLoader'


const deleteEventFromServer = (id) => {
    return request({
        url : `/events/${id}`,
        method : 'delete'
    })
}

const EventCard = ({eventData , refetch}) => {
    const theme = useTheme()
    const colors = tokens(theme.palette.mode)
    const [deleteDialogOpen , setDeleteDialogOpen] = useState(false)
    const [open , setOpen] = useState(false)
    const [error , setError] = useState("")
    const randomNumberBetween0Adn7 = Math.floor(Math.random() * 7)
    const randomNumberBetween100And700 = (randomNumberBetween0Adn7 !== 0 ? randomNumberBetween0Adn7 : 1) * 100
    const randomColor = colors.mix[randomNumberBetween100And700]


    const deleteEventDialogOpen = () => {
        setDeleteDialogOpen(true)
    }

    const deleteEventDialogClose = () => {
        setDeleteDialogOpen(false)
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpen(false);
      };

    const deleteEventMutate = useMutation({
        mutationKey : ['delete-event-from-server'],
        mutationFn : deleteEventFromServer,
        onSuccess : (data) => {
            refetch()
        },
        onError : (error) => {
            if(!error.response || error.message === 'Network Error'){
                setError("obbs , you have internet connection problems")
                setOpen(true)
                return
            }
            switch(error.response.status){
                case 404 : {
                    setError("obbs , you're out of space , the destenation not found in our system")
                    setOpen(true)
                    break ;
                }
                case 401 : {
                    setError("you're not authorize to delete this event")
                    setOpen(true)
                    break ;
                }

                case 500 : {
                    setError("obbs , there are some problems in our server , we will fix it soon , come backe later")
                    setOpen(true)
                    break
                }
                default : {
                    setError(`obbs ,unknown error happend with status code ${error.status}`)
                    setOpen(true)
                    break
                }
            }  
        }
        
    })

    const deleteDialogConfirm = () => {
        deleteEventMutate.mutate(eventData?.id)
        setDeleteDialogOpen(false)
    }


    if(deleteEventMutate.isLoading){
        return <CubeLoader />
    }



  return (
    <>
        <Box
            sx={{
                position: 'relative',
                '&::before' : {
                width : 'calc(100% - 60px)',
                zIndex : '-2'
                },
                "&::after":{
                zIndex : '-1',
                backgroundColor : `${colors.primary[500]} !important`,
                width : '0'
                },
                '&::after , &::before' : {
                content : '""',
                position : 'absolute',
                right : '0',
                top : '0',
                height : '100%',
                borderRadius : '10px',
                transition : '0.3s',
                boxShadow : `0px 0px 10px -4px ${randomColor}`
                //   backgroundImage : `linear-gradient(90deg , ${colors.greenBlueAccent[500]} , ${colors.tealAccent[500]})`,
                },
                "&:hover::after" : {
                width : 'calc(100% - 60px)'
                },
                "&:hover img" : {
                filter : 'grayscale(100%)'
                }
            }}
            className={'team-memmber-box'}
        >
            <Box
                className={'team-memmber-data'}
                sx={{
                display : 'flex',
                alignItems : 'center',
                paddingTop : '60px',
                paddingBottom : '30px'
                }}  
            >
                <img 
                style={{
                    maxWidth : 'calc(100% - 60px)',
                    transition : '0.3s',
                    borderRadius : '10px',
                    maxHeight : '200px'
                }}
                alt='event-cover-background'
                src={`http://127.0.0.1:8000${eventData?.image_cover}`}
                />
                <Box
                    sx={{
                        width : '60px',
                        display : 'flex',
                        flexDirection : 'column',
                        alignItems : 'center',
                        gap : '20px'
                    }}
                >
                    <Box
                        sx={{
                        width : '60px',
                        display : 'flex',
                        alignItems : 'center',
                        justifyContent : 'center',

                        }}
                    >
                        <IconButton
                            LinkComponent={Link}
                            to={`/events/${eventData?.id}`}
                        >
                        <LinkOutlined 
                            sx={{
                                color : colors.yellowAccent[500],
                                transition : '0.3s',
                                "&:hover" : {
                                    color : colors.yellowAccent[600]
                                }
                            }}
                        />
                        </IconButton>
                    </Box>
                    <Box
                        sx={{
                        width : '60px',
                        display : 'flex',
                        alignItems : 'center',
                        justifyContent : 'center',

                        }}
                    >
                        <IconButton
                            onClick={deleteEventDialogOpen}
                        >
                        <DeleteOutlined 
                            sx={{
                            color : colors.yellowAccent[500],
                            transition : '0.3s',
                            "&:hover" : {
                                color : colors.yellowAccent[600]
                            }
                            }}
                        />
                        </IconButton>
                    </Box>
                </Box>
            </Box>
            <Box
                className = {'team-memmber-info'}
                sx={{
                paddingLeft : '80px',
                paddingTop : '20px',
                paddingBottom : '20px'
                }}
            >
                <Typography
                    sx={{
                        fontSize : '22px',
                        color : randomColor,
                        textTransform : 'capitalize',
                        marginBottom : '5px',
                        transition : '0.3s'
                    }}
                >
                    {eventData?.name}
                </Typography>
            </Box>
        </Box>
        
        <Dialog
            open={deleteDialogOpen}
            maxWidth={'xs'}
        >
        <DialogTitle
            sx={{
                color : colors.yellowAccent[500] ,
                textAlign : 'center',
                textTransform : 'capitalize'
            }}
        >
            delete event alter
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            sx={{
                textAlign : 'center',
                marginBottom : '10px'
            }}
          >
            are you sure you want to delete this event , this action can't be undone
          </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={deleteDialogConfirm} color="success">
                confirm
            </Button>
            <Button onClick={deleteEventDialogClose} color="error">
                Cancel
            </Button>
        </DialogActions>
        </Dialog>

        <Snackbar open={open} autoHideDuration={4000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                {error}
            </Alert>
        </Snackbar>

    </>
  )
}

export default EventCard