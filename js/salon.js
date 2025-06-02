let modal, botonGuardar;
let nombre, direccion, descripcion, precio;
let tablaBody;
let modoEdicion = false;
let indexEdicion = null;
let salones = JSON.parse(localStorage.getItem('salones')) || [];
document.addEventListener('DOMContentLoaded', function () {
    modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('nuevoSalonModal'));
    botonGuardar = document.getElementById('btnGuardarSalon');
    nombre = document.getElementById('nombreSalon');
    direccion = document.getElementById('direccionSalon');
    descripcion = document.getElementById('descripcionSalon');
    precio = document.getElementById('precioSalon');
    tablaBody = document.querySelector('section:last-of-type table tbody');

    botonGuardar.addEventListener('click', guardarSalon);

    renderizarSalones();
});

function renderizarSalones() {
    const tablaBody = document.getElementById('tablaSalonesBody');
    tablaBody.innerHTML = '';

    salones.forEach((salon, index) => {
        const fila = document.createElement('tr');

        fila.innerHTML = `
            <th scope="row">${index + 1}</th>
            <td>${salon.nombre}</td>
            <td>${salon.direccion}</td>
            <td>${salon.descripcion}</td>
            <td>$${new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(salon.precio)}</td>
            <td>
                <button class="btn btn-sm btn-primary editarSalon-btn" data-index="${index}">Editar</button>
                <button class="btn btn-sm btn-danger eliminarSalon-btn" data-index="${index}">Eliminar</button>
            </td>
        `;
        tablaBody.appendChild(fila);
    });

    document.querySelectorAll('.eliminarSalon-btn').forEach(btn => btn.addEventListener('click', eliminarSalon));

    document.querySelectorAll('.editarSalon-btn').forEach(btn => btn.addEventListener('click', editarSalon));
}

function guardarSalon() {
    const datosSalon = {
        nombre: nombre.value.trim(),
        direccion: direccion.value.trim(),
        descripcion: descripcion.value.trim(),
        precio: parseFloat(precio.value.replace(/\./g, '').replace(',', '.').trim())
    };

    if (modoEdicion) {
        salones[indexEdicion] = datosSalon;
        modoEdicion = false;
        indexEdicion = null;
        botonGuardar.textContent = 'Guardar';
    } else {
        salones.push(datosSalon);
    }

    localStorage.setItem('salones', JSON.stringify(salones));
    renderizarSalones();
    alert('¡Muy bien! Salón guardado correctamente!');

    limpiarFormulario();
    modal.hide();
}


function editarSalon(event) {
    const index = event.target.getAttribute('data-index');
    const salon = salones[index];

    nombre.value = salon.nombre;
    direccion.value = salon.direccion;
    descripcion.value = salon.descripcion;
    precio.value = salon.precio.toString().replace('.', ',');

    botonGuardar.textContent = 'Actualizar';
    modoEdicion = true;
    indexEdicion = index;

    modal.show();
}


function actualizarSalon(index) {

    salones[index] = {
        nombre: nombre.value.trim(),
        direccion: direccion.value.trim(),
        descripcion: descripcion.value.trim(),
        precio: parseFloat(precio.value.replace('.', '').replace(',', '.').trim())
    };

    localStorage.setItem('salones', JSON.stringify(salones));
    renderizarSalones();
    alert('¡Salon actualizado correctamente!');

    botonGuardar.textContent = 'Guardar';
    botonGuardar.onclick = guardarSalon;

    limpiarFormulario();
    modal.hide();
}

function eliminarSalon(event) {
    const index = event.target.getAttribute('data-index');
    if (confirm('¿Estás seguro de que deseas eliminar este salon?')) {
        salones.splice(index, 1);
        localStorage.setItem('salones', JSON.stringify(salones));
        renderizarSalones();
    }
}

function limpiarFormulario() {
    nombre.value = '';
    direccion.value = '';
    descripcion.value = '';
    precio.value = '';
    modoEdicion = false;
    indexEdicion = null;
    botonGuardar.textContent = 'Guardar';
}

