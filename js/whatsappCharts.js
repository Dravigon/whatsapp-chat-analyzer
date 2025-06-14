



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

function drawChatContribution(canvasId,messages) {
    const counts = {};
    messages.forEach(msg => {
        console.log({msg})
        counts[msg[2]] = (counts[msg[2]] || 0) + 1;
    });

    const users = Object.keys(counts);
    const messageCounts = Object.values(counts);


    // Pie chart setup
    const ctx = document.getElementById(canvasId).getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: users,
            datasets: [{
                label: 'Messages',
                data: messageCounts,
                backgroundColor(ctx) {
                    return getRandomColor()
                },
                borderColor: '#fff',
                borderWidth: 0.1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom' },
                title: {
                    display: true,
                    text: 'Chat Contribution by User'
                }
            }
        }
    });

}
export { drawChatContribution }