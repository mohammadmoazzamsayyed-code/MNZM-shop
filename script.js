const OWNER_WHATSAPP = "918097527096";
let cart = JSON.parse(localStorage.getItem('mnzmCart')) || [];
let activeModalProductId = null;

const productDetailsDatabase = {
  'bonker': {
    title: 'Bonker (Men & Women)',
    price: 250,
    description: 'Premium heavy cotton blend unisex bonker pants with elastic waistband, drawstring, side pockets, and durable soft texture.',
    defaultImages: ['images/bonker1.png'],
    colorImages: {
      'Dark Grey': ['images/bonker1.png'],
      'Black': ['images/bonker2.png'],
      'Navy Blue': ['images/bonker3.png'],
      'Olive Green': ['images/bonker4.png']
    },
    colors: ['Dark Grey', 'Black', 'Navy Blue', 'Olive Green'],
    sizes: ['XL', 'XXL', '3XL']
  },
  'plain-plazo': {
    title: 'Plain Plazo',
    price: 150,
    description: 'Minimalist solid colored flared plain plazos crafted for all-day daily wear.',
    defaultImages: ['images/plain1.png'],
    colorImages: {
      'Dark Grey': ['images/plain1.png'],
      'Black': ['images/plain2.png'],
      'Navy Blue': ['images/plain3.png'],
      'Maroon': ['images/plain4.png']
    },
    colors: ['Dark Grey', 'Black', 'Navy Blue', 'Maroon'],
    sizes: ['Free Size']
  },
  'rinkle-plazo': {
    title: 'Rinkle Plazo',
    price: 150,
    description: 'Trendy wrinkled fabric plazo with maximum stretchability and extreme comfort.',
    defaultImages: ['images/rinkle1.png'],
    colorImages: {
      'Dark Grey': ['images/rinkle1.png'],
      'Black': ['images/rinkle2.png'],
      'Navy Blue': ['images/rinkle3.png'],
      'Maroon': ['images/rinkle4.png']
    },
    colors: ['Dark Grey', 'Black', 'Navy Blue', 'Maroon'],
    sizes: ['Free Size']
  },
  'cotton-leggings': {
    title: 'Cotton Leggings',
    price: 200,
    description: '4-way stretch 100% pure combed cotton leggings with ankle length comfortable fit.',
    defaultImages: ['images/leggings1.png'],
    colorImages: {
      'Dark Grey': ['images/leggings1.png'],
      'Black': ['images/leggings2.png'],
      'Navy Blue': ['images/leggings3.png'],
      'Maroon': ['images/leggings4.png']
    },
    colors: ['Dark Grey', 'Black', 'Navy Blue', 'Maroon'],
    sizes: ['XL', 'XXL', '3XL']
  },
  'nylon-leggings': {
    title: 'Nylon Leggings',
    price: 150,
    description: 'Smooth stretchable high-grade nylon leggings for everyday comfort.',
    defaultImages: ['images/nylon1.png'],
    colorImages: {
      'Black': ['images/nylon1.png'],
      'Dark Grey': ['images/nylon2.png'],
      'Navy Blue': ['images/nylon3.png']
    },
    colors: ['Black', 'Dark Grey', 'Navy Blue'],
    sizes: ['XL', 'XXL', '3XL']
  },
  'printed-plazo': {
    title: 'Printed Plazo',
    price: 150,
    description: 'Vibrant floral and geometric prints crafted from soft material for casual style.',
    defaultImages: ['images/printed1.png'],
    colorImages: {},
    colors: [],
    sizes: ['Free Size']
  },
  'ribbon-pant': {
    title: 'Ribbon Pant',
    price: 200,
    description: 'Stylish ribbon side-detailed modern trousers with elastic waist fit.',
    defaultImages: ['images/ribbon1.png'],
    colorImages: {
      'Black': ['images/ribbon1.png'],
      'Dark Grey': ['images/ribbon2.png'],
      'Beige': ['images/ribbon3.png']
    },
    colors: ['Black', 'Dark Grey', 'Beige'],
    sizes: ['XL', 'XXL']
  },
  'korean-pant': {
    title: 'Korean Pant',
    price: 200,
    description: 'Modern loose baggy aesthetic Korean trousers with side elastic and double stitching.',
    defaultImages: ['images/korean1.png'],
    colorImages: {
      'Dark Grey': ['images/korean1.png'],
      'Black': ['images/korean2.png'],
      'Beige': ['images/korean3.png'],
      'Olive Green': ['images/korean4.png']
    },
    colors: ['Dark Grey', 'Black', 'Beige', 'Olive Green'],
    sizes: ['XL', 'XXL', '3XL']
  },
  'cotton-plain-plazo': {
    title: 'Cotton Plain Plazo',
    price: 150,
    description: 'Minimalist solid colored flared plain cotton plazos crafted from breathable fine quality cotton.',
    defaultImages: ['images/cotton-plain1.png'],
    colorImages: {
      'Dark Grey': ['images/cotton-plain1.png'],
      'Black': ['images/cotton-plain2.png'],
      'Navy Blue': ['images/cotton-plain3.png'],
      'Maroon': ['images/cotton-plain4.png']
    },
    colors: ['Dark Grey', 'Black', 'Navy Blue', 'Maroon'],
    sizes: ['Free Size']
  },
  'cotton-printed-plazo': {
    title: 'Cotton Printed Plazo',
    price: 150,
    description: 'Vibrant printed cotton plazo crafted from soft breathable pure cotton fabric.',
    defaultImages: ['images/cotton-printed1.png'],
    colorImages: {},
    colors: [],
    sizes: ['Free Size']
  }
};

