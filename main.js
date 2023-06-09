
var expenses = [];
var myChart;

function updateChart() {
  var salary = parseFloat(document.getElementById('salary').value);
  localStorage.setItem('expenses', JSON.stringify(expenses));
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
            '#f70505',
            '#5d8aa8',
            '#FF00FF',
            '#00FF00',
            '#FFFF00',
            '#00FFFF',
            '#0000FF',
            '#FF0000',
            '#800080',
            '#8A2BE2',
            '#FF1493',
            '#1E90FF',
            '#FFD700',
            '#32CD32',
            '#FF4500',
            '#B8860B',
            '#808000',
            '#800000',
            '#008080',
            '#008000',
            '#CD5C5C',
            '#DB7093',
            '#ADFF2F',
            '#FF69B4',
            '#FFA500',
            '#00BFFF',
            '#7FFFD4',
            '#BC8F8F',
            '#FF6347',
            '#00FA9A',
            '#FF00FF',
            '#FF0000',
            '#CD853F',
            '#FFB6C1',
            '#A0522D',
            '#FFFACD',
            '#8B4513',
            '#556B2F',
            '#FFDAB9',
            '#DAA520',
            '#6A5ACD',
            '#2E8B57',
            '#FF4500',
            '#808080',
            '#BDB76B',
            '#FFA07A',
            '#7B68EE',
            '#00FF7F',
            '#00CED1',
            '#9932CC',
            '#FF8C00',
            '#A52A2A',
            '#DEB887',
            '#4682B4',
            '#FF69B4',
            '#8B008B',
            '#800000',
            '#808000',
            '#008000',
            '#008080',
            '#000080',
            '#800080',
            '#FF0000',
            '#FF4500',
            '#FF8C00',
            '#FFA500',
            '#FFD700',
            '#FFFF00',
            '#ADFF2F',
            '#008000',
            '#006400',
            '#008080',
            '#0000FF',
            '#000080',
            '#4B0082',
            '#8B008B',
            '#800080',
            '#FF00FF',
            '#FF1493',
            '#FF69B4',
            '#FFB6C1',
            '#FFC0CB',
            '#FAEBD7',
            '#F5F5DC',
            '#FFE4C4',
            '#FFEBCD',
            '#F5DEB3',
            '#FFF8DC',
            '#FFFACD',
            '#FAFAD2',
            '#FFFFE0',
            '#FFFACD',
            '#FFEFD5',
            '#FFE4B5',
            '#FFDAB9',
            '#FFE4E1',
            '#FFF0F5',
            '#FFF5EE',
            '#FDF5E6',
            '#FFFAF0',
            '#FFFFF0'
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

  updateSummary();
}

function updateSummary() {
  var salary = parseFloat(document.getElementById('salary').value);
  var totalExpenses = expenses.reduce(function(total, expense) {
    return total + expense.value;
  }, 0);

  document.getElementById('total-expenses').textContent = formatCurrency(totalExpenses);
  document.getElementById('total-salary').textContent = formatCurrency(salary);
  localStorage.setItem('salary', salary);

  updateStatus();
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
  if (!value) {
    return 'R$ 0,00';
  }
  return 'R$ ' + value.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
}

function createExpenseItem(expense) {
  var listItem = document.createElement('li');
  listItem.className = 'expense-item';

  var expenseName = document.createElement('span');
  expenseName.className = 'expense-name';
  expenseName.textContent = expense.name;
  expenseName.setAttribute('contenteditable', 'true');
  expenseName.addEventListener('input', function() {
    var editedName = expenseName.textContent.trim();
    if (editedName !== '') {
      expense.name = editedName;
      updateChart();
    }
  });
  expenseName.addEventListener('focusout', function() {
    var editedName = expenseName.textContent.trim();
    if (editedName === '') {
      expenseName.textContent = expense.name;
    } else {
      expense.name = editedName;
      expenseName.textContent = editedName;
      updateChart();
    }
  });
  listItem.appendChild(expenseName);

  var expenseValue = document.createElement('span');
  expenseValue.className = 'expense-value';
  expenseValue.textContent = formatCurrency(expense.value);
  expenseValue.setAttribute('contenteditable', 'true');
  expenseValue.addEventListener('input', function() {
    var editedValue = expenseValue.textContent.replace(/[^0-9,]/g, '');
    var decimalCount = editedValue.split(',')[1];
    if (decimalCount && decimalCount.length > 2) {
      editedValue = editedValue.slice(0, editedValue.lastIndexOf(',') + 3);
    }
    expenseValue.textContent = editedValue !== '' ? formatCurrency(parseFloat(editedValue.replace(',', '.'))) : '';
    if (editedValue !== '') {
      expense.value = parseFloat(editedValue.replace(',', '.'));
      updateChart();
    }
  });
  expenseValue.addEventListener('focusout', function() {
    var editedValue = expenseValue.textContent.replace(/[^0-9,]/g, '');
    if (editedValue === '') {
      expenseValue.textContent = formatCurrency(expense.value);
    } else {
      expenseValue.textContent = formatCurrency(parseFloat(editedValue.replace(',', '.')));
      expense.value = parseFloat(editedValue.replace(',', '.'));
    }
  });
  listItem.appendChild(expenseValue);

  var creationDate = document.createElement('span');
  creationDate.className = 'expense-creation-date';
  var formattedDate = new Date(expense.creationDate).toLocaleDateString('pt-BR');
  creationDate.textContent = formattedDate;
  listItem.appendChild(creationDate);

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
    value: expenseValue,
    creationDate: new Date().toISOString() // Adicione esta linha para definir a data de criação
  };

  expenses.push(expense);

  var expenseList = document.querySelector('#expense-list ul');
  var listItem = createExpenseItem(expense);
  expenseList.appendChild(listItem);

  document.getElementById('expense-name').value = '';
  document.getElementById('expense-value').value = '';

  updateChart();
  updateStatus();
  updateSummary();
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
updateSummary();