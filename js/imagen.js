document.addEventListener('DOMContentLoaded', function () {
    const nombreImagen = document.querySelector('#nuevoImagenModal input[aria-label="Nombre de la imagen"]');
    const archivoImagen = document.querySelector('#nuevoImagenModal input[type="file"]');
    const descripcionImagen = document.querySelector('#nuevoImagenModal input[aria-label="Descripción de la imagen"]');
    const botonGuardar = document.querySelector('#nuevoImagenModal .btn-primary');
    const tablaBody = document.querySelector('#nuevoImagenModal').closest('section').querySelector('table tbody');
    const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('nuevoImagenModal'));

    let imagenes = JSON.parse(localStorage.getItem('imagenes')) || [];

    function renderizarImagenes() {
        tablaBody.innerHTML = '';
        imagenes.forEach((img, index) => {
            tablaBody.innerHTML += `
                <tr>
                    <th scope="row">${index + 1}</th>
                    <td>${img.nombre}</td>
                    <td><img src="${img.url}" alt="imagen" style="max-width: 150px;" class="img-fluid"></td>
                    <td>${img.descripcion}</td>
                    <td class="d-flex flex-column flex-sm-row gap-2 align-items-center justify-content-center">
                        <button class="btn btn-sm btn-primary" disabled>Editar</button>
                        <button class="btn btn-sm btn-danger" disabled>Eliminar</button>
                    </td>
                </tr>`;
        });
    }

    function guardarImagen() {
        const nombre = document.getElementById('nombreImagen').value.trim();
        const descripcion = document.getElementById('descripcionImagen').value.trim();

        if (!nombre || !descripcion || !imagenSeleccionada) {
            alert('Todos los campos son obligatorios y debes seleccionar una imagen.');
            return;
        }

        imagenes.push({
            nombre,
            descripcion,
            url: imagenSeleccionada
        });

        localStorage.setItem('imagenes', JSON.stringify(imagenes));
        renderizarImagenes();

        alert('¡Muy bien! Imagen guardada correctamente!');
        document.getElementById('nombreImagen').value = '';
        document.getElementById('descripcionImagen').value = '';
        imagenSeleccionada = null;
        document.getElementById('nuevoImagenModal').classList.remove('show');
        document.querySelector('.modal-backdrop').remove();
    }


    botonGuardar.addEventListener('click', guardarImagen);
    renderizarImagenes();
});

const imagenes = [];
let imagenSeleccionada = null;

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
document.getElementById('nuevoImagenModal').addEventListener('show.bs.modal', cargarGaleriaImagenes);        