import React, {useState, useEffect} from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Avatar from '@material-ui/core/Avatar'
import IconButton from '@material-ui/core/IconButton'
import Icon from '@material-ui/core/Icon'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Edit from '@material-ui/icons/Edit'
import Divider from '@material-ui/core/Divider'
import auth from './../auth/auth-helper'
import {listByOwner} from './api-charity'
import {Redirect, Link} from 'react-router-dom'
import DeleteCharity from './DeleteCharity'

const useStyles = makeStyles(theme => ({
  root: theme.mixins.gutters({
    maxWidth: 600,
    margin: 'auto',
    padding: theme.spacing(3),
    marginTop: theme.spacing(5)
  }),
  title: {
    margin: `${theme.spacing(3)}px 0 ${theme.spacing(3)}px ${theme.spacing(1)}px` ,
    color: theme.palette.protectedTitle,
    fontSize: '1.2em'
  },
  addButton:{
    float:'right'
  },
  leftIcon: {
    marginRight: "8px"
  }
}))

export default function MyCharities() {
    const classes = useStyles()
    const [charities, setCharities] = useState([])
    const [redirectToSignin, setRedirectToSignin] = useState(false)
    const jwt = auth.isAuthenticated()

    useEffect(() => {
        const abortController = new AbortController()
        const signal = abortController.signal
        listByOwner({
            userId: jwt.user._id
        }, {t: jwt.token}, signal).then((data) => {
            if (data.error) {
                setRedirectToSignin(true)
            } else {
                setCharities(data)
            }
        })
        return function cleanup(){
            abortController.abort()
        }
    }, [])
    
    const removeCharity = (charity) => {
      const updatedCharity = [...charities]
      const index = updatedCharity.indexOf(charity)
      updatedCharity.splice(index, 1)
      setCharities(updatedCharity)
    }

    if(redirectToSignin) {
      return <Redirect to='/signin'/>
    }

    return (
        <div>
            <Paper className={classes.root} elevation={4}>
                <Typography type="title" className={classes.title}>
                    Your charites
                    <span className={classes.addButton}>
                        <Link to="/charity/shop/new">
                            <Button color="primary" variant="contained">
                                <Icon className={classes.leftIcon}>add_box</Icon>  New Charity
                            </Button>
                        </Link>
                    </span>
                </Typography>
                <List dense>
                {charities.map((charity, i) => {
                    return <span key={i}>
                        <ListItem button>
                            <ListItemAvatar>
                                <Avatar src={'/api/charities/'}/>
                            </ListItemAvatar>
                            <ListItemText primary={charity.name} secondary={charity.description}/>
                            { auth.isAuthenticated().user && auth.isAuthenticated().user._id == charity.owner._id &&
                                (<ListItemSecondaryAction>
                                    <Link to={"/charity/donations/" + charity._id}>
                                        <Button aria-label="Orders" color="primary">
                                            View Donations
                                        </Button>
                                    </Link>  
                                    <Link to={"/charity/shop/edit/" + charity._id}>
                                        <IconButton aria-label="Edit" color="primary">
                                            <Edit/>
                                        </IconButton>
                                    </Link>
                                    <DeleteCharity charity={charity} onRemove={removeCharity}/>                                
                                  </ListItemSecondaryAction>)
                                }                                
                        </ListItem>
                        <Divider/>
                    </span>})}
                </List> 
            </Paper>
        </div>
        
    )
}
