$(document).ready(function() {
    var cpmGaugeData, tempGaugeData, photoAvgGaugeData, photoGaugeData;
    var cpmGaugeChart, tempGaugeChart, photoAvgGaugeChart, photoGaugeChart;
    var cpmGaugeOptions, tempGaugeOptions, photoAvgGaugeOptions, photoGaugeOptions;
    var lineData;
    var lineChart;
    var lineChartOptions;
    var socket = io.connect(window.location.href)

    socket.on('connect', function(data) {
        socket.emit('join', 'Connection from browser established.');
    });

    socket.on('cpmBroadcast', function(data) {
        cpmGaugeData.setValue(0, 1, Number(data));
        cpmGaugeChart.draw(cpmGaugeData, cpmGaugeOptions);

        lineData.addRow(
            [new Date(), Number(data), null, null, null]);
        lineChart.draw(lineData, lineChartOptions);

        trimData();
    });

    socket.on('envbroadcast', function(data) {
        tempGaugeData.setValue(0, 1, Number(data['tempGet']));
        photoAvgGaugeData.setValue(0, 1, Number(data['photoAvgGet']));
        photoGaugeData.setValue(0, 1, Number(data['photoGet']));
        tempGaugeChart.draw(tempGaugeData, tempGaugeOptions);
        photoAvgGaugeChart.draw(photoAvgGaugeData, photoAvgGaugeOptions);
        photoGaugeChart.draw(photoGaugeData, photoGaugeOptions);

        lineData.addRow(
            [new Date(), null, Number(data['tempGet']), Number(data['photoAvgGet']), Number(data['photoGet'])]);
        lineChart.draw(lineData, lineChartOptions);

        trimData();
    });

    google.charts.load('current', {
        'packages': ['corechart', 'line', 'gauge']
    });
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {

        cpmGaugeData = google.visualization.arrayToDataTable([
            ['Label', 'Value'],
            ['CPM', 0]
        ]);
        tempGaugeData = google.visualization.arrayToDataTable([
            ['Label', 'Value'],
            ['Temperature', 0]
        ]);
        photoAvgGaugeData = google.visualization.arrayToDataTable([
            ['Label', 'Value'],
            ['Photo-Avg', 0]
        ]);
        photoGaugeData = google.visualization.arrayToDataTable([
            ['Label', 'Value'],
            ['Photo', 0]
        ]);

        lineData = new google.visualization.DataTable();
        lineData.addColumn('datetime', 'Time');
        lineData.addColumn('number', 'CPM');
        lineData.addColumn('number', 'Temperature');
        lineData.addColumn('number', 'Photo-Average');
        lineData.addColumn('number', 'Photo');

        cpmGaugeOptions = {
            width: 225,
            height: 250,
            minorTicks: 10,
            max: 40,
            greenFrom: 0,
            greenTo: 27,
            yellowFrom: 27,
            yellowTo: 35,
            redFrom: 35,
            redTo: 40
        };
        tempGaugeOptions = {
            width: 225,
            height: 250,
            minorTicks: 10,
            max: 40,
            greenFrom: 16,
            greenTo: 24,
            yellowFrom: 24,
            yellowTo: 30,
            redFrom: 30,
            redTo: 40
        };
        photoAvgGaugeOptions = {
            width: 225,
            height: 250,
            minorTicks: 10,
            max: 1023,
            redFrom: 0,
            redTo: 100,
            yellowFrom: 100,
            yellowTo: 200,
            greenFrom: 200,
            greenTo: 1023
        };
        photoGaugeOptions = photoAvgGaugeOptions;

        lineChartOptions = {
            interpolateNulls: true,
            series: {
                0: {
                    targetAxisIndex: 0
                },
                1: {
                    targetAxisIndex: 0
                },
                2: {
                    targetAxisIndex: 1
                },
                3: {
                    targetAxisIndex: 1
                },
            },
            vAxes: {
                // Adds titles to each axis.
                0: {
                    title: 'CPM & Temperature',
                    minValue:0,
                    viewWindow: {
                        min: 0
                    }
                },
                1: {
                    title: 'Photodiode',
                    minValue:0,
                    viewWindow: {
                        min: 0
                    }
                }
            },
            legend: {
                position: 'bottom'
            },
            chartArea: {
                left: 50,
                width: 750,
                top: 50
            }
        };

        cpmGaugeChart = new google.visualization.Gauge(document.getElementById('cpm_div'));
        tempGaugeChart = new google.visualization.Gauge(document.getElementById('temp_div'));
        photoAvgGaugeChart = new google.visualization.Gauge(document.getElementById('photoavg_div'));
        photoGaugeChart = new google.visualization.Gauge(document.getElementById('photo_div'));
        lineChart = new google.visualization.LineChart(document.getElementById('linechart_div'));

        cpmGaugeChart.draw(cpmGaugeData, cpmGaugeOptions);
        tempGaugeChart.draw(tempGaugeData, tempGaugeOptions);
        photoAvgGaugeChart.draw(photoAvgGaugeData, photoAvgGaugeOptions);
        photoGaugeChart.draw(photoGaugeData, photoGaugeOptions);
        lineChart.draw(lineData, lineChartOptions);
    }

    function trimData() {
        while (lineData.getNumberOfRows() > 1500) {
            lineData.removeRow(0);
        };
    };

    function getTimeVal() {
        var time = new Date();
        return [time.getHours(), time.getMinutes(), time.getSeconds()];
    }
});
