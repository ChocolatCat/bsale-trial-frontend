//Esperamos a que cargue el documento
document.addEventListener("DOMContentLoaded", () => {
    //Ejecutamos el fetch a las categorias
    setCategories();
    //Configuramos el boton de busqueda
    document.getElementById('busqueda-button').addEventListener('click', () => {
        //Buscamos el texto de la caja y ejecutamos la busqueda
        let busqueda = document.getElementById('busqueda-input').value;
        searchProducts(busqueda, 1);
    });
    //Y el pulsar enter para buscar
    document.getElementById('busqueda-input').addEventListener('keypress', (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            document.getElementById('busqueda-button').click();
        }
    });
});

//API routes - Las declaramos para poder modificarlas mas facilmente
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

//Creamos cada elemento que se deba agregar dinamicamente
function createProduct(name, price, url_image, discount){
    //Si el producto no tiene imagen, cargamos un placeholder
    let image_url = url_image != '' ? url_image : 'img/no-image.jpg';
    //Procesamos el precio para mostrar los descuentos si es necesario
    let priceString = discount > 0 ? `<span class="strikethrough">$ ${price}</span> <span class="has-text-primary has-text-weight-bold">$ ${Math.round(price - (price * (discount / 100)))}</span>` : `<span class="has-text-weight-bold">$ ${price}</span>`;
    //Devolvemos el elemento creado
    return `<div class="tile is-parent">
            <article class="tile is-child notification is-info">
                <p class="title is-5">${name}</p>
                <p class="subtitle is-6">${priceString}</p>
                <figure class="image">
                    <img class="product-image" src="${image_url}">
                </figure>
            </article>
        </div>`;
}

//Funcion para crear dinamicamente el paginamiento
function createPagination(route, elements, id = 0){
    //Buscamos y limpiamos el paginador para trabajar con el.
    let paginator = document.getElementById('pagination-list');
    paginator.innerHTML = '';
    //Mostramos hasta 9 elementos por pagina
    for(let i=0;i<elements / 9;i++){
        //Creamos cada item del paginador
        let li = createNode('li');
        let a = createNode('a');
        a.classList.add('pagination-link');
        a.innerText = i+1;
        //Este switch asigna la funcion a usar dependiendo de que API estemos usando
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
        //Agregamos los elementos al DOM
        append(li, a);
        append(paginator, li);
    }
}

//Funcion que consume la API de busqueda
async function searchProducts(text, page = 0){
    //Deshabilitamos el boton para que no se generen consultas a lo loco
    let button = document.getElementById('busqueda-button');
    button.disabled = true;
    //Conectamos al backend
    const response = await fetch(`${SEARCH}?name=${text}${page > 0 ? '&page=' + page : ''}`, {
        method: 'GET'
    //procesamos la respuesta
    }).then((resp)=> resp.json()).then(({data, count})=>{
        //Rehabilitamos el boton
        button.disabled = false;
        //Buscamos el contenedor de los productos
        let products = document.getElementById('productos');
        products.innerHTML = '';
        //Si encontramos algun producto, procesamos los datos. Si no, mostramos un mensaje al usuario
        if(data.length > 0){
            data.map((producto) => {
                //Creamos un nodo que contenga el producto
                let container = createNode('div');
                container.classList.add('column', 'is-one-third-desktop', 'is-half-tablet', 'is-full-mobile');
                container.innerHTML = createProduct(producto.name, producto.price, producto.url_image, producto.discount);
                //Y lo agregamos al contenedor
                append(products, container);
            });
            //Creamos la paginacion con la funcion correspondiente. Le enviamos el numero total de productos que calzan con la busqueda
            createPagination('SEARCH', count);
        }else{
            //Mostramos un mensaje de que no se encuentran productos
            let container = createNode('div');
            container.classList.add('is-centered', 'columns');
            container.innerHTML = '<p class="title is-centered">No se encontraron productos.</p>';
            //Buscamos al paginador y lo limpiamos
            let paginator = document.getElementById('pagination-list');
            paginator.innerHTML = '';
            append(products, container);
        }
    //bloque de error
    }).catch((err)=>{
        console.log(err);
    });
}

//Funcion que consume la API de busqueda filtrada de productos, por categoria.
async function fetchCategory(id, page = 0){
    //Conectamos al backend
    const response = await fetch(`${FILTER}${id}${page > 0 ? '?page=' + page : ''}`, {
        method: 'GET'
    //procesamos la respuesta
    }).then((resp)=> resp.json()).then(({data, count})=>{
        //Buscamos el contenedor de los productos y lo limpiamos
        const products = document.getElementById('productos');
        products.innerHTML = '';
        data.map((producto) => {
            //Creamos un nodo por producto y lo agregamos al contenedor
            let container = createNode('div');
            container.classList.add('column', 'is-one-third-desktop', 'is-half-tablet', 'is-full-mobile');
            container.innerHTML = createProduct(producto.name, producto.price, producto.url_image, producto.discount);
            append(products, container);
        });
        //Generamos la paginacion correspondiente
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
        //Buscamos el contenedor de productos y lo limpiamos
        const products = document.getElementById('productos');
        products.innerHTML = '';
        data.map((producto) => {
            //Creamos cada producto y lo agregamos al contenedor
            let container = createNode('div');
            container.classList.add('column', 'is-one-third-desktop', 'is-half-tablet', 'is-full-mobile');
            container.innerHTML = createProduct(producto.name, producto.price, producto.url_image, producto.discount);
            append(products, container);
        });
        //Creamos la paginacion correspondiente
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