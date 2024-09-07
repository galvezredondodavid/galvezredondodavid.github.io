// Crear un contexto para el gráfico
const ctx = document.getElementById('myChart').getContext('2d');

// Añadir una variable para la longitud máxima de los datos
const longitud = 50;

// Inicializar los datos
const data = {
    labels: [],
    datasets: [{
        label: 'Precio',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 3,
    }]
};

// Crear la gráfica de línea sin escalas visibles y sin leyenda
const chart = new Chart(ctx, {
    type: 'line',
    data: data,
    options: {
        events: [],
        responsive: true,
        scales: {
            x: {
                display: false // Ocultar la escala x
            },
            y: {
                display: false // Ocultar la escala y
            }
        },
        plugins: {
            legend: {
                display: false // Ocultar la leyenda
            }
        }
    }
});

// Crear el indicador de color
const indicator = document.createElement('div');
indicator.style.position = 'absolute';
indicator.style.bottom = '20px';
indicator.style.right = '20px';
indicator.style.width = '20px';
indicator.style.height = '20px';
indicator.style.border = '2px solid white'; // Añadir borde blanco
document.body.appendChild(indicator);

window.onmousemove = function(e) {
    window.mouseY = e.clientY;
    const windowHeight = window.innerHeight; // Altura de la ventana
    const indicator = document.getElementById('indicator');

    if (window.mouseY > windowHeight / 2) {
        indicator.style.backgroundColor = 'red';
    } else if (window.mouseY < windowHeight / 2){
        indicator.style.backgroundColor = 'green';
    }
}

// Variables para ajustar las probabilidades
const bullishProbability = 0.7; // Probabilidad de que suba cuando el ratón está por encima
const bearishProbability = 0.7; // Probabilidad de que baje cuando el ratón está por debajo

setInterval(() => {
    const chaosFactor = 0.5;
    const mouseY = window.mouseY;
    const windowHeight = window.innerHeight;

    let priceChange;
    if (mouseY === undefined) {
        // Si no se detecta el ratón, la probabilidad es del 50% y la cantidad es aleatoria
        priceChange = chaosFactor * (Math.random() < 0.5 ? 1 : -1) * Math.random() / 10;
    } else {
        // Calcula la probabilidad de cambio de precio
        const isBullish = mouseY <= windowHeight / 2;
        const randomFactor = Math.random() < (isBullish ? bullishProbability : 1 - bearishProbability) ? 1 : -1;
        priceChange = chaosFactor * randomFactor * Math.random() / 10;
    }

    const lastPrice = chart.data.datasets[0].data.length > 0
        ? chart.data.datasets[0].data[chart.data.datasets[0].data.length - 1].y
        : 100;

    const newPrice = lastPrice + priceChange;

    if (chart.data.labels.length > longitud) {
        chart.data.labels.shift();
        chart.data.datasets[0].data.shift();
    }

    chart.data.labels.push('');
    chart.data.datasets[0].data.push({ x: chart.data.labels.length, y: newPrice });

    chart.update();
}, 1000);