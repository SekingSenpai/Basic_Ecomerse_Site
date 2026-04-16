let cart = JSON.parse(localStorage.getItem('gridlock_cart')) || [];

function updateCartBadge() {
  const badge = document.getElementById('cart-count');
  if (badge) {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  }
}

function addToCart(id, title, price, image) {
  const existingItem = cart.find(item => item.id === id);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ id, title, price, image, quantity: 1 });
  }
  
  localStorage.setItem('gridlock_cart', JSON.stringify(cart));
  updateCartBadge();
  alert(`Added ${title} to your cart!`);
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  localStorage.setItem('gridlock_cart', JSON.stringify(cart));
  updateCartBadge();
  renderCart();
}

function renderCart() {
  const cartContainer = document.getElementById('cart-items-container');
  const subtotalEl = document.getElementById('cart-subtotal');
  const totalEl = document.getElementById('cart-total');
  const checkoutBtn = document.getElementById('checkout-btn');
  
  if (!cartContainer) return;
  
  cartContainer.innerHTML = '';
  
  if (cart.length === 0) {
    cartContainer.innerHTML = '<tr><td colspan="4"><div class="empty-cart-msg">Your cart is currently empty. <br><br><a href="shop.html" class="btn btn-outline">Shop Now</a></div></td></tr>';
    subtotalEl.textContent = '₹0.00';
    totalEl.textContent = '₹0.00';
    if(checkoutBtn) checkoutBtn.disabled = true;
    return;
  }
  
  if(checkoutBtn) checkoutBtn.disabled = false;
  
  let subtotal = 0;
  
  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;
    
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>
        <div class="cart-item-flex">
          <img src="${item.image}" alt="${item.title}" class="cart-item-img">
          <div>
            <strong>${item.title}</strong>
            <button class="remove-btn" onclick="removeFromCart('${item.id}')">Remove</button>
          </div>
        </div>
      </td>
      <td>₹${item.price.toFixed(2)}</td>
      <td>${item.quantity}</td>
      <td><strong>₹${itemTotal.toFixed(2)}</strong></td>
    `;
    cartContainer.appendChild(tr);
  });
  
  subtotalEl.textContent = `₹${subtotal.toFixed(2)}`;
  
  const total = subtotal + 500.00;
  totalEl.textContent = `₹${total.toFixed(2)}`;
}

document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  
  if (document.getElementById('cart-items-container')) {
    renderCart();
  }
  
  const addButtons = document.querySelectorAll('.add-to-cart-btn');
  addButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const card = e.target.closest('.product-card');
      const id = btn.getAttribute('data-id');
      const title = btn.getAttribute('data-title');
      const price = parseFloat(btn.getAttribute('data-price'));
      const image = card.querySelector('.product-img').src;
      
      addToCart(id, title, price, image);
    });
  });
});
