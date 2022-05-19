'use strict';


//function for delete button
function deleteTask(id) {
    const deleteId = id;
    const cookie = getCookie('todo');

    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + cookie);
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
        method: 'DELETE',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch("https://api-nodejs-todolist.herokuapp.com/task/" + deleteId, requestOptions)
        .then(response => response.json())
        .then(result => {
            console.log(result)
            if (result.success == true) {

                const thisId = id;
                const li = document.getElementById(thisId);
                li.remove();
            }
        })
        .catch(error => console.log('error', error));

}
//function for update button
function updateTask(id) {


    const input = document.getElementsByClassName('input-value');
    const description = input[0].value;

    const cookie = getCookie('todo');

    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + cookie);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "completed": true,
        "description": description

    });

    var requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch("https://api-nodejs-todolist.herokuapp.com/task/" + id, requestOptions)
        .then(response => response.text())
        .then(result => {
            console.log(result);
            if (description == '') {
                alert('this feild is required');
            }
            else {
                const span = document.getElementById(`des-${id}`);
                span.innerHTML = description;

                const input = document.getElementsByClassName('input-value')[0];
                const updateBtn = document.getElementsByClassName('update')[0];
                console.log(input);
                input.remove();
                updateBtn.remove();
            }


        })
        .catch(error => console.log('error', error));



}
//function for edit button 
function editTask(id) {
    const editId = id;
    const cookie = getCookie('todo');

    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + cookie);
    myHeaders.append("Content-Type", "application/json");



    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        // body: raw,
        // redirect: 'follow'
    };

    const listId = id;
    const li = document.getElementById(listId);

    fetch("https://api-nodejs-todolist.herokuapp.com/task/" + editId, requestOptions)
        .then(response => response.json())
        .then(result => {
            console.log(result)
            if (result.success == true) {
                const input = document.createElement('input');
                const updateBtn = document.createElement('button');


                const task = result.data;

                const des = task.description;
                input.setAttribute('type', 'text');
                input.setAttribute('class', 'input-value');
                updateBtn.setAttribute('class', 'update');
                updateBtn.setAttribute('onclick', `updateTask("${editId}")`);
                input.value = des;
                updateBtn.innerHTML = 'update';
                li.append(input);
                li.append(updateBtn);


            }

        }
        )

        .catch(error => console.log('error', error));
}
// logout button event listener
var logout = document.getElementsByClassName("logout");
if (logout[0]) {
    logout[0].addEventListener("click", function (e) {
        e.preventDefault();
        const cookie = getCookie('todo');
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + cookie);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,

        };

        fetch("https://api-nodejs-todolist.herokuapp.com/user/logout", requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log(result);
                if (result.success == true) {
                    window.location.href = "http://127.0.0.1:5500/login.html";
                    setCookie("todo", '', 1);
                }
            })
            .catch(error => console.log('error', error));
    })

}

// signup
let form = document.getElementById('signup-form');

//signup button event listener
if (form) {
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        //getting the iput values
        const userName = document.getElementById('user-name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const age = document.getElementById('age').value;

        //calling form validation
        formValidation(userName, email, password);

        // input values coverted to string
        var raw = JSON.stringify({
            "name": userName,
            "email": email,
            "password": password,
            "age": age
        });

        //function for fetching
        var requestOptions = {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: raw,
            // redirect: 'follow'
        };



        fetch("https://api-nodejs-todolist.herokuapp.com/user/register", requestOptions)
            .then(response => {
                console.log(response)
                if (response.status == 201 || response.status == 200) {
                    window.location.href = "http://127.0.0.1:5500/login.html";
                }
                else {
                    alert("Something went wrong, please try again");
                }
            })
            .then(result => console.log(result))
            .catch(error => console.log(error));


    });
}


