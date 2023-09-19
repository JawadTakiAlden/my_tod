import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, List, ListItem, ListItemIcon, ListItemText, TextField, Typography, useTheme } from '@mui/material'
import React from 'react'
import GridBox from '../components/GridBox'
import GridItem from '../components/GridItem'
import { tokens } from '../assets/theme'
import { NoteOutlined } from '@mui/icons-material'
import { Formik } from 'formik'
import * as Yup from 'yup'

const ReadableCards = () => {
    const theme = useTheme()
    const colors = tokens(theme.palette.mode)
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const sendNotificationHandler = (values) => {
        console.log(values)
    }
  return (
    <>
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
                            do you want to make a new notification , create new one right now!
                        </Typography>
                        <Button color='secondary' onClick={handleClickOpen}>create notification</Button>
                    </Box>
                </Box>
            </GridItem>
        </GridBox>
    </Box>
    <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>Send Notification</DialogTitle>
        <DialogContent>
          <DialogContentText>
            publish new notification for user 
          </DialogContentText>
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={sendNotificationHandler}
        >
            {
                ({handleBlur , handleChange , handleSubmit , values , errors , touched}) => (
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Message"
                            multiline
                            rows={4}
                            value={values.message}
                            name='message'
                            fullWidth
                            variant="outlined"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={!!touched.message && !!errors.message}
                            helperText={touched.message && errors.message}
                        />
                        <Box
                            sx={{
                                display : 'flex',
                                alignItems : 'center',
                                justifyContent: 'flex-end',
                                marginTop : '10px'
                            }}
                        >
                            <Button type='submit' color='success'>
                                Send Notification
                            </Button>
                        </Box>
                    </form>
                )
            }
        </Formik>
          
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color='error'>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

const initialValues = {
    message : ''
}

const validationSchema = Yup.object({
    message : Yup.string().required('message is required')
})

export default ReadableCards