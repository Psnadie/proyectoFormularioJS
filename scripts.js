function changePenguinColor(element, colorName) {
    // Remover selección de todos los colores
    const allColors = document.querySelectorAll('.color-option');
    allColors.forEach(c => c.classList.remove('selected'));

    // Añadir selección al color clickeado
    element.classList.add('selected');

    // Cambiar la imagen del pinguino
    const penguinImg = document.getElementById('penguinImg');
    penguinImg.src = `PinguinosColores/penguin-${colorName}.png`;

    // Para revisar que el cambio se haga bien por consola
    console.log('Cambiando a penguin-' + colorName + '.png');
}

// Esta funcion es la que compara ambos campos de las contraseñas
function validatePasswords() {
    const pw = document.getElementById('password');
    const cpw = document.getElementById('confirmPassword');
    if (!pw || !cpw) return true;

    // si alguno de ambos campos no esta vacio, compara ambos
    if (pw.value !== '' || cpw.value !== '') {
        if (pw.value !== cpw.value) {
            pw.style.borderColor = 'red';
            cpw.style.borderColor = 'red';
            pw.style.backgroundColor = '#ffe6e6';
            cpw.style.backgroundColor = '#ffe6e6';
            return false;
        } else {
            // si ninguno de los esta vacio resetea los estilos
            pw.style.borderColor = '';
            cpw.style.borderColor = '';
            pw.style.backgroundColor = '';
            cpw.style.backgroundColor = '';
            return true;
        }
    }

    // el default, para que cuando ambos campos esten vacios no haya ningun estilo extra aplicados
    pw.style.borderColor = '';
    cpw.style.borderColor = '';
    pw.style.backgroundColor = '';
    cpw.style.backgroundColor = '';
    return true;
}

// Valida que un email tenga formato básico válido
function validateEmail() {
    const emailEl = document.getElementById('parentEmail');
    if (!emailEl) return true;
    const value = emailEl.value.trim();
    if (value === '') {
        // empty: reset styles
        emailEl.style.borderColor = '';
        emailEl.style.backgroundColor = '';
        return true;
    }

    // Validación sencilla: algo@algo.algo (no perfecta pero me parece suficiente aquí)
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(value)) {
        emailEl.style.borderColor = 'red';
        emailEl.style.backgroundColor = '#ffe6e6';
        return false;
    }

    // válido: reset
    emailEl.style.borderColor = '';
    emailEl.style.backgroundColor = '';
    return true;
}

// Valida que el nombre cumpla: 4-12 letters/numbers/spaces
function validateName() {
    const nameEl = document.getElementById('penguinName');
    if (!nameEl) return true;
    const value = nameEl.value.trim();
    if (value === '') {
        nameEl.style.borderColor = '';
        nameEl.style.backgroundColor = '';
        return true;
    }

    // Permite letras (unicode), números y espacios, entre 4 y 12 caracteres
    const re = /^[\p{L}0-9 ]{4,12}$/u;
    if (!re.test(value)) {
        nameEl.style.borderColor = 'red';
        nameEl.style.backgroundColor = '#ffe6e6';
        return false;
    }

    // válido: reset
    nameEl.style.borderColor = '';
    nameEl.style.backgroundColor = '';
    return true;
}

// Valida que se haya aceptado la politica de privacidad
function validatePrivacy() {
    const privacyEl = document.getElementById('acceptPrivacy');
    const privacyWrapper = privacyEl ? privacyEl.closest('.privacy') : null;
    if (!privacyEl) return true;
    if (!privacyEl.checked) {
        if (privacyWrapper) privacyWrapper.classList.add('error');
        return false;
    }
    if (privacyWrapper) privacyWrapper.classList.remove('error');
    return true;
}

// Escape HTML to avoid injection when inserting user values into the page
function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

