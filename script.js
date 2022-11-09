document.addEventListener("DOMContentLoaded", () => {
    setCategories();
    document.getElementById('busqueda-button').addEventListener('click', () => {
        let busqueda = document.getElementById('busqueda-input').value;
        searchProducts(busqueda, 1);
    });
});

//API routes
const SEARCH = "https://bsale-trial-backend-production.up.railway.app/api/products/search";
const FILTER = 'https://bsale-trial-backend-production.up.railway.app/api/products/filter/';
const FETCH = 'https://bsale-trial-backend-production.up.railway.app/api/products';
const CATEGORIES = 'https://bsale-trial-backend-production.up.railway.app/api/categories';

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

function createPagination(route, elements, id = 0){
    let paginator = document.getElementById('pagination-list');
    paginator.innerHTML = '';
    for(let i=0;i<elements / 9;i++){
        let li = createNode('li');
        let a = createNode('a');
        a.classList.add('pagination-link');
        a.innerText = i+1;
        switch(route){
            case 'SEARCH':
                let busqueda = document.getElementById('busqueda-input').value;
                a.onclick = () => searchProducts(busqueda, i+1);
                break;
            case 'FETCH':
                a.onclick = () => fetchProducts(i+1);
                break;
            case 'FILTER':
                a.onclick = () => fetchCategory(id, i+1);
                break;
        }
        append(li, a);
        append(paginator, li);
    }
}

async function searchProducts(text, page = 0){
    let button = document.getElementById('busqueda-button');
    button.disabled = true;
    //Conectamos al backend
    const response = await fetch(`${SEARCH}?name=${text}${page > 0 ? '&page=' + page : ''}`, {
        method: 'GET'
    //procesamos la respuesta
    }).then((resp)=> resp.json()).then(({data, count})=>{
        button.disabled = false;
        const products = document.getElementById('productos');
        products.innerHTML = '';
        if(data.length > 0){
            data.map((producto) => {
                let container = createNode('div');
                container.classList.add('column', 'is-one-third-desktop', 'is-half-tablet', 'is-full-mobile');
                container.innerHTML = createProduct(producto.name, producto.price, producto.url_image);
                append(products, container);
            });
            createPagination('SEARCH', count);
        }else{
            let container = createNode('div');
            container.classList.add('is-centered', 'is-flex');
            container.innerHTML = '<p class="title">No se encontraron productos.</p>';
            append(products, container);
        }
    //bloque de error
    }).catch((err)=>{
        console.log(err);
    });
}

async function fetchCategory(id, page = 0){
    //Conectamos al backend
    const response = await fetch(`${FILTER}${id}${page > 0 ? '?page=' + page : ''}`, {
        method: 'GET'
    //procesamos la respuesta
    }).then((resp)=> resp.json()).then(({data, count})=>{
        const products = document.getElementById('productos');
        products.innerHTML = '';
        data.map((producto) => {
            let container = createNode('div');
            container.classList.add('column', 'is-one-third-desktop', 'is-half-tablet', 'is-full-mobile');
            container.innerHTML = createProduct(producto.name, producto.price, producto.url_image);
            append(products, container);
        });
        createPagination('FILTER', count, id);
    //bloque de error
    }).catch((err)=>{
        console.log(err);
    });
}

//Nos entrega la lista completa de productos
async function fetchProducts(page = 0){
    //Conectamos al backend
    const response = await fetch(`${FETCH}${page > 0 ? '?page=' + page : ''}`, {
        method: 'GET'
    //procesamos la respuesta
    }).then((resp)=> resp.json()).then(({data, count})=>{
        const products = document.getElementById('productos');
        products.innerHTML = '';
        data.map((producto) => {
            let container = createNode('div');
            container.classList.add('column', 'is-one-third-desktop', 'is-half-tablet', 'is-full-mobile');
            container.innerHTML = createProduct(producto.name, producto.price, producto.url_image);
            append(products, container);
        });
        createPagination('FETCH', count);
    //bloque de error
    }).catch((err)=>{
        console.log(err);
    });
}


//Agrega las categorias para navegar los productos
async function setCategories(){
    //Conectamos al backend
    const response = await fetch(`${CATEGORIES}`, {
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
            a.onclick = () => fetchCategory(cat.id, 1);
            append(li, a);
            append(ul, li);
        });
    //bloque de error
    }).catch((err)=>{
        console.log(err);
    });
}