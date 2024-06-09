document.addEventListener('DOMContentLoaded', function () {
  const theme = document.getElementById('theme')
  const newItemInput = document.querySelector('.addNew')
  const todoList = document.querySelector('.main-content ul')
  const leftItem = document.querySelector('.left-item span')
  const filterButtons = document.querySelectorAll('.filter input[type="radio"]')
  const clearCompletedButton = document.querySelector('.right-item .clear')

  // Function to update the count of items left
  function updateItemsLeft() {
    const itemsLeft = document.querySelectorAll(
      '.main-content ul li input[type="checkbox"]:not(:checked)'
    ).length
    leftItem.textContent = itemsLeft
  }

  // Function to add close functionality
  function addCloseFunctionality(closeButton) {
    closeButton.addEventListener('click', function () {
      const li = this.parentElement
      li.remove()
      updateItemsLeft()
    })
  }

  // Toggle theme
  theme.addEventListener('click', function () {
    document.body.className = theme.checked ? 'light-theme' : 'dark-theme'
  })

  // Add close functionality to existing items
  const closeButtons = document.getElementsByClassName('remove')
  for (let i = 0; i < closeButtons.length; i++) {
    addCloseFunctionality(closeButtons[i])
  }

  // Event listener to add new todo item
  newItemInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter' && newItemInput.value.trim() !== '') {
      const li = document.createElement('li')
      li.className = 'flex-row'

      li.innerHTML = `
        <label class="list-item" draggable="true">
          <input type="checkbox" name="todo-item" />
          <span class="check-icon"></span>
          <span class="txt">${newItemInput.value}</span>
        </label>
        <span class="remove"></span>
      `

      todoList.appendChild(li)

      const newClose = li.querySelector('.remove')
      addCloseFunctionality(newClose)

      newItemInput.value = ''
      updateItemsLeft()
    }
  })

  // Update items left count on page load
  updateItemsLeft()

  // Drag and drop functionality
  let draggedItem = null

  todoList.addEventListener('dragstart', function (e) {
    draggedItem = e.target.closest('li')
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', null)
  })

  todoList.addEventListener('dragover', function (e) {
    e.preventDefault()
    const targetItem = e.target.closest('li')
    if (targetItem && draggedItem !== targetItem) {
      const rect = targetItem.getBoundingClientRect()
      const next = (e.clientY - rect.top) / (rect.bottom - rect.top) > 0.5
      todoList.insertBefore(
        draggedItem,
        next ? targetItem.nextElementSibling : targetItem
      )
    }
  })

  todoList.addEventListener('drop', function (e) {
    e.preventDefault()
  })

  // Filter buttons functionality
  filterButtons.forEach((button) => {
    button.addEventListener('change', function () {
      const targetId = this.getAttribute('id')
      todoList.querySelectorAll('li').forEach((item) => {
        const checkbox = item.querySelector('input[type="checkbox"]')
        if (targetId === 'all') {
          item.style.display = 'flex'
        } else if (targetId === 'active') {
          item.style.display = checkbox.checked ? 'none' : 'flex'
        } else if (targetId === 'completed') {
          item.style.display = checkbox.checked ? 'flex' : 'none'
        }
      })
    })
  })

  // Clear completed button functionality
  clearCompletedButton.addEventListener('click', function () {
    todoList.querySelectorAll('li').forEach((item) => {
      const checkbox = item.querySelector('input[type="checkbox"]')
      if (checkbox.checked) {
        item.remove()
      }
    })
    updateItemsLeft()
  })
})
