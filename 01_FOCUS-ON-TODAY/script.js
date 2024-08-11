document.addEventListener('DOMContentLoaded', (event) => {

    window.onload = function () {
        // Retrieve the data
        const myObject = JSON.parse(localStorage.getItem('goalStorage'));
        const mycheckboxObject = JSON.parse(localStorage.getItem('tickedData'));

        let inputList = [...document.querySelectorAll('.input')];
        let checkboxList = [...document.querySelectorAll('.checkbox')];

        console.log(myObject)
        inputList.forEach((input, i) => {
            // console.log(input)
            if(myObject!=null && myObject[i]) {
                input.value = myObject[i]
            }
        })

        checkboxList.forEach((checkbox, i) => {

            if (mycheckboxObject!=null && mycheckboxObject[i] === "1") {
                checkbox.parentElement.classList.add("completed");
                checked++
                progressValueDisplay(checked, updatedGoalsLength)
            }
            else checkbox.parentElement.classList.remove("completed");
        })

        // console.log(myObject)
        // console.log(mycheckboxObject)
        setupCheckboxListeners();


    };

    const size = 5;

    let checkboxList = [...document.querySelectorAll('.checkbox')];
    let inputList = [...document.querySelectorAll('.input')];

    let goalList = document.querySelector('.goal-list');
    console.log(goalList);

    let progressValue = document.querySelector('.progress-value');
    progressValue.style.display = 'none';

    const errorMessage = document.querySelector('.message');
    let checked = 0;
    let updatedGoalsLength = checkboxList.length;

    // LOCAL STORAGE HANDLER CODE

    const goalStorageInitial = Array(size).fill("");
    const tickedDataInitial = Array(size).fill("0");

    const goalStorage = JSON.parse(localStorage.getItem('goalStorage')) || goalStorageInitial;
    const tickedData = JSON.parse(localStorage.getItem('tickedData')) || tickedDataInitial;

    inputList.forEach(function (input, index) {

        input.addEventListener('input', (e) => {
            goalStorage[index] = e.target.value;

            // if(goalStorage[index]=="") tickedData[index] = "0";

            localStorage.setItem('goalStorage', JSON.stringify(goalStorage));

            // let toDisp=JSON.parse(localStorage.getItem(`goalStorage`))[index]
            // console.log(toDisp);
            // input.innerText=e.target.value;
        });

    })

    checkboxList.forEach(function (checkbox, index) {

        checkbox.addEventListener('click', (e) => {
            console.log(e.target)
            tickedData[index] = e.target.classList.contains('ticked') ? "0" : "1";
            localStorage.setItem('tickedData', JSON.stringify(tickedData));
        });
    })

    function progressValueDisplay(checked, updatedGoalsLength) {
        progressValue.textContent = `${checked}/${updatedGoalsLength} completed`;
        progressValue.style.width = `${(checked / updatedGoalsLength) * 100}%`;
        // if((checked / updatedGoalsLength) * 100 === 0)  
        //     progressValue.style.transition="all ease 2s";

        progressValue.style.display = (checked / updatedGoalsLength) * 100 === 0 ? 'none' : 'flex';

    }

    function setupCheckboxListeners() {
        checkboxList.forEach((checkbox, index) => {
            checkbox.removeEventListener('click', handleCheckboxClick); // Remove old listener
            checkbox.addEventListener('click', handleCheckboxClick);
        });
    }

    function handleCheckboxClick(e) {
        const index = checkboxList.indexOf(e.currentTarget);

        if (inputList[index].value === "") {
            if (checkboxList[index].parentElement.classList.contains("completed")) {
                checkboxList[index].parentElement.classList.remove("completed");
                if (checked > 0) checked--;
                progressValueDisplay(checked, updatedGoalsLength);
            }
        }

        if (index !== -1 && inputList[index].value !== "") {
            checkboxList[index].parentElement.classList.toggle("completed");

            if (checkboxList[index].parentElement.classList.contains("completed")) {
                checked++;

                const message = `Please set minimum 3 goals!`;
                errorMessage.textContent = checked >= 3 ? "" : message;

                progressValueDisplay(checked, updatedGoalsLength);

            } else {

                if (checked > 0) checked--;

                const message = `Please set minimum 3 goals!`;
                errorMessage.textContent = checked >= 3 ? "" : message;

                progressValueDisplay(checked, updatedGoalsLength);
            }
        }

    }


    setupCheckboxListeners();

    document.querySelector('.add').addEventListener('click', () => {

        if (updatedGoalsLength < size) {

            //   console.log(e)
            const goal = document.createElement("div");

            goal.innerHTML = `<div class="goal">
                                <div class="checkbox">
                                    <img class="ticked" src="images/Vector 1.svg" alt="error">
                                </div>
                                <input type="text" class="input" placeholder="Add New Goal">
                              </div>`;

            goalList.append(goal.cloneNode(true));
            console.log(goalList);
            updatedGoalsLength++;

            // Update checkboxList and inputList
            checkboxList = [...document.querySelectorAll('.checkbox')];
            inputList = [...document.querySelectorAll('.input')];


            const afterAdded = goalList.lastChild;
            const afterAddedCbox = goalList.lastChild.firstChild.children[0];

            //IMPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
            afterAdded.addEventListener('input', (e) => {

                const index = [...goalList.children].indexOf(afterAdded)

                goalStorage[index] = e.target.value;
                localStorage.setItem('goalStorage', JSON.stringify(goalStorage));


            });

            afterAddedCbox.addEventListener('click', (e) => {

                const index = [...goalList.children].indexOf(afterAdded)

                tickedData[index] = e.target.classList.contains('ticked') ? "0" : "1";
                localStorage.setItem('tickedData', JSON.stringify(tickedData));
            })

            progressValueDisplay(checked, updatedGoalsLength);

            setupCheckboxListeners(); // Rebind event listeners for all checkboxes

        } else {

            errorMessage.style.display = 'block';
            errorMessage.innerHTML = `<b>Maximum ${size} goals can be added.<b>`;

            setTimeout(() => {
                const message = `Please set minimum 3 goals!`;
                errorMessage.textContent = checked >= 3 ? "" : message;
            }, 2500)

        }
    });

   document.querySelector('.clear').addEventListener('click', () =>{
    localStorage.clear();
    location.reload();
   }) 
});

