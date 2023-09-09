import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, ImageList, ImageListItem, Input, TextField, useMediaQuery, useTheme } from '@mui/material'
import React, { useState } from 'react'
import GridBox from '../components/GridBox'
import GridItem from '../components/GridItem'
import image from '../assets/images/5.jpg'
import { AddOutlined, DeleteOutlined } from '@mui/icons-material'
import { tokens } from '../assets/theme'
import { Formik } from 'formik'
import * as Yup from 'yup'
import AddButton from '../components/AddButton'
import { useNavigate, useParams } from 'react-router'
import { useMutation, useQuery } from '@tanstack/react-query'
import { request } from '../api/request'
import CubeLoader from '../components/CubeLoader/CubeLoader'


const getEventImagsFromServer = (id) => {
  return request({
    url : `/events/${id}`
  })
}


const addEventImageToserver = (values) => {
  return request({
    url : '/event-images',
    method : 'post',
    headers : {
      "Content-Type" : "multipart/form-data"
    },
    data : values
  })
}



const deleteEventImageFromServer = (id) => {
  return request({
    url : `/event-images/${id}`,
    method : 'delete'
  })
}

const Event = () => {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)
  const [isAddImageDialogOpen , setIsAddImageDialogOpen] = useState(false)
  const [isDeleteImageOpen , setIsDeleteImageOpen] = useState(false)
  const [clickedImage , setClickedImage] = useState()
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const {eventID} = useParams()
  const navigate = useNavigate()

  // dealing with APIs

  // get images for this event
  const eventImagesQuery = useQuery({
    queryKey : ['get-images-for-event-from-server'],
    queryFn : () => getEventImagsFromServer(eventID)
  })

  const addNewImageMutation = useMutation({
    mutationKey : ['add-event-image-to-server'],
    mutationFn : addEventImageToserver,
    onSuccess : () => {
      eventImagesQuery.refetch()
      AddImageDialogClose()
    }
  })


  const deleteImageMutation = useMutation({
    mutationKey : ['delete-event-image-from-server'],
    mutationFn : deleteEventImageFromServer,
    onSuccess : () => {
      eventImagesQuery.refetch()
      deleteImageDialogClose()
    }
  })

  const AddImageDialogOpen = () => {
    setIsAddImageDialogOpen(true)
  }
  const AddImageDialogClose = () => {
    setIsAddImageDialogOpen(false)
  }

  // here
  const handleFormSubmit = (values) => {
    const data = {
      event_id : eventID,
      images : [values.imageFile]
    }
    addNewImageMutation.mutate(data)
  }



  const deleteImageDialogOpen = (id) => {
    setClickedImage(id)
    setIsDeleteImageOpen(true)
  }
  const deleteImageDialogClose = () => {
    setIsDeleteImageOpen(false)
  }
  const deleteImageDialogConfirm = () => {
    deleteImageMutation.mutate(clickedImage)
  }


  if(eventImagesQuery.isLoading){
    return <CubeLoader />
  }

  if(eventImagesQuery.isError){
    if(eventImagesQuery.error.response){
      if(eventImagesQuery.error.response.status === 401){
        return navigate('/auth/signin')
      }
    }else if(eventImagesQuery.error.request){
      return "no response receved from server"
    }else{
      return "unknown error with message" + eventImagesQuery.error.message
    }
  }

  const eventInformation = eventImagesQuery.data.data.event

  console.log(eventInformation)

  return (
    <>
    <Box>
    <ImageList variant="masonry" cols={3} gap={8}>
      <ImageListItem>
      <Box
            sx={{
              height : '250px',
              borderRadius : '8px',
              display : 'flex',
              alignItems : 'center',
              justifyContent : 'center',
              boxShadow : `2px 2px 10px -5px ${colors.indigoAccent[400]}`,
              transition : '0.3s',
              cursor : 'pointer',
              "&:hover" : {
                backgroundColor : colors.primary[400],
              }
            }}
            onClick={AddImageDialogOpen}
          >
            <AddOutlined 
              sx={{
                fontSize : '80px',
              }}
            />
          </Box>
      </ImageListItem>
        {eventInformation.event_images.map((item) => (
          <ImageListItem 
            key={item.src}
            sx={{
              position : 'relative',
              borderRadius : '6px'
              
            }}
            
          >
            <IconButton
              sx={{
                position : 'absolute',
                backgroundColor : 'rgba(255 , 255 , 255 , 0.6)',
                transition : '0.3s',
                left : '0px',
                top : '0px',
                borderTopLeftRadius : '0',
                '&:hover' : {
                  backgroundColor : 'rgba(255 , 255 , 255 , 1)',
                  left : '5px',
                top : '5px',
                }
              }}
              onClick={() => deleteImageDialogOpen(item.id)}
              color='error'
            >
              <DeleteOutlined />
            </IconButton>
            <img
              src={`http://127.0.0.1:8000${item.src}?w=248&fit=crop&auto=format`}
              srcSet={`http://127.0.0.1:8000${item.src}?w=248&fit=crop&auto=format&dpr=2 2x`}
              alt={item.src}
              loading="lazy"
              style={{
                borderRadius : '6px'
              }}
            />
          </ImageListItem>
        ))}
      </ImageList>
      {/* <GridBox spacing={2}>
        <GridItem xs={12} sm={6} md={4} lg={2}>
          <Box
            sx={{
              height : '250px',
              borderRadius : '8px',
              display : 'flex',
              alignItems : 'center',
              justifyContent : 'center',
              boxShadow : `2px 2px 10px -5px ${colors.indigoAccent[400]}`,
              transition : '0.3s',
              cursor : 'pointer',
              "&:hover" : {
                backgroundColor : colors.primary[400],
              }
            }}
            onClick={AddImageDialogOpen}
          >
            <AddOutlined 
              sx={{
                fontSize : '80px',
              }}
            />
          </Box>
        </GridItem>
        {
          eventInformation.event_images.map(image => (
            <GridItem xs={12} sm={6} md={4} lg={2}>
              <a href={`http://127.0.0.1:8000${image.src}`} target='_blank'>
              <Box
                sx={{
                  backgroundImage : `url(http://127.0.0.1:8000${image.src})`,
                  backgroundRepeat : 'no-repeat',
                  backgroundSize : 'cover',
                  backgroundPosition : 'center',
                  height : '250px',
                  borderRadius : '8px',
                  position : 'relative',
                  overflow : 'hidden',
                  "&:hover .delete-event-image-box" : {
                    bottom : '10px'
                  }
                }}
              >
                <Box
                  sx={{
                    height : '20px',
                    width : '100%',
                    display : 'flex',
                    alignItems : 'center',
                    justifyContent : 'center',
                    bottom : '-100%',
                    transition : '0.2s',
                    position : 'absolute',
                    zIndex : 1,
                  }}
                  className={'delete-event-image-box'}
                >
                  <IconButton
                    color='error'
                    onClick={deleteImageDialogOpen}
                  >
                  <DeleteOutlined 
                    // color='error'
                  />
                  </IconButton>
                </Box>
              </Box>
              </a>
            </GridItem>
          ))
        }
      </GridBox> */}
    </Box>
    <Dialog
        open={isAddImageDialogOpen}
        maxWidth={'xs'}
    >
        <DialogTitle
                sx={{
                    color : colors.yellowAccent[500] ,
                    textAlign : 'center',
                    textTransform : 'capitalize'
                }}
            >add image to event</DialogTitle>
        <DialogContent>
          <DialogContentText
            sx={{
                textAlign : 'center',
                marginBottom : '10px'
            }}
          >
            after you click on create button , new image will publish for all users and this image cant be update later so take care while chooseing, and dont worry you can delete image if you make a mistake
          </DialogContentText>
          <Formik
        onSubmit={handleFormSubmit}
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
                  "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                }}
              >
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
          <Button onClick={AddImageDialogClose} color="error">
            Cancel
          </Button>
          
        </DialogActions>
    </Dialog>

    <Dialog
        open={isDeleteImageOpen}
        maxWidth={'xs'}
    >
        <DialogTitle
                sx={{
                    color : colors.yellowAccent[500] ,
                    textAlign : 'center',
                    textTransform : 'capitalize'
                }}
            >add image to event</DialogTitle>
        <DialogContent>
          <DialogContentText
            sx={{
                textAlign : 'center',
                marginBottom : '10px'
            }}
          >
            are you sure that you want to delete this image , this action cant be undone
          </DialogContentText>
          </DialogContent>
        <DialogActions>
          <Button onClick={deleteImageDialogConfirm} color="success">
            confirm
          </Button>
          <Button onClick={deleteImageDialogClose} color="error">
            cancle 
          </Button>
          
        </DialogActions>
    </Dialog>
    </>
  )
}

const validationSchema = Yup.object({
  image :  Yup.string().required('image field is required'),
})

const initialValues = {
  image : '',
  imageFile : ''
}

export default Event