let defaultReviews = {
  'rinkle-plazo': [
    { name: 'Priya', rating: 5, text: 'Very comfortable fabric. Highly recommended!' },
    { name: 'Saba Khan', rating: 5, text: 'Soft quality and perfect fit.' }
  ],
  'bonker': [
    { name: 'Aman', rating: 5, text: 'Awesome quality for daily wear!' }
  ]
};

let allReviews = JSON.parse(localStorage.getItem('mnzmCardReviews')) || defaultReviews;

window.onload = function() {
  renderCardColors();
  renderAllCardReviews();
  updateCartUI();
  setupZoomFeature();
};

function getProductImages(prod, colorName) {
  if (prod.colorImages && prod.colorImages[colorName] && prod.colorImages[colorName].length > 0) {
    return prod.colorImages[colorName];
  }
  let idx = prod.colors.indexOf(colorName);
  if (idx === -1) idx = 0;
  let baseImg = prod.defaultImages[0];
  let newImg = baseImg.replace(/\d+(\.png|\.jpg|\.jpeg)$/i, (match, ext) => (idx + 1) + ext);
  return [newImg];
}

function renderCardColors() {
  Object.keys(productDetailsDatabase).forEach(productId => {
    let prod = productDetailsDatabase[productId];
    let el = document.getElementById(`colors-${productId}`);
    if (el && prod.colors && prod.colors.length > 0) {
      el.innerHTML = prod.colors.map((color, idx) => 
        `<button class="opt-btn ${idx === 0 ? 'selected' : ''}" onclick="selectCardColor('${productId}', '${color}', this)">${color}</button>`
      ).join('');
    }
  });
}

function selectCardColor(productId, colorName, btn) {
  selectCardOption(btn);
  const prod = productDetailsDatabase[productId];
  if (!prod) return;

  let imgEl = document.getElementById(`card-img-${productId}`);
  if (imgEl) {
    let images = getProductImages(prod, colorName);
    if (images && images.length > 0) {
      imgEl.src = images[0];
    }
  }
}

