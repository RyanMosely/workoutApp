let transactions = [];
let myChart;

fetch("/api/transaction")
  .then(response => response.json())
  .then(data => {
    // save db data on global variable
    transactions = data;
    populateTotal();
    populateTable();
    //populateChart();
  });

function populateTotal() {
  // reduce transaction amounts to a single total value
  const total = transactions.reduce((total, t) => {
    return total + parseInt(t.value);
  }, 0);

  const totalEl = document.querySelector("#total");
  totalEl.textContent = total;
}

function populateTable() {
  const tbody = document.querySelector("#tbody");
  tbody.innerHTML = "";

  transactions.forEach(transaction => {
    // create and populate a table row
    console.log(transaction);

    console.log(transactions.indexOf(transaction));

    const tr = document.createElement("tr");
    let elId = transactions.indexOf(transaction)
    elId++
    tr.setAttribute("id", elId);
    tr.innerHTML = `
      <td>${transaction.name}</td>
      <td>${transaction.value}</td>
      <button onclick="testFunc()">Edit</button>
    `;
    
    console.log(transactions.length);

    tbody.appendChild(tr);
  });
}

console.log("wtf")

/*
function populateChart() {
  // copy array and reverse it
  const reversed = transactions.slice().reverse();
  let sum = 0;

  // create date labels for chart
  const labels = reversed.map(t => {
    const date = new Date(t.date);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  });

  // create incremental values for chart
  const data = reversed.map(t => {
    sum += parseInt(t.value);
    return sum;
  });

  // remove old chart if it exists
  if (myChart) {
    myChart.destroy();
  }

  const ctx = document.getElementById("my-chart").getContext("2d");

  myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Total Over Time",
          fill: true,
          backgroundColor: "#6666ff",
          data
        }
      ]
    }
  });
}

*/

function sendTransaction(isAdding) {
  const nameEl = document.querySelector("#t-name");
  const amountEl = document.querySelector("#t-amount");
  const errorEl = document.querySelector(".error");

  // validate form
  if (nameEl.value === "" || amountEl.value === "") {
    errorEl.textContent = "";
    return;
  } else {
    errorEl.textContent = "";
  }

  // create record
  const transaction = {
    name: nameEl.value,
    value: [amountEl.value],
    date: new Date().toISOString()
  };

  // if subtracting funds, convert amount to negative number
  if (!isAdding) {
    transaction.value *= -1;
  }

  // add to beginning of current array of data
  transactions.push(transaction);

  // re-run logic to populate ui with new record
  //populateChart();
  populateTable();
  populateTotal();

  // also send to server
  fetch("/api/transaction", {
    method: "POST",
    body: JSON.stringify(transaction),
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json"
    }
  })
    .then(response => response.json())
    .then(data => {
      if (data.errors) {
        errorEl.textContent = "";
      } else {
        // clear form
        nameEl.value = "";
        amountEl.value = "";
      }
    })
    .catch(err => {
      // fetch failed, so save in indexed db
      saveRecord(transaction);

      // clear form
      nameEl.value = "";
      amountEl.value = "";
    });
}



document.querySelector("#add-btn").addEventListener("click", function(event) {
  event.preventDefault();
  sendTransaction(true);
});

document.querySelector("#sub-btn").addEventListener("click", function(event) {
  event.preventDefault();
  sendTransaction(false);
});



function testFunc() {


  let newInput = ""
  newInput = document.createElement("input");
  newInput.setAttribute("id", "inputArea");
  

  newButton = document.createElement("button");
  newButton.innerHTML = `somethin`
  newButton.setAttribute("onClick", "newTest()");
  newButton.setAttribute("id", "subButton");
  //newInput.addEventListener('submit', somethinFunction());
  let row = event.target.parentNode;
  row.appendChild(newInput);
  row.appendChild(newButton);
  
  console.log(event.target.parentNode);
  


}



function newTest() {
  console.log("next step");

let inputArea = document.getElementById("inputArea");
let subButton = document.getElementById("subButton");
console.log(inputArea.value);


let row = event.target.parentNode;
console.log(row);
let newWorkout = document.createElement("td");
newWorkout.innerHTML = inputArea.value;
row.appendChild(newWorkout);

/*
let indexLoc = 1;

localStorage.setItem(indexLoc, inputArea.value);

indexLoc++;
*/

transactions[row.id-1].value.push(inputArea.value);



console.log(transactions[0].value);
console.log(row.id);

inputArea.remove();
subButton.remove();

}