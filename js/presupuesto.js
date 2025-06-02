let modalPresupuesto, botonGuardarPresupuesto;
let apellidoPresupuesto, nombrePresupuesto, telefono, email, salon, precioPresupuesto;
let tablaBodyPresupuesto;
let modoEdicionPresupuesto = false;
let indexEdicionPresupuesto = null;
let presupuestos = JSON.parse(localStorage.getItem('presupuestos')) || [];

function cargarOpcionesSalones() {
    const salones = JSON.parse(localStorage.getItem('salones')) || [];
    salon.innerHTML = '<option selected disabled>Elegir...</option>';

    salones.forEach((s, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.text = s.nombre;
        salon.appendChild(option);
    });
}

document.addEventListener('DOMContentLoaded', function () {
    modalPresupuesto = bootstrap.Modal.getOrCreateInstance(document.getElementById('nuevoPresupuestoModal'));
    botonGuardarPresupuesto = document.getElementById('btnGuardarPresupuesto');
    apellidoPresupuesto = document.getElementById('apellidoPresu');
    nombrePresupuesto = document.getElementById('nombrePresu');
    telefono = document.getElementById('telefonoPresu');
    email = document.getElementById('emailPresu');
    salon = document.getElementById('salonPresu');
    precioPresupuesto = document.getElementById('precioPresu');
    tablaBodyPresupuesto = document.querySelector('section:last-of-type table tbody');

    botonGuardarPresupuesto.addEventListener('click', guardarPresupuesto);
    salon.addEventListener('change', actualizarPrecioSalon);

    cargarOpcionesSalones();
    renderizarPresupuestos();
});

function actualizarPrecioSalon() {
    const salones = JSON.parse(localStorage.getItem('salones')) || [];
    const selected = salon.value;
    if (salones[selected]) {
        precioPresupuesto.value = salones[selected].precio;
    } else {
        precioPresupuesto.value = '';
    }
}

function renderizarPresupuestos() {
    const tablaBodyPresupuesto = document.getElementById('tablaPresupuestosBody');
    tablaBodyPresupuesto.innerHTML = '';

    presupuestos.forEach((presu, index) => {
        const fila = document.createElement('tr');

        fila.innerHTML = `
            <th scope="row">${index + 1}</th>
            <td>${presu.apellidoPresupuesto}, ${presu.nombrePresupuesto}</td>
            <td>${presu.telefono}</td>
            <td>${presu.email}</td>
            <td>${presu.salon.nombre}</td>
            <td>$${new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(presu.precioPresupuesto)}</td>
            <td>
                <button class="btn btn-sm btn-primary editarPresupuesto-btn" data-index="${index}">Editar</button>
                <button class="btn btn-sm btn-danger eliminarPresupuesto-btn" data-index="${index}">Eliminar</button>
            </td>
        `;
        tablaBodyPresupuesto.appendChild(fila);
    });

    document.querySelectorAll('.eliminarPresupuesto-btn').forEach(btn =>
        btn.addEventListener('click', eliminarPresupuesto)
    );

    document.querySelectorAll('.editarPresupuesto-btn').forEach(btn =>
        btn.addEventListener('click', editarPresupuesto)
    );
}

function guardarPresupuesto() {
    const salones = JSON.parse(localStorage.getItem('salones')) || [];
    const selectedSalon = salones[salon.value];

    if (!selectedSalon) {
        alert('Debe seleccionar un salón válido.');
        return;
    }

    const datos = {
        apellidoPresupuesto: apellidoPresupuesto.value.trim(),
        nombrePresupuesto: nombrePresupuesto.value.trim(),
        telefono: telefono.value.trim(),
        email: email.value.trim(),
        salon: selectedSalon,
        precioPresupuesto: selectedSalon.precio
    };

    if (modoEdicionPresupuesto) {
        presupuestos[indexEdicionPresupuesto] = datos;
        alert('¡Presupuesto actualizado correctamente!');
    } else {
        presupuestos.push(datos);
        alert('¡Muy bien! Presupuesto guardado correctamente!');
    }

    localStorage.setItem('presupuestos', JSON.stringify(presupuestos));
    renderizarPresupuestos();

    limpiarFormulario();
    modalPresupuesto.hide();
}

function editarPresupuesto(event) {
    const index = event.target.getAttribute('data-index');
    const presupuesto = presupuestos[index];

    apellidoPresupuesto.value = presupuesto.apellidoPresupuesto;
    nombrePresupuesto.value = presupuesto.nombrePresupuesto;
    telefono.value = presupuesto.telefono;
    email.value = presupuesto.email;
    precioPresupuesto.value = presupuesto.precioPresupuesto;

    const salones = JSON.parse(localStorage.getItem('salones')) || [];
    for (let i = 0; i < salones.length; i++) {
        if (salones[i].nombre === presupuesto.salon.nombre) {
            salon.value = i;
            break;
        }
    }

    botonGuardarPresupuesto.textContent = 'Actualizar';
    modoEdicionPresupuesto = true;
    indexEdicionPresupuesto = index;
    modalPresupuesto.show();
}

function actualizarPresupuesto(index) {
    const salones = JSON.parse(localStorage.getItem('salones')) || [];
    const selectedSalon = salones[salon.value];

    presupuestos[index] = {
        apellidoPresupuesto: apellidoPresupuesto.value.trim(),
        nombrePresupuesto: nombrePresupuesto.value.trim(),
        telefono: telefono.value.trim(),
        email: email.value.trim(),
        salon: selectedSalon,
        precioPresupuesto: selectedSalon.precio
    };

    localStorage.setItem('presupuestos', JSON.stringify(presupuestos));
    renderizarPresupuestos();
    alert('¡Presupuesto actualizado correctamente!');

    botonGuardarPresupuesto.textContent = 'Guardar';
    botonGuardarPresupuesto.onclick = guardarPresupuesto;

    limpiarFormulario();
    modalPresupuesto.hide();
}

function eliminarPresupuesto(event) {
    const index = event.target.getAttribute('data-index');
    if (confirm('¿Estás seguro de que deseas eliminar este presupuesto?')) {
        presupuestos.splice(index, 1);
        localStorage.setItem('presupuestos', JSON.stringify(presupuestos));
        renderizarPresupuestos();
    }
}

function limpiarFormulario() {
    apellidoPresupuesto.value = '';
    nombrePresupuesto.value = '';
    telefono.value = '';
    email.value = '';
    salon.selectedIndex = 0;
    precioPresupuesto.value = '';
    modoEdicionPresupuesto = false;
    indexEdicionPresupuesto = null;
    botonGuardarPresupuesto.textContent = 'Guardar';
}
