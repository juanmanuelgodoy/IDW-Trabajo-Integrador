let modalServicio, botonGuardarServicio;
let nombreServicio, precioServicio, descripcionServicio;
let tablaBodyServicio;
let modoEdicionServicio = false;
let indexEdicionServicio = null;
let servicios = JSON.parse(localStorage.getItem('servicios')) || [];

document.addEventListener('DOMContentLoaded', function () {
    modalServicio = bootstrap.Modal.getOrCreateInstance(document.getElementById('nuevoServicioModal'));
    botonGuardarServicio = document.getElementById('btnGuardarServicio');
    nombreServicio = document.getElementById('nombreServicio');
    precioServicio = document.getElementById('precioServicio');
    descripcionServicio = document.getElementById('descripcionServicio');
    tablaBodyServicio = document.getElementById('tablaServiciosBody');

    botonGuardarServicio.addEventListener('click', guardarServicio);

    renderizarServicios();
});

function renderizarServicios() {
    tablaBodyServicio.innerHTML = '';

    servicios.forEach((servicio, index) => {
        const fila = document.createElement('tr');

        fila.innerHTML = `
            <th scope="row">${index + 1}</th>
            <td>${servicio.nombreServicio}</td>
            <td>$${new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(servicio.precioServicio)}</td>
            <td>${servicio.descripcionServicio}</td>
            <td>
                <button class="btn btn-sm btn-primary editarServicio-btn" data-index="${index}">Editar</button>
                <button class="btn btn-sm btn-danger eliminarServicio-btn" data-index="${index}">Eliminar</button>
            </td>
        `;
        tablaBodyServicio.appendChild(fila);
    });

    document.querySelectorAll('.eliminarServicio-btn').forEach(btn =>
        btn.addEventListener('click', eliminarServicio)
    );

    document.querySelectorAll('.editarServicio-btn').forEach(btn =>
        btn.addEventListener('click', editarServicio)
    );
}

function guardarServicio() {
    const nombre = nombreServicio.value.trim();
    const descripcion = descripcionServicio.value.trim();
    const precio = parseFloat(
        precioServicio.value.replace(/\./g, '').replace(',', '.').trim()
    );

    if (!nombre || isNaN(precio) || !descripcion) {
        alert('Por favor, completá todos los campos correctamente.');
        return;
    }

    const datos = { nombreServicio: nombre, precioServicio: precio, descripcionServicio: descripcion };

    if (modoEdicionServicio && indexEdicionServicio !== null) {
        servicios[indexEdicionServicio] = datos;
        alert('¡Servicio actualizado correctamente!');
    } else {
        servicios.push(datos);
        alert('¡Muy bien! servicio guardado correctamente!');
    }

    localStorage.setItem('servicios', JSON.stringify(servicios));
    renderizarServicios();
    limpiarFormulario();
    modalServicio.hide();
}

function editarServicio(event) {
    const index = parseInt(event.target.getAttribute('data-index'));
    const servicio = servicios[index];

    nombreServicio.value = servicio.nombreServicio;
    precioServicio.value = servicio.precioServicio.toString().replace('.', ',');
    descripcionServicio.value = servicio.descripcionServicio;

    botonGuardarServicio.textContent = 'Actualizar';
    modoEdicionServicio = true;
    indexEdicionServicio = index;
    modalServicio.show();
}

function eliminarServicio(event) {
    const index = parseInt(event.target.getAttribute('data-index'));
    if (confirm('¿Estás seguro de que deseas eliminar este servicio?')) {
        servicios.splice(index, 1);
        localStorage.setItem('servicios', JSON.stringify(servicios));
        renderizarServicios();
    }
}

function limpiarFormulario() {
    nombreServicio.value = '';
    precioServicio.value = '';
    descripcionServicio.value = '';
    modoEdicionServicio = false;
    indexEdicionServicio = null;
    botonGuardarServicio.textContent = 'Guardar';
}

