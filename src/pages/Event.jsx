import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Input, TextField, useMediaQuery, useTheme } from '@mui/material'
import React, { useState } from 'react'
import GridBox from '../components/GridBox'
import GridItem from '../components/GridItem'
import image from '../assets/images/5.jpg'
import { AddOutlined, DeleteOutlined } from '@mui/icons-material'
import { tokens } from '../assets/theme'
import { Formik } from 'formik'
import * as Yup from 'yup'
import AddButton from '../components/AddButton'

const Event = () => {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)
  const [isAddImageDialogOpen , setIsAddImageDialogOpen] = useState(false)
  const [isDeleteImageOpen , setIsDeleteImageOpen] = useState(false)
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const AddImageDialogOpen = () => {
    setIsAddImageDialogOpen(true)
  }
  const AddImageDialogClose = () => {
    setIsAddImageDialogOpen(false)
  }
  const handleFormSubmit = (values) => {
    console.log(values)
  }


  const deleteImageDialogOpen = () => {
    setIsDeleteImageOpen(true)
  }
  const deleteImageDialogClose = () => {
    setIsDeleteImageOpen(false)
  }
  const deleteImageDialogConfirm = () => {
    console.log('delete image ')
  }

  return (
    <>
    <Box>
      <GridBox spacing={2}>
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
        <GridItem xs={12} sm={6} md={4} lg={2}>
          <Box
            sx={{
              backgroundImage : `url(${image})`,
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
        </GridItem>
        <GridItem xs={12} sm={6} md={4} lg={2}>
          <Box
            sx={{
              backgroundImage : `url(${image})`,
              backgroundRepeat : 'no-repeat',
              backgroundSize : 'cover',
              backgroundPosition : 'center',
              height : '250px',
              borderRadius : '8px'
            }}
          >
          </Box>
        </GridItem>
        <GridItem xs={12} sm={6} md={4} lg={2}>
          <Box
            sx={{
              backgroundImage : `url(${image})`,
              backgroundRepeat : 'no-repeat',
              backgroundSize : 'cover',
              backgroundPosition : 'center',
              height : '250px',
              borderRadius : '8px'
            }}
          >
          </Box>
        </GridItem>
        <GridItem xs={12} sm={6} md={4} lg={2}>
          <Box
            sx={{
              backgroundImage : `url(${image})`,
              backgroundRepeat : 'no-repeat',
              backgroundSize : 'cover',
              backgroundPosition : 'center',
              height : '250px',
              borderRadius : '8px'
            }}
          >
          </Box>
        </GridItem>
        <GridItem xs={12} sm={6} md={4} lg={2}>
          <Box
            sx={{
              backgroundImage : `url(${image})`,
              backgroundRepeat : 'no-repeat',
              backgroundSize : 'cover',
              backgroundPosition : 'center',
              height : '250px',
              borderRadius : '8px'
            }}
          >
          </Box>
        </GridItem>
        <GridItem xs={12} sm={6} md={4} lg={2}>
          <Box
            sx={{
              backgroundImage : `url(${image})`,
              backgroundRepeat : 'no-repeat',
              backgroundSize : 'cover',
              backgroundPosition : 'center',
              height : '250px',
              borderRadius : '8px'
            }}
          >
          </Box>
        </GridItem>
        <GridItem xs={12} sm={6} md={4} lg={2}>
          <Box
            sx={{
              backgroundImage : `url(${image})`,
              backgroundRepeat : 'no-repeat',
              backgroundSize : 'cover',
              backgroundPosition : 'center',
              height : '250px',
              borderRadius : '8px'
            }}
          >
          </Box>
        </GridItem>
        <GridItem xs={12} sm={6} md={4} lg={2}>
          <a href={image} target='_blank'>
            <Box
              sx={{
                backgroundImage : `url(${image})`,
                backgroundRepeat : 'no-repeat',
                backgroundSize : 'cover',
                backgroundPosition : 'center',
                height : '250px',
                borderRadius : '8px'
              }}
            >
            </Box>
          </a>
        </GridItem>
        <GridItem xs={12} sm={6} md={4} lg={2}>
          <Box
            sx={{
              backgroundImage : `url(${image})`,
              backgroundRepeat : 'no-repeat',
              backgroundSize : 'cover',
              backgroundPosition : 'center',
              height : '250px',
              borderRadius : '8px'
            }}
          >
          </Box>
        </GridItem>
        <GridItem xs={12} sm={6} md={4} lg={2}>
          <Box
            sx={{
              backgroundImage : `url(${image})`,
              backgroundRepeat : 'no-repeat',
              backgroundSize : 'cover',
              backgroundPosition : 'center',
              height : '250px',
              borderRadius : '8px'
            }}
          >
          </Box>
        </GridItem>
        <GridItem xs={12} sm={6} md={4} lg={2}>
          <Box
            sx={{
              backgroundImage : `url(${image})`,
              backgroundRepeat : 'no-repeat',
              backgroundSize : 'cover',
              backgroundPosition : 'center',
              height : '250px',
              borderRadius : '8px'
            }}
          >
          </Box>
        </GridItem>
        <GridItem xs={12} sm={6} md={4} lg={2}>
          <Box
            sx={{
              backgroundImage : `url(${image})`,
              backgroundRepeat : 'no-repeat',
              backgroundSize : 'cover',
              backgroundPosition : 'center',
              height : '250px',
              borderRadius : '8px'
            }}
          >
          </Box>
        </GridItem>
        <GridItem xs={12} sm={6} md={4} lg={2}>
          <Box
            sx={{
              backgroundImage : `url(${image})`,
              backgroundRepeat : 'no-repeat',
              backgroundSize : 'cover',
              backgroundPosition : 'center',
              height : '250px',
              borderRadius : '8px'
            }}
          >
          </Box>
        </GridItem>

      </GridBox>
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
                <Input 
                  type='file'
                  fullWidth 
                  sx={{ gridColumn: "span 4" }}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.image}
                  name="image"
                  error={!!touched.image && !!errors.image}
                  label="Image"
                  variant="filled"
                />
                {/* <TextField
                    fullWidth
                    variant="filled"
                    type="file"
                    label="Image"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.image}
                    name="image"
                    error={!!touched.image && !!errors.image}
                    helperText={touched.image && errors.image}
                    sx={{ gridColumn: "span 4" }}
                /> */}
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
}

export default Event