let headerComponent = {
    props: {
        activeTab: {
            type: String,
            required: true,
        },
        activetodos: {
            type: Number,
            required: true,
            default: 0,
        },
        completedtodos: {
            type: Number,
            required: true,
            default: 0,
        }
    },
    template: `
    <div class="header">
        <div class="header-title">
          #todo
        </div>
        <ul class="menu-options">
          <li class="menu-option" :class="{'active-tab': activeTab == 'all'}" @click="changeTab('all')">All</li>
          <li class="menu-option" :class="{'active-tab': activeTab == 'active'}" @click="changeTab('active')">Active <span class="todo-number">{{ activetodos }}</span></li>
          <li class="menu-option" :class="{'active-tab': activeTab == 'completed'}" @click="changeTab('completed')">Completed <span class="todo-number">{{ completedtodos }}</span></li>
        </ul>
      </div>
    `,
    methods: {
        changeTab(tab) {
            this.$emit('change-tab', tab)
        }
    }
}

let inputTaskComponent = {
    props: {
        activeTab: {
            type: String,
            required: true
        }
    },
    template: `
    <div class="input-field-conteiner">
        <input type="text" placeholder="Add a task" @keyup.enter="addTodo" v-model="value">
        <button class="add-task-btn" @click="addTodo">
          Add
        </button>
    </div>
    `,
    data() {
        return {
            value: ''
        }
    }
    ,
    methods: {
        addTodo() {
            this.value = this.value.trim()
            if (this.value) {
                this.$emit('add-todo', this.value)
                document.querySelector('.input-field-conteiner input').value = ''
                document.querySelector('.input-field-conteiner input').focus()
                this.value = ''
            } else {
                alert('Added a text to todo')
            }
        }
    }
}

let todoComponent = {
    props: {
        todo: {
            type: Object,
            required: true,
        },
        actualTab: {
            type: String,
            required: false
        }
    },
    template: `
    <div :id="todo.id" class="todo" :class="{'todo-completed': todo.completed}">
        <i v-if="todo.completed" class="fas fa-cookie-bite" @click="todoItemAction"></i>
        <i v-else class="fas fa-cookie" @click="todoItemAction"></i>
        <div class="todo-text">
            <span >
                {{ todo.text }}
            </span>
        </div>
        <i v-if="todo.completed && actualTab != 'all'" class="fas fa-trash trash" @click="deleteTodo"></i>
    </div>
    `,
    methods: {
        todoItemAction() {
            if (!this.todo.completed) {
                this.$emit('complet-todo', this.todo)
            } else {
                this.$emit('undo-todo', this.todo)
            }
        },
        deleteTodo(){
            this.$emit('delete-todo', this.todo)
        }
    }
}

let activeTodosComponent = {
    props: {
        todos: {
            type: Array,
            required: true,
        }
    },
    template: `
    <div class="active-todos-tab todo-tab" >
        <todo-item @complet-todo="completeTodo" v-for="todo in todos" :todo="todo"></todo-item>
    </div>
    `,
    components: {
        'todo-item': todoComponent,
    },
    methods: {
        completeTodo(todo) {
            this.$emit('complet-todo', todo)
        },
    }
}

let buttonDeleteAllCompletedTodo = {
    template: `
        <button class="btn-clear-all-todo-completed" @click="deleteAllTodoCompleted">Clear All</button>
    `,
    methods: {
        deleteAllTodoCompleted(){
            this.$emit('delete-all-todo-completed')
        }
    }
}

let completedTodosComponent = {
    props: {
        todos: {
            type: Array,
            required: true,
        }
    },
    template: `
    <div class="completed-todos-tab todo-tab" >
        <todo-item v-for="todo in todos" :todo="todo" @undo-todo="undoTodo" @delete-todo="deleteTodo"></todo-item>
        <btn-clear-all v-if="todos.length" @delete-all-todo-completed="deleteAllTodoCompleted"></btn-clear-all>
    </div>
    `,
    components: {
        'todo-item': todoComponent,
        'btn-clear-all': buttonDeleteAllCompletedTodo,
    },
    methods: {
        undoTodo(todo) {
            this.$emit('undo-todo', todo)
        },
        deleteTodo(todo){
            this.$emit('delete-todo', todo)
        },
        deleteAllTodoCompleted(){
            this.$emit('delete-all-todo-completed')
        }
    }
}

let allTodosComponent = {
    props: {
        todos: {
            type: Array,
            required: true,
        },
        actualTab: {
            type: String,
            required: false
        }
    },
    template: `
    <div class="all-todos-tab todo-tab" >
        <todo-item v-for="todo in todos" :todo="todo" :actual-tab="actualTab" @undo-todo="undoTodo" @complet-todo="completeTodo"></todo-item>
    </div>
    `,
    components: {
        'todo-item': todoComponent,
    },
    methods: {
        undoTodo(todo) {
            this.$emit('undo-todo', todo)
        },
        completeTodo(todo) {
            this.$emit('complet-todo', todo)
        }
    }
}

