const $ = selector => document.querySelector(selector);
const $$ = selector => document.querySelectorAll(selector);

//Elementos
const $canvas = $('#canvas');
const colorPicker = $('#color-picker');
const clearBtn = $('#clear-btn');
const drawBtn = $('#draw-btn');
const eraseBtn = $('#erase-btn');
const fillBtn = $('#fill-btn');
const rectangleBtn = $('#rectangle-btn');
const ellipseBtn = $('#ellipse-btn');
const pickerBtn = $('#picker-btn');
const starBtn = $('#star-btn');

//Constantes
const MODES = {
 DRAW: 'draw',
 ERASE: 'erase',
 RECTANGLE: 'rectangle',
 ELLIPSE: 'ellipse',
 PICKER : 'picker',
 FILL: 'fill',
 STAR: 'star',
 CLEAR: 'clear'
}

//Llamando al contexto
const ctx = $canvas.getContext('2d');

//Variables
let isDrawing = false;
//variables en dos formas
let startX, startY;
let lastX = 0;
let lastY = 0;
let mode = MODES.DRAW;
let imageCanvasData;


//Eventos

$canvas.addEventListener('mousedown', StartDrawing);
$canvas.addEventListener('mousemove', Draw);
$canvas.addEventListener('mouseup', StopDrawing);
$canvas.addEventListener('mouseleave', StopDrawing);
clearBtn.addEventListener('click', ClearCanvas);
colorPicker.addEventListener('change', HandlerChangeColor)
drawBtn.addEventListener('click', () => setMode(MODES.DRAW))
rectangleBtn.addEventListener('click', () => setMode(MODES.RECTANGLE))
ellipseBtn.addEventListener('click', () => setMode(MODES.ELLIPSE))
eraseBtn.addEventListener('click', () => setMode(MODES.ERASE))
fillBtn.addEventListener('click', () => setMode(MODES.FILL))
pickerBtn.addEventListener('click', () => setMode(MODES.PICKER))
starBtn.addEventListener('click', () => setMode(MODES.STAR))


//Funciones

function StartDrawing(event){
 isDrawing = true;
 const { offsetX, offsetY } = event;

 [startX, startY] = [offsetX, offsetY];
 [lastX, lastY] = [offsetX, offsetY];

 //recuperamos la imagen de todo el canvas
 imageCanvasData = ctx.getImageData(0, 0, $canvas.width, $canvas.height)
 
}

function Draw(event){
 if(!isDrawing) return;

 const { offsetX, offsetY } = event;
 
 if(mode === MODES.DRAW || mode === MODES.ERASE){
  
  //comenzar el trazado del dibujo
  ctx.beginPath();
  //seguir el trazado actual
  ctx.moveTo(lastX, lastY);
  //dibujamos el trazado con la nueva coordenada
  ctx.lineTo(offsetX, offsetY);
  //dibujar
  ctx.stroke();
 
  //color
  // ctx.strokeStyle = colorPicker.value;
 
  //actualizar la posición
  [lastX, lastY] = [offsetX, offsetY];
 }

 if(mode === MODES.RECTANGLE){

  //recuperamos la imagen de todo el canvas
  ctx.putImageData(imageCanvasData, 0, 0);

  //Coordenadas del primer click
  const width = offsetX - startX
  const height = offsetY - startY

  //dibujamos el rectangulo
  ctx.beginPath();
  ctx.rect(startX, startY, width, height)
  ctx.stroke();
  ctx.lineWidth = 2

  return
 }

 if(mode === MODES.ELLIPSE){

  //recuperamos la imagen de todo el canvas
  ctx.putImageData(imageCanvasData, 0, 0);

  //Coordenadas del primer click
  const width = offsetX - startX
  const height = offsetY - startY

  //dibujamos el ovalo
  ctx.beginPath();
  ctx.ellipse(startX, startY, width, height, 0, 0, 2 * Math.PI)
  ctx.stroke();
  ctx.lineWidth = 2

  return
 }

 if(mode === MODES.PICKER){



  return
 }
}

function StopDrawing(event){
 isDrawing = false;
}

function ClearCanvas(){
 ctx.clearRect(0, 0, $canvas.width, $canvas.height);
}

function HandlerChangeColor(){
 const { value } = colorPicker

 ctx.strokeStyle = value;
}

async function setMode (newMode) {
 //guardamos el modo anterior
 let previousMode = mode
 //cambiamos el modo
 mode = newMode

 //para limpiar el boton activo actual
 $('button.active')?.classList.remove('active')

 if(mode === MODES.DRAW){
  drawBtn.classList.add('active')
  $canvas.style.cursor = 'crosshair'
  ctx.globalCompositeOperation = 'source-over'
  ctx.lineWidth = 2
  return
 }

 //globalCompositeOperation del context
 if(mode === MODES.ERASE){
  eraseBtn.classList.add('active')
  //cambiamos el cursor
  $canvas.style.cursor = 'url(icons/erase.png), auto'
  //cambiando el globalCompositeOperation del context
  ctx.globalCompositeOperation = 'destination-out'
  ctx.lineWidth = 15
  return
 }

 if(mode === MODES.RECTANGLE){
  rectangleBtn.classList.add('active')
  $canvas.style.cursor = 'nw-resize'
  ctx.globalCompositeOperation = 'source-over'
  ctx.lineWidth = 2
  return
 }

 if(mode === MODES.ELLIPSE){
  ellipseBtn.classList.add('active')
  $canvas.style.cursor = 'nw-resize'
  //cambiando el globalCompositeOperation del context
  ctx.globalCompositeOperation = 'source-over'
  ctx.lineWidth = 2
  ctx.lineJoin = 'round'
  return
 }

 if(mode === MODES.FILL){
  fillBtn.classList.add('active')
  $canvas.style.cursor = 'url(icons/cursor-fill.png), auto'
  return
 }


 if(mode === MODES.PICKER){
  pickerBtn.classList.add('active')
  //abrir el eyeDropper
  const eyerDropper = new window.EyeDropper();
  try {
   const result = await eyerDropper.open();
   //recuperando el color del picker
   const { sRGBHex } = result;
   //guardar el color elegido
   ctx.strokeStyle = sRGBHex
   colorPicker.value = sRGBHex
   //volver al modo anterior
   setMode(previousMode)
  } catch (error) {
   console.log(error);
  }
  return
 }

 if(mode === MODES.STAR){
  starBtn.classList.add('active')
  return
 }

}

setMode(MODES.DRAW)





