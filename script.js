let modalQt = 1;
let cart = [];
let modalKey = 0;

const c = (el) => document.querySelector(el);
const cs = (el) => document.querySelectorAll(el);
const cid = (id) => document.getElementById(id);

// Adicionando as pizzas na tela.

pizzaJson.map((pizza, index) => {
    let pizzaItem = c(".models .pizza-item").cloneNode(true);

    pizzaItem.setAttribute("data-key", index);
    pizzaItem.querySelector(".pizza-item--img img").src = pizza.img;
    pizzaItem.querySelector(".pizza-item--name").innerHTML = pizza.name;
    pizzaItem.querySelector(".pizza-item--desc").innerHTML = pizza.description;
    pizzaItem.querySelector(
        ".pizza-item--price"
    ).innerHTML = `${pizza.price.toLocaleString("pt-br", {
        style: "currency",
        currency: "BRL",
    })}`;

    // Abrir Modal
    pizzaItem.querySelector("a").addEventListener("click", (e) => {
        e.preventDefault();

        let key = e.target.closest(".pizza-item").getAttribute("data-key");
        modalQt = 1;
        modalKey = key;
        let pizza = pizzaJson[key];

        c(".pizzaBig img").src = pizza.img;
        c(".pizzaInfo h1").innerHTML = pizza.name;
        c(".pizzaInfo--desc").innerHTML = pizza.description;
        c(".pizzaInfo--actualPrice").innerHTML = pizza.price.toLocaleString(
            "pt-br",
            {
                style: "currency",
                currency: "BRL",
            }
        );

        c(".pizzaInfo--size.selected").classList.remove("selected");
        cs(".pizzaInfo--size").forEach((size, sizeIndex) => {
            if (sizeIndex == 1) size.classList.add("selected");
            size.querySelector("span").innerHTML = pizza.sizes[sizeIndex];
        });

        c(".pizzaInfo--qt").innerHTML = modalQt;

        c(".pizzaWindowArea").style.opacity = 0;
        c(".pizzaWindowArea").style.display = "flex";
        setTimeout(() => {
            c(".pizzaWindowArea").style.opacity = 1;
        }, 200);
    });

    c(".pizza-area").appendChild(pizzaItem);
});

// Fechar modal
function closeModal() {
    c(".pizzaWindowArea").style.opacity = 0;
    setTimeout(() => {
        c(".pizzaWindowArea").style.display = "none";
    }, 200);
}

cs(".pizzaInfo--cancelButton").forEach((el) => {
    el.addEventListener("click", closeModal);
});

cs(".pizzaInfo--cancelMobileButton").forEach((el) => {
    el.addEventListener("click", closeModal);
});

// Evento para alterar quantidade

c(".pizzaInfo--qtmenos").addEventListener("click", (e) => {
    if (modalQt > 1) {
        modalQt--;
        c(".pizzaInfo--qt").innerHTML = modalQt;
    }
});

c(".pizzaInfo--qtmais").addEventListener("click", (e) => {
    modalQt++;
    c(".pizzaInfo--qt").innerHTML = modalQt;
});

// Evento para selecionar o SIZE

cs(".pizzaInfo--size").forEach((size, sizeIndex) => {
    size.addEventListener("click", (e) => {
        c(".pizzaInfo--size.selected").classList.remove("selected");
        size.classList.add("selected");
    });
});

// Evento para adicionar a pizza ao carrinho

c(".pizzaInfo--addButton").addEventListener("click", (e) => {
    let size = c(".pizzaInfo--size.selected").getAttribute("data-key");
    let identifier = pizzaJson[modalKey].id + "@" + size;

    let key = cart.findIndex((item) => item.identifier == identifier);

    if (key > -1) {
        cart[key].qt += modalQt;
    } else {
        cart.push({
            identifier: identifier,
            id: pizzaJson[modalKey].id,
            size,
            qt: modalQt,
        });
    }
    updateCart();
    closeModal();
});

c(".menu-openner").addEventListener("click", () => {
    if (cart.length > 0) {
        c("aside").style.left = "0";
    }
});

c(".menu-closer").addEventListener("click", () => {
    c("aside").style.left = "100vw";
});

function updateCart() {
    c(".menu-openner span").innerHTML = cart.length;

    if (cart.length > 0) {
        c("aside").classList.add("show");
        c(".cart").innerHTML = "";

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for (let i in cart) {
            let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id);
            subtotal += pizzaItem.price * cart[i].qt;
            let cartItem = c(".models .cart--item").cloneNode(true);

            let pizzaSizeName;
            switch (cart[i].size) {
                case 0:
                    pizzaSizeName = "P";
                    break;
                case 1:
                    pizzaSizeName = "M";
                    break;
                case 2:
                    pizzaSizeName = "G";
                    break;
                default:
                    pizzaSizeName = "P";
                    break;
            }

            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

            cartItem.querySelector("img").src = pizzaItem.img;
            cartItem.querySelector(".cart--item-nome").innerHTML = pizzaName;
            cartItem.querySelector(".cart--item--qt").innerHTML = cart[i].qt;

            cartItem
                .querySelector(".cart--item-qtmais")
                .addEventListener("click", (e) => {
                    cart[i].qt++;
                    updateCart();
                });

            cartItem
                .querySelector(".cart--item-qtmenos")
                .addEventListener("click", (e) => {
                    cart[i].qt--;
                    if (cart[i].qt < 1) {
                        cart.splice(i, 1);
                    }
                    updateCart();
                });

            c(".cart").append(cartItem);
        }

        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        c(".subtotal span:last-child").innerHTML = subtotal.toLocaleString(
            "pt-br",
            {
                style: "currency",
                currency: "BRL",
            }
        );
        c(".desconto span:last-child").innerHTML = desconto.toLocaleString(
            "pt-br",
            {
                style: "currency",
                currency: "BRL",
            }
        );
        c(".total span:last-child").innerHTML = total.toLocaleString("pt-br", {
            style: "currency",
            currency: "BRL",
        });
    } else {
        c("aside").classList.remove("show");
        c("aside").style.left = "100vw";
    }
}

c(".cart--finalizar").addEventListener("click", () => {
    alert("Pedido finalizado com sucesso!");
    cart = [];
    updateCart();
});
