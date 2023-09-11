import React from 'react'
import Page from '../layouts/Page'
import { Box } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import CubeLoader from '../components/CubeLoader/CubeLoader'
import { useNavigate } from 'react-router'
import { request } from '../api/request'
import * as Yup from 'yup'

const cloumns = [
  {
    field : 'id',
    headerName : 'ID',
    width : 50
  },
    {
        field : 'name',
        headerName : 'Name',
        editable : true,
        width : 150
    },
    {
        field : 'image',
        headerName : 'Image',
        width : 120,
        alignHeader : 'center',
        align : 'center',
        renderCell : (params) => {
            return <a href={`http://192.168.1.19:9000${params.row.image}`} target='_blanck'><Box
                sx={{
                    width : '50px',
                    height : '50px',
                    borderRadius : '50%',
                    backgroundImage : `url(http://192.168.1.19:9000${params.row.image})`,
                    backgroundRepeat : 'no-repeat',
                    backgroundSize : 'cover',
                    backgroundPosition : 'center'
                }}
            >

            </Box>
            </a>
        }
    },
    {
        field : 'is_extra',
        type : 'boolean',
        editable : true,
        headerName : 'Is Extra'
    },
    {
      field : 'gender',
      headerName : 'Gender',
      width : 60,
      type : 'singelSelect',
      valueOptions : ['mail' , 'femail'],
      editable : true
    },
]

const getChildrensFromServer = () => {
    return request({
        url : '/children'
    })
}

const validationSchema = Yup.object({
  name : Yup.string().required('name field is requied'),
  image : Yup.string().required('image field is requied'),
  is_extra : Yup.boolean().required('is extra field is required'),
  gender : Yup.string().required('gender field is required')
})



const Childrens = () => {

    const navigate = useNavigate()
    const childrensQuery = useQuery({
        queryKey : ['get-childrens-from-server'],
        queryFn : getChildrensFromServer
    })

    if(childrensQuery.isLoading){
        return <CubeLoader />
      }
    
      if(childrensQuery.isError){
        if(childrensQuery.error.response){
          if(childrensQuery.error.response.status === 401){
            return navigate('/auth/signin')
          }
        }else if(childrensQuery.error.request){
          return "no response receved from server"
        }else{
          return "unknown error with message" + childrensQuery.error.message
        }
      }

  return (
    <Page 
    name={'childrens'} 
    data={childrensQuery.data.data.children} 
    columns={cloumns}
    link={{
      path : 'children'
    }}
    formInputs={[
      {
        name : 'name',
        lable : 'First Name',
        type : 'text',
        initialValues : '',
        fullWidth : true
      },
      {
        name : 'image',
        lable : 'Image',
        type : 'file',
        fullWidth : true
      },
      {
        name : 'gender',
        lable : 'Phone',
        type : 'text',
        initialValues : '',
        fullWidth : true
      },
      {
        name : 'is_extra',
        lable : 'Is Extra',
        type : 'checkbox',
        fullWidth : true,
      },
    ]}
      initialValues={{
        name : '',
        image : '',
        is_extra : ''
      }}
        validationSchema={validationSchema}
        valuesShouldUpdate={['name' , 'is_extra' , 'gender']}
    />
  )
}

export default Childrens