// campos del formulario
const mascotaInput = document.querySelector('#mascota');
const propietarioInput = document.querySelector('#propietario');
const telefonoInput = document.querySelector('#telefono');
const fechaInput = document.querySelector('#fecha');
const horaInput = document.querySelector('#hora');
const sintomasInput = document.querySelector('#sintomas');
const formulario = document.querySelector('#nueva-cita');
const contenedorCitas = document.querySelector('#citas');
let modoEdicion;




// event listeners
eventListeners()
function eventListeners(){
    mascotaInput.addEventListener('input', datosCita);
    propietarioInput.addEventListener('input', datosCita);
    telefonoInput.addEventListener('input', datosCita);
    fechaInput.addEventListener('input', datosCita)
    horaInput.addEventListener('input', datosCita)
    sintomasInput.addEventListener('input', datosCita)
    formulario.addEventListener('submit', nuevaCita)
}   



// objeto con la info de la cita
citasObj = {
    mascota: '',
    propietario: '',
    telefono: '',
    fecha: '',
    hora: '',
    sintomas: '',
}




// FUNCIONES 
// guarda los datos de la cita en el objeto.
function datosCita(e){
    citasObj[e.target.name] = e.target.value;
}


// elimina una cita
function eliminarCita(id) {
    // eliminar la cita
    administrarCitas.eliminarCita(id)

    // enviar un mensaje
    ui.mostrarAlerta('La cita se elimino correctamente')

    // refrescar el html

    ui.imprimitCitas(administrarCitas);

}



// reinicia el objeto
function reiniciarObjeto() {
    citasObj.mascota = '';
    citasObj.propietario = '';
    citasObj.telefono = '';
    citasObj.fecha = '';
    citasObj.hora = '';
    citasObj.sintomas = '';

}

// valida y agrega una nueva cita
function nuevaCita(e) {
    e.preventDefault();

    // extraer la info del objeto
    const { mascota, propietario, telefono, fecha, hora, sintomas } = citasObj;

    // validar 
    if(mascota === '' || propietario === '' || telefono === '' || fecha === '' || hora === '' || sintomas === '' ) {
        ui.mostrarAlerta('Todos los campos son obligatorios', 'error');
        return
    }


    // verifica si esta en modo edicion
    if(modoEdicion) {

        // cambiar el texto del boton
        formulario.querySelector('button[type = "submit"]').textContent = 'Crear cita';


        // editar el objeto de la cita
        administrarCitas.editarCita({...citasObj})



        // mensaje
        ui.mostrarAlerta('La cita se edito correctamente...');

        // quita modo edicion
        modoEdicion = false;

    } else {
        // generar un id
        citasObj.id = Date.now();

        // agrega la cita al array
        administrarCitas.agregarCita({...citasObj});

        ui.mostrarAlerta('La cita se agrego correctamente...')


    }





    // reseteo el formulario
    formulario.reset()

    // reiniciar el objeto
    reiniciarObjeto();

    // imprimir citas
    ui.imprimitCitas(administrarCitas);


}

// Carga los datos y el modo edicion

function cargarEdicion(cita) {
    const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;

    // llenar los inputs
    mascotaInput.value = mascota;
    propietarioInput.value = propietario;
    telefonoInput.value = telefono;
    fechaInput.value = fecha;
    horaInput.value = hora;
    sintomasInput.value = sintomas;

    // llenar el obj 
    citasObj.mascota = mascota;
    citasObj.propietario = propietario;
    citasObj.telefono = telefono;
    citasObj.fecha = fecha;
    citasObj.hora = hora;
    citasObj.sintomas = sintomas;
    citasObj.id = id;





    // cambiar el texto del boton

    formulario.querySelector('button[type = "submit"]').textContent = 'Guardar cambios'

    // activo modo edicion
    modoEdicion = true;

}





// CLASES

class Citas {
    constructor() {
        this.citas = [];
    }

    agregarCita(cita) {
        this.citas = [...this.citas, cita]
    }


    eliminarCita(id) {
        this.citas = this.citas.filter( cita => cita.id != id);
    }

    editarCita(citaActualizada) {
        this.citas = this.citas.map( cita => cita.id === citaActualizada.id ? citaActualizada : cita)
    };

}

class UI {
    mostrarAlerta(mensaje, tipo) {
        const alertaHTML = document.createElement('div');
        alertaHTML.innerHTML = `<p>${mensaje}</p>`; 
        
        // le agrego clases
        alertaHTML.classList.add('text-center', 'alert', 'd-block', 'col-12' )
        if(tipo === 'error'){
            alertaHTML.classList.add('alert-danger',)
        } else {
            alertaHTML.classList.add('alert-success')
        }

        document.querySelector('#contenido').insertBefore(alertaHTML, document.querySelector('.agregar-cita'))

        setTimeout(() => {
            alertaHTML.remove()
        }, 3000);

    }



    imprimitCitas({citas}){


        ui.limpiarHTML()

        citas.forEach(cita => {
            const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;

            const divCita = document.createElement('div');
            divCita.classList.add('cita', 'p-3');
            divCita.dataset.id = id;
        

            // scripting de los elemntos
            const mascotaParrafo = document.createElement('h2');
            mascotaParrafo.classList.add('card-title', 'font-weight-bolder');
            mascotaParrafo.textContent = mascota;

            const propietarioParrafo = document.createElement('p');
            propietarioParrafo.innerHTML = `<span class = 'font-weight-bolder'>Propietario:</span> ${propietario}`;

            const telefonoParrafo = document.createElement('p');
            telefonoParrafo.innerHTML = `<span class = 'font-weight-bolder'>Telefono:</span> ${telefono}`;

            const fechaParrafo = document.createElement('p');
            fechaParrafo.innerHTML = `<span class = 'font-weight-bolder'>Fecha:</span> ${fecha}`;

            const horaParrafo = document.createElement('p');
            horaParrafo.innerHTML = `<span class = 'font-weight-bolder'>Hota:</span> ${hora}`;

            const sintomasParrafo = document.createElement('p');
            sintomasParrafo.innerHTML = `<span class = 'font-weight-bolder'>Sintomas:</span> ${sintomas}`;


            // boton para eliminar las citas
            const btnEliminar = document.createElement('button');
            btnEliminar.classList.add('btn', 'btn-danger', 'mr-2')
            btnEliminar.innerHTML = `
            Eliminar <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>`;

            btnEliminar.onclick = () => eliminarCita(id);
            



            // boton para editar las citas
            const btnEditar = document.createElement('button');
            btnEditar.classList.add('btn', 'btn-info', 'mr-2')
            btnEditar.innerHTML = `
            Editar <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
          </svg>`;

            btnEditar.onclick = () => cargarEdicion(cita);







            // agregar los parrafos al divCita
            divCita.appendChild(mascotaParrafo);
            divCita.appendChild(propietarioParrafo);
            divCita.appendChild(telefonoParrafo);
            divCita.appendChild(fechaParrafo);
            divCita.appendChild(horaParrafo);
            divCita.appendChild(sintomasParrafo);
            divCita.appendChild(btnEliminar);
            divCita.appendChild(btnEditar)


            // agregar las citas al html
            contenedorCitas.appendChild(divCita);

        });
    }


    limpiarHTML() {
        while(contenedorCitas.firstChild){
            contenedorCitas.removeChild(contenedorCitas.firstChild);
        }
    }

}

const administrarCitas = new Citas();
const ui = new UI;