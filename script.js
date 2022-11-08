document.addEventListener("DOMContentLoaded", () => {
    addCategories();
});

//Funcion conveniente para crear elementos dependiendo de la etiqueta
function createNode(element) {
	return document.createElement(element);
}

//Function conveniente para agregar hijos al padre indicado
function append(parent, el) {
	return parent.appendChild(el);
}

function createProduct(name, price, url_image){
    let image_url = url_image != '' ? url_image : 'img/no-image.jpg';
    return `<div class="tile is-parent">
            <article class="tile is-child notification is-info">
                <p class="title is-5">${name}</p>
                <p class="subtitle is-6">$ ${price}</p>
                <figure class="image">
                    <img class="product-image" src="${image_url}">
                </figure>
            </article>
        </div>`;
}

async function fetchCategory(id){
    //Conectamos al backend
    const response = await fetch(`https://bsale-trial-backend-production.up.railway.app/api/products/filter/${id}`, {
        method: 'GET'
    //procesamos la respuesta
    }).then((resp)=> resp.json()).then(({data})=>{
        const products = document.getElementById('productos');
        products.innerHTML = '';
        data.map((producto) => {
            let container = createNode('div');
            container.classList.add('column', 'is-one-third-desktop', 'is-half-tablet', 'is-full-mobile');
            container.innerHTML = createProduct(producto.name, producto.price, producto.url_image);
            append(products, container);
        });
    //bloque de error
    }).catch((err)=>{
        console.log(err);
    });
}

//Nos entrega la lista completa de productos
async function fetchProducts(){
    //Conectamos al backend
    const response = await fetch('https://bsale-trial-backend-production.up.railway.app/api/products', {
        method: 'GET'
    //procesamos la respuesta
    }).then((resp)=> resp.json()).then(({data})=>{
        const products = document.getElementById('productos');
        products.innerHTML = '';
        data.map((producto) => {
            let container = createNode('div');
            container.classList.add('column', 'is-one-third-desktop', 'is-half-tablet', 'is-full-mobile');
            container.innerHTML = createProduct(producto.name, producto.price, producto.url_image);
            append(products, container);
        });
    //bloque de error
    }).catch((err)=>{
        console.log(err);
    });
}


//Agrega las categorias para navegar los productos
async function addCategories(){
    //Conectamos al backend
    const response = await fetch('https://bsale-trial-backend-production.up.railway.app/api/categories', {
        method: 'GET'
    //procesamos la respuesta
    }).then((resp)=> resp.json()).then(({data})=>{
        //obtenemos el padre de la lista de categorias
        const ul = document.getElementById('categorias');
        //Agregamos una a una cada categoria recibida por el backend
        data.map((cat)=>{
            let li = createNode('li');
            let a = createNode('a');
            a.innerText = cat.name.toUpperCase();
            a.onclick = () => fetchCategory(cat.id);
            append(li, a);
            append(ul, li);
        });
    //bloque de error
    }).catch((err)=>{
        console.log(err);
    });
}