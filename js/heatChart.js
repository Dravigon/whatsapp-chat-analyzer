


function createRandomColorGenerator() {
  // Generate a pool of colors first
  let colorPool = [];

  // Helper to generate a random HEX color
  function getRandomHexColor() {
    return '#' + Math.random().toString(16).substring(2, 8);
  }

  // Fill pool with colors
  for (let i = 0; i < 100; i++) {
    colorPool.push(getRandomHexColor()); 
  }

  // Shuffle pool (Fisher–Yates algorithm)
  for (let i = colorPool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [colorPool[i], colorPool[j]] = [colorPool[j], colorPool[i]];
  }

  return function getColor() {
    if (colorPool.length === 0) {
      // Refill or reshuffle
      for (let i = 0; i < 100; i++) {
        colorPool.push(getRandomHexColor()); 
      }
      for (let i = colorPool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [colorPool[i], colorPool[j]] = [colorPool[j], colorPool[i]];
      }
    }
    return colorPool.pop();
  };
}

const getRandomColor = createRandomColorGenerator();

function drawHeatChart(canvasId, messages) {

  const matrix = Array(7).fill(null).map(() => Array(24).fill(0));

  messages.forEach((data) => {

    let timestamp = data[0].match(/(.*\d)\ \-\ .*?:/)?.[1]||data[1]

    let m = moment(timestamp);
    if (!m.isValid()) {
      m = moment(timestamp, "DD/MM/YY, hh:mm:ss A");
    }
    const weekday = m.isoWeekday() % 7; // 0 = Sunday, 6 = Saturday
    const hour = m.hour();
    console.log({ weekday })
    if (Number.isNaN(weekday))
      return;
    matrix[weekday][hour]++;
  });

  // Flatten into Chart.js matrix format
  const data = [];
  for (let day = 0; day < 7; day++) {
    for (let hour = 0; hour < 24; hour++) {
      data.push({
        x: hour,
        y: day,
        v: matrix[day][hour],
      });
    }
  }


  const ctx = document.getElementById(canvasId).getContext("2d");
  const chart = new Chart(ctx, {
    type: 'matrix',
    data: {
      datasets: [{
        label: 'Messages',
        data: data,
        backgroundColor(ctx) {
          const value = ctx.dataset.data[ctx.dataIndex].v;
          const max = 5; // max expected messages per cell, adjust as needed
          const t = Math.min(value / max, 1); // normalized 0 to 1

          // Linear interpolate from yellow (255,255,0) to red (255,0,0)
          const r = 255;
          const g = Math.round(255 * (1 - t));
          const b = 0;

          return `rgb(${r},${g},${b})`;
        },
        width: ({ chart }) => (chart.chartArea || {}).width / 24 - 1,
        height: ({ chart }) => (chart.chartArea || {}).height / 7 - 1,
        borderWidth: 0.1,
        borderColor: '#ccc',
      }]
    },
    options: {
      responsive: true,
      plugins: {
        tooltip: {
          callbacks: {
            title: d => `Hour: ${d[0].raw.x}, Day: ${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d[0].raw.y]}`,
            label: d => `Messages: ${d.raw.v}`
          }
        },
        legend: { display: false },
        title: {
          display: true,
          text: 'Chat Frequency Heatmap (Hour vs Weekday)'
        }
      },
      scales: {
        x: {
          type: 'linear',
          position: 'bottom',
          min: 0,
          max: 23,
          ticks: { stepSize: 1 },
          title: { display: true, text: 'Hour of Day' }
        },
        y: {
          type: 'linear',
          min: 0,
          max: 6,
          ticks: {
            callback: val => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][val],
            stepSize: 1
          },
          title: { display: true, text: 'Day of Week' }
        }
      }
    }
  });
}


export { drawHeatChart }