function openProductDetail(productId) {
  activeModalProductId = productId;
  const prod = productDetailsDatabase[productId];
  if (!prod) return;

  document.getElementById('detailTitle').innerText = prod.title;
  document.getElementById('detailPrice').innerText = `₹${prod.price}`;
  document.getElementById('detailDescription').innerText = prod.description;

  const colorGroupEl = document.getElementById('detailColorGroup');
  const colorContainer = document.getElementById('detailColors');

  if (prod.colors && prod.colors.length > 0) {
    if (colorGroupEl) colorGroupEl.style.display = 'block';
    let cardColorEl = document.querySelector(`#colors-${productId} .opt-btn.selected`);
    let preSelectedColor = cardColorEl ? cardColorEl.innerText : prod.colors[0];

    if (colorContainer) {
      colorContainer.innerHTML = prod.colors.map(c => `
        <button class="opt-btn ${c === preSelectedColor ? 'selected' : ''}" onclick="selectModalColor('${c}', this)">${c}</button>
      `).join('');
    }
    let initialImages = getProductImages(prod, preSelectedColor);
    updateModalImages(initialImages);
  } else {
    if (colorGroupEl) colorGroupEl.style.display = 'none';
    updateModalImages(prod.defaultImages);
  }

  const sizeContainer = document.getElementById('detailSizes');
  if (sizeContainer) {
    sizeContainer.innerHTML = prod.sizes.map((s, idx) => `
      <button class="opt-btn ${idx === 0 ? 'selected' : ''}" onclick="selectCardOption(this)">${s}</button>
    `).join('');
  }

  const addBtn = document.getElementById('detailAddToCartBtn');
  if (addBtn) {
    addBtn.onclick = function() {
      let selectedColor = (prod.colors && prod.colors.length > 0) ? (colorContainer?.querySelector('.opt-btn.selected')?.innerText || prod.colors[0]) : 'Default';
      let selectedSize = sizeContainer?.querySelector('.opt-btn.selected')?.innerText || prod.sizes[0];
      addToCartDirect(prod.title, prod.price, selectedColor, selectedSize);
      closeDetailModal();
    };
  }

  document.getElementById('productDetailModal').style.display = 'flex';
}

function selectModalColor(colorName, btnEl) {
  selectCardOption(btnEl);
  const prod = productDetailsDatabase[activeModalProductId];
  if (prod) {
    let images = getProductImages(prod, colorName);
    updateModalImages(images);
  }
}

function updateModalImages(images) {
  if (!images || images.length === 0) return;

  const mainImg = document.getElementById('detailMainImg');
  if (mainImg) mainImg.src = images[0];

  const thumbsContainer = document.getElementById('detailThumbnails');
  if (thumbsContainer) {
    thumbsContainer.innerHTML = images.map((imgSrc, idx) => `
      <img src="${imgSrc}" class="thumb-img ${idx === 0 ? 'active' : ''}" onclick="changeDetailImage('${imgSrc}', this)" onerror="this.style.display='none'">
    `).join('');
  }
}

function changeDetailImage(src, thumbEl) {
  const mainImg = document.getElementById('detailMainImg');
  if (mainImg) mainImg.src = src;
  document.querySelectorAll('.thumb-img').forEach(t => t.classList.remove('active'));
  if (thumbEl) thumbEl.classList.add('active');
}

function closeDetailModal() {
  document.getElementById('productDetailModal').style.display = 'none';
}

function setupZoomFeature() {
  const container = document.getElementById("zoomContainer");
  const img = document.getElementById("detailMainImg");

  if (!container || !img) return;

  container.addEventListener("mousemove", (e) => {
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;

    img.style.transformOrigin = `${xPercent}% ${yPercent}%`;
    img.style.transform = "scale(2.2)";
  });

  container.addEventListener("mouseleave", () => {
    img.style.transform = "scale(1)";
    img.style.transformOrigin = "center center";
  });
}

function selectCardOption(btn) {
  if (!btn || !btn.parentElement) return;
  let siblingButtons = btn.parentElement.querySelectorAll('.opt-btn');
  siblingButtons.forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
}

function addCardToCart(btn, title, price) {
  let card = btn.closest('.card');
  let colorBtn = card.querySelector('.color-options .opt-btn.selected');
  let selectedColor = colorBtn ? colorBtn.innerText : 'Default';
  let selectedSize = card.querySelector('.size-options .opt-btn.selected')?.innerText || 'Free Size';

  addToCartDirect(title, price, selectedColor, selectedSize);
}

