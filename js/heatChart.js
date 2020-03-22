function getColourList(maxVal, minVal) {
  var green = 255; //i.e. FF
  var red = 0;
  var stepSize = 510 / (maxVal - minVal); //how many colors do you want?
  var colourArray = [];
  while (red < 255) {
    red += stepSize;
    if (red > 255) {
      red = 255;
    }
    //rgb(200, 0, 0)
    colourArray.push("rgb(" + red + "," + green + "," + 0 + ")"); //assume output is function that takes RGB
  }
  while (green > 0) {
    green -= stepSize;
    if (green < 0) {
      green = 0;
    }
    colourArray.push("rgb(" + red + "," + green + "," + 0 + ")"); //assume output is function that takes RGB
  }
  return {
    stepSize: stepSize,
    colourList: colourArray,
    minVal: minVal
  };
}
function drawLegends(
  canvas,
  xPadding,
  size,
  xOrigin,
  xStepSize,
  yStepSize,
  spacing,
  colourDetails,
  minValue,
  maxValue,
  xSize
) {
  var endX = (xStepSize + spacing) * size + xPadding;
  var startX = xPadding;
  var ctx = canvas.getContext("2d");

  var currentPos = (xStepSize + spacing) * xSize - xPadding - xOrigin;

  ctx.fillStyle = "rgb(0, 0, 0)";
  ctx.textAlign = "center";
  ctx.save();
  ctx.translate(100, 300);
  ctx.rotate(-0.5 * Math.PI);
  ctx.fillText(
    minValue + " chats",
    ((xStepSize + spacing) * xSize) / 2 - 20,
    currentPos - xPadding - xOrigin - 2
  );
  ctx.fillText(
    maxValue + " chats",
    ((xStepSize + spacing) * xSize) / 2 - 20,
    currentPos -
      xPadding -
      xOrigin +
      ((size * xStepSize * 0.85) / colourDetails.colourList.length) * maxValue +
      10
  );
  ctx.restore();
  xStepSize = (size * xStepSize * 0.85) / colourDetails.colourList.length;
  ctx.fillText(
    "Legend (Chats per hour)",
    (maxValue * xStepSize) / 2 + currentPos,
    10
  );

  for (var i = minValue; i <= maxValue; i++) {
    ctx.fillStyle = colourDetails.colourList[i - minValue];
    ctx.fillRect(currentPos, 20, xStepSize, yStepSize - 20);
    currentPos += xStepSize;
  }
}
function drawRow(
  canvas,
  xPadding,
  spacing,
  rowName,
  values,
  colourDetails,
  xStepSize,
  yStepSize,
  y
) {
  var ctx = canvas.getContext("2d");
  ctx.fillStyle = "rgb(200, 0, 0)";
  ctx.textAlign = "center";
  ctx.fillText(rowName, xPadding / 2, y + yStepSize / 2);
  var currentPos = xPadding;
  for (var val of values) {
    ctx.fillStyle = colourDetails.colourList[val - colourDetails.minVal - 1];
    ctx.fillRect(currentPos, y, xStepSize, yStepSize);
    currentPos += xStepSize + spacing;
  }
}

export const drawHeatChart = (canvasId,data) => {
  var values = Object.values(data.values);
  var keys = Object.keys(data.values);
  var maxVal = values.reduce(function(accumum, val) {
    return Math.max(accumum || Math.max(...val), Math.max(...val));
  }, 0);
  var minVal = values.reduce(function(accumum, val) {
    return Math.min(accumum || 0, Math.min(...val));
  }, 0);
  var colourDetails = getColourList(maxVal, minVal);
  var canvas = document.getElementById(canvasId);
  var xPadding = 50;
  var yPadding = 100;
  var spacing = 1;
  var stepSize = (canvas.width - xPadding) / values[0].length - spacing;
  var yStepSize =
    (canvas.height - yPadding) / keys.length - keys.length * spacing;
  var currentPos = xPadding + stepSize / 2;
  drawLegends(
    canvas,
    xPadding,
    keys.length,
    xPadding,
    stepSize,
    yStepSize,
    spacing,
    colourDetails,
    minVal,
    maxVal,
    values[0].length
  );
  for (var val of data.periods) {
    if (canvas.getContext) {
      var ctx = canvas.getContext("2d");
      ctx.fillStyle = "rgb(200, 0, 0)";
      ctx.textAlign = "center";
      ctx.fillText(val, currentPos, yPadding - 10);
      currentPos += stepSize + spacing;
    }
  }
  var y = yPadding;
  for (var row in data.values) {
    drawRow(
      canvas,
      xPadding,
      spacing,
      row,
      data.values[row],
      colourDetails,
      stepSize,
      yStepSize,
      y
    );
    y += yStepSize + spacing;
  }
}
