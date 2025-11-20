
// FUNCIONES 
function showMessage(elementId, message, type) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = message;
        element.className = `msg ${type}`;
        setTimeout(() => {
            element.textContent = '';
            element.className = 'msg';
        }, 5000);
    }
}


function isLoggedIn() {
    return localStorage.getItem('user') !== null;
}


function getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
}


function updateAuthUI() {
    const btnLogin = document.getElementById('btnLogin');
    const btnLogout = document.getElementById('btnLogout');
    const perfilLink = document.getElementById('perfilLink');
    const profileInfo = document.getElementById('profileInfo');

    if (isLoggedIn()) {
     
        if (btnLogin) btnLogin.style.display = 'none';
        if (btnLogout) btnLogout.style.display = 'block';
        if (perfilLink) perfilLink.style.display = 'block';

      
        if (profileInfo) {
            const user = getCurrentUser();
            profileInfo.innerHTML = `
                <h4>Bienvenido, ${user.name}</h4>
                <p>Email: ${user.email}</p>
                <button class="btn" onclick="logout()">Cerrar Sesión</button>
            `;
        }
    } else {
       
        if (btnLogin) btnLogin.style.display = 'block';
        if (btnLogout) btnLogout.style.display = 'none';
        if (perfilLink) perfilLink.style.display = 'none';

        
        if (profileInfo) {
            profileInfo.innerHTML = 'Inicia sesión para ver tu perfil.';
        }
    }
}


function logout() {
    localStorage.removeItem('user');
    updateAuthUI();
   
    if (window.location.href.includes('index.html')) {
        window.location.reload();
    } else {
        window.location.href = '../index.html';
    }
}


const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = document.getElementById('regName').value;
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPass').value;
        const password2 = document.getElementById('regPass2').value;

      
        if (password !== password2) {
            showMessage('regMsg', 'Las contraseñas no coinciden', 'error');
            return;
        }

        if (password.length < 6) {
            showMessage('regMsg', 'La contraseña debe tener al menos 6 caracteres', 'error');
            return;
        }

        
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const existingUser = users.find(user => user.email === email);
        if (existingUser) {
            showMessage('regMsg', 'El usuario ya existe', 'error');
            return;
        }

        const newUser = { name, email, password };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        showMessage('regMsg', 'Registro exitoso. Redirigiendo...', 'success');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
    });
}


const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const userInput = document.getElementById('loginUser').value;
        const password = document.getElementById('loginPass').value;

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => (u.email === userInput || u.name === userInput) && u.password === password);

        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
            showMessage('loginMsg', 'Inicio de sesión exitoso. Redirigiendo...', 'success');
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 2000);
        } else {
            showMessage('loginMsg', 'Credenciales incorrectas', 'error');
        }
    });
}


const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = document.getElementById('contactName').value;
        const email = document.getElementById('contactEmail').value;
        const phone = document.getElementById('contactPhone').value;
        const projectType = document.getElementById('contactProjectType').value;
        const message = document.getElementById('contactMsg').value;

      
        const contacts = JSON.parse(localStorage.getItem('contacts')) || [];
        const newContact = { 
            name, 
            email, 
            phone, 
            projectType, 
            message, 
            date: new Date().toLocaleString() 
        };
        contacts.push(newContact);
        localStorage.setItem('contacts', JSON.stringify(contacts));

       
        contactForm.reset();
        showMessage('contactResp', 'Mensaje enviado correctamente. Te contactaremos pronto.', 'success');
    });
}


function initCalculator() {
    const budgetForm = document.getElementById('budgetForm');
    const areaInput = document.getElementById('area');
    const areaRange = document.getElementById('areaRange');
    const areaValue = document.getElementById('areaValue');
    const btnGuardarPresupuesto = document.getElementById('btnGuardarPresupuesto');
    const btnImprimirPresupuesto = document.getElementById('btnImprimirPresupuesto');
    
  
    if (areaInput && areaRange && areaValue) {
        areaInput.addEventListener('input', function() {
            areaRange.value = this.value;
            areaValue.textContent = this.value + ' m²';
        });
        
        areaRange.addEventListener('input', function() {
            areaInput.value = this.value;
            areaValue.textContent = this.value + ' m²';
        });
        
     
        areaValue.textContent = areaInput.value + ' m²';
    }
    
   
    if (budgetForm) {
        budgetForm.addEventListener('submit', function(e) {
            e.preventDefault();
            calcularPresupuesto();
        });
    }
   
    const calculatorInputs = document.querySelectorAll('#budgetForm input, #budgetForm select');
    calculatorInputs.forEach(input => {
        input.addEventListener('change', function() {
            setTimeout(calcularPresupuesto, 100);
        });
    });
    
   
    if (btnGuardarPresupuesto) {
        btnGuardarPresupuesto.addEventListener('click', guardarPresupuesto);
    }
    
    if (btnImprimirPresupuesto) {
        btnImprimirPresupuesto.addEventListener('click', imprimirPresupuesto);
    }
    
    
    cargarPresupuestosGuardados();
    
  
    calcularPresupuesto();
}

