const products = [
    {
        id: 1,
        name: "Wireless Headphones",
        category: "Electronics",
        price: 1999,
        image: "https://via.placeholder.com/400x250?text=Headphones"
    },
    {
        id: 2,
        name: "Smart Watch",
        category: "Electronics",
        price: 2999,
        image: "https://via.placeholder.com/400x250?text=Smart+Watch"
    },
    {
        id: 3,
        name: "Cotton T-Shirt",
        category: "Clothing",
        price: 799,
        image: "https://via.placeholder.com/400x250?text=T-Shirt"
    },
    {
        id: 4,
        name: "Denim Jacket",
        category: "Clothing",
        price: 1999,
        image: "https://via.placeholder.com/400x250?text=Jacket"
    },
    {
        id: 5,
        name: "Running Shoes",
        category: "Shoes",
        price: 2499,
        image: "https://via.placeholder.com/400x250?text=Shoes"
    },
    {
        id: 6,
        name: "Casual Sneakers",
        category: "Shoes",
        price: 1799,
        image: "https://via.placeholder.com/400x250?text=Sneakers"
    },
    {
        id: 7,
        name: "Leather Wallet",
        category: "Accessories",
        price: 999,
        image: "https://via.placeholder.com/400x250?text=Wallet"
    },
    {
        id: 8,
        name: "Travel Backpack",
        category: "Accessories",
        price: 1499,
        image: "https://via.placeholder.com/400x250?text=Backpack"
    }
];




const productContainer = document.getElementById("productContainer");
const emptyProducts = document.getElementById("emptyProducts");

const searchInput = document.getElementById("search");
const categorySelect = document.getElementById("category");
const priceInput = document.getElementById("price");
const sortSelect = document.getElementById("sort");

const clearFiltersButton = document.getElementById("clearFilters");

const cartContainer = document.getElementById("cartContainer");
const emptyCartMessage = document.getElementById("emptyCartMessage");
const cartSummary = document.getElementById("cartSummary");

const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");

const emptyCartButton = document.getElementById("emptyCart");
const cartButton = document.getElementById("cartBtn");
const cartSection = document.getElementById("cartSection");

const resultCount = document.getElementById("resultCount");




let cart = JSON.parse(localStorage.getItem("productCart")) || [];




function saveCart() {
    localStorage.setItem("productCart", JSON.stringify(cart));
}




function renderProducts(productList) {

    productContainer.innerHTML = "";

    resultCount.textContent =
        `${productList.length} product(s) found`;

    if (productList.length === 0) {

        emptyProducts.classList.remove("hidden");

        return;
    }

    emptyProducts.classList.add("hidden");

    productList.forEach(product => {

        const card = document.createElement("article");

        card.className = "product-card";

        card.innerHTML = `
            <img
                src="${product.image}"
                alt="${product.name}"
                class="product-image"
            >

            <div class="product-info">

                <span class="product-category">
                    ${product.category}
                </span>

                <h3 class="product-name">
                    ${product.name}
                </h3>

                <p class="product-price">
                    ₹${product.price.toFixed(2)}
                </p>

                <button
                    class="add-cart"
                    data-id="${product.id}"
                >
                    Add to Cart
                </button>

            </div>
        `;

        productContainer.appendChild(card);
    });
}




function filterProducts() {

    const searchText =
        searchInput.value.toLowerCase().trim();

    const category =
        categorySelect.value;

    const maxPrice =
        Number(priceInput.value);

    const sortValue =
        sortSelect.value;


    let filteredProducts = products.filter(product => {

        const matchesSearch =
            product.name.toLowerCase().includes(searchText);

        const matchesCategory =
            category === "all" ||
            product.category === category;

        const matchesPrice =
            !priceInput.value ||
            product.price <= maxPrice;

        return (
            matchesSearch &&
            matchesCategory &&
            matchesPrice
        );
    });


   

    if (sortValue === "low-high") {

        filteredProducts.sort(
            (a, b) => a.price - b.price
        );

    } else if (sortValue === "high-low") {

        filteredProducts.sort(
            (a, b) => b.price - a.price
        );

    } else if (sortValue === "name-a-z") {

        filteredProducts.sort(
            (a, b) =>
                a.name.localeCompare(b.name)
        );

    } else if (sortValue === "name-z-a") {

        filteredProducts.sort(
            (a, b) =>
                b.name.localeCompare(a.name)
        );
    }


    renderProducts(filteredProducts);
}




