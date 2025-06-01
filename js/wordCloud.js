function drawWordCloud(canvasId,messages){
    const wordCounts = {};
messages.toLowerCase().replace(/[^\w\s]/g, "").split(/\s+/).forEach(word => {
    if(Number.isInteger(+word)){
        return;
    }
  if (word.length > 3) { // ignore short/common words
    wordCounts[word] = (wordCounts[word] || 0) + 1;
  }
});

// Convert to wordcloud2 format: [word, weight]
const wordArray = Object.entries(wordCounts);

WordCloud(document.getElementById(canvasId), {
    list: wordArray,
    gridSize: 1,
    weightFactor: 1,
    fontFamily: 'sans-serif',
    color: 'random-dark',
    backgroundColor: '#fff',
    rotateRatio: 0.5
  });
}

export {drawWordCloud}