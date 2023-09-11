import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, ImageList, ImageListItem, Snackbar, TextField, Typography, useTheme } from '@mui/material';
import React , {useState} from 'react';
import { baseURLImage, request } from '../api/request';
import { useMutation, useQuery } from '@tanstack/react-query';
import CubeLoader from '../components/CubeLoader/CubeLoader';
import { useNavigate } from 'react-router';
import AddButton from '../components/AddButton';
import { tokens } from '../assets/theme';
import * as Yup from 'yup'
import { Formik } from 'formik';
import { DeleteOutlined } from '@mui/icons-material';

const addImageToServer = (file) => {
    return request({
        url : '/post',
        method : 'POST',
        headers : {
          "Content-Type": "multipart/form-data"
        },
        data : file
    })
}

const getPublicImagesFromServer = () => {
    return request({
        url : '/post',
    })
}

const deleteImageFromServer = (id) => {
  return request({
    url : `/post/${id}`,
    method : 'delete'
  })
}

const PublicImages = () => {
    const navigate = useNavigate()
    const theme = useTheme()
    const colors = tokens(theme.palette.mode)
    const [open, setOpen] = useState(false);
    const [openSnackbar , setOpenSnackbar] = useState(false)
    const [error , setError] = useState("")
    const [deleteDialogOpen , setDeleteDialogOpen] = useState(false)
    const [clickedImage , setClickedImage] = useState()

    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };

    const handelAlterClose = () => {
      setOpenSnackbar(false)
    }

    const deleteImageDialogClose = () => {
      setDeleteDialogOpen(false)
  }

  const deleteImageDialogOpen = (id) => {
    setClickedImage(id)
    setDeleteDialogOpen(true)
  }
  const deleteDialogConfirm = () => {
    deleteImageMutation.mutate(clickedImage)
    deleteImageDialogClose()
  }

    const getPublicImagesFromServerQuery = useQuery({
        queryKey : ['get-public-images-from-server'],
        queryFn : getPublicImagesFromServer
    })

    const deleteImageMutation = useMutation({
      mutationKey : ['delete-image-from-server'],
      mutationFn : deleteImageFromServer,
      onSuccess : (data) => {
        getPublicImagesFromServerQuery.refetch()
      },
        onError : (error) => {
          if(!error?.response && error?.message === 'Network Error'){
              setError("obbs , you have internet connection problems")
              setOpenSnackbar(true)
              return
          }
          switch(error.response.status){
              case 404 : {
                  setError("obbs , you're out of space , the destenation not found in our system")
                  setOpenSnackbar(true)
                  break ;
              }
              case 401 : {
                  setError(`you're not authorize to create new question and answer in our system`)
                  setOpenSnackbar(true)
                  break ;
              }
  
              case 500 : {
                  setError("obbs , there are some problems in our server , we will fix it soon , come backe later")
                  setOpenSnackbar(true)
                  break
              }
              default : {
                  setError(`obbs ,unknown error happend with status code ${error.status}`)
                  setOpenSnackbar(true)
                  break
              }
          }  
      }
    })

    const addImageMutation = useMutation({
        mutationKey : ['add-public-image-to-server'],
        mutationFn : addImageToServer,
        onSuccess : (data) => {
          getPublicImagesFromServerQuery.refetch()
          },
          onError : (error) => {
            if(!error?.response && error?.message === 'Network Error'){
                setError("obbs , you have internet connection problems")
                setOpenSnackbar(true)
                return
            }
            switch(error.response.status){
                case 404 : {
                    setError("obbs , you're out of space , the destenation not found in our system")
                    setOpenSnackbar(true)
                    break ;
                }
                case 401 : {
                    setError(`you're not authorize to create new question and answer in our system`)
                    setOpenSnackbar(true)
                    break ;
                }
    
                case 401 : {
                  setError(`check your entered data , there some mistake with it`)
                  setOpenSnackbar(true)
                  break ;
                }
    
                case 500 : {
                    setError("obbs , there are some problems in our server , we will fix it soon , come backe later")
                    setOpenSnackbar(true)
                    break
                }
                default : {
                    setError(`obbs ,unknown error happend with status code ${error.status}`)
                    setOpenSnackbar(true)
                    break
                }
            }  
        }
    })

    const addImageFornHanderler = (values) => {
        let data = {
          image : values.imageFile
        }
        addImageMutation.mutate(data)
        setOpen(false)

    }
    if(getPublicImagesFromServerQuery.isLoading || addImageMutation.isLoading || deleteImageMutation.isLoading){
        return <CubeLoader />
      }
  
      if(getPublicImagesFromServerQuery.isError){
        if(getPublicImagesFromServerQuery?.error?.response?.status !== 401){
            getPublicImagesFromServerQuery.refetch()
            return
        }else{
            return navigate('/auth/signin')
        }
      }

      console.log(getPublicImagesFromServerQuery.data.data.posts)

  return (
    <>
    <Box>
    <AddButton color={colors.pinkAccent[500]} reactionFunction={handleClickOpen} />
    <Box sx={{ width: '100%', height: '100%'}}>
      {
        getPublicImagesFromServerQuery.data.data.posts.length === 0 && (
          <Typography
          sx={{
            color : colors.pinkAccent[500],
            textAlign : 'center'
          }}
          variant='h2'
        >
          No Posts until now
        </Typography>
        )
      }
      <ImageList variant="masonry" cols={3} gap={8}>
        {getPublicImagesFromServerQuery.data.data.posts.map((item) => (
          <ImageListItem 
            key={item.img}
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
              src={`${baseURLImage}${item.image_url}?w=248&fit=crop&auto=format`}
              srcSet={`http://127.0.0.1:8000${item.image_url}?w=248&fit=crop&auto=format&dpr=2 2x`}
              alt={item.title}
              loading="lazy"
              style={{
                borderRadius : '6px'
              }}
            />
          </ImageListItem>
        ))}
      </ImageList>
    </Box>
    </Box>
    <Snackbar open={openSnackbar} autoHideDuration={4000} onClose={handelAlterClose}>
            <Alert onClose={handelAlterClose} severity="error" sx={{ width: '100%' }}>
                {error}
            </Alert>
        </Snackbar>
    <Dialog 
      open={open}
    >
        <DialogTitle>Subscribe</DialogTitle>
        <DialogContent>
          <Formik
                onSubmit={addImageFornHanderler}
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
                                "& > div": { gridColumn:"span 4" },
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
                        <Button type="submit" color="success" variant="outlined">
                            add
                        </Button>
                        </Box>
                    </form>
                    )
                }
            </Formik>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant='outlined' color='error'>Cancel</Button>
        </DialogActions>
      </Dialog>

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
            delete Image alter
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            sx={{
                textAlign : 'center',
                marginBottom : '10px'
            }}
          >
            are you sure you want to delete this image , this action can't be undone
          </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={deleteDialogConfirm} color="success">
                confirm
            </Button>
            <Button onClick={deleteImageDialogClose} color="error">
                Cancel
            </Button>
        </DialogActions>
        </Dialog>
    </>
  )
}

export default PublicImages

const initialValues = {
    image : '',
    imageFile : {}
}

const validationSchema = Yup.object({
    image : Yup.string().required('image field is required')
})