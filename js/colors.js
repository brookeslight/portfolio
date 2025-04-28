function setup() {
    const canvas = createCanvas(windowWidth*0.75, windowHeight*0.75);
    canvas.parent('canvas-container');
    noStroke();
}

function draw() {
    // Use a fixed Y value (luminance)
    const y = 128;
    // Normalize mouseX and mouseY to [0, 1] and scale to [16, 240] for Cb and Cr
    const cb = map(mouseX, 0, width, 16, 240); // Cb value
    const cr = map(mouseY, 0, height, 16, 240); // Cr value

    // Convert YCbCr to RGB
    const r = y + 1.402 * (cr - 128);
    const g = y - 0.344136 * (cb - 128) - 0.714136 * (cr - 128);
    const b = y + 1.772 * (cb - 128);

    // Ensure RGB values are within [0, 255]
    const red = constrain(r, 0, 255);
    const green = constrain(g, 0, 255);
    const blue = constrain(b, 0, 255);

    // Set the background color
    background(red, green, blue);
}