function addToCart(productId) {

    const product =
        products.find(p => p.id === productId);

    if (!product) {
        return;
    }


    const existingProduct =
        cart.find(item => item.id === productId);


    if (existingProduct) {

        existingProduct.quantity++;

    } else {

        cart.push({
            ...product,
            quantity: 1
        });

    }


    saveCart();

    renderCart();

    alert(`${product.name} added to cart!`);
}




function changeQuantity(productId, change) {

    const item =
        cart.find(product => product.id === productId);

    if (!item) {
        return;
    }

    item.quantity += change;


    if (item.quantity <= 0) {

        cart =
            cart.filter(product => product.id !== productId);
    }


    saveCart();

    renderCart();
}




function removeFromCart(productId) {

    cart =
        cart.filter(product => product.id !== productId);

    saveCart();

    renderCart();
}




function emptyCart() {

    if (cart.length === 0) {
        return;
    }


    const confirmEmpty =
        confirm("Are you sure you want to empty the cart?");


    if (confirmEmpty) {

        cart = [];

        saveCart();

        renderCart();
    }
}




function calculateCartTotal() {

    return cart.reduce(
        (total, item) =>
            total + item.price * item.quantity,
        0
    );
}




function renderCart() {

    cartContainer.innerHTML = "";


    if (cart.length === 0) {

        emptyCartMessage.classList.remove("hidden");

        cartSummary.classList.add("hidden");

        cartCount.textContent = "0";

        return;
    }


    emptyCartMessage.classList.add("hidden");

    cartSummary.classList.remove("hidden");


    let totalItems = 0;


    cart.forEach(item => {

        totalItems += item.quantity;


        const cartItem =
            document.createElement("article");

        cartItem.className = "cart-item";


        cartItem.innerHTML = `

            <div class="cart-item-info">

                <h3>${item.name}</h3>

                <p>
                    ₹${item.price.toFixed(2)}
                    ×
                    ${item.quantity}
                </p>

            </div>


            <div class="quantity-controls">

                <button
                    class="quantity-minus"
                    data-id="${item.id}"
                >
                    −
                </button>

                <strong>
                    ${item.quantity}
                </strong>

                <button
                    class="quantity-plus"
                    data-id="${item.id}"
                >
                    +
                </button>

                <button
                    class="remove-button"
                    data-id="${item.id}"
                >
                    Remove
                </button>

            </div>

        `;


        cartContainer.appendChild(cartItem);
    });


    cartCount.textContent = totalItems;


    cartTotal.textContent =
        calculateCartTotal().toFixed(2);
}




productContainer.addEventListener(
    "click",
    function (event) {

        if (
            event.target.classList.contains("add-cart")
        ) {

            const productId =
                Number(event.target.dataset.id);

            addToCart(productId);
        }
    }
);




cartContainer.addEventListener(
    "click",
    function (event) {

        const productId =
            Number(event.target.dataset.id);


        if (
            event.target.classList.contains(
                "quantity-minus"
            )
        ) {

            changeQuantity(productId, -1);
        }


        if (
            event.target.classList.contains(
                "quantity-plus"
            )
        ) {

            changeQuantity(productId, 1);
        }


        if (
            event.target.classList.contains(
                "remove-button"
            )
        ) {

            removeFromCart(productId);
        }

    }
);




searchInput.addEventListener(
    "input",
    filterProducts
);




categorySelect.addEventListener(
    "change",
    filterProducts
);




priceInput.addEventListener(
    "input",
    filterProducts
);




sortSelect.addEventListener(
    "change",
    filterProducts
);




clearFiltersButton.addEventListener(
    "click",
    function () {

        searchInput.value = "";

        categorySelect.value = "all";

        priceInput.value = "";

        sortSelect.value = "default";

        filterProducts();
    }
);



emptyCartButton.addEventListener(
    "click",
    emptyCart
);




cartButton.addEventListener(
    "click",
    function () {

        cartSection.scrollIntoView({
            behavior: "smooth"
        });

    }
);




renderProducts(products);

renderCart();