function calcularPresupuesto() {
   
    const area = parseFloat(document.getElementById('area').value) || 0;
    const costoM2Base = parseFloat(document.getElementById('tipoConstruccion').value) || 0;
    const numPisos = parseFloat(document.getElementById('numPisos').value) || 1;
    const calidadAcabados = parseFloat(document.getElementById('calidadAcabados').value) || 1;
    const ubicacion = parseFloat(document.getElementById('ubicacion').value) || 1;
    const incluyeProyecto = document.getElementById('incluyeProyecto').checked;
    const incluyeLicencias = document.getElementById('incluyeLicencias').checked;
    
   
    const areaTotal = area * numPisos;
    
   
    const costoM2Ajustado = costoM2Base * calidadAcabados * ubicacion;
    const costoConstruccion = areaTotal * costoM2Ajustado;
    const costoProyecto = incluyeProyecto ? costoConstruccion * 0.08 : 0; 
    const costoLicitaciones = incluyeLicencias ? costoConstruccion * 0.05 : 0; 
    
    const presupuestoTotal = costoConstruccion + costoProyecto + costoLicitaciones;
    
   
    if (document.getElementById('costoM2')) {
        document.getElementById('costoM2').textContent = 'Bs' + costoM2Ajustado.toLocaleString('es-PE');
        document.getElementById('areaTotal').textContent = areaTotal.toLocaleString('es-PE') + ' m²';
        document.getElementById('costoConstruccion').textContent = 'Bs' + costoConstruccion.toLocaleString('es-PE');
        document.getElementById('costoProyecto').textContent = 'Bs' + costoProyecto.toLocaleString('es-PE');
        document.getElementById('costoLicencias').textContent = 'Bs' + costoLicitaciones.toLocaleString('es-PE');
        document.getElementById('presupuestoTotal').textContent = 'Bs' + presupuestoTotal.toLocaleString('es-PE');
    }
    
    return {
        area,
        areaTotal,
        tipoConstruccion: document.getElementById('tipoConstruccion').options[document.getElementById('tipoConstruccion').selectedIndex].text,
        calidadAcabados: document.getElementById('calidadAcabados').options[document.getElementById('calidadAcabados').selectedIndex].text,
        ubicacion: document.getElementById('ubicacion').options[document.getElementById('ubicacion').selectedIndex].text,
        numPisos: document.getElementById('numPisos').options[document.getElementById('numPisos').selectedIndex].text,
        incluyeProyecto,
        incluyeLicencias,
        costoM2: costoM2Ajustado,
        costoConstruccion,
        costoProyecto,
        costoLicitaciones,
        presupuestoTotal,
        fecha: new Date().toLocaleDateString('es-PE')
    };
}

function guardarPresupuesto() {
    if (!isLoggedIn()) {
        alert('Debes iniciar sesión para guardar presupuestos');
        return;
    }

    const presupuesto = calcularPresupuesto();
    const nombre = prompt('Ingresa un nombre para este presupuesto:', 
                         `Presupuesto ${presupuesto.areaTotal}m² - ${new Date().toLocaleDateString()}`);
    
    if (nombre) {
        
        const presupuestosGuardados = JSON.parse(localStorage.getItem('presupuestos')) || [];
      
        presupuestosGuardados.push({
            id: Date.now(),
            nombre,
            ...presupuesto
        });
        
        localStorage.setItem('presupuestos', JSON.stringify(presupuestosGuardados));
        
      
        cargarPresupuestosGuardados();
        
        alert('Presupuesto guardado correctamente');
    }
}

function cargarPresupuestosGuardados() {
    const listaPresupuestos = document.getElementById('listaPresupuestos');
    if (!listaPresupuestos) return;
    
    const presupuestosGuardados = JSON.parse(localStorage.getItem('presupuestos')) || [];
    listaPresupuestos.innerHTML = '';
    
    if (presupuestosGuardados.length === 0) {
        listaPresupuestos.innerHTML = '<p>No hay presupuestos guardados</p>';
        return;
    }
    
 
    presupuestosGuardados.sort((a, b) => b.id - a.id);
    
    presupuestosGuardados.forEach(presupuesto => {
        const presupuestoElement = document.createElement('div');
        presupuestoElement.className = 'saved-budget-item';
        presupuestoElement.innerHTML = `
            <div class="saved-budget-header">
                <span class="saved-budget-title">${presupuesto.nombre}</span>
                <div class="saved-budget-actions">
                    <button class="btn btn-small btn-cargar" data-id="${presupuesto.id}">Cargar</button>
                    <button class="btn btn-small btn-eliminar" data-id="${presupuesto.id}">Eliminar</button>
                </div>
            </div>
            <div class="saved-budget-details">
                <div>Área: ${presupuesto.areaTotal}m² | Total: Bs${presupuesto.presupuestoTotal.toLocaleString('es-PE')}</div>
                <div>${presupuesto.fecha}</div>
            </div>
        `;
        listaPresupuestos.appendChild(presupuestoElement);
    });
    
 
    document.querySelectorAll('.btn-cargar').forEach(button => {
        button.addEventListener('click', function() {
            cargarPresupuesto(this.getAttribute('data-id'));
        });
    });
    
    document.querySelectorAll('.btn-eliminar').forEach(button => {
        button.addEventListener('click', function() {
            eliminarPresupuesto(this.getAttribute('data-id'));
        });
    });
}