let dashBoardComponent = {
    props: {
        totalTodos: {
            type: Number,
            required: true,
            default: 0
        },
        totalCompleted: {
            type: Number,
            required: true,
            default: 0
        },
        totalUncompleted: {
            type: Number,
            required: true,
            default: 0
        }
    },
    data(){
        return {
            date: new Date().toDateString(),
            time: new Date().toLocaleTimeString()
        }
    }
    ,
    template: `
    <div class="dash-board">
      <div class="dash-board-row">
        <div class="dash-board-field-title-conteiner">
            <h2 class="dash-board-field-title">Date</h2>
            <p class="dash-board-field-percentage">:)</p>
        </div>
        <div class="dash-board-date-conteiner">
            <p class="dash-board-date">{{ date }}</p>
        </div>
      </div>
      <div class="dash-board-row">
        <div class="dash-board-field-title-conteiner">
            <h2 class="dash-board-field-title">Completed</h2>
            <p class="dash-board-field-percentage">{{ completedPercentage.toFixed(2) + '%' }}</p>
        </div>
        <div class="dash-board-progress-bar-conteiner">
          <div class="dash-board-progress-bar completed-progress-bar" :style="{width: completedPercentage + '%'}"></div>
        </div>
      </div>
      <div class="dash-board-row">
        <div class="dash-board-field-title-conteiner">
            <h2 class="dash-board-field-title">Uncompleted</h2>
            <p class="dash-board-field-percentage">{{ uncompletedPercentage.toFixed(2) + '%' }}</p>
        </div>
        <div class="dash-board-progress-bar-conteiner">
          <div class="dash-board-progress-bar uncompleted-progress-bar" :style="{width: uncompletedPercentage + '%'}"></div>
        </div>
      </div>
    </div>
    `,
    computed: {
        completedPercentage(){
            return String(this.totalCompleted * 100 / this.totalTodos) == 'NaN' ? 0 : (this.totalCompleted * 100 / this.totalTodos)
        },
        uncompletedPercentage(){
            return String(this.totalUncompleted * 100 / this.totalTodos) == 'NaN' ? 0 : (this.totalUncompleted * 100 / this.totalTodos)
        }
    }
}

let app = new Vue({
    el: '#main-app',
    data: {
        activeList: [],
        completedList: [],
        activeTab: 'active',
    },
    methods: {
        changeTab(tab) {
            this.activeTab = tab;
        },
        addTodo(todo) {
            if (this.activeTab == 'active' || this.activeTab == 'all') {
                this.activeList.push(
                    {
                        id: 'unconcluded' + this.activeList.length,
                        text: todo,
                        completed: false
                    }
                )
                localStorage.setItem('activesTodos', JSON.stringify(app.activeList))
            }
        },
        completTodo(todo) {
            this.activeList = this.activeList.filter(todoItem => {
                if (todoItem != todo) {
                    return todo
                } else {
                    this.completedList.push({
                        id: 'completed' + this.completedList.length,
                        text: todo.text,
                        completed: true
                    })
                }
            })
            localStorage.setItem('activesTodos', JSON.stringify(app.activeList))
            localStorage.setItem('completedTodos', JSON.stringify(app.completedList))
        },
        undoTodo(todo) {
            this.completedList = this.completedList.filter(todoItem => {
                if (todoItem != todo) {
                    return todo
                } else {
                    this.activeList.push({
                        id: 'uncompleted' + this.activeList.length,
                        text: todo.text,
                        completed: false
                    })
                }
            })
            localStorage.setItem('activesTodos', JSON.stringify(app.activeList))
            localStorage.setItem('completedTodos', JSON.stringify(app.completedList))
        },
        deleteTodo(todo){
            this.completedList = this.completedList.filter(todoItem => {
                if (todoItem != todo) {
                    return todo
                }
            })
            localStorage.setItem('completedTodos', JSON.stringify(app.completedList))
        },
        deleteAllTodoCompleted(){
            this.completedList = []
            localStorage.setItem('completedTodos', JSON.stringify(app.completedList))
        }
    },
    components: {
        'header-component': headerComponent,
        'input-task-component': inputTaskComponent,
        'active-todos-component': activeTodosComponent,
        'completed-todos-component': completedTodosComponent,
        'all-todos-component': allTodosComponent,
        'dash-board-component': dashBoardComponent,
    },
    computed: {
        allList() {
            return this.activeList.concat(this.completedList);
        },
        totalTasks(){
            return this.activeList.length + this.completedList.length;
        },
        totalCompleted(){
            return this.completedList.length;
        },
        totalUncompleted(){
            return this.activeList.length
        }
    }
})


function getLocalStorageData(){
    let activeTodos = localStorage.getItem('activesTodos')
    let completedTodos = localStorage.getItem('completedTodos')

    console.log(activeTodos)
    console.log(completedTodos)

    app.activeList = activeTodos ? JSON.parse(activeTodos) : []
    app.completedList = completedTodos ? JSON.parse(completedTodos) : []
}

document.querySelector('.open').addEventListener('click', ()=>{
    document.querySelector('.mobile-filter-status').style.display = 'block'
    document.querySelector('.dash-board').style.display = 'flex'
    document.querySelector('.close').style.display = 'block'
})

document.querySelector('.close').addEventListener('click', ()=>{
    document.querySelector('.mobile-filter-status').style.display = 'none'
    document.querySelector('.dash-board').style.display = 'none'
    document.querySelector('.close').style.display = 'none'
})

getLocalStorageData()