function addToCartDirect(title, price, color, size) {
  let existingIndex = cart.findIndex(item => item.title === title && item.color === color && item.size === size);

  if (existingIndex > -1) {
    cart[existingIndex].qty += 1;
  } else {
    cart.push({ title, price, color, size, qty: 1 });
  }

  saveAndUpdateCart();
  showToast(`${title} added to cart!`);
}

function buyCardViaWhatsApp(btn, title, price) {
  let card = btn.closest('.card');
  let colorBtn = card.querySelector('.color-options .opt-btn.selected');
  let selectedColor = colorBtn ? colorBtn.innerText : 'Default';
  let selectedSize = card.querySelector('.size-options .opt-btn.selected')?.innerText || 'Free Size';

  let message = `🛍️ *DIRECT ORDER - MNZM SHOP*\n\n` +
                `• Product: *${title}*\n` +
                `• Color: ${selectedColor}\n` +
                `• Size: ${selectedSize}\n` +
                `• Price: ₹${price}\n\n` +
                `I want to buy this item. Please confirm my order!`;

  let encodedMsg = encodeURIComponent(message);
  let whatsappUrl = `https://wa.me/${OWNER_WHATSAPP}?text=${encodedMsg}`;
  window.open(whatsappUrl, '_blank');
}

// CANCELLATION MODAL FUNCTIONS
function openCancelModal() {
  document.getElementById('cancelModal').style.display = 'flex';
}

function closeCancelModal() {
  document.getElementById('cancelModal').style.display = 'none';
}

function handleCancelSubmission(e) {
  e.preventDefault();

  const phone = document.getElementById('cancelPhone').value.trim();
  const name = document.getElementById('cancelName').value.trim();
  const reason = document.getElementById('cancelReason').value;
  const notes = document.getElementById('cancelNotes').value.trim();

  let message = `🚫 *ORDER CANCELLATION REQUEST - MNZM SHOP*\n\n` +
                `👤 *Customer Info:*\n` +
                `• Name: ${name}\n` +
                `• Registered Phone: ${phone}\n\n` +
                `❓ *Reason:* ${reason}\n` +
                `📝 *Additional Details:* ${notes || 'None'}\n\n` +
                `Please process my order cancellation within the 2-hour window. Thank you.`;

  let encodedMsg = encodeURIComponent(message);
  let whatsappUrl = `https://wa.me/${OWNER_WHATSAPP}?text=${encodedMsg}`;

  window.open(whatsappUrl, '_blank');
  closeCancelModal();
}

function updateCartUI() {
  const countEl = document.getElementById('cartCount');
  const listEl = document.getElementById('cartItemsList');
  const totalEl = document.getElementById('cartTotal');

  if (!countEl || !listEl || !totalEl) return;

  let totalQty = cart.reduce((acc, item) => acc + item.qty, 0);
  let totalPrice = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

  countEl.innerText = totalQty;
  totalEl.innerText = totalPrice;

  if (cart.length === 0) {
    listEl.innerHTML = '<p style="text-align:center; color: var(--text-muted); margin-top: 2rem;">No items added yet.</p>';
    return;
  }

  listEl.innerHTML = cart.map((item, idx) => `
    <div class="cart-item">
      <div class="cart-item-details">
        <strong>${item.title}</strong>
        <br><small style="color: var(--text-muted);">Color: ${item.color} | Size: ${item.size}</small>
        <br><span style="color: var(--success); font-weight:700;">₹${item.price} × ${item.qty} = ₹${item.price * item.qty}</span>
      </div>
      <div class="qty-controls">
        <button onclick="changeQty(${idx}, -1)">-</button>
        <span>${item.qty}</span>
        <button onclick="changeQty(${idx}, 1)">+</button>
      </div>
    </div>
  `).join('');
}

function changeQty(index, change) {
  cart[index].qty += change;
  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }
  saveAndUpdateCart();
}

function clearCart() {
  cart = [];
  saveAndUpdateCart();
}

function saveAndUpdateCart() {
  localStorage.setItem('mnzmCart', JSON.stringify(cart));
  updateCartUI();
}

function toggleCart() {
  document.getElementById('cartSidebar').classList.toggle('open');
}

