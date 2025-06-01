  
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
    const freq = {};
    let currentTimeStamp = "";
    
    messages.forEach((data) => {
      let timestamp = data[1]
      const key = roundTimestamp(timestamp, interval);

      console.log({key})
      if(key == 'Invalid date')console.log(timestamp,"-----------invalid",{data})
      freq[key] = (freq[key] || 0) + 1;
    });
    const sortedKeys = Object.keys(freq).sort();
    return {
      labels: sortedKeys,
      data: sortedKeys.map(key => freq[key])
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
        datasets: [{
          label: `Messages per ${interval}`,
          data: freqData.data,
          borderColor: '#007bff',
          backgroundColor: 'rgba(0, 123, 255, 0.1)',
          fill: true,
          tension: 0.3,
          pointRadius: 4
        }]
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