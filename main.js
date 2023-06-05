var expenses = [];
    var myChart;

    function updateChart() {
        var salary = parseFloat(document.getElementById('salary').value);

        var data = [];
        var totalExpenses = 0;
        for (var i = 0; i < expenses.length; i++) {
            var expense = expenses[i].value;
            totalExpenses += expense;
            var percentage = (expense / salary) * 100;
            data.push({
                value: expense,
                percentage: percentage.toFixed(2),
                label: expenses[i].name
            });
        }
        var remainingSalary = salary - totalExpenses;
        data.push({
            value: remainingSalary,
            percentage: ((remainingSalary / salary) * 100).toFixed(2),
            label: "Restante do Salário"
        });

        var ctx = document.getElementById('myChart').getContext('2d');
        if (myChart) {
            myChart.data.labels = data.map(function(item) {
                return item.label;
            });
            myChart.data.datasets[0].data = data.map(function(item) {
                return item.value;
            });
            myChart.update();
        } else {
            myChart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: data.map(function(item) {
                        return item.label;
                    }),
                    datasets: [{
                        data: data.map(function(item) {
                            return item.value;
                        }),
                        backgroundColor: [
                            '#FF6384',
                            '#36A2EB',
                            '#FFCE56',
                            '#4BC0C0',
                            '#9966FF',
                            '#FF9F40',
                            '#8D42F4',
                            '#FF8A80',
                            '#7CD9FF',
                            '#FFC400',
                            '#80CBC4',
                            '#f70505'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'right'
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    var label = context.label || '';
                                    var value = context.raw || 0;
                                    var dataset = context.chart.data.datasets[0];
                                    var total = dataset.data.reduce(function(acc, val) {
                                        return acc + val;
                                    }, 0);
                                    var percentage = (value / total) * 100;

                                    if (!isNaN(percentage)) {
                                        percentage = percentage.toFixed(0);
                                    } else {
                                        percentage = '0.00';
                                    }

                                    return label + ': R$ ' + value.toLocaleString('pt-BR') + ' (' + percentage + '%)';
                                }
                            }
                        }
                    }
                }
            });
        }

        // Atualiza o resumo das despesas
        document.getElementById('total-expenses').textContent = isNaN(totalExpenses) ? 'R$ 00,00' : totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
        document.getElementById('total-salary').textContent = isNaN(salary) ? 'R$ 00,00' : salary.toLocaleString('pt-BR', { minimumFractionDigits: 2 });

        // Salva as despesas e o salário no armazenamento local
        localStorage.setItem('expenses', JSON.stringify(expenses));
        localStorage.setItem('salary', salary);
    }

    function updateStatus() {
        var salary = parseFloat(document.getElementById('salary').value);
        var totalExpenses = expenses.reduce(function(total, expense) {
            return total + expense.value;
        }, 0);

        var statusElement = document.getElementById('status');
        var tipsSection = document.querySelector('.tips-section');

        if (totalExpenses > salary) {
            statusElement.textContent = 'Excede o salário!';
            statusElement.classList.remove('within-budget');
            statusElement.classList.add('exceeds-salary');
            tipsSection.style.display = 'block';
        } else {
            statusElement.textContent = 'Dentro do orçamento';
            statusElement.classList.remove('exceeds-salary');
            statusElement.classList.add('within-budget');
            tipsSection.style.display = 'none';
        }
    }

    function formatCurrency(value) {
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    function createExpenseItem(expense) {
        var listItem = document.createElement('li');
        listItem.className = 'expense-item';

        var expenseName = document.createElement('span');
        expenseName.className = 'expense-name';
        expenseName.textContent = expense.name;
        listItem.appendChild(expenseName);

        var expenseValue = document.createElement('span');
        expenseValue.className = 'expense-value';
        expenseValue.textContent = formatCurrency(expense.value);
        listItem.appendChild(expenseValue);

        var deleteButton = document.createElement('button');
        deleteButton.className = 'expense-delete-button';
        deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
        deleteButton.addEventListener('click', function() {
            expenses = expenses.filter(function(item) {
                return item !== expense;
            });
            listItem.remove();
            updateChart();
            updateStatus();
        });
        listItem.appendChild(deleteButton);

        return listItem;
    }

    function addExpense() {
        var expenseName = document.getElementById('expense-name').value;
        var expenseValue = parseFloat(document.getElementById('expense-value').value);
        if (!expenseName || isNaN(expenseValue)) {
            return;
        }

        var expense = {
            name: expenseName,
            value: expenseValue
        };

        expenses.push(expense);

        var expenseList = document.querySelector('#expense-list ul');
        var listItem = createExpenseItem(expense);
        expenseList.appendChild(listItem);

        document.getElementById('expense-name').value = '';
        document.getElementById('expense-value').value = '';

        updateChart();
        updateStatus();
    }

    // Carrega as despesas e o salário do armazenamento local
    var storedExpenses = localStorage.getItem('expenses');
    if (storedExpenses) {
        expenses = JSON.parse(storedExpenses);
        var expenseList = document.querySelector('#expense-list ul');
        expenses.forEach(function(expense) {
            var listItem = createExpenseItem(expense);
            expenseList.appendChild(listItem);
        });
    }

    var storedSalary = localStorage.getItem('salary');
    if (storedSalary) {
        document.getElementById('salary').value = storedSalary;
    }

    // Atualiza o gráfico e o status inicialmente
    updateChart();
    updateStatus();

    document.getElementById('add-expense-button').addEventListener('click', addExpense);
    document.getElementById('salary').addEventListener('input', function() {
        updateChart();
        updateStatus();
    });