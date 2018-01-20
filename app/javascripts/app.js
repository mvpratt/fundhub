// AUTHOR: <mvpratt>

/*
UI Testing status 9/13/2017:
  Verify exceptions
    PASS - Overfund
    PASS - Fund after deadline
    PASS - Refund request early
    PASS - Refund request from non-contributer
    PASS - Payout request from non-owner
    PASS - Call projects that dont exist
    PASS - Try to fund a project that has already paid out

  Verify nominal transactions
    PASS - Create project
    PASS - Contribute
    PASS - Payout after fully funded
    PASS - Refund after deadline
*/

let fundhub; // Main contract
const gasLimit = 4500000;
const max_projects_displayed = 4;
const user_names = ['Coinbase', 'Alice', 'Bob', 'Carol'];

function setStatus(message) {
  const status = document.getElementById('status');
  status.innerHTML = message;
}

// function logTimestamp(message) {
//  console.log(`Log Timestamp: ${web3.eth.getBlock(web3.eth.blockNumber).timestamp}  Log: ${message}`);
// }

function showUserBalances() {
  for (let i = 0; i < user_names.length; i += 1) {
    console.log(`${user_names[i]}\t: balance : ${web3.fromWei(web3.eth.getBalance(web3.eth.accounts[i]), 'ether')} ETH`);
  }
}

// Project "struct"
function ProjectTemplate() {
  const project = {};
  project.owner = '';
  project.address = '';
  project.amount_goal = 0;
  project.deadline = 0;
  project.instance = 0;
  project.index = 0;
  project.balance = 0;
  return project;
}

function logProjectDetails(project) {
  console.log('-----------------------------');
  console.log('New project created:');
  console.log(`project owner: ${project.owner}`);
  console.log(`project address: ${project.address}`);
  console.log(`project goal: ${project.amount_goal}`);
  console.log(`project deadline: ${project.deadline}`);
  //console.log(`project index: ${project.index}`);
  console.log(`current time: ${web3.eth.getBlock(web3.eth.blockNumber).timestamp}`);
  console.log('-----------------------------');
}


function getProjectAddress(index) {
  return fundhub.myProjects.call(index);
}

function getBalance(address) {
  return new Promise( (resolve, reject) => {
    resolve(web3.eth.getBalance(address).valueOf());
  });
}

function getCurrentTime() {
  return new Promise( (resolve, reject) => {
    resolve(web3.eth.getBlock(web3.eth.blockNumber).timestamp);
  });
}

function scrubAmountGoal(amount_goal) {
  return new Promise( (resolve, reject) => {
    const default_amount_goal = web3.toWei(10, 'ether');

    if (amount_goal === undefined || amount_goal === null || amount_goal === '') {
      amount_goal = default_amount_goal;
    } else {
      amount_goal = web3.toWei(web3.toBigNumber(amount_goal), 'ether');
    }
    resolve(amount_goal);
  });
}


function scrubDuration(duration) {
  return new Promise( (resolve, reject) => {
    const default_duration = 200;
    if (duration === undefined || duration === null || duration === '') {
      duration = default_duration;
    } else {
      duration = Number(duration);
    }
    resolve(duration);
  });
}