function openCheckoutModal() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }
  document.getElementById('checkoutModal').style.display = 'flex';
}

function closeCheckoutModal() {
  document.getElementById('checkoutModal').style.display = 'none';
  // Reset payment selection and hide QR container on close
  const paymentSelect = document.getElementById('custPayment');
  if (paymentSelect) paymentSelect.value = "Cash on Delivery (COD)";
  const qrBox = document.getElementById('qrContainer');
  if (qrBox) qrBox.style.display = 'none';
}

// Function to show/hide QR code dynamically in checkout modal
function toggleQROption(paymentMethod) {
  const qrBox = document.getElementById('qrContainer');
  if (!qrBox) return;

  if (paymentMethod === 'UPI / Online Payment') {
    qrBox.style.display = 'block';
  } else {
    qrBox.style.display = 'none';
  }
}

function handleOrderSubmission(e) {
  e.preventDefault();

  const name = document.getElementById('custName').value.trim();
  const phone = document.getElementById('custPhone').value.trim();
  const address = document.getElementById('custAddress').value.trim();
  const pincode = document.getElementById('custPincode').value.trim();
  const payment = document.getElementById('custPayment').value;

  let orderDetails = cart.map((item, i) => `${i + 1}. *${item.title}*\n   - Color: ${item.color}\n   - Size: ${item.size}\n   - Qty: ${item.qty}\n   - Price: ₹${item.price * item.qty}`).join('\n\n');
  let totalPrice = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

  let paymentNote = (payment === 'UPI / Online Payment') 
    ? `\n💳 *Payment Status:* Online Prepaid (Screenshot attached in chat)` 
    : `\n💳 *Payment Status:* Cash on Delivery (COD)`;

  let message = `🛍️ *CART ORDER - MNZM SHOP*\n\n` +
    `👤 *Customer Details:*\n` +
    `• Name: ${name}\n` +
    `• Phone: ${phone}\n` +
    `• Address: ${address}\n` +
    `• Pincode: ${pincode}\n` +
    `• Payment Mode: ${payment}${paymentNote}\n\n` +
    `📦 *Order Summary:*\n${orderDetails}\n\n` +
    `💰 *Total Amount:* ₹${totalPrice}\n\n` +
    `Please confirm my order. Thank you!`;

  let encodedMsg = encodeURIComponent(message);
  let whatsappUrl = `https://wa.me/${OWNER_WHATSAPP}?text=${encodedMsg}`;

  window.open(whatsappUrl, '_blank');
  clearCart();
  closeCheckoutModal();
  toggleCart();
}

function filterCategory(cat, evt) {
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
  evt.target.classList.add('active');

  document.querySelectorAll('.card').forEach(card => {
    if (cat === 'all' || card.getAttribute('data-category') === cat) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
}

function filterProducts() {
  let query = document.getElementById('searchInput').value.toLowerCase();
  document.querySelectorAll('.card').forEach(card => {
    let title = card.querySelector('h3').innerText.toLowerCase();
    card.style.display = title.includes(query) ? 'flex' : 'none';
  });
}

function submitCardReview(e, prodId) {
  e.preventDefault();
  let form = e.target;
  let name = form.querySelector('.rev-name').value;
  let rating = parseInt(form.querySelector('.rev-rating').value);
  let text = form.querySelector('.rev-msg').value;

  if (!allReviews[prodId]) allReviews[prodId] = [];
  allReviews[prodId].push({ name, rating, text });

  localStorage.setItem('mnzmCardReviews', JSON.stringify(allReviews));
  renderAllCardReviews();
  form.reset();
  showToast("Review submitted!");
}

function renderAllCardReviews() {
  Object.keys(allReviews).forEach(id => {
    let container = document.getElementById(`reviews-${id}`);
    if (container) {
      container.innerHTML = allReviews[id].map(r => `
        <div class="review-item">
          <div class="review-head">
            <span>${r.name}</span>
            <span class="star-gold">${'★'.repeat(r.rating)}</span>
          </div>
          <div>${r.text}</div>
        </div>
      `).join('');
    }
  });
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.innerText = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}
