const serverUrl = 'http://localhost:3333';
const suggestName = (isLeaveMessage) => {
    const query = document.getElementById('query').value;

    fetch(`${serverUrl}/names?q=${query}`)
        .then(response => response.json())
        .then(entries => {
            if (!isLeaveMessage) {
                hideMessage();
            }
            const result = document.getElementById('result');
            result.innerHTML = '';
            if (entries.length) {
                //displaying found names
                let list = '<div class="list-group">';
                entries.forEach(entry => {
                    list += `<button type="button" class="list-group-item list-group-item-action">
<span>${entry.name}</span>
<span class="badge bg-primary float-end">${entry.trust}</span>
 </button>`;
                });
                list += '</div>';
                result.innerHTML = list;

                //binding click event for selecting name
                for (listItem of result.getElementsByTagName('button')) {
                    ((name) => {
                        listItem.addEventListener('click', () => updateName(name))
                    })(listItem.getElementsByTagName('span').item(0).innerText);
                }
            } else {
                result.innerHTML = 'No entries found'
            }
        })
        .catch(error => {
            showMessage('Error fetching data')
            console.log(error);
        })
}

const updateName = (name) => {
    const query = name ? name : document.getElementById('query').value;
    const declinedName = name ? document.getElementById('query').value : null;

    if (query) {
        fetch(`${serverUrl}/update?name=${query}` + (declinedName ? `&declined=${declinedName}` : ''), {
            method: 'POST'
        })
            .then(response => response.json())
            .then(response => {
                showMessage(response.message);
                suggestName(true); //rerendering suggestions
                showStatus();
            })
            .catch(error => {
                showMessage('Error while updating')
                console.log(error);
            });
    }
}

const showStatus = () => {
    fetch(`${serverUrl}/names?all=1`)
        .then(response => response.json())
        .then(entries => {
            const status = document.getElementById('status');
            if (entries.length) {
                //displaying found names
                let list = '<div class="list-group">';
                entries.forEach(entry => {
                    list += `<div class="list-group-item">
<span class="float-start">${entry.name}</span>
<span class="badge bg-primary float-end">${entry.trust}</span>
 </div>`;
                });
                list += '</div>';
                status.innerHTML = list;
            } else {
                status.innerHTML = 'DB is empty';
            }
        })
        .catch(error => {
            showMessage('Error fetching data')
            console.log(error);
        })
}

const hideMessage = () => {
    document.getElementById('message').style.display = 'none';
}
const showMessage = (message) => {
    document.getElementById('message').innerHTML = message;
    document.getElementById('message').style.display = 'block';
}
