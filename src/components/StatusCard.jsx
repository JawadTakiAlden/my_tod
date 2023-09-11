import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, TextField, Typography, useTheme } from '@mui/material'
import React , { useState } from 'react'
import Image from '../assets/images/20.png'

import { tokens } from '../assets/theme'
import { DeleteOutlined, LinkOutlined, UpdateOutlined } from '@mui/icons-material'
import { Link } from 'react-router-dom'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { useMutation } from '@tanstack/react-query'
import { baseURLImage, request } from '../api/request'

const delteSubStatusFromServer = (id) => {
    return request({
        url : `/substatus/${id}`,
        method : 'delete'
    })
}

const StatusCard = ({type , subStatus}) => {
    const theme = useTheme()
    const colors = tokens(theme.palette.mode)
    const [deleteDialogOpen , setDeleteDialogOpen] = useState(false)
    const [updateDialogOpen , setUpdateDialogOpen] = useState(false)
    const randomNumberBetween0Adn7 = Math.floor(Math.random() * 7)
    const randomNumberBetween100And700 = (randomNumberBetween0Adn7 !== 0 ? randomNumberBetween0Adn7 : 1) * 100
    const randomColor = colors.mix[randomNumberBetween100And700]


    const deleteEventDialogOpen = () => {
        setDeleteDialogOpen(true)
    }

    const deleteEventDialogClose = () => {
        setDeleteDialogOpen(false)
        console.log('Event Card Page : delete event rejected by click on cancle button')
    }


    const deletesubStatus = useMutation({
        mutationKey : [`delete-substatus-${subStatus.id}-from-server`],
        mutationFn : () => delteSubStatusFromServer(subStatus.id)
    })

    const deleteDialogConfirm = () => {
        deletesubStatus.mutate(subStatus.id)
        setDeleteDialogOpen(false)
    }

    const updateSubStatusInServer = (values) => {
        return request({
            url : `/substatus/${subStatus.id}`,
            method : 'put',
            data : {
                ...values
            }
        })
    }

    const updateSubStatusMutation = useMutation({
        mutationKey : [`update-substatus-${subStatus.id}-in-server`],
        mutationFn : updateSubStatusInServer
    })
    const updateEventHandler = (values) => {
        let data = {
            name : values.name,
        }

        if(values.image){
            data['image'] = values.imageFile
        }
        // console.log(data)
        updateSubStatusMutation.mutate(data)
    }
    const updateEventDialogOpen = () => {
        setUpdateDialogOpen(true)
    }
    const updateEventDialogClose = () => {
        setUpdateDialogOpen(false)
        console.log('update event action canceld by click on cancel button')
    }
    const initialValues = {
        name : subStatus.name,
        image : '',
        imageFile : ''
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
                    width : 'calc(100% - 60px)',
                    transition : '0.3s',
                    borderRadius : '10px'
                }}
                alt='event-cover-background'
                src={`${baseURLImage}${subStatus.image}`}
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
                    {
                        type === 'status' && (

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
                                    LinkComponent={Link}
                                    to={'/status/1'}
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
                        )
                    }
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
                            color : colors.redAccent[500],
                            transition : '0.3s',
                            "&:hover" : {
                                color : colors.redAccent[600]
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
                            onClick={updateEventDialogOpen}
                        >
                        <UpdateOutlined 
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
                    {subStatus.name}
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

        <Dialog
            open={updateDialogOpen}
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
          <Formik
        onSubmit={updateEventHandler}
        initialValues={initialValues}
        validationSchema={validationSchema}
      >
        {
          (
            {
              values,
              errors,
              touched,
              handleBlur,
              handleChange,
              handleSubmit,
              setFieldValue
            }
          ) => (
            <form onSubmit={handleSubmit}>
              <Box
                display="grid"
                gap="30px"
                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                sx={{
                  "& > div": { gridColumn: "span 4" },
                }}
              >
                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="Name"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.name}
                                    name="name"
                                    error={!!touched.name && !!errors.name}
                                    helperText={touched.name && errors.name}
                                    sx={{ gridColumn: "span 4" }}
                                />
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="file"
                                    label="Image"
                                    onBlur={handleBlur}
                                    onChange={(e) => {
                                        setFieldValue('imageFile' , e.currentTarget.files[0])
                                        handleChange(e)
                                    }}
                                    value={values.image}
                                    name="image"
                                    error={!!touched.image && !!errors.image}
                                    helperText={touched.image && errors.image}
                                    sx={{ gridColumn: "span 4" }}
                                />
              </Box>
              <Box display="flex" justifyContent="end" mt="20px">
                <Button type="submit" color="success" variant="contained">
                  add
                </Button>
              </Box>
            </form>
          )
        }
      </Formik>
        </DialogContent>
        <DialogActions>
            <Button onClick={updateEventDialogClose} color="error">
                Cancel
            </Button>
        </DialogActions>
        </Dialog>
    </>
  )
}

const validationSchema = Yup.object({
    name :  Yup.string().required('name field is required'),
  })
  


export default StatusCard