function createProject() {

    const success = true;
    const myProject = new ProjectTemplate();
    const user_index = Number(document.getElementById('i_user').value);
    const user_addr = web3.eth.accounts[user_index];
    let amount_goal = document.getElementById('i_amount_goal').value;
    let duration = document.getElementById('i_duration').value;

    return scrubAmountGoal(amount_goal)
      .then((value) => {
        amount_goal = value;
        return scrubDuration(duration);
      })
      .then((value) => {
        duration = value;
        return fundhub.createProject(amount_goal, duration, { from: user_addr, gas: gasLimit });
        // .catch(function(e) {
        //  success = false;
        //  console.log("createProject() exception");
        //  console.log(e);
        //  setStatus("Error creating project; see log.");
      })
      .then((result) => {
        // result is an object with the following values:
        // result.tx      => transaction hash, string
        // result.logs    => array of decoded events that were triggered within this transaction
        // result.receipt => transaction receipt object, which includes gas used
        // loop through result.logs to see if we triggered the  event.
        for (let i = 0; i < result.logs.length; i++) {
          let log = result.logs[i];

          if (log.event == "LogCreateProject") {
            console.log("Event: FundingHub.LogCreateProject()");
            myProject.address = log.args._projectAddress;
            break;
          }
        }
        return Project.at(myProject.address);
      })
      //.catch(function(err) {
        //console.log(err)
      //})
      .then((value) => {
        myProject.instance = value;
        return myProject.instance.info.call();
      })
      .then((value) => {
        myProject.owner = value[0];
        myProject.amount_goal = web3.toBigNumber(value[1]);
        myProject.deadline = parseInt(value[2]);
        logProjectDetails(myProject);
      })
      .then(refreshProjectTableAll)
      .then(refreshUserTable)
      .then(() => {
        if (success) {
          setStatus(`New project, Project ${myProject.index} created by ${user_names[user_index]}!`);
        }
      });
}

function getUserName(user_address) {
  for (let i = 0; i <= user_names.length; i += 1) {
    if (user_address === web3.eth.accounts[i]) {
      return user_names[i];
    }
  }
  return false;
}

function refreshProjectTableByIndex(index) {
    const myProject = new ProjectTemplate();
    let project_state;
    let current_time;
    let refill_element;
    let state_element;

    myProject.index = index;

    return getProjectAddress(myProject.index)
      .then((value) => {
        myProject.address = value.toString();
        return Project.at(myProject.address);
      })
      .then((value) => {
        myProject.instance = value;
        return myProject.instance.paidOut.call();
      })
      .then((value) => {
        myProject.paid_out = value;
        return getBalance(myProject.address);
      })
      .then((value) => {
        myProject.balance = value;
        return getCurrentTime();
      })              
      .then((value) => {
        current_time = value;
        return myProject.instance.info.call();
      })
      .then((value) => {
        myProject.owner = value[0];
        myProject.amount_goal = web3.toBigNumber(value[1]);
        myProject.deadline = parseInt(value[2]);

        owner_element = document.getElementById(`owner_address_${myProject.index}`);
        address_element = document.getElementById(`project_address_${myProject.index}`);
        goal_element = document.getElementById(`amount_goal_${myProject.index}`);
        raised_element = document.getElementById(`amount_raised_${myProject.index}`);
        deadline_element = document.getElementById(`deadline_${myProject.index}`);

        owner_element.innerHTML = getUserName(myProject.owner);
        address_element.innerHTML = (`${myProject.address.substring(0, 6)}....${myProject.address.substring(38, 42)}`);
        goal_element.innerHTML = web3.fromWei(myProject.amount_goal, 'ether');
        raised_element.innerHTML = web3.fromWei(myProject.balance, 'ether');
        deadline_element.innerHTML = myProject.deadline - current_time;

        if (myProject.paid_out === true) {
          project_state = 'Paid out!';
        } 
        else if (myProject.balance === myProject.amount_goal) {
          project_state = 'Fully Funded! (Request your payout)';
        } 
        else if (current_time > myProject.deadline && myProject.balance > 0) {
          project_state = 'Deadline Expired (Request your refund)';
        } 
        else if (current_time > myProject.deadline && myProject.balance === 0) {
          project_state = 'All refunds issued';
        } 
        else {
          project_state = 'Accepting Funds';
        }
        state_element = document.getElementById(`state_${myProject.index}`);        
        state_element.innerHTML = project_state;
      });
}

function refreshProjectTableAll() {
    return fundhub.num_projects.call()
      .then((value) => {
        const promises = [];
        let num_projects_displayed;

        if (value > max_projects_displayed) {
          num_projects_displayed = max_projects_displayed;
        } else {
          num_projects_displayed = value;
        }

        for (let i = 1; i <= num_projects_displayed; i += 1) {
          promises.push(refreshProjectTableByIndex(i));
        }
        return Promise.all(promises);
      })
}