// login 
form = document.getElementById('login-form');
if (form) {
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const login = document.getElementsByClassName('login');
        console.log(login);

        var raw = JSON.stringify({
            "email": email,
            "password": password
        });

        var requestOptions = {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: raw,
            // redirect: 'follow'
        };

        fetch("https://api-nodejs-todolist.herokuapp.com/user/login", requestOptions)
            .then(
                response => response.json()
            )
            .then(
                result => {

                    if (login) {
                        let token = result.token;
                        setCookie('todo', token, 1);
                        // window.redirect = 'http://127.0.0.1:5500/todo.html';
                        window.location.href = "http://127.0.0.1:5500/todolist.html";
                        console.log(result.token)
                    }
                }
            )
            .catch(
                error => console.log('error', error)
            );

    });

}
function formValidation(name, email, password) {
    if (name == '' || email == '' || password == '') {
        alert("This field is required");
        window.location.href == "http://127.0.0.1:5500/todo.html"
        return false
    }
    if (password.length < 7) {
        alert("password length should be more than 7");
        return false;
    }
}


function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cName) {
    const name = cName + "=";
    const cDecoded = decodeURIComponent(document.cookie); //to be careful
    const cArr = cDecoded.split('; ');
    let res;
    cArr.forEach(val => {
        if (val.indexOf(name) === 0) res = val.substring(name.length);
    })
    return res;
}


var cookie = getCookie('todo');
if (window.location.href == "http://127.0.0.1:5500/todo.html") {
    if (cookie == undefined || cookie == null || cookie == '') {
        window.location.href = "http://127.0.0.1:5500/login.html";
    }
    else {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + cookie);

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            // redirect: 'follow'
        };

        fetch("https://api-nodejs-todolist.herokuapp.com/user/me", requestOptions)
            .then(response => {
                response.json();
                console.log(response);
            })
            .then(result => {
                console.log(result);

            }
            )
            .catch(error => console.log('error', error));
    }

}

//todo add task form sunmissiton  js
// console.log(getCookie('todo'));

if (window.location.href == "http://127.0.0.1:5500/todo.html") {
    var cookie = getCookie('todo');
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + cookie);

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch("https://api-nodejs-todolist.herokuapp.com/user/me", requestOptions)
        .then(response => response.json())
        .then(result => {
            console.log(result)
            if (result) {
                form = document.getElementById('todo-form');
                const lsOutput = document.getElementById('output-value');
                const issueID = document.getElementById('issue-id');
                const display_data = document.getElementById('display_data');
                if (form) {
                    form.addEventListener('submit', function (event) {
                        event.preventDefault();
                        const taskName = document.getElementById('task-name').value;
                        const description = document.getElementById('description').value;
                        const time = document.getElementById('time-value').value;
                        // const output =document.getElementsByClassName('wrapper-2');

                        var cookie = getCookie('todo');
                        var myHeaders = new Headers();
                        myHeaders.append("Authorization", "Bearer " + cookie);
                        myHeaders.append("Content-Type", "application/json");

                        var raw = JSON.stringify({
                            "description": description
                        });

                        var requestOptions = {
                            method: 'POST',
                            headers: myHeaders,
                            body: raw,
                            // redirect: 'follow'
                        };

                        fetch("https://api-nodejs-todolist.herokuapp.com/task", requestOptions)
                            .then(response => {
                                response.json();
                                if (response.status == 200 || response.status == 201) {
                                    window.location.href = "http://127.0.0.1:5500/todolist.html";
                                }
                                else {
                                    window.location.href = "http://127.0.0.1:5500/login.html";
                                }

                            }
                            )
                            .then(result => console.log(result))
                            .catch(error => console.log('error', error));

                    });

                }

            }
        })
        .catch(error => console.log('error', error));
}

// form = document.getElementById('todo-form');
// const lsOutput = document.getElementById('output-value');
// const issueID = document.getElementById('issue-id');
// const display_data = document.getElementById('display_data');
// if(form){
//     form.addEventListener('submit', function(event){
//         event.preventDefault();
//         const taskName = document.getElementById('task-name').value;
//         const description = document.getElementById('description').value;
//         const time = document.getElementById('time-value').value;
//         // const output =document.getElementsByClassName('wrapper-2');

//         var cookie =getCookie('todo');
//         var myHeaders = new Headers();
//         myHeaders.append("Authorization", "Bearer "+ cookie);
//         myHeaders.append("Content-Type", "application/json");

//         var raw = JSON.stringify({
//         "description": description
//         });

//         var requestOptions = {
//         method: 'POST',
//         headers: myHeaders,
//         body: raw,
//         // redirect: 'follow'
//         };

