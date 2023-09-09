import { PermIdentityOutlined} from '@mui/icons-material'
import { Box, Button, ImageList, ImageListItem, List, ListItem, ListItemIcon, ListItemText, TextField, Typography, useTheme } from '@mui/material'
import React, { useState } from 'react'
import { tokens } from '../assets/theme'
import { useLocation, useParams } from 'react-router'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { request } from '../api/request'
import { useMutation } from '@tanstack/react-query'



const ChildInformation = () => {
    const theme = useTheme()
    const [updateFormOpen , setUpdateFormOpen] = useState(false)
    const colors = tokens(theme.palette.mode)
    const {state : {data}} = useLocation()

    console.log(data)
    const initialValues = {
        image : '',
        imageFile : ''
    }

    const validationSchema = Yup.object({
        image : Yup.string().required('image field is required')
    })

    const updateImage = (values) => {
        return request({
            url : `/children/${data.id}`,
            data : values,
            headers : {
                "Content-Type" : "multipart/form-data"
            },
            method : 'patch'
        })
    }
    const updateImageMution = useMutation({
        mutationKey : [`update-child-${data.id}-image-in server`],
        mutationFn : updateImage
    })

    const handleFormSubmit = (values) => {
        let data = {
            image : values.imageFile
        }
        updateImageMution.mutate(data)
    }

  return (
    <Box>
        <Button
            onClick={()=> setUpdateFormOpen(true)}
            color='info'
        >
            update image
        </Button>
        <Box
            sx={{
                width : {xs : '100%' , sm : '80%' , md : '60%'},
                margin : '0 auto'
            }}
        >
        {
            updateFormOpen && (
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
                        <Box display="flex" justifyContent="end" mt="20px" gap={'10px'}>
                            <Button type="submit" color="success" variant="contained">
                            update
                            </Button>
                            <Button onClick={() => setUpdateFormOpen(false)} color="error" variant="outlined">
                            cancel
                            </Button>
                        </Box>
                        </form>
                    )
                    }
                </Formik>
            )
        }
        </Box>
            <Typography
                sx={{
                    textTransform : 'capitalize',
                    color : colors.greenBlueAccent[500],
                    margin : '20px 5px'
                }}
                variant='h3'
            >
                identity informations
            </Typography>
            <ImageList variant="masonry" cols={1} gap={8}>
                <ImageListItem 
                    key={data.image}
                    sx={{
                    position : 'relative',
                    borderRadius : '6px'
                    
                    }}
                    
                >
                    <img
                    src={`http://192.168.1.19:9000${data.image}?w=248&fit=crop&auto=format`}
                    srcSet={`http://192.168.1.19:9000${data.image}?w=248&fit=crop&auto=format&dpr=2 2x`}
                    alt={data.image}
                    loading="lazy"
                    style={{
                        borderRadius : '6px'
                    }}
                    />
                </ImageListItem>
            </ImageList>
            <List>
                <ListItem>
                    <ListItemIcon>
                        <PermIdentityOutlined />
                    </ListItemIcon>
                    <ListItemText>
                        {data.name}
                    </ListItemText>
                </ListItem>
                <ListItem>
                    <ListItemIcon>
                        <PermIdentityOutlined />
                    </ListItemIcon>
                    <ListItemText>
                        {data.isExtra ? 'Extra' : 'Not Extra'}
                    </ListItemText>
                </ListItem>
            </List>
        </Box>
  )
}

export default ChildInformation