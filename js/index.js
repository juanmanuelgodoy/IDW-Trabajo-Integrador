document.addEventListener('DOMContentLoaded', function () {
    const salones = JSON.parse(localStorage.getItem('salones')) || [];
    const imagenes = JSON.parse(localStorage.getItem('imagenes')) || [];
    const contenedor = document.getElementById('contenedor-salones');

    contenedor.innerHTML = '';

    salones.forEach(salon => {
        const imagen = imagenes.find(img =>
            img.nombre?.toLowerCase() === salon.nombre?.toLowerCase()
        );

        const imagenUrl = imagen?.url || 'img/default.png';

        contenedor.innerHTML += `
        <div class="col-12 col-md-6 col-lg-4">
            <div class="card h-100 shadow-sm bg-success bg-opacity-10">
                <img src="${imagenUrl}" class="card-img-top img-fluid rounded-top"
                    alt="${salon.nombre}" style="height: 200px; object-fit: cover;"
                    onerror="this.src='img/default.png'">
                <div class="card-body">
                    <h3 class="h5">${salon.nombre}</h3>
                    <p class="text-muted mb-2">${salon.direccion || 'Sin dirección'}</p>
                    <p class="mb-1"><strong>Precio:</strong> $${(salon.precio || 0).toLocaleString('es-AR')}</p>
                    <p class="mb-0">${salon.descripcion || 'Sin descripción'}</p>
                </div>
                <div class="card-footer bg-transparent border-0">
                    <button class="btn btn-outline-success w-100 reservar-btn" 
                        data-salon-id="${salon.nombre}" 
                        data-precio="${(salon.precio || 0).toFixed(2)}">
                        Reservar
                    </button>
                </div>
            </div>
        </div>
        `;
    });
    document.querySelectorAll('.reservar-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const salonId = this.getAttribute('data-salon-id');
            const precio = this.getAttribute('data-precio');

            document.getElementById('reservaModalBody').innerText =
                `¡Reserva exitosa! ${salonId} por $${precio}`;

            new bootstrap.Modal(document.getElementById('reservaModal')).show();

            this.textContent = 'Reservado';
            this.classList.remove('btn-outline-success');
            this.classList.add('btn-success');
            this.disabled = true;
        });
    });
});