function cargarPresupuesto(id) {
    const presupuestosGuardados = JSON.parse(localStorage.getItem('presupuestos')) || [];
    const presupuesto = presupuestosGuardados.find(p => p.id == id);
    
    if (presupuesto) {
       
        document.getElementById('area').value = presupuesto.area;
        document.getElementById('areaRange').value = presupuesto.area;
        document.getElementById('areaValue').textContent = presupuesto.area + ' m²';
        
     
        seleccionarOpcionPorTexto('tipoConstruccion', presupuesto.tipoConstruccion);
        seleccionarOpcionPorTexto('numPisos', presupuesto.numPisos);
        seleccionarOpcionPorTexto('calidadAcabados', presupuesto.calidadAcabados);
        seleccionarOpcionPorTexto('ubicacion', presupuesto.ubicacion);
        
        document.getElementById('incluyeProyecto').checked = presupuesto.incluyeProyecto;
        document.getElementById('incluyeLicencias').checked = presupuesto.incluyeLicencias;
        
       
        calcularPresupuesto();
        
       
        document.getElementById('calculadora').scrollIntoView({ behavior: 'smooth' });
    }
}

function seleccionarOpcionPorTexto(selectId, texto) {
    const select = document.getElementById(selectId);
    for (let i = 0; i < select.options.length; i++) {
        if (select.options[i].text === texto) {
            select.selectedIndex = i;
            break;
        }
    }
}

function eliminarPresupuesto(id) {
    if (confirm('¿Estás seguro de que quieres eliminar este presupuesto?')) {
        const presupuestosGuardados = JSON.parse(localStorage.getItem('presupuestos')) || [];
        const nuevosPresupuestos = presupuestosGuardados.filter(p => p.id != id);
        localStorage.setItem('presupuestos', JSON.stringify(nuevosPresupuestos));
        cargarPresupuestosGuardados();
    }
}

function imprimirPresupuesto() {
    const presupuesto = calcularPresupuesto();
    
    alert(`🏗️ LUCHO'S CONSTRUCCIÓN
PRESUPUESTO

Fecha: ${presupuesto.fecha}
Área: ${presupuesto.area}m² (Total: ${presupuesto.areaTotal}m²)
Tipo: ${presupuesto.tipoConstruccion}`);

    
    alert(`📊 DETALLES:
• Pisos: ${presupuesto.numPisos}
• Calidad: ${presupuesto.calidadAcabados}
• Ubicación: ${presupuesto.ubicacion}
• Proyecto: ${presupuesto.incluyeProyecto ? 'SÍ' : 'NO'}
• Licencias: ${presupuesto.incluyeLicencias ? 'SÍ' : 'NO'}`);

    alert(`💰 COSTOS:
• Por m²: Bs ${presupuesto.costoM2.toLocaleString('es-PE')}
• Construcción: Bs ${presupuesto.costoConstruccion.toLocaleString('es-PE')}
• Proyecto: Bs ${presupuesto.costoProyecto.toLocaleString('es-PE')}
• Licencias: Bs ${presupuesto.costoLicencias.toLocaleString('es-PE')}

💵 TOTAL: Bs ${presupuesto.presupuestoTotal.toLocaleString('es-PE')}`);

    alert(`📞 CONTACTO:
Tel: 60100793-70132373
Email: contacto@luchosconstruccion.com

📍 Válido por 30 días`);
}
 
document.addEventListener('DOMContentLoaded', function() {
   
    updateAuthUI();
    
 
    const btnLogin = document.getElementById('btnLogin');
    if (btnLogin) {
        btnLogin.addEventListener('click', function() {
            window.location.href = 'pages/login.html';
        });
    }
    
  
    const btnLogout = document.getElementById('btnLogout');
    if (btnLogout) {
        btnLogout.addEventListener('click', function() {
            logout();
        });
    }
    
  
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
    
  
    const btnHero = document.querySelector('.btn-hero');
    if (btnHero) {
        btnHero.addEventListener('click', function() {
            document.getElementById('calculadora').scrollIntoView({ behavior: 'smooth' });
        });
    }
    
   
    initCalculator();
});