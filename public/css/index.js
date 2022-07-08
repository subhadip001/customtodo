const deleteListBtn = document.querySelector("#deleteListButton")
const modal = document.querySelector("#delModal")
const cancelBtn = document.querySelector("#cancel")
const deleteBtn = document.querySelector("#delete")
const opacity = document.querySelector("#opacity")

deleteListBtn.addEventListener("click" , () => {
    modal.classList.add("show-modal")
    opacity.classList.add("opacity")
})

cancelBtn.addEventListener("click" , () => {
    modal.classList.remove("show-modal")
    opacity.classList.remove("opacity")
})
deleteBtn.addEventListener("click" , () => {
    modal.classList.remove("show-modal")
    opacity.classList.remove("opacity")
})