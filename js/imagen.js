let imagenes = [];
let imagenSeleccionada = null;
let modoEdicionImagen = false;
let indexEdicionImagen = null;

document.addEventListener('DOMContentLoaded', function () {
    const nombreImagen = document.querySelector('#nuevoImagenModal input[aria-label="Nombre de la imagen"]');
    const archivoImagen = document.querySelector('#nuevoImagenModal input[type="file"]');
    const descripcionImagen = document.querySelector('#nuevoImagenModal input[aria-label="Descripción de la imagen"]');
    const tablaBody = document.querySelector('#nuevoImagenModal').closest('section').querySelector('table tbody');
    const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('nuevoImagenModal'));
    const botonGuardar = document.querySelector('#nuevoImagenModal .btn-primary');
    botonGuardar.addEventListener('click', guardarImagen);

    imagenes = JSON.parse(localStorage.getItem('imagenes')) || [];

    function renderizarImagenes() {
        tablaBody.innerHTML = '';
        imagenes.forEach((img, index) => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
            <th scope="row">${index + 1}</th>
            <td>${img.nombre}</td>
            <td><img src="${img.url}" alt="imagen" style="max-width: 150px;" class="img-fluid"></td>
            <td>${img.descripcion}</td>
            <td class="d-flex flex-column flex-sm-row gap-2 align-items-center justify-content-center">
                <button class="btn btn-sm btn-primary editar-btn" data-index="${index}">Editar</button>
                <button class="btn btn-sm btn-danger eliminar-btn" data-index="${index}">Eliminar</button>
            </td>
        `;
            tablaBody.appendChild(fila);
        });

        document.querySelectorAll('.editar-btn').forEach(btn =>
            btn.addEventListener('click', editarImagen)
        );

        document.querySelectorAll('.eliminar-btn').forEach(btn =>
            btn.addEventListener('click', eliminarImagen)
        );
    }


    function guardarImagen() {
        const nombre = document.getElementById('nombreImagen').value.trim();
        const descripcion = document.getElementById('descripcionImagen').value.trim();

        if (!nombre || !descripcion || (!imagenSeleccionada && !modoEdicionImagen)) {
            alert('Todos los campos son obligatorios y debes seleccionar una imagen.');
            return;
        }

        const urlSeleccionada = imagenSeleccionada || imagenes[indexEdicionImagen].url;

        const nuevaImagen = {
            nombre,
            descripcion,
            url: urlSeleccionada
        };

        if (modoEdicionImagen && indexEdicionImagen !== null) {
            imagenes[indexEdicionImagen] = nuevaImagen;
            alert('¡Imagen actualizada correctamente!');
        } else {
            imagenes.push(nuevaImagen);
            alert('¡Muy bien! Imagen guardada correctamente!');
        }

        localStorage.setItem('imagenes', JSON.stringify(imagenes));
        renderizarImagenes();
        limpiarFormularioImagen();
        bootstrap.Modal.getInstance(document.getElementById('nuevoImagenModal')).hide();
    }

    botonGuardar.addEventListener('click', guardarImagen);
    renderizarImagenes();

    function eliminarImagen(event) {
    const index = parseInt(event.target.getAttribute('data-index'));
    if (confirm('¿Estás seguro de que deseas eliminar esta imagen?')) {
        imagenes.splice(index, 1);
        localStorage.setItem('imagenes', JSON.stringify(imagenes));
        renderizarImagenes();
    }
}
});

function cargarGaleriaImagenes() {
    const galeria = document.getElementById('galeriaImagenes');
    galeria.innerHTML = '';

    const imagenesDisponibles = [
        'Inicio_salon_basico_1.png',
        'Inicio_salon_estandar_1.png',
        'Inicio_salon_premium_1.png',
        'imgbola.png'
    ];

    imagenesDisponibles.forEach(nombre => {
        const url = `img/${nombre}`;
        const img = document.createElement('img');
        img.src = url;
        img.alt = nombre;
        img.className = 'img-thumbnail';
        img.style.width = '120px';
        img.style.cursor = 'pointer';

        img.onclick = () => {
            imagenSeleccionada = url;
            document.querySelectorAll('#galeriaImagenes img').forEach(i => i.classList.remove('border-primary'));
            img.classList.add('border-primary');
        };

        galeria.appendChild(img);
    });
}

function editarImagen(event) {
    const index = parseInt(event.target.getAttribute('data-index'));
    const img = imagenes[index];

    document.getElementById('nombreImagen').value = img.nombre;
    document.getElementById('descripcionImagen').value = img.descripcion;
    imagenSeleccionada = img.url;

    modoEdicionImagen = true;
    indexEdicionImagen = index;

    // Marcar imagen seleccionada en galería (si existe)
    document.querySelectorAll('#galeriaImagenes img').forEach(i => {
        i.classList.toggle('border-primary', i.src.includes(img.url));
    });

    const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('nuevoImagenModal'));
    modal.show();
}

function eliminarImagen(event) {
    const index = parseInt(event.target.getAttribute('data-index'));
    if (confirm('¿Estás seguro de que deseas eliminar esta imagen?')) {
        imagenes.splice(index, 1);
        localStorage.setItem('imagenes', JSON.stringify(imagenes));
        renderizarImagenes();
    }
}

function limpiarFormularioImagen() {
    document.getElementById('nombreImagen').value = '';
    document.getElementById('descripcionImagen').value = '';
    imagenSeleccionada = null;
    modoEdicionImagen = false;
    indexEdicionImagen = null;
    document.querySelectorAll('#galeriaImagenes img').forEach(i => i.classList.remove('border-primary'));
}

document.getElementById('nuevoImagenModal').addEventListener('show.bs.modal', cargarGaleriaImagenes);        