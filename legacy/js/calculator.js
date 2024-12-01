$(document).ready(function() {
    // Initialize tooltips
    $('[data-toggle="tooltip"]').tooltip();

    // Chart instance
    let profitChart = null;

    // Calculator functions
    function calculateROI(data) {
        const months = parseInt(data.timeframe);
        let totalPlants = parseInt(data.plantQuantity);
        const propagationRate = parseFloat(data.propagationRate) / 100;
        const pricePerPlant = parseFloat(data.pricePerPlant);
        const monthlyCosts = parseFloat(data.monthlyCosts);
        const marketingCosts = parseFloat(data.marketingCosts);
        const initialInvestment = parseFloat(data.initialInvestment);

        let monthlyData = [];
        let totalRevenue = 0;
        let totalCosts = initialInvestment;

        // Calculate monthly growth and revenue
        for (let month = 1; month <= months; month++) {
            const newPlants = Math.floor(totalPlants * propagationRate);
            totalPlants += newPlants;
            
            const monthlyRevenue = totalPlants * pricePerPlant * 0.1; // Assume 10% of plants sold per month
            totalRevenue += monthlyRevenue;
            
            const monthlyTotalCosts = monthlyCosts + marketingCosts;
            totalCosts += monthlyTotalCosts;

            monthlyData.push({
                month: month,
                plants: totalPlants,
                revenue: monthlyRevenue,
                costs: monthlyTotalCosts,
                profit: monthlyRevenue - monthlyTotalCosts
            });
        }

        const netProfit = totalRevenue - totalCosts;
        const roiPercentage = (netProfit / initialInvestment) * 100;

        return {
            totalRevenue,
            totalCosts,
            netProfit,
            roiPercentage,
            monthlyData
        };
    }

    function updateChart(monthlyData) {
        const ctx = document.getElementById('profitChart')?.getContext('2d');
        if (!ctx) {
            $('#chartContainer').html('<canvas id="profitChart"></canvas>');
        }

        const months = monthlyData.map(data => 'Month ' + data.month);
        const profits = monthlyData.map(data => data.profit);
        const revenues = monthlyData.map(data => data.revenue);
        const costs = monthlyData.map(data => data.costs);

        if (profitChart) {
            profitChart.destroy();
        }

        profitChart = new Chart(document.getElementById('profitChart').getContext('2d'), {
            type: 'line',
            data: {
                labels: months,
                datasets: [{
                    label: 'Net Profit',
                    data: profits,
                    borderColor: '#48bb78',
                    fill: false
                }, {
                    label: 'Revenue',
                    data: revenues,
                    borderColor: '#4299e1',
                    fill: false
                }, {
                    label: 'Costs',
                    data: costs,
                    borderColor: '#f56565',
                    fill: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    }]
                },
                tooltips: {
                    callbacks: {
                        label: function(tooltipItem, data) {
                            return data.datasets[tooltipItem.datasetIndex].label + ': $' + 
                                   tooltipItem.yLabel.toLocaleString();
                        }
                    }
                }
            }
        });
    }

    function formatCurrency(number) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(number);
    }

    function updateResults(results) {
        $('#totalRevenue').text(formatCurrency(results.totalRevenue));
        $('#totalCosts').text(formatCurrency(results.totalCosts));
        $('#netProfit').text(formatCurrency(results.netProfit));
        $('#roiPercentage').text(results.roiPercentage.toFixed(2) + '%');
        
        updateChart(results.monthlyData);
        $('#results').removeClass('hidden');
    }

    // Form submission handler
    $('#calculatorForm').on('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            initialInvestment: $('#initialInvestment').val(),
            timeframe: $('#timeframe').val(),
            plantQuantity: $('#plantQuantity').val(),
            pricePerPlant: $('#pricePerPlant').val(),
            propagationRate: $('#propagationRate').val(),
            monthlyCosts: $('#monthlyCosts').val(),
            marketingCosts: $('#marketingCosts').val()
        };

        const results = calculateROI(formData);
        updateResults(results);
    });

    // Reset button handler
    $('.btn-reset').on('click', function() {
        $('#calculatorForm')[0].reset();
        $('#results').addClass('hidden');
        if (profitChart) {
            profitChart.destroy();
            profitChart = null;
        }
    });

    // Print button handler
    $('.btn-print').on('click', function() {
        window.print();
    });

    // Save as PDF handler
    $('.btn-save-pdf').on('click', function() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Add title
        doc.setFontSize(20);
        doc.text('Snake Plant ROI Calculator Results', 20, 20);
        
        // Add results
        doc.setFontSize(12);
        doc.text('Total Revenue: ' + $('#totalRevenue').text(), 20, 40);
        doc.text('Total Costs: ' + $('#totalCosts').text(), 20, 50);
        doc.text('Net Profit: ' + $('#netProfit').text(), 20, 60);
        doc.text('ROI Percentage: ' + $('#roiPercentage').text(), 20, 70);

        // Add chart if visible
        if (profitChart) {
            const chartCanvas = document.getElementById('profitChart');
            const chartImage = chartCanvas.toDataURL('image/png');
            doc.addImage(chartImage, 'PNG', 20, 90, 170, 100);
        }

        // Save the PDF
        doc.save('snake-plant-roi-calculation.pdf');
    });
});
