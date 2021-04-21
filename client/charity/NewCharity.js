import React, {useState} from 'react'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import FileUpload from '@material-ui/icons/AddPhotoAlternate'
import auth from './../auth/auth-helper'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Icon from '@material-ui/core/Icon'
import { makeStyles } from '@material-ui/core/styles'
import {create} from './api-charity.js'
import {Link, Redirect} from 'react-router-dom'

const useStyles = makeStyles(theme => ({
    card: {
      maxWidth: 600,
      margin: 'auto',
      textAlign: 'center',
      marginTop: theme.spacing(5),
      paddingBottom: theme.spacing(2)
    },
    error: {
      verticalAlign: 'middle'
    },
    title: {
      marginTop: theme.spacing(2),
      color: theme.palette.openTitle,
      fontSize: '1em'
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: 300
    },
    submit: {
      margin: 'auto',
      marginBottom: theme.spacing(2)
    },
    input: {
      display: 'none'
    },
    filename:{
      marginLeft:'10px'
    }
  }))

export default function NewCharity() {
    const classes = useStyles()
       
    const [values, setValues] = useState({
        name: '',
        description: '',
        image: '',
        redirect: false,
        error: ''
        
  })

  const jwt = auth.isAuthenticated()

  const handleChange = name => event => {
    const value = name === 'image'
      ? event.target.files[0]
      : event.target.value
    setValues({...values, [name]: value })
    
  }


  const clickSubmit = () => {
    
    let charityData = new FormData()
    values.name && charityData.append('name', values.name)
    values.description && charityData.append('description', values.description)
    values.image && shopData.append('image', values.image)
    create({
        userId: jwt.user._id
    }, {
        t: jwt.token
    }, charityData).then((data) => {
      if (data.error) {
        setValues({...values, error: data.error})
      } else {
        setValues({...values, error: '', redirect: true})
      }
    })
  }
    if (values.redirect) {
        return (<Redirect to={'/charity/charities'}/>)
    }
       
    return (
        <div>
            <Card className={classes.card}>
                <CardContent>
                    <Typography type="headline" component="h2" className={classes.title}>
                        New Charity
                    </Typography>
                    <br/>
                    
                    <input accept="image/*" onChange={handleChange('image')} className={classes.input} id="icon-button-file" type="file" />
                    <label htmlFor="icon-button-file">
                        <Button variant="contained" color="secondary" component="span">
                            Upload Logo
                            <FileUpload/>
                        </Button>
                    </label> <span className={classes.filename}>{values.image ? values.image.name : ''}</span><br/>
                    <TextField id="name" label="Name" className={classes.textField} value={values.name} onChange={handleChange('name')} margin="normal"/><br/>
                    <TextField
                        id="multiline-flexible"
                        label="Description"
                        multiline
                        rows="2"
                        value={values.description}
                        onChange={handleChange('description')}
                        className={classes.textField}
                        margin="normal"
                    /><br/> {
                        values.error && (<Typography component="p" color="error">
                            <Icon color="error" className={classes.error}>error</Icon>
                        {values.error}</Typography>)
                    }
                </CardContent>
                <CardActions>
                    <Button color="primary" variant="contained" onClick={clickSubmit} className={classes.submit}>Submit</Button>
                    <Link to='/charity/charities' className={classes.submit}><Button variant="contained">Cancel</Button></Link>
                </CardActions>
            </Card>
        </div>
    )
}

