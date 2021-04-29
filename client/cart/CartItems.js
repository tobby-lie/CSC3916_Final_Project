import React, { useState, useEffect } from 'react'
import auth from './../auth/auth-helper'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import cart from './cart-helper.js'
import { Link } from 'react-router-dom'
import { list } from '../charity/api-charity'

const useStyles = makeStyles(theme => ({
  card: {
    margin: '24px 0px',
    padding: '16px 40px 60px 40px',
    backgroundColor: '#80808017'
  },
  title: {
    margin: theme.spacing(2),
    color: theme.palette.openTitle,
    fontSize: '1.2em'
  },
  price: {
    color: theme.palette.text.secondary,
    display: 'inline'
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    marginTop: 0,
    width: 50
  },
  productTitle: {
    fontSize: '1.15em',
    marginBottom: '5px'
  },
  subheading: {
    color: 'rgba(88, 114, 128, 0.67)',
    padding: '8px 10px 0',
    cursor: 'pointer',
    display: 'inline-block'
  },
  cart: {
    width: '100%',
    display: 'inline-flex'
  },
  details: {
    display: 'inline-block',
    width: "100%",
    padding: "4px"
  },
  content: {
    flex: '1 0 auto',
    padding: '16px 8px 0px'
  },
  cover: {
    width: 160,
    height: 125,
    margin: '8px'
  },
  itemTotal: {
    float: 'right',
    marginRight: '40px',
    fontSize: '1.5em',
    color: 'rgb(72, 175, 148)'
  },
  checkout: {
    float: 'right',
    margin: '24px'
  },
  total: {
    fontSize: '1.2em',
    color: 'rgb(53, 97, 85)',
    marginRight: '16px',
    fontWeight: '600',
    verticalAlign: 'bottom'
  },
  continueBtn: {
    marginLeft: '10px'
  },
  itemShop: {
    display: 'block',
    fontSize: '0.90em',
    color: '#78948f'
  },
  removeButton: {
    fontSize: '0.8em'
  }
}))

export default function CartItems(props) {
  const classes = useStyles()
  const [cartItems, setCartItems] = useState(cart.getCart())
  const [donation, setDonation] = useState(false)
  const [charities, setCharities] = useState([])
  const [slideIndex, setslideIndex] = useState(1)

  useEffect(() => {
    console.log('get donation', cart.getDonation())
    setDonation(cart.getDonation())
    console.log('donate', typeof (donation))

    const abortController = new AbortController()
    const signal = abortController.signal
    list(signal).then((data) => {
      if (data.error) {
        console.log('ERROR', data.error)
      } else {
        setCharities(data)
        showSlides(1)

      }
    })
    return function cleanup() {
      abortController.abort()
    }

  }, [])




  const handleChange = index => event => {
    let updatedCartItems = cartItems
    if (event.target.value == 0) {
      updatedCartItems[index].quantity = 1
    } else {
      updatedCartItems[index].quantity = event.target.value
    }


    setCartItems([...updatedCartItems])
    cart.updateCart(index, event.target.value)
    setDonate(cart.getDonation(), cart.getDonationObject().charityId)


  }





  const removeItem = index => event => {
    let updatedCartItems = cart.removeItem(index)
    if (updatedCartItems.length == 0) {
      props.setCheckout(false)
    }
    setCartItems(updatedCartItems)
  }

  const openCheckout = () => {
    props.setCheckout(true)
  }

  const setDonate = (val, charityId) => {
    console.log('setting donate')
    cart.toggleDonation(val)
    if (val == true) {
      cart.editDonationObject({ amount: cart.calculateDonation(), charityId: charityId })

    } else {
      cart.editDonationObject({})

    }
    setDonation(val)
  }



  // Next/previous controls
  const plusSlides = (n) => {
    console.log('plusSlides', n)
    setslideIndex(slideIndex + n)
    showSlides(slideIndex + n);
  }

  // Thumbnail image controls
  const currentSlide = (n) => {
    showSlides(n);
  }

  const showSlides = (n) => {
    console.log('showslides', n)
    let i;
    let slides = document.getElementsByClassName("mySlides");
    let dots = document.getElementsByClassName("dot");
    if (n > slides.length) { setslideIndex(1); n = 1 }
    if (n < 1) { setslideIndex(slides.length); n = slides.length }
    for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
      // console.log(i, slides[i].classList)
    }
    for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
    }
    // console.log('slides?', slides)
    slides[n - 1].style.display = "block";
    dots[n - 1].classList.add("active");
    console.log(n - 1)
  }





  return (
    <Card className={classes.card}>

      <Typography type="title" className={classes.title}>
        Shopping Cart
      </Typography>
      {cartItems.length > 0 ? (<span>
        {cartItems.map((item, i) => {
          return <span key={i}><Card className={classes.cart}>
            <CardMedia
              className={classes.cover}
              image={'/api/product/image/' + item.product._id}
              title={item.product.name}
            />
            <div className={classes.details}>
              <CardContent className={classes.content}>
                <Link to={'/product/' + item.product._id}><Typography type="title" component="h3" className={classes.productTitle} color="primary">{item.product.name}</Typography></Link>
                <div>
                  <Typography type="subheading" component="h3" className={classes.price} color="primary">$ {item.product.price}</Typography>
                  <span className={classes.itemTotal}>${item.product.price * item.quantity}</span>
                  <span className={classes.itemShop}>Shop: {item.product.shop.name}</span>
                </div>
              </CardContent>
              <div className={classes.subheading}>
                Quantity: <TextField
                  value={item.quantity}
                  onChange={handleChange(i)}
                  type="number"
                  inputProps={{
                    min: 1
                  }}
                  className={classes.textField}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  margin="normal" />
                <Button className={classes.removeButton} color="primary" onClick={removeItem(i)}>x Remove</Button>
              </div>
            </div>
          </Card>
            <Divider />
          </span>
        })
        }
        <br />
        {/* <div style={{backgroundColor: '#ffffff', borderRadius: '16px', paddingTop: '1rem', paddingBottom: '1rem', marginTop: '1rem'}}> */}
        <Card style={{ paddingBottom: '3rem', paddingTop: '1rem' }}>
          <p style={{ marginLeft: '1rem' }}>Donate to charity</p>
          <div className="slideshow-container">
            {
              charities.map((charity, i) => {
                return (
                  <div key={charity._id} className="mySlides fade">
                    <div className="numbertext">{i + 1} / {charities.length}</div>
                    <h2 style={{ textAlign: 'center' }}>{charity.name}</h2>
                    <h4 style={{ textAlign: 'center' }}>{charity.description}</h4>
                    <div style={{ display: 'flex', justifyContent: 'center', paddingLeft: '3rem', paddingRight: '3rem' }}>
                      {/* {
                        'val: ' + donation + ", type: " + typeof (donation)
                      } */}
                      {
                        (donation == false) ? <Button color="secondary" variant="contained" onClick={() => setDonate(true, charity._id)}>Round Up $1 and Donate to this Charity</Button>
                          :
                          <p>Thank You!</p>
                      }

                    </div>
                  </div>
                )

              })
            }
            {/* <!-- Next and previous buttons --> */}
            <a className="prev" onClick={() => plusSlides(-1)}>&#10094;</a>
            <a className="next" onClick={() => plusSlides(1)}>&#10095;</a>
            <br />

          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            {
              charities.map((charity, i) => {
                return (
                  <span key={'dot' + charity._id} className="dot" onClick={() => currentSlide(i + 1)}></span>

                )

              })
            }
          </div>

        </Card>


        <div className={classes.checkout}>

          {
            donation &&
            <>
              <Button color="primary" variant="contained" onClick={() => setDonate(false, '')}>X Cancel Donation</Button>

              <div className={classes.total}>Charity Round Up: ${Math.round((cart.calculateDonation()) * 100) / 100}

              </div>

            </>
          }
          <div className={classes.total}>Total: ${Math.round(cart.getTotal() * 100) / 100}
          </div>
          <div>
            {!props.checkout && (auth.isAuthenticated() ?
              <Button color="secondary" variant="contained" onClick={openCheckout}>Checkout</Button>
              :
              <Link to="/signin">
                <Button color="primary" variant="contained">Sign in to checkout</Button>
              </Link>)}
          </div>
          <Link to='/' className={classes.continueBtn}>
            <Button variant="contained">Continue Shopping</Button>
          </Link>
        </div>
      </span>) :
        <Typography variant="subtitle1" component="h3" color="primary">No items added to your cart.</Typography>
      }
    </Card >)
}

CartItems.propTypes = {
  checkout: PropTypes.bool.isRequired,
  setCheckout: PropTypes.func.isRequired
}