function refreshUserTableByIndex(index) {
  return new Promise(((resolve, reject) => {
    const user_address = web3.eth.accounts[index];
    const refill_element_address = document.getElementById(`user_address_${index}`);
    const refill_element_balance = document.getElementById(`user_balance_${index}`);

    refill_element_address.innerHTML = (`${user_address.substring(0, 6)}....${user_address.substring(38, 42)}`).toString();
    refill_element_balance.innerHTML = web3.fromWei(web3.eth.getBalance(web3.eth.accounts[index]), 'ether');
    resolve();
  }));
}

function refreshUserTable() {
  return new Promise(((resolve, reject) => {
    const num_users = 3;
    const promises = [];

    for (let i = 1; i <= num_users; i += 1) {
      promises.push(refreshUserTableByIndex(i));
    }

    Promise.all(promises).then(() => {
      resolve();
    });
  }));
}

function contribute() {
    const myProject = {};
    const default_amount_contribute = web3.toWei(1, 'ether');
    const user_index = Number(document.getElementById('i_user').value);
    const user_addr = web3.eth.accounts[user_index];
    let success = true;
    let amount_contribute = document.getElementById('contrib_amount').value;

    myProject.index = Number(document.getElementById('i_project_num').value);

    if (amount_contribute === undefined || amount_contribute === null || amount_contribute === '') {
      amount_contribute = default_amount_contribute;
    } else {
      amount_contribute = web3.toWei(amount_contribute, 'ether');
    }

    return getProjectAddress(myProject.index)
      .then(value => {
        return fundhub.contribute(value.toString(), 
          { from: user_addr, 
            value: amount_contribute, 
            gas: gasLimit 
          })
      })
      .catch((error) => {
        success = false;
        console.log('contribute() exception');
        console.log(error);
        setStatus('Error funding project; see log.');
      })
      .then(refreshProjectTableAll)
      .then(refreshUserTable)
      .then(() => {
        if (success) {
          setStatus(`${user_names[user_index]} contributed ${web3.fromWei(amount_contribute, 'ether')} ETH to Project ${myProject.index}!`);
        }
      });
}


function requestPayout() {
    let success = true;
    const proj_index = Number(document.getElementById('i_project_num').value);
    const user_index = Number(document.getElementById('i_user').value);
    const user_addr = web3.eth.accounts[user_index];

    return getProjectAddress(proj_index)
      .then(addr => Project.at(addr))
      .then(instance => {
        return instance.payout({ from: user_addr })
      })
      .catch((error) => {
        success = false;
        console.log('payout() exception');
        console.log(error);
        setStatus('Error getting payout; see log.');
      })
      .then(refreshProjectTableAll)
      .then(refreshUserTable)
      .then(() => {
        if (success) {
          setStatus(`Payout sent to ${user_names[user_index]}!`);
        }
      });
}

function requestRefund() {
    let success = true;
    const proj_index = Number(document.getElementById('i_project_num').value);
    const user_index = Number(document.getElementById('i_user').value);
    const user_addr = web3.eth.accounts[user_index];

    return getProjectAddress(proj_index)
      .then(addr => Project.at(addr))
      .then(instance => {
        return instance.refund({ from: user_addr })
      })
      .catch((error) => {
        success = false;
        console.log('refund() exception');
        console.log(error);
        setStatus('Error getting refund; see log.');
      })
      .then(refreshProjectTableAll)
      .then(refreshUserTable)
      .then(() => {
        if (success) {
          setStatus(`Refund sent to ${user_names[user_index]}!`);
        }
      });
}

window.onload = function () {
  web3.eth.getAccounts((err, accs) => {
    if (err != null) {
      alert('There was an error fetching your accounts.');
    }

    if (accs.length === 0) {
      alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
    }

    FundingHub.deployed()
    .then((value) => {
      fundhub = value;
      showUserBalances();
      console.log('FundingHub deployed!');
      console.log(`Fundhub address: ${fundhub.address}`);
    })
    .then(refreshProjectTableAll)
    .then(refreshUserTable);
  });
};