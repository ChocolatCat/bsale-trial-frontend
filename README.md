# bsale-trial-frontend
## Demo
Hay un demo disponible en https://chocolatcat.github.io/bsale-trial-frontend/index.html
## Tecnologías usadas
* ECMAScript
* Fetch API
* [Bulma](https://bulma.io/)
## Workflow
Todas las rutas se consumen utilizando la Fetch API de Javascript. Esto se hace de forma asincrona para no bloquear el hilo principal del sitio. Esto tambien usa la API de Promesas de Javascript.
```
const response = await fetch('url de la api', {
  method: 'METODO API'
}).then((resp)=> resp.json()).then(()=>{
  //Logica
}).catch((err) => console.log(err));
```
Los elementos son cargados de forma dinamica al elegir una categoria. "TODOS" carga todos los productos en la BD.
Cada categoria se carga de forma dinamica en una tab-bar hecha con Bulma. Al clickear una, se remueven los elementos cargados anteriormente y luego se cargan los elementos de la categoría deseada, usando la API de backend.
Los elementos se benefician de Flexbox y Bulma para que se muestren de forma ordenada y responsiva. 
Todos los elementos se generan de forma programatica y se agregan al DOM para mostrarlos.