//         fetch("https://api-nodejs-todolist.herokuapp.com/task", requestOptions)
//         .then(response => 
//             {
//                 response.json();
//                 if(response.status == 200 || response.status == 201)
//                 {
//                     window.location.href = "http://127.0.0.1:5500/todolist.html";
//                 }
//                 else{
//                     window.location.href = "http://127.0.0.1:5500/login.html";
//                 }

//             }
//         )
//         .then(result => console.log(result))
//         .catch(error => console.log('error', error));


//         // const lsKey = [taskName, description, time];

//         // const issue = JSON.stringify(lsKey);


//         // if(taskName && time || description){
//         //     localStorage.setItem("id", issue);
//         //     // showList();
//         //     document.getElementById('task-name').value = '';  
//         //     document.getElementById('description').value = '';
//         //     document.getElementById('time-value').value = '';
//         // }




//     });

// }


function validateForm() {
    // const form = document.getElementById('todo-form');
    const taskVal = document.getElementById('task-name').value;
    const des = document.getElementById('description').value;
    // const taskVal = form['task-value'].value;
    // const des = form['des'].value;

    if (taskVal == '' || des == '') {
        alert("This field is required");
        return false
    }


}




// show todo list



const forms = document.forms;
const ul = document.getElementById('task-list');
const list = document.createDocumentFragment();

// // delete tasks
// list.addEventListener('click', (e) => {
//   if(e.target.className == 'delete'){
//     const li = e.target.parentElement;
//     li.parentNode.removeChild(li);
//   }
// });

// add tasks

if (window.location.href == "http://127.0.0.1:5500/todolist.html") {

    if (cookie == undefined || cookie == null || cookie == '') {
        window.location.href = "http://127.0.0.1:5500/login.html";
    }

    var myHeaders = new Headers();
    var cookie = getCookie('todo');
    myHeaders.append("Authorization", "Bearer " + cookie);
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
    const ul = document.getElementById('task-list');


    fetch("https://api-nodejs-todolist.herokuapp.com/task", requestOptions)
        .then(response => response.json())
        .then(result => {




            const tasks = result.data;

            tasks.map(function (task) {

                const li = document.createElement('li');
                li.setAttribute('id', `${task._id}`)
                // console.log(li);
                const taskName = document.createElement('span');
                const taskDesk = document.createElement('span');
                const time = document.createElement('span');

                taskDesk.setAttribute('id', `des-${task._id}`);

                const deleteBtn = document.createElement('button');
                const editBtn = document.createElement('button');
                deleteBtn.setAttribute('class', 'delete');
                editBtn.setAttribute('class', 'edit');

                deleteBtn.setAttribute('data-id', `${task._id}`);
                editBtn.setAttribute('data-id', `${task._id}`);

                deleteBtn.setAttribute('onClick', `deleteTask("${task._id}")`);
                editBtn.setAttribute('onClick', `editTask("${task._id}")`);

                taskDesk.innerHTML = task.description;

                deleteBtn.innerHTML = 'delete';
                editBtn.innerHTML = 'edit';

                // taskName.classList.add('name');
                // deleteBtn.classList.add('delete');

                li.appendChild(taskDesk);
                li.appendChild(deleteBtn);
                li.appendChild(editBtn);
                ul.appendChild(li);




            }

            )



        })
        .catch(error => console.log('error', error));






    

    // const addForm = document.getElementById('list-button');
    // addForm.addEventListener('click', function (){
    //     window.location.href = "http://127.0.0.1:5500/todo.html";
    // });



}

//hide tasks

// const hideBox = document.querySelector('#hide');

// hideBox.addEventListener('change',function(e){
//     if(hideBox.checked){
//     list.style.display = "none";
//     } else{
//      list.style.display = "block";
//     }
// });

// filter tasks

// const searchbar = document.forms['search-tasks'].querySelector('input');
// searchbar.addEventListener('keyup',function(e){
//     const term = e.target.value.toLowerCase();

//     const tasks = list.getElementsByTagName('li');
//     Array.from(tasks).forEach(function(task){
//         const title = task.firstElementChild.textContent;
//         if(title.toLowerCase().indexOf(term) != -1){
//             task.style.display='block';
//         } else{
//             task.style.display= 'none';
//         }
//     });
// });


