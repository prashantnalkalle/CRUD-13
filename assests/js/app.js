const cl = console.log;
const cardcontainer = document.getElementById('cardcontainer')
const inputform = document.getElementById('inputform')
const title = document.getElementById('title')
const completed = document.getElementById('completed')
const userId = document.getElementById('userId')
const Addtodo = document.getElementById('Addtodo')
const Updatetodo = document.getElementById('Updatetodo')
const todocontainer = document.getElementById('todocontainer')
const spinner = document.getElementById('spinner')

let todoArr =[]

let Base_url ='https://jsonplaceholder.typicode.com/todos'

function snackbar(msg,icon){
    swal.fire({
        title : msg,
        icon : icon,
        timer : 3000
    })
}

function fetchproducts (){
    spinner.classList.remove('d-none')
    let xhr = new XMLHttpRequest()

    let Post_Url = `${Base_url}`

    xhr.open('GET',Post_Url)

    xhr.send(null)

    xhr.onload = function(){
        if(xhr.status >= 200 && xhr.status <= 299){
            postArr = JSON.parse(xhr.response)
        
            createposts(postArr.reverse())
            
        }
       
        spinner.classList.add('d-none')
        
    }



}

fetchproducts()

function createicon(status){
    if(status.toString() == 'true'){
        return `<i class="fa-regular fa-square-check fa-2x text-success"></i>`
    }else{
        return `<i class="fa-solid fa-square-xmark fa-2x text-danger"></i>`
    }
}


function createposts(arr){
    let result = ''
    arr.forEach((ele,i) =>{
        result +=` <tr id=${ele.id}>
					    <td>${arr.length - i}</td>
						<td>${ele.title}</td>
						<td>${createicon(ele.completed)}</td>
						<td><i role='button' class="fa-regular fa-pen-to-square fa-2x text-success" onclick="onedit(this)" ></i></td>
						<td><i role='button' class="fa-solid fa-trash fa-2x text-danger" onclick="onremove(this)"></i></td>
					</tr>`
    })


    todocontainer.innerHTML =result


}

function onsubmit(ele){
    spinner.classList.remove('d-none')
    
    ele.preventDefault()

    let newobj = {
        title : title.value,
        completed : completed.value,
        userId : userId.value,
    }


    let xhr = new XMLHttpRequest()

    xhr.open('POST',Base_url)

    xhr.send(JSON.stringify(newobj))

    xhr.onload = function(){
       if(xhr.status >=200 && xhr.status <=299){
         let response =JSON.parse( xhr.response)

            addnewcard(newobj,response)
       }

     spinner.classList.add('d-none')

    }

}


function addnewcard(newobj,response){
    let tr = document.createElement('tr')
    tr.id = response.id


    tr.innerHTML = `	<td>${todoArr.length}</td>
						<td>${newobj.title}</td>
						<td>${createicon(newobj.completed)}</td>
						<td><i role='button' class="fa-regular fa-pen-to-square fa-2x text-success" onclick="onedit(this)" ></i></td>
						<td><i role='button' class="fa-solid fa-trash fa-2x text-danger" onclick="onremove(this)"></i></td>
					`


    todocontainer.prepend(tr)

    inputform.reset()

    snackbar(`The New Todo id ${response.id} is added successfully!!`,'success')
}


function onedit(ele){
    spinner.classList.remove('d-none')
    
    let editId = ele.closest('tr').id
    localStorage.setItem('EditId',editId)
    let Post_url = `${Base_url}/${editId}`

    let xhr = new XMLHttpRequest()

    xhr.open('GET',Post_url)

    xhr.send(null)

    xhr.onload = function(){
       if(xhr.status >=200 && xhr.status <=299){
        let EditObj = JSON.parse(xhr.response)

        title.value = EditObj.title
        completed.value = EditObj.completed 
        userId.value = EditObj.userId


        Addtodo.classList.add('d-none')
        Updatetodo.classList.remove('d-none')

       }else{

        let err = xhr.response

        snackbar(err,'error')

       }

        spinner.classList.add('d-none')

    }

    

}


function onupdate(){
    let updateId = localStorage.getItem('EditId')
    spinner.classList.remove('d-none')

    let updateObj ={
        title : title.value,
        completed : completed.value,
        userId : userId.value,
        id : userId
    }

    let PUT_url = `${Base_url}/${updateId}`
    let xhr = new XMLHttpRequest()

    xhr.open('PUT',PUT_url)

    xhr.send(JSON.stringify(updateObj))

    xhr.onload = function(){
       if(xhr.status >= 200 && xhr.status <= 299){
         
        let tr = document.getElementById(updateId).children

        tr[1].innerText = updateObj.title
        tr[2].innerHTML = createicon(updateObj.completed)


        inputform.reset()
        snackbar(`The Post id${updateId} is Updated successfully!!`,'success')

        Addtodo.classList.remove('d-none')
        Updatetodo.classList.add('d-none')
       }else{
        let err = xhr.response

        snackbar(err,'error')
       }

        spinner.classList.add('d-none')

    }
    
}


function onremove(ele){
    let removeId = ele.closest('tr').id

    Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!"
    }).then((result) => {
    if (result.isConfirmed){
            spinner.classList.remove('d-none')
            
            let Remove_url = `${Base_url}/${removeId}`

            let xhr = new XMLHttpRequest()

            xhr.open('DELETE',Remove_url)

            xhr.send(null)

            xhr.onload = function(){
                if(xhr.status >= 200 && xhr.status <= 299){
                    ele.closest('tr').remove();

                    snackbar(`The card id ${removeId} is removed Successfully!!!`,'success')

                }
                spinner.classList.add('d-none')

            
            }

        }
    });
}

inputform.addEventListener('submit',onsubmit)
Updatetodo.addEventListener('click',onupdate)