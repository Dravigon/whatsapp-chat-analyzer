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
                backgroundColor: [
                    '#ff6384',
                    '#36a2eb',
                    '#ffcd56',
                    '#4bc0c0',
                    '#9966ff',
                    '#ff9f40'
                ],
                borderColor: '#fff',
                borderWidth: 2
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