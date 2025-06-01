  
  // Round timestamps based on selected interval
  function roundTimestamp(timestamp, interval) {
    const m = moment(timestamp);
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

      let timestamp = data[0].match(/(.*\d)\ \-\ .*?:/)[1]
      let user = data[2]
      if (!grouped[user]) grouped[user] = {};

      const key = roundTimestamp(timestamp, interval);


      grouped[user][key] = (grouped[user][key] || 0) + 1;
    });
          
    const allBins = [...new Set(Object.values(grouped).flatMap(obj => Object.keys(obj)))].sort();

    // Build datasets
    const datasets = Object.entries(grouped).map(([user, binData], i) => {
      const color = ['green', 'orange', 'yellow'][i % 3]; // expand as needed
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