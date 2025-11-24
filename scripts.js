function changePenguinColor(element, colorName) {
    // Remover selección de todos los colores
    const allColors = document.querySelectorAll('.color-option');
    allColors.forEach(c => c.classList.remove('selected'));

    // Añadir selección al color clickeado
    element.classList.add('selected');

    // Cambiar la imagen del pingüino
    const penguinImg = document.getElementById('penguinImg');
    penguinImg.src = `PinguinosColores/penguin-${colorName}.png`;

    // Para revisar que el cambio se haga bien por consola
    console.log('Cambiando a penguin-' + colorName + '.png');
}