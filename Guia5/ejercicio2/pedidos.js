// ===== Datos =====
const pedidos = [];          // Arreglo original (nunca se modifica al filtrar)
let precioMaximo = null;     // null = sin filtro

// ===== Elementos del DOM =====
const formPedido = document.querySelector("#formPedido");
const inputProducto = document.querySelector("#idProducto");
const inputPrecio = document.querySelector("#idPrecio");
const inputCantidad = document.querySelector("#idCantidad");
const inputPrecioMaximo = document.querySelector("#idPrecioMaximo");
const cuerpoTabla = document.querySelector("#idCuerpoTabla");
const totalUnidades = document.querySelector("#idTotalUnidades");
const montoTotal = document.querySelector("#idMontoTotal");
const mensaje = document.querySelector("#idMensaje");

// ===== Lógica (procesamiento de datos, sin tocar el HTML) =====

// Devuelve una lista de errores; si está vacía, los datos son válidos
function validarPedido(producto, precio, cantidad) {
  const errores = [];
  if (producto.trim() === "") {
    errores.push("El nombre del producto no puede estar vacío.");
  }
  if (Number.isNaN(precio) || precio <= 0) {
    errores.push("El precio debe ser un número mayor que cero.");
  }
  if (!Number.isInteger(cantidad) || cantidad <= 0) {
    errores.push("La cantidad debe ser un número entero positivo.");
  }
  return errores;
}

function calcularSubtotal(pedido) {
  return pedido.precio * pedido.cantidad;
}

function calcularTotalUnidades(lista) {
  return lista.reduce((total, p) => total + p.cantidad, 0);
}

function calcularMontoTotal(lista) {
  return lista.reduce((total, p) => total + calcularSubtotal(p), 0);
}

// filter devuelve un arreglo NUEVO, el original no cambia
function filtrarPorPrecio(lista, maximo) {
  return lista.filter((p) => p.precio <= maximo);
}

// ===== Actualización del HTML =====

function escaparHTML(texto) {
  return texto
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function pintarTabla(lista) {
  if (lista.length === 0) {
    cuerpoTabla.innerHTML =
      '<tr><td colspan="4" class="text-center text-muted">No hay pedidos para mostrar</td></tr>';
    return;
  }

  cuerpoTabla.innerHTML = lista
    .map(
      (p) => `
      <tr>
        <td>${escaparHTML(p.producto)}</td>
        <td>$${p.precio.toFixed(2)}</td>
        <td>${p.cantidad}</td>
        <td>$${calcularSubtotal(p).toFixed(2)}</td>
      </tr>`
    )
    .join("");
}

// Los totales se calculan sobre TODOS los pedidos registrados
function pintarTotales() {
  totalUnidades.textContent = calcularTotalUnidades(pedidos);
  montoTotal.textContent = `$${calcularMontoTotal(pedidos).toFixed(2)}`;
}

function mostrarMensaje(texto, tipo) {
  mensaje.innerHTML = texto
    ? `<div class="alert alert-${tipo} mb-0">${texto}</div>`
    : "";
}

function actualizarVista() {
  const lista =
    precioMaximo === null ? pedidos : filtrarPorPrecio(pedidos, precioMaximo);
  pintarTabla(lista);
  pintarTotales();
}

// ===== Eventos =====

formPedido.addEventListener("submit", (evento) => {
  evento.preventDefault(); // evita recargar la página

  const producto = inputProducto.value;
  const precio = Number(inputPrecio.value);
  const cantidad = Number(inputCantidad.value);

  const errores = validarPedido(producto, precio, cantidad);
  if (errores.length > 0) {
    mostrarMensaje(errores.join("<br>"), "danger");
    return;
  }

  pedidos.push({ producto: producto.trim(), precio, cantidad });
  formPedido.reset();
  mostrarMensaje("Pedido agregado correctamente.", "success");
  actualizarVista();
});

document.querySelector("#idBtnFiltrar").addEventListener("click", () => {
  const maximo = Number(inputPrecioMaximo.value);
  if (inputPrecioMaximo.value.trim() === "" || Number.isNaN(maximo) || maximo <= 0) {
    mostrarMensaje("Ingrese un precio máximo válido (mayor que cero).", "danger");
    return;
  }
  precioMaximo = maximo;
  mostrarMensaje("", "");
  actualizarVista();
});

document.querySelector("#idBtnMostrarTodos").addEventListener("click", () => {
  precioMaximo = null;
  inputPrecioMaximo.value = "";
  mostrarMensaje("", "");
  actualizarVista();
});

document.querySelector("#idBtnLimpiar").addEventListener("click", () => {
  pedidos.length = 0; // vacía el arreglo
  precioMaximo = null;
  inputPrecioMaximo.value = "";
  mostrarMensaje("", "");
  actualizarVista();
});

// Pintado inicial
actualizarVista();