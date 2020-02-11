// Variables
const carrito       = document.getElementById('carrito')
const cursos        = document.getElementById('lista-cursos')
const listaCursos   = document.querySelector('#lista-carrito tbody')
const vaciarCarritoBtn = document.getElementById('vaciar-carrito')
const totalPrecio = document.getElementById('total-precio')

// Listeners
cargarEventListeners()

function cargarEventListeners() {
    // Dispara cuando se presiona "Agregar carrito"
    cursos.addEventListener('click', comprarCurso)

    // Cuando se elimina un curso del carrito
    carrito.addEventListener('click', eliminarCurso)

    // Al vaciar el carrito
    vaciarCarritoBtn.addEventListener('click', vaciarCarrito)

    // Al cargar el documento, mostrar LocalStorage
    document.addEventListener('DOMContentLoaded', leerLocalStorage)
    
    // Calcular el total
    document.addEventListener('DOMContentLoaded', calcularTotal)
}


// Funciones

// Funcion que añade el curso al carrito
function comprarCurso(e) {
    e.preventDefault()
    // Delegation para agregar-carrito
    if (e.target.classList.contains('agregar-carrito')) {
        const curso = e.target.parentElement.parentElement
        // Enviamos el curso seleccionado para tomar sus datos
        leerDatosCursos(curso)
    }
}

// Lee los datos del curso
function leerDatosCursos(curso) {
    const infoCurso = {
        imagen: curso.querySelector('img').src,
        titulo: curso.querySelector('h4').textContent,
        precio: curso.querySelector('.precio span').textContent,
        id: curso.querySelector('a').getAttribute('data-id')
    }

    insertarCarrito(infoCurso)
}

// Muestra el curso seleccionado en el carrito
function insertarCarrito(curso) {
    const row = document.createElement('tr')
    row.innerHTML = `
        <td>
            <img src="${curso.imagen}" width=100>
        </td>
        <td>${curso.titulo}</td>
        <td>${curso.precio}</td>
        <td>
            <a href="#" class="borrar-curso" data-id="${curso.id}">X</a>
        </td>
    `

    listaCursos.appendChild(row)

    guardarCursoLocalStorage(curso)
    calcularTotal()
}

//Elimina el curso sel carrito en el DOM
function eliminarCurso(e) {
    e.preventDefault()
    
    let curso, cursoId

    if (e.target.classList.contains('borrar-curso')) {
        e.target.parentElement.parentElement.remove()
        curso = e.target.parentElement.parentElement
        cursoId = curso.querySelector('a').getAttribute('data-id')
    }

    eliminarCursoLocalStorage(cursoId)
    calcularTotal()
}

// Elimina los cursos del carrito en el DOM y LS
function vaciarCarrito() {
    // Forma Lenta 
    // listaCursos.innerHTML = ''
    // Forma Rapida (recomendada)
    while (listaCursos.firstChild) {
        listaCursos.removeChild(listaCursos.firstChild)
    }

    // Vaciar el carrito en el Local Storage
    //localStorage.setItem('cursos', JSON.stringify([]))
    vaciarLocalStorage()
    calcularTotal()
    return false
}

// Almacena cursos en el carrito a Local Storage
function guardarCursoLocalStorage(curso) {
    let cursos

    // Toma el valor de un arreglo con datos de LS o vacio
    cursos = obtenerCursosLocalStorage()

    // EL curso seleccionado se agrega al arreglo
    cursos.push(curso);
    
    localStorage.setItem('cursos', JSON.stringify(cursos))

    
}

// Comprueba que haya elementos en local storage
function obtenerCursosLocalStorage() {
    let cursosLS

    if (localStorage.getItem('cursos') === null) {
        cursosLS = []
    } else {
        cursosLS = JSON.parse(localStorage.getItem('cursos')); 
    }

    return cursosLS
}

// Imprime los cursos de Local Storage en el carrito
function leerLocalStorage(){
    let cursosLS

    cursosLS = obtenerCursosLocalStorage()

    cursosLS.forEach((curso) => {
        // construir el template
        const row = document.createElement('tr')

        row.innerHTML = `
            <td>
                <img src="${curso.imagen}" width=100>
            </td>
            <td>${curso.titulo}</td>
            <td>${curso.precio}</td>
            <td>
                <a href="#" class="borrar-curso" data-id="${curso.id}">X</a>
            </td>
        `

        listaCursos.appendChild(row)
    });
    
}

// Elimina el curso por el ID en Local Storage
function eliminarCursoLocalStorage(curso) {
    let cursosLS
    // Obtenemos el arreglo de cursos
    cursosLS = obtenerCursosLocalStorage()
    // Iteramos comparando el ID del curso borrado con los del LS
    cursosLS.forEach((cursoLS, index) => {
        if (cursoLS.id === curso) {
            cursosLS.splice(index, 1)
        }
    });
    // Añadimos el arreglo actual a Local Storage
    localStorage.setItem('cursos', JSON.stringify(cursosLS))
}

function vaciarLocalStorage() {
    localStorage.clear()
}

// Calcular el precio total de todos los cursos en el carrito
function calcularTotal() {
    // Obtenemos el numero de elementos en el tbody
    const numeroCursos = document.querySelectorAll('#lista-carrito tbody tr')
    let total = 0;
    if (numeroCursos != null) {
        // Recorremos los elementos del carrito
        numeroCursos.forEach(curso => {
            // Obtenemos los precios de los elementes del carrito
            let preciosCursos = curso.children[2].innerHTML.slice(1, curso.children[2].innerHTML.length)
            // 
            total += Number(preciosCursos)
        });
        // Imprimimos el precio en el HTML
        totalPrecio.innerHTML = `
        <p></p>
                Total: $${total}
        `;
    }
    
    
}