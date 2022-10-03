//pre-entrega 2

//const
const cards = document.querySelector("#tarjetas");
const carro = document.querySelector("#carrito");
const total = document.querySelector("#totalCarritoDiv");
const formasPago = document.querySelector("#formasPago");
const card = document.querySelector(".card");



let carrito = JSON.parse(localStorage.getItem("carrito")) || []; 


//stock

/*const prendas = [

  {imagen : "remera-negra.jpg", nombre: "remera",precio: 2000, id:1},
  {imagen : "top rayado.jpg",nombre : "top rayas",precio: 3000, id:2},
  {imagen : "jeans.jpg",nombre : "jeans",precio: 10000,id: 3},
  {imagen : "campera de jeans.jpg",nombre : "campera de jeans",precio: 12000,id: 4},
  {imagen : "zapatillas cara.jpg",nombre : "zapatillas",precio: 20000, id:5},
  {imagen : "blazer rosa.jpg",nombre : "blazer de lino",precio: 20000, id: 6},

]*/

//FETCH
/*
const prendas = [];

fetch("./js/data.json")
.then(res=>res.json())
.then(data=>{
  data.forEach(el=>{
*/
// async await
const prendas = [];
const respuesta = async ()=>{

const response = await fetch ("./js/data.json");

const data = await response.json();
data.forEach(el=>{

  prendas.push(el);

})

hacerCards(data);

}
respuesta();


//pRODUCTOS (constructor)

function Productos(imagen, nombre, precio, id) {
    
  this.imagen = imagen;
  this.nombre = nombre;
  this.cantidad = cantidad;
  this.precio = parseInt(precio);
  this.id= id;
  
}


//modificar el DOM


function hacerCards(arrayConPrendas) {
  cards.innerHTML = "";
  arrayConPrendas.forEach(prenda => {
    let {imagen, nombre, precio,id} = prenda

    cards.innerHTML += `<article><div class="card p-3" style="width: 18rem;">
    <img src="/img/${imagen}" class="card-img-top" alt="...">
    <div class="card-body">
      <h5 class="">${nombre.toUpperCase()}</h5>
      <p class="">$${precio}</p>
      <button class="carrito btn btn-dark container" id="btn-agregar${id}">Comprar</button>

    </div></article> 
    `
    
  });
  botonComprar(arrayConPrendas); 
}

/* FUNCIONALIDAD DEL FILTRO */

const input = document.querySelector ("#ingreso");


function escucharInput (){
  input.addEventListener("input",()=>{
    hacerCards(prendas.filter(el=>el.nombre.includes(input.value.toLowerCase()))); 
  })
}

escucharInput();
// ver si lo dejamos o no 
const btnBuscar = document.querySelector("#btnBuscar");
function escucharBuscar (){
btnBuscar.addEventListener("click",()=>{
 
  hacerCards(prendas.filter(el=>el.nombre.includes(input.value.toLowerCase()))); 

  })
}
escucharBuscar();


// funcion comprar
function botonComprar(arrayConPrendas) {

  arrayConPrendas.forEach(prenda => {
     document.querySelector(`#btn-agregar${prenda.id}`).addEventListener("click",()=>{

      agregarCarrito(prenda);
    

     })
  });
  
}


//agregar al carrito

function agregarCarrito(prenda){

  let verificacion = carrito.some(prend=>prend.id === prenda.id);
  if(verificacion===false){
      prenda.cantidad = 1;
      carrito.push(prenda);
  }
  else{
      let prendFind = carrito.find(prend=> prend.id===prenda.id);
      prendFind.cantidad++;
  }
  console.log(carrito);
  mostrarCarrito();
  }

//Mostrar carrito

  function mostrarCarrito(){
    carro.innerHTML = "";
    carrito.forEach(prend=>{
      let {nombre, imagen, cantidad, id} =prend
      carro.innerHTML += ` <div class="container text-center">
      <div class="row">
     <div class="col">
     <h4 class="">${nombre}</h4>
     <img src="/img/${imagen}" alt="..." style="width: 4rem">
      </div>
      <div class="col">
      <p class="">Cantidad: ${cantidad}</p>
      </div>
      <div class="col">
      <button class="carrito btn btn-info" id="btn-borrarUno${id}">-</button>
      <button class="carrito btn btn-danger" id="btn-sumarUno${id}">+</button>
      </div>
      <div class="col">
      <p class="">$${prend.precio * prend.cantidad}</p>
      </div>
      <div class="col">
      <button class="carrito btn btn-secondary" id="btn-borrar${id}">X</button>
      </div>
      </div>
      </div>`
        
    })

    localStorage.setItem("carro",JSON.stringify(carrito))
    totalCarrito(); 
    borrarPrenda();
     borrarUno();
     sumarUno();
     vaciarCarrito();
     pagoEfectivo();
     pagoCredito();
     finalizarCompra();
   

}

