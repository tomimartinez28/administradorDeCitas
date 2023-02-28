import Citas from './classes/Citas.js';
import UI from './classes/Ui.js';
import { mascotaInput, propietarioInput, telefonoInput, fechaInput, horaInput, sintomasInput, formulario  } from './selectores.js'
export let DB;

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
    const transaction = DB.transaction(['citas'], 'readwrite');
    const objectStore = transaction.objectStore('citas');
    objectStore.delete(id)

    transaction.oncomplete = () => {
        console.log('Cita eliminada');
        ui.imprimirCitas()
    }

    transaction.onerror = () =>{
        console.log('Error al eliminar registro.');
    }
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

    const {mascota, propietario, telefono, fecha, hora, sintomas } = citasObj;

    // Validar
    if( mascota === '' || propietario === '' || telefono === '' || fecha === ''  || hora === '' || sintomas === '' ) {
        ui.mostrarAlerta('Todos los mensajes son Obligatorios', 'error')

        return;
    }

    if(modoEdicion) {
        // Estamos editando
        administrarCitas.editarCita( {...citasObj} );

        // edita de la base de datos;
        const transaction = DB.transaction(['citas'], 'readwrite');
        const objectStore = transaction.objectStore('citas');
        objectStore.put(citasObj);

        transaction.oncomplete = () => {
            ui.mostrarAlerta('Guardado Correctamente');

            formulario.querySelector('button[type="submit"]').textContent = 'Crear Cita';
    
            modoEdicion = false;
        }

        transaction.onerror = () => {
            console.log('Hubo un error Error');
        }




    } else {
        // Nuevo Registro


        // Generar un ID único
        citasObj.id = Date.now();
        

        // Añade la nueva cita
        administrarCitas.agregarCita({...citasObj});


        // INSERTARLA EN LA BASE DE DATOS DE INDEXEDDB
        const transaction = DB.transaction(['citas'], 'readwrite');
        const objectStore = transaction.objectStore('citas');
        objectStore.add(citasObj);
        transaction.oncomplete = function() {
            // Mostrar mensaje de que todo esta bien...
            ui.mostrarAlerta('Se agregó correctamente')
        } 


        
    }


    // Imprimir el HTML de citas
    ui.imprimirCitas();

    // Reinicia el objeto para evitar futuros problemas de validación
    reiniciarObjeto();

    // Reiniciar Formulario
    formulario.reset();

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



// Function que crea la base de datos
export function crearDB() {
    // Crear la base de datos version 1.0
    const crearDB = window.indexedDB.open('citas', 1);

    // Si hay un error
    crearDB.onerror = function() {
        console.log('ERROR AL CREAR LA BASE DE DATOS');
    }

    // Si todo sale bien
    crearDB.onsuccess = function() {
        console.log('Base de datos creada');
        DB = crearDB.result;
        // Luego de que recarga la pagina, y crea la base de datos, lee los datos de la DB y los imprime
        ui.imprimirCitas()
    }

    // DEFINIR EL SCHEMA
    crearDB.onupgradeneeded = function(e) {
        const db = e.target.result;
        const objectStore = db.createObjectStore('citas', {
            keyPath: 'id',
            autoIncrement: true,
        });

        // Definir todas las columnas
        objectStore.createIndex('mascota', 'mascota', { unique: false });
        objectStore.createIndex('propietario', 'propietario', { unique: false });
        objectStore.createIndex('telefono', 'telefono', { unique: false });
        objectStore.createIndex('fecha', 'fecha', { unique: false });
        objectStore.createIndex('hora', 'hora', { unique: false });
        objectStore.createIndex('sintomas', 'sintomas', { unique: false });
        objectStore.createIndex('id', 'id', { unique: true });
        
        console.log('Tabla creada');
    }
}