//Esta es la funcion principal del script, maneja los event listeners y validaciones
document.addEventListener('DOMContentLoaded', () => {
    const summaryEl = document.getElementById('summary');
    summaryEl.className = 'summary hidden';
    const pw = document.getElementById('password');
    const cpw = document.getElementById('confirmPassword');
    const emailEl = document.getElementById('parentEmail');
    const nameEl = document.getElementById('penguinName');
    const privacyEl = document.getElementById('acceptPrivacy');
    const nextBtn = document.querySelector('.next-button');

    //onclick, onchange, onfocus, onblur (las puse mas que todo porque eran requisitos de la practica
    // aunque personalmente prefiero usar un eventlistener y yo manualmente encargarme de todo.)
    if (nextBtn) {
        // onclick: ejecuta las validaciones rápidas
        nextBtn.onclick = () => {
            // llamar validadores para que también estén disponibles vía onclick
            validateName();
            validateEmail();
            validatePasswords();
            validatePrivacy();
            return true;
        };
    }
    // aqui llamo a las funciones de validacion antes de enviar el formulario (las que cambian los estilos a rojo y demas)
    if (pw && cpw) {
        pw.addEventListener('input', validatePasswords);
        cpw.addEventListener('input', validatePasswords);
    }

    if (emailEl) {
        emailEl.addEventListener('input', validateEmail);
        // onchange: validar cuando el valor cambie y el control pierda el foco
        emailEl.onchange = validateEmail;
    }

    if (privacyEl) {
        // validar cuando cambie el checkbox
        privacyEl.addEventListener('change', validatePrivacy);
        // asignar onchange también (práctica requerida)
        privacyEl.onchange = validatePrivacy;
    }

    if (nameEl) {
        nameEl.addEventListener('input', validateName);
        // onfocus: marcar que el campo fue enfocado (no cambia estilos)
        nameEl.onfocus = () => { nameEl.dataset.focused = '1'; };
        // onblur: limpiar marca y validar al salir del campo
        nameEl.onblur = () => { delete nameEl.dataset.focused; validateName(); };
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const pwOk = validatePasswords();
            const emailOk = validateEmail();
            const nameOk = validateName();
            const privacyOk = validatePrivacy();
            const summaryEl = document.getElementById('summary');
            const penguinImg = document.getElementById('penguinImg');
            const penguinSrc = penguinImg ? penguinImg.getAttribute('src') : '';

            if (!summaryEl) return;

            // Si alguna de las validaciones no pasa, pone en el summary la clase error y muestra los mensajes que fallaron
            if (!pwOk || !emailOk || !nameOk || !privacyOk) {
                //este es el array de los mensajes de error posibles
                const msgs = [];
                if (!pwOk) msgs.push('Las contraseñas no coinciden');
                if (!emailOk) msgs.push('El email no es válido');
                if (!nameOk) msgs.push('El nombre debe tener 4-12 letras, números o espacios');
                if (!privacyOk) msgs.push('Debes aceptar la política de privacidad');
                summaryEl.className = 'summary error';
                summaryEl.innerHTML = `
                    <h3>Hay errores en el formulario</h3>
                    <div class="errors">
                        <ul>
                            ${msgs.map(m => `<li>${m}</li>`).join('')}
                        </ul>
                    </div>
                `;
                summaryEl.scrollIntoView({ behavior: 'smooth' });
                return;
            }

            // cuando todo es correcto, arregla los datos, cambia la clase del summary y muestra los datos
            const nameVal = nameEl ? nameEl.value.trim() : '';
            const emailVal = emailEl ? emailEl.value.trim() : '';
            const pwVal = pw ? pw.value : '';

            summaryEl.className = 'summary success';
            summaryEl.innerHTML = `
                <h3>Registro completado con éxito</h3>
                <div class="details">
                    <img src="${penguinSrc}" alt="Penguin" />
                    <div class="fields">
                        <div class="field"><b>Nombre:</b> ${escapeHtml(nameVal)}</div>
                        <div class="field"><b>Email:</b> ${escapeHtml(emailVal)}</div>
                        <div class="field"><b>Contraseña:</b> ${escapeHtml(pwVal)}</div>
                        <div class="field"><b>Privacidad:</b> ${privacyEl && privacyEl.checked ? 'Aceptada' : 'No aceptada'}</div>
                    </div>
                </div>
            `;
            summaryEl.scrollIntoView({ behavior: 'smooth' });
        });
    }
});