//TOTAL CARRITO 

function totalCarrito() {
  let totalCarrito = carrito.reduce((acc, el) => acc + el.precio * el.cantidad,0)
    total.innerHTML = `<div>
    <h5>El total de su compra es $${totalCarrito}</h5> 
    </div> 
    `
    console.log(totalCarrito);
   
    localStorage.setItem('totalCarrito', JSON.stringify(totalCarrito))
}

//VACIAR CARRITO

function vaciarCarrito() {
  carrito.forEach(prenda=>{
    document.querySelector("#btnVaciar").addEventListener("click",()=>{
      Swal.fire({
        title: 'Estas seguro ?',
        text: "Estas por vaciar tu carrito !",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, vaciar !'
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire(
            'Eliminaste tu carrito !',
            'Te esperamos de nuevo. Gracias',
            'success',)
          let indice = carrito.findIndex(element=>element.id===prenda.id);
          carrito.splice(indice.cantidad,1);
          mostrarCarrito();
          
        }
      })
      
       
    })
   
})
}

// BORRAR POR GRUPO DE PRENDAS

function borrarPrenda(){
  carrito.forEach(prenda=>{
      document.querySelector(`#btn-borrar${prenda.id}`).addEventListener("click",()=>{
         let indice = carrito.findIndex(element=>element.id===prenda.id);
          carrito.splice(indice.cantidad,1);
          mostrarCarrito();
      })
  })
}



//funcion borrar de a una prenda

function borrarUno() {

  carrito.forEach(prenda=>{
    document.querySelector(`#btn-borrarUno${prenda.id}`).addEventListener("click",()=>{
      
      let verificacion = carrito.some(prend=>prend.id === prenda.id);
      let indicePrenda = carrito.indexOf(prenda);
       if(verificacion === true){
        if((carrito[indicePrenda].cantidad) > 0){

          carrito[indicePrenda].cantidad -- ;
        } 
        
       console.log(carrito[indicePrenda].cantidad);
       mostrarCarrito();
      
      }
        
       
    })
  })
  
}


//funcion sumar cantidad

function sumarUno() {

  carrito.forEach(prenda=>{
    document.querySelector(`#btn-sumarUno${prenda.id}`).addEventListener("click",()=>{
      
      let verificacion = carrito.some(prend=>prend.id === prenda.id);
      let indicePrenda = carrito.indexOf(prenda);
      if(verificacion === true){
         
        carrito[indicePrenda].cantidad ++ ;
       // console.log(carrito[indicePrenda].cantidad);
       
      
      }
        mostrarCarrito();
       
    })
  })
  
}

//hacerCards(prendas); 
mostrarCarrito();


//FINALIZAR COMPRA

function finalizarCompra() {
     document.querySelector("#btnFinalizarCompra").addEventListener("click", async ()=>{
      

  const { value: email } = await Swal.fire({
    title: 'Ingresa tu email, para continuar con tu compra ',
    input: 'email',
    inputLabel: 'Obtendrás mayor información sobre métodos de pago y envíos.',
    inputPlaceholder: 'nombre@gmail.com'
  })
  
  if (email) {
    Swal.fire(`Revisá tu correo: ${email}`)
  }

  })
   
}


// formas de pago 

const pago = document.createElement("p");

pago.innerText = "Selecciona la forma de pago:";

formasPago.append(pago);


// pagar con efectivo 

function pagoEfectivo() {
  document.querySelector("#flexRadioDefault1").addEventListener("change",()=>{

    let totalEfectivo = carrito.reduce((acc, el) => acc + el.precio * el.cantidad,0)
    total.innerHTML = `<div>
    <h5>El total de su compra es $${totalEfectivo}</h5> 
    </div> 
    `
    localStorage.setItem('totalEfectivo', JSON.stringify(totalEfectivo))

  })
}

// pagar con credito 

function pagoCredito() {
  document.querySelector("#flexRadioDefault2").addEventListener("change",()=>{

    card.classList.add("active");
    setTimeout(() => {
      card.classList.remove("active");

    }, 1500);

    let totalCredito = carrito.reduce((acc, el) => acc + el.precio * el.cantidad * 1.20,0)
    total.innerHTML = `<div>
    <h5>El total de su compra es $${totalCredito}</h5> 
    </div> 
    `

    localStorage.setItem('totalCredito', JSON.stringify(totalCredito))

  
  })
}

