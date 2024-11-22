// Array globale per memorizzare gli articoli nel carrello
let cart = [];

// Attende che il DOM sia completamente caricato prima di eseguire le funzioni
document.addEventListener('DOMContentLoaded', function() {
    initializeUI(); // Gestisce il popolamento di informazioni del negozio
    loadProducts(); // Caricamento della griglia prodotti
    initializeEvents(); // Inizializzazione eventi al click (apertura carrello)
});

function initializeUI() {
    // Imposta il nome e l'indirizzo del negozio nell'interfaccia
    document.getElementById('nomeNegozio').textContent = negozio.nomeNegozio;
    document.getElementById('indirizzoNegozio').textContent = negozio.indirizzo;
    
    // Crea dinamicamente la lista dei metodi di pagamento
    // Docs: https://developer.mozilla.org/it/docs/Web/API/Document/createElement
    const metodiPagamentoList = document.getElementById('metodiPagamento');
    for (let i = 0; i < negozio.metodiPagamento.length; i++) {
        const li = document.createElement('li');
        li.textContent = negozio.metodiPagamento[i];
        metodiPagamentoList.appendChild(li);
    }

    // Mostra le informazioni sulla spedizione usando template literals
    // Docs: https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Template_literals
    document.getElementById('infoSpedizione').textContent = 
        `Spese di spedizione: €${negozio.speseSpedizione}\nSpedizione gratuita per ordini superiori a €${negozio.sogliaSpedizioneGratuita}`;
}

// Funzione per caricare i prodotti
function loadProducts() {
    // Crea le card dei prodotti dinamicamente
    // Ogni prodotto include:
    // - Immagine
    // - Titolo
    // - Descrizione troncata
    // - Prezzo (con gestione degli sconti)
    // - Pulsanti per dettagli e carrello
    
    // Usa .substring() per troncare la descrizione
    // Docs: https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Global_Objects/String/substring
    
    // Usa .toFixed() per formattare i prezzi
    // Docs: https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Global_Objects/Number/toFixed
    const container = document.getElementById('productContainer');
    
    // Itera su ogni prodotto nell'array dei prodotti usando un ciclo for
    for(let i = 0; i < prodotti.products.length; i++) {
        const product = prodotti.products[i];
        // Calcola il prezzo scontato per questo prodotto
        const discountedPrice = calculateDiscountedPrice(product.price, product.discountPercentage);
        // Crea un elemento div per la colonna
        const col = document.createElement('div');
        // Imposta le classi Bootstrap per il layout responsive
        col.className = 'col-md-4 mb-4';
        
        // Costruisce il template HTML per la card del prodotto usando template literals
        col.innerHTML = `
            <div class="card product-card h-100">
                <!-- Immagine del prodotto -->
                <img src="${product.thumbnail}" class="card-img-top" alt="${product.title}">
                <div class="card-body d-flex flex-column">
                    <!-- Titolo del prodotto -->
                    <h5 class="card-title">${product.title}</h5>
                    <!-- Descrizione troncata a 100 caratteri -->
                    <p class="card-text">${product.description.substring(0, 100)}...</p>
                    <div class="mt-auto">
                        <!-- Visualizzazione del prezzo con/senza sconto -->
                        <p class="card-text">
                            ${product.discountPercentage > 0 ? 
                                `<s class="text-muted">€${product.price.toFixed(2)}</s>
                                 <strong class="text-danger ms-2">€${discountedPrice.toFixed(2)}</strong>
                                 <span class="badge bg-danger ms-2">-${product.discountPercentage}%</span>` 
                                : 
                                `<strong>€${product.price.toFixed(2)}</strong>`
                            }
                        </p>
                        <!-- Pulsanti per dettagli e aggiunta al carrello -->
                        <div class="d-flex justify-content-between">
                            <button class="btn btn-primary" onclick="showProductDetails(${product.id})"> <!-- come vedete, il parametro product.id viene passato alla funzione showProductDetails() -->
                                Maggiori informazioni
                            </button>
                            <button class="btn btn-success" onclick="addToCart(${product.id})"> <!-- come vedete, il parametro product.id viene passato alla funzione addToCart() -->
                                <i class="fas fa-cart-plus"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Aggiunge la card al container
        container.appendChild(col);
    }
}

// Funzione per calcolare il prezzo scontato
function calculateDiscountedPrice(price, discountPercentage) {
    // Calcola il prezzo scontato applicando la percentuale di sconto
    return price - (price * (discountPercentage / 100));
}

// Funzione per mostrare i dettagli del prodotto
function showProductDetails(productId) {
    // Trova il prodotto specifico usando .find()
    // Docs: https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Global_Objects/Array/find
    const product = prodotti.products.find(p => p.id === productId);
    // crea il prezzo scontato
    const discountedPrice = calculateDiscountedPrice(product.price, product.discountPercentage);
    // Popola e mostra un modal Bootstrap con i dettagli del prodotto
    const modalTitle = document.getElementById('productModalTitle');
    const modalBody = document.getElementById('productModalBody');
    
    modalTitle.textContent = product.title;
    
    modalBody.innerHTML = `
        <div class="row">
            <div class="col-md-6">
                <img src="${product.thumbnail}" class="img-fluid" alt="${product.title}">
            </div>
            <div class="col-md-6">
                <p>${product.description}</p>
                <ul class="list-unstyled">
                    <li>
                        <strong>Prezzo:</strong> 
                        ${product.discountPercentage > 0 ? 
                            `<s class="text-muted">€${product.price.toFixed(2)}</s>
                             <strong class="text-danger ms-2">€${discountedPrice.toFixed(2)}</strong>
                             <span class="badge bg-danger ms-2">-${product.discountPercentage}%</span>` 
                            : 
                            `€${product.price.toFixed(2)}`
                        }
                    </li>
                    <li><strong>Categoria:</strong> ${product.category}</li>
                    <li><strong>Brand:</strong> ${product.brand}</li>
                    <li><strong>Disponibilità:</strong> ${product.stock} pezzi</li>
                    <li><strong>Rating:</strong> ${product.rating}/5</li>
                </ul>
                <div class="mt-3">
                    <button class="btn btn-success" onclick="addToCart(${product.id})">
                        Aggiungi al carrello
                    </button>
                </div>
            </div>
        </div>
    `;
    
    new bootstrap.Modal(document.getElementById('productModal')).show();
}

function addToCart(productId) {
    // Aggiunge un prodotto al carrello o incrementa la quantità se già presente
    // Usa .find() per cercare prodotti esistenti nel carrello
    // Aggiorna il badge e mostra una notifica
    const product = prodotti.products.find(p => p.id === productId);
    const discountedPrice = calculateDiscountedPrice(product.price, product.discountPercentage);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ //inserisce un nuovo prodotto nell'array globale "cart" (riga 2)
            id: product.id,
            title: product.title,
            price: discountedPrice, // Usando il prezzo scontato
            quantity: 1
        });
    }
    
    updateCartBadge(); // Aggiorna il badge del carrello (riga 175)
    showCartNotification(product.title); // Mostra una notifica "toast" (riga 181)
}

function updateCartBadge() {
    const badge = document.querySelector('.badge');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    badge.textContent = totalItems;
}


function showCartNotification(productTitle) {
    // Crea e mostra un toast Bootstrap temporaneo
    // Usa setTimeout per rimuovere il toast dopo 3 secondi
    // Docs: https://developer.mozilla.org/it/docs/Web/API/setTimeout
    
    const existingToast = document.querySelector('.toast');
    if (existingToast) { // Rimuovi toast precedenti (se presenti)
        existingToast.remove();
    }

    // Crea nuovo toast usando template literals (il toast è un elemento Bootstrap di notifica, la vedete in basso a destra quando aggiungete un prodotto al carrello)
    const toastHTML = `
        <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header">
                <strong class="me-auto">Carrello aggiornato</strong>
                <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
            </div>
            <div class="toast-body">
                ${productTitle} è stato aggiunto al carrello
            </div>
        </div>
    `;

    // Inserisci il toast nel DOM
    document.body.insertAdjacentHTML('beforeend', toastHTML);

    // Rimuovi il toast dopo 3 secondi
    setTimeout(() => {
        const toast = document.querySelector('.toast');
        if (toast) {
            toast.remove();
        }
    }, 3000);
}

function updateCartModal() {
    // Aggiorna il contenuto del modal del carrello
    // Calcola i subtotali e il totale complessivo
    // Mostra pulsanti per rimuovere articoli
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    cartItems.innerHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        const subtotal = item.price * item.quantity;
        total += subtotal;
        
        cartItems.innerHTML += `
            <div class="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <h6>${item.title}</h6>
                    <small>Quantità: ${item.quantity} x €${item.price.toFixed(2)}</small>
                </div>
                <div>
                    <span class="me-3">€${subtotal.toFixed(2)}</span>
                    <button class="btn btn-sm btn-danger" onclick="removeFromCart(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    });
    
    cartTotal.textContent = total.toFixed(2);
}

function removeFromCart(productId) {
    // Rimuove un prodotto dal carrello usando .filter()
    // Docs: https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
    cart = cart.filter(item => item.id !== productId);
    updateCartBadge();
    updateCartModal();
}

function initializeEvents() {
    // Evento click sul pulsante del carrello
    document.querySelector('.btn-outline-dark').addEventListener('click', function() {
        updateCartModal();
        new bootstrap.Modal(document.getElementById('cartModal')).show();
    });
}