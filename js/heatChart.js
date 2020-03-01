function getColourList(maxVal, minVal) {
  let green = 255; //i.e. FF
  let red = 0;
  let stepSize = 510 / (maxVal - minVal); //how many colors do you want?
  let colourArray = [];
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
  let ctx = canvas.getContext("2d");
  ctx.fillStyle = "rgb(200, 0, 0)";
  ctx.textAlign = "center";
  ctx.fillText(rowName, xPadding / 2, y + yStepSize / 2);
  let currentPos = xPadding;
  for (let val of values) {
    ctx.fillStyle = colourDetails.colourList[val - colourDetails.minVal - 1];
    ctx.fillRect(currentPos, y, xStepSize, yStepSize);
    currentPos += xStepSize + spacing;
  }
}

export const drawHeatChart = (canvasId,data) => {
    console.log(data);
  let canvas = document.getElementById(canvasId);
  let values = Object.values(data.values);
  let keys = Object.keys(data.values);
  let maxVal = values.reduce(function(accumum, val) {
    return Math.max(accumum || Math.max(...val), Math.max(...val));
  }, 0);
  let minVal = values.reduce(function(accumum, val) {
    return Math.min(accumum || 0, Math.min(...val));
  }, 0);
  let colourDetails = getColourList(maxVal, minVal);
  let xPadding = 50;
  let yPadding = 51;
  let spacing = 3;
  let stepSize =
    (canvas.width - xPadding) / values[0].length - spacing;
  let yStepSize =
    (canvas.height - yPadding) / keys.length - keys.length * spacing;
  let currentPos = xPadding + stepSize / 2;
  for (let val of data.periods) {
    if (canvas.getContext) {
      let ctx = canvas.getContext("2d");
      ctx.fillStyle = "rgb(200, 0, 0)";
      ctx.textAlign = "center";
      ctx.fillText(val, currentPos, 10);
      currentPos += stepSize + spacing;
    }
  }
  let y = 15;
  for (let row in data.values) {
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
