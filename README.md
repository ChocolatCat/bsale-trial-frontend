# bsale-trial-frontend
## Objetivo
Consumir el [Backend](https://github.com/chocolatcat/bsale-trial-backend) para mostrar los datos proveídos por Bsale.
## Como utilizar.
Simplemente abrir `index.html` en tu navegador. El archivo `script.js` debe estar en la misma carpeta.
## Estructura
`index.html` es la pagina que nos mostrara los datos.  
`script.js` nos provee la funcionalidad para consumir el backend que se proporcionó.  
La carpeta `img` contiene una imagen para mostrar en caso de que un producto no tenga una imagen asignada.  
La carpeta `styles` tiene el CSS adicional del sitio.  
## Demo
Hay un demo disponible en https://chocolatcat.github.io/bsale-trial-frontend/
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
Como ultimo, todos los elementos que no tengan una imagen asignada son mostradas con una imagen indicando tal.
