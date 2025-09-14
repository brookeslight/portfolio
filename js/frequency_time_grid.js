

let numerology = 0; // μ = 0 to 8
const numerologyMin = 0;
const numerologyMax = 8;

// Grid parameters
const nSubcarriersRB = 12; // 12 subcarriers per RB
const nRB = 10; // Number of resource blocks (for illustration)
const nBWP = 2; // Number of BWPs
const nCarrier = 1; // Only one carrier shown
const nRadioFrames = 1; // Only one radio frame shown
const nSubframes = 10;
const nOFDMSymbols = 14; // per slot

// slots per subframe: 2^μ for μ = 0..8
const nSlotsPerSubframe = Array.from({length: 9}, (_, i) => Math.pow(2, i));

function setup() {
    let canvas = createCanvas(1920, 1080);
    canvas.parent('canvas-container');
    noStroke();
    textFont('monospace', 12);
}

function draw() {
    background(240);
    drawFrequencyTimeGrid();
    drawLabels();
}

function keyPressed() {
    if (keyCode === UP_ARROW && numerology < numerologyMax) {
        numerology++;
    } else if (keyCode === DOWN_ARROW && numerology > numerologyMin) {
        numerology--;
    }
}


function drawFrequencyTimeGrid() {
    // Frequency domain (y), Time domain (x)
    const subcarrierSpacing = 15 * Math.pow(2, numerology); // kHz
    const nSlots = nSlotsPerSubframe[numerology] * nSubframes;
    const gridX = 120, gridY = 60;
    const gridW = 700, gridH = 350;
    const rbW = gridW / nSlots;
    const rbH = gridH / nRB;


    // Draw Resource Blocks (RBs) with bold borders
    for (let slot = 0; slot < nSlots; slot++) {
        for (let rb = 0; rb < nRB; rb++) {
            // RB color: alternating blue/white
            if ((rb + slot) % 2 === 0) {
                fill(220, 235, 255);
            } else {
                fill(255);
            }
            stroke(60, 120, 200);
            strokeWeight(2);
            rect(gridX + slot * rbW, gridY + rb * rbH, rbW, rbH);

            // Draw REs inside RB (light grid)
            stroke(180, 200, 230, 120);
            strokeWeight(1);
            for (let sym = 0; sym < nOFDMSymbols; sym++) {
                let x = gridX + slot * rbW + sym * (rbW / nOFDMSymbols);
                line(x, gridY + rb * rbH, x, gridY + (rb + 1) * rbH);
            }
            for (let sc = 0; sc < nSubcarriersRB; sc++) {
                let y = gridY + rb * rbH + sc * (rbH / nSubcarriersRB);
                line(gridX + slot * rbW, y, gridX + (slot + 1) * rbW, y);
            }
            noFill();
        }
    }
    noStroke();


    // Draw BWP boundaries (horizontal lines, green, bold)
    let bwpSize = nRB / nBWP;
    stroke(0, 180, 0);
    strokeWeight(4);
    for (let bwp = 1; bwp < nBWP; bwp++) {
        let by = gridY + bwp * bwpSize * rbH;
        line(gridX, by, gridX + gridW, by);
    }
    noStroke();

    // Draw slot boundaries (vertical lines, orange, bold)
    stroke(255, 140, 0);
    strokeWeight(3);
    for (let slot = 1; slot < nSlots; slot++) {
        let sx = gridX + slot * rbW;
        line(sx, gridY, sx, gridY + gridH);
    }
    noStroke();

    // Frequency axis labels (y)
    fill(30, 60, 120);
    textAlign(RIGHT, CENTER);
    textSize(13);
    for (let rb = 0; rb <= nRB; rb++) {
        let y = gridY + rb * rbH;
        let freq = rb * nSubcarriersRB * subcarrierSpacing;
        text(freq + ' kHz', gridX - 10, y + (rb === nRB ? -8 : 8));
    }
    textSize(12);

    // Time axis labels (x)
    textAlign(CENTER, TOP);
    textSize(13);
    for (let slot = 0; slot <= nSlots; slot++) {
        let x = gridX + slot * rbW;
        text('Slot ' + slot, x, gridY + gridH + 5);
    }
    textSize(12);

    // Show number of OFDM symbols between slot 0 and slot 1
    if (nSlots > 0) {
        let x0 = gridX;
        let x1 = gridX + rbW;
        let yMid = gridY + gridH + 40;
        // Draw a double-headed arrow
        stroke(120, 0, 0);
        strokeWeight(2);
        line(x0, yMid, x1, yMid);
        // Arrow heads
        let ah = 8, aw = 5;
        // Left arrow
        line(x0, yMid, x0 + aw, yMid - ah);
        line(x0, yMid, x0 + aw, yMid + ah);
        // Right arrow
        line(x1, yMid, x1 - aw, yMid - ah);
        line(x1, yMid, x1 - aw, yMid + ah);
        noStroke();
        fill(120, 0, 0);
        textAlign(CENTER, BOTTOM);
        text(nOFDMSymbols + ' OFDM symbols', (x0 + x1) / 2, yMid - 6);
    }
}


function drawLabels() {
    fill(0);
    textAlign(LEFT, TOP);
    let labelY = 520; // Move labels even lower below the grid
    text('Numerology (μ): ' + numerology + ' (Press UP/DOWN)', 20, labelY);
    text('Subcarrier spacing: ' + (15 * Math.pow(2, numerology)) + ' kHz', 20, labelY + 20);
    text('Slots per subframe: ' + nSlotsPerSubframe[numerology], 20, labelY + 40);
    text('Resource Block: colored rectangles', 20, labelY + 60);
    text('Resource Element: colored small cells', 20, labelY + 80);
    text('BWP boundary: green lines', 20, labelY + 100);
    text('Slot boundary: blue lines', 20, labelY + 120);
    textAlign(CENTER, CENTER);
    // Move x-axis label below the grid
    text('Time Domain (slots)', 470, 440);
    // y-axis label remains on the left
    push();
    translate(60, 240);
    rotate(-HALF_PI);
    text('Frequency Domain (kHz)', 0, 0);
    pop();
}
