const cart = {
  itemTotal() {
    if (typeof window !== "undefined") {
      if (localStorage.getItem('cart')) {
        return JSON.parse(localStorage.getItem('cart')).length
      }
    }
    return 0
  },
  addItem(item, cb) {
    let cart = []
    if (typeof window !== "undefined") {
      if (localStorage.getItem('cart')) {
        cart = JSON.parse(localStorage.getItem('cart'))
      }
      cart.push({
        product: item,
        quantity: 1,
        shop: item.shop._id
      })
      localStorage.setItem('cart', JSON.stringify(cart))
      cb()
    }
  },
  updateCart(itemIndex, quantity) {
    let cart = []
    if (typeof window !== "undefined") {
      if (localStorage.getItem('cart')) {
        cart = JSON.parse(localStorage.getItem('cart'))
      }
      cart[itemIndex].quantity = quantity
      localStorage.setItem('cart', JSON.stringify(cart))
    }
  },
  getCart() {
    if (typeof window !== "undefined") {
      if (localStorage.getItem('cart')) {
        return JSON.parse(localStorage.getItem('cart'))
      }
    }
    return []
  },
  removeItem(itemIndex) {
    let cart = []
    if (typeof window !== "undefined") {
      if (localStorage.getItem('cart')) {
        cart = JSON.parse(localStorage.getItem('cart'))
      }
      cart.splice(itemIndex, 1)
      localStorage.setItem('cart', JSON.stringify(cart))
    }
    return cart
  },
  emptyCart(cb) {
    if (typeof window !== "undefined") {
      localStorage.removeItem('cart')
      cb()
    }
  },

  toggleDonation(val) {
    if (typeof window !== "undefined") {
      localStorage.setItem('donation', val)

    }
  },

  getDonation() {
    if (typeof window !== "undefined") {
      console.log('donation', localStorage.getItem('donation'))
      if (localStorage.getItem('donation') === 'true') {
        return true
      }
      return false

    }
  },

  getSubtotal() {
    return this.getCart().reduce((a, b) => {
      return a + (b.quantity * b.product.price)
    }, 0)
  },

  getTotal() {
    if (this.getDonation()) {
      return this.getSubtotal() + this.calculateDonation()

    } else {
      return this.getSubtotal()

    }
  },

  calculateDonation() {
    return (Math.round(this.getSubtotal()) - this.getSubtotal())
  },

  getDonationObject() {

    if (typeof window !== "undefined") {
      if (localStorage.getItem('donationObject')) {
        return JSON.parse(localStorage.getItem('donationObject'))
      }
    }
    return []

  },

  editDonationObject(val) {

    if (typeof window !== "undefined") {

      localStorage.setItem('donationObject',JSON.stringify(val))

    }

  },






}

export default cart
