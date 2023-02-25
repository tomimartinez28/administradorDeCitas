import Citas from './classes/Citas.js';
import UI from './classes/Ui.js';
import { mascotaInput, propietarioInput, telefonoInput, fechaInput, horaInput, sintomasInput, formulario  } from './selectores.js'


const administrarCitas = new Citas();
const ui = new UI();


let modoEdicion = false;

// objeto con la info de la cita
let citasObj = {
    mascota: '',
    propietario: '',
    telefono: '',
    fecha: '',
    hora: '',
    sintomas: '',
}


// FUNCIONES 

// guarda los datos de la cita en el objeto.
export function datosCita(e){
    citasObj[e.target.name] = e.target.value;
}



// elimina una cita
export function eliminarCita(id) {
    // eliminar la cita
    administrarCitas.eliminarCita(id)

    // enviar un mensaje
    ui.mostrarAlerta('La cita se elimino correctamente')

    // refrescar el html

    ui.imprimitCitas(administrarCitas);

}



// reinicia el objeto
export function reiniciarObjeto() {
    citasObj.mascota = '';
    citasObj.propietario = '';
    citasObj.telefono = '';
    citasObj.fecha = '';
    citasObj.hora = '';
    citasObj.sintomas = '';

}

// valida y agrega una nueva cita
export function nuevaCita(e) {
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

export function cargarEdicion(cita) {
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

