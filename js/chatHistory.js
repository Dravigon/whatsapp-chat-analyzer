
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



  // Round timestamps based on selected interval
  function roundTimestamp(timestamp, interval) {
    let m = moment(timestamp);
    if (!m.isValid()) {
      m = moment(timestamp, "DD/MM/YY, hh:mm:ss A");
    }
    if (interval === 'minute') return m.seconds(0).milliseconds(0).format("YYYY-MM-DD HH:mm");
    if (interval === 'hour') return m.minutes(0).seconds(0).milliseconds(0).format("YYYY-MM-DD HH");
    if (interval === 'day') return m.hours(0).minutes(0).seconds(0).milliseconds(0).format("YYYY-MM-DD");
    if (interval === 'month') return m.hours(0).minutes(0).seconds(0).milliseconds(0).format("YYYY-MM");
  }

  // Process data and group by interval
  function getFrequencyData(messages,interval) {
    const grouped = {};
    let currentTimeStamp = "";
    
    messages.forEach((data) => {

      let timestamp = data[0].match(/(.*\d)\ \-\ .*?:/)?.[1]||data[1]
      let user = data[2]
      if (!grouped[user]) grouped[user] = {};

      const key = roundTimestamp(timestamp, interval);

      if(key=="Invalid date")
        console.log(data,timestamp)

      grouped[user][key] = (grouped[user][key] || 0) + 1;
    });
          
    const allBins = [...new Set(Object.values(grouped).flatMap(obj => Object.keys(obj)))].sort();

    // Build datasets
    const datasets = Object.entries(grouped).map(([user, binData], i) => {
      const color = getRandomColor(); // expand as needed
      return {
        label: user,
        data: allBins.map(bin => binData[bin] || 0),
        borderColor: color,
        fill: true,
        tension: 0.3
      };
    });
    return {
      labels: allBins,
      data: datasets
    };
  }



  function drawChatHistory(canvasId,messages,interval="month") {
      // Initial chart render
    const ctx = document.getElementById(canvasId).getContext('2d');
    let chart;
    const freqData = getFrequencyData(messages , interval);
    if (chart) chart.destroy();

    chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: freqData.labels,
        datasets: freqData.data
      },
      options: {
        responsive: true,
        scales: {
          x: {
            title: { display: true, text: 'Time' }
          },
          y: {
            beginAtZero: true,
            title: { display: true, text: 'Message Count' }
          }
        },
        plugins: {
          title: {
            display: true,
            text: `Chat Message Frequency - Grouped by ${interval}`
          }
        }
      }
    });
  }

  export {drawChatHistory}