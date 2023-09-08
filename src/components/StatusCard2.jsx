import { CheckOutlined, DeleteOutlined, EditOutlined, LinkOutlined, SaveOutlined } from '@mui/icons-material'
import { Alert, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Fab, IconButton, MenuItem, Select, Snackbar, useTheme } from '@mui/material'
import { useMutation, useQuery } from '@tanstack/react-query'
import React, { useState } from 'react'
import { request } from '../api/request'
import { tokens } from '../assets/theme'
import CubeLoader from './CubeLoader/CubeLoader'
import { Link, useNavigate } from 'react-router-dom'

const StatusCard2 = ({data , ageSections}) => {
    const theme = useTheme()
    const colors = tokens(theme.palette.mode)
    const [isEditMode , setIsEditMode] = useState(false)
    const [value , setValue] = useState({
        name : data.name,
        ageSection_id : data.ageSection_id
    })
    const [deleteDialogOpen , setDeleteDialogOpen] = useState(false)
    const [open , setOpen] = useState(false)
    const [error , setError] = useState("")
    const navigate = useNavigate()


    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpen(false);
      };

    const deleteEventHandling = () => {
        console.log('Event Card Page : request for delete this event')
    }

    const deleteEventDialogOpen = () => {
        setDeleteDialogOpen(true)
    }

    const deleteEventDialogClose = () => {
        setDeleteDialogOpen(false)
        console.log('Event Card Page : delete event rejected by click on cancle button')
    }

    

    const UpdateStatusInServer = (values) => {
        return request({
            url : `/status/${data.id}`,
            method : 'PATCH',
            data : values
        })
    }

    const deleteFromServer = () => {
        return request({
            url : `/status/${data.id}`,
            method : 'DELETE',
        })
    }

    const deleteFromServerMutation = useMutation({
        mutationKey : ['delete-status-from-server'],
        mutationFn : deleteFromServer,
        onSuccess : (data) => {
            console.log(data)
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
        deleteFromServerMutation.mutate()
        setDeleteDialogOpen(false)
    }

    const {mutate , isLoading , isSuccess} = useMutation({
        mutationKey : ['update-status-in-server'],
        mutationFn : UpdateStatusInServer,
        onSuccess : (data) => {
            console.log(data)
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
                case 422 : {
                    setError("procces falid with status code 422 , this mean you enter wrong data m maybe empty string")
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

    const saveHandler = () => {
        mutate({name : value.name , ageSection_id : value.ageSection_id})
        setIsEditMode(false)
    }


    if(deleteFromServerMutation.isLoading){
        return <CubeLoader />
    }

  return (
      <>
      <Box
      sx={{
            display : 'flex',
            alignItems : 'center',
            justifyContent : 'space-evenly',
            boxShadow : '1px 1px 10px -4px green',
            padding : '20px',
            gap : '5px',
            borderRadius : '50px 0px 50px 0',
            transition : '0.3s',
        }}
    >
        <Box
            sx={{
                display : 'flex',
            alignItems : 'center',
            justifyContent : 'center',
            flexDirection : 'column',
            gap : '8px'
            }}
        >
            <input 
                value={value.name}
                disabled={!isEditMode}
                style={{
                    backgroundColor : 'transparent',
                    color : colors.grey[100],
                    outline : 'none',
                    border : isEditMode ? `1px solid ${colors.grey[200]}` : `none`,
                    borderRadius : '6px',
                    textAlign : 'center',
                    padding : '8px 10px',
                    width : '100%'
                }}
                onChange={(e) => setValue({...value , name :e.target.value})}
            />

            <Select
                value={value.ageSection_id}
                onChange={(e) => setValue({...value , ageSection_id :e.target.value})}
                autoWidth
                label="Age Section"
                name={'ageSection_id'}
                disabled={!isEditMode}
            >
                {
                    ageSections.map(ageSection => (
                        <MenuItem key={ageSection.id} value={ageSection.id}>From {ageSection.from} To {ageSection.to} Year</MenuItem>
                    ))
                }
            </Select>
        </Box>

        <Box
            sx={{
                flexBasis : '60px',
                display : 'flex',
                flexDirection : 'column',
                position : 'relative',
                gap : '5px'
            }}
        >
            <Fab
                sx={{
                    backgroundColor : 'transparent',
                    borderTopLeftRadius : '0',
                    borderBottomLeftRadius : '0',
                    "&:hover" : {
                        backgroundColor : 'transparent',
                    }
                }}
                disabled={isLoading || isEditMode}
                component={Link}
                to={`/status/${data?.id}`}
            >
                <LinkOutlined color='info' />
            </Fab>
            {
                isEditMode
                ? (
                    <Fab
                        sx={{
                            backgroundColor : 'transparent',
                            "&:hover" : {
                                backgroundColor : 'transparent',
                            }
                        }}
                        onClick={saveHandler}
                    >
                        <SaveOutlined color='success'/>
                    </Fab>
                )
                : undefined
            }
            {
                !isEditMode
                ? (
                    <Fab
                        sx={{
                            backgroundColor : 'transparent',
                            "&:hover" : {
                                backgroundColor : 'transparent',
                            }
                        }}
                        onClick={() => setIsEditMode(true)}
                    >
                        <EditOutlined color='warning'/>
                    </Fab>
                )
                : undefined
            }
            {
                isLoading
                ? (
                    <CircularProgress
                        size={58}
                        sx={{
                            color : 'green',
                            position : 'absolute',
                            top : '60px',
                            left : '-1px',
                            zIndex : '1'
                        }}
                    />
                )
                : undefined
            }
            <Fab
                sx={{
                    backgroundColor : 'transparent',
                    borderTopLeftRadius : '0',
                    borderBottomLeftRadius : '0',
                    "&:hover" : {
                        backgroundColor : 'transparent',
                    }
                }}
                disabled={isLoading || isEditMode}
                onClick={deleteEventDialogOpen}
            >
                <DeleteOutlined color='error'/>
            </Fab>
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
            delete status alter
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            sx={{
                textAlign : 'center',
                marginBottom : '10px'
            }}
          >
            are you sure you want to delete this status , all sub status realted to it wil be deleted , this action can't be undone
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

export default StatusCard2