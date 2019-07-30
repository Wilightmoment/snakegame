let map
let food
let snake
const ready = document.querySelector('.ready')
const playing = document.querySelector('.playing')
const end = document.querySelector('.end')
let timer
let initSpeed = 200
let nowSpeed = initSpeed
let score = 0
let best = 0
let flag = 1
let state = 'ready'

function Map () {
    this.width = 1120
    this.height = 640
    this.position = 'relative'
    this.backgroundColor = '#00035A'
    this._map
    let fragment = document.createDocumentFragment()
    for (let i = 0; i < 16; i++) {
        let rows = document.createElement('div')
        rows.className = 'rows'
        for (let j = 0; j < 28; j++) {
            let lattice = document.createElement('div')
            lattice.className = 'lattice'
            rows.append(lattice)
        }
        fragment.appendChild(rows)
    }
    this.show = function () {
        this._map = document.createElement('div')
        this._map.style.width = this.width + 'px'
        this._map.style.height = this.height + 'px'
        this._map.style.position = this.position
        this._map.style.backgroundColor = this.backgroundColor
        // this._map.style.margin = '20px auto'
        this._map.appendChild(fragment)
        playing.children[0].append(this._map)
    }
}

function Food () {
    this.width = 40
    this.height = 40
    this.position = 'absolute'
    this.backgroundImage = "url('../img/ic-point.svg')"
    this.backgroundColor = 'rgba(255, 255, 255, 0.2)'
    this.x = 0
    this.y = 0
    this._food
    this._food_shadow
    this.show = function () {
        this._food = document.createElement('div')
        this._food.style.width = this.width + 'px'
        this._food.style.height = this.height + 'px'
        this._food.style.position = this.position
        this._food.style.backgroundImage = this.backgroundImage
        this._food.style.backgroundPosition = 'center'
        this._food.style.backgroundColor = this.backgroundColor
        this.x = Math.floor(Math.random() * map.width / this.width)
        this.y = Math.floor(Math.random() * map.height / this.height)
        this._food.style.left = this.x * this.width + 'px'
        this._food.style.top = this.y * this.height + 'px'

        // 周圍亮光
        for (let i = 1; i < 13; i ++) {
            if (this.x - i >= 0) {
                this._food_shadow = this.set_food_shadow()
                let opacity = (1 - i / 13) * 0.2
                this._food_shadow.style.backgroundColor = `rgba(255, 255, 255, ${opacity})`
                this._food_shadow.style.left = (this.x - i) * this.width + 'px'
                this._food_shadow.style.top = this.y * this.height + 'px'
                map._map.append(this._food_shadow)
            }
            if (this.x + i < map.width / this.width) {
                this._food_shadow = this.set_food_shadow()
                let opacity = (1 - i / 13) * 0.2
                this._food_shadow.style.backgroundColor = `rgba(255, 255, 255, ${opacity})`
                this._food_shadow.style.left = (this.x + i) * this.width + 'px'
                this._food_shadow.style.top = this.y * this.height + 'px'
                map._map.append(this._food_shadow)
            }
            if (this.y - i >= 0) {
                this._food_shadow = this.set_food_shadow()
                let opacity = (1 - i / 13) * 0.2
                this._food_shadow.style.backgroundColor = `rgba(255, 255, 255, ${opacity})`
                this._food_shadow.style.left = this.x * this.width + 'px'
                this._food_shadow.style.top = (this.y - i) * this.height + 'px'
                map._map.append(this._food_shadow)
            }
            if (this.y + i < map.height / this.height) {
                this._food_shadow = this.set_food_shadow()
                let opacity = (1 - i / 13) * 0.2
                this._food_shadow.style.backgroundColor = `rgba(255, 255, 255, ${opacity})`
                this._food_shadow.style.left = this.x * this.width + 'px'
                this._food_shadow.style.top = (this.y + i)  * this.height + 'px'
                map._map.append(this._food_shadow)
            }
        }

        playSound('E5', -20)
        playSound('A5', -20, 50)
        map._map.append(this._food)
    }

    this.set_food_shadow = function (food_shadow) {
        food_shadow = document.createElement('div')
        food_shadow.className = 'food_shadow'
        food_shadow.style.width = this.width + 'px'
        food_shadow.style.height = this.height + 'px'
        food_shadow.style.position = this.position
            
        return food_shadow
    }
}

function Snake () {
    this.width = 40
    this.height = 40
    this.position = 'absolute'
    this.direct = 'right'
    this.body = new Array (
        [3, 2, '#00FFE2', null],
        [2, 2, '#FFFFFF', null],
        [1, 2, 'rgba(255, 255, 255, 0.9)', null]
    )

    this.show = function () {
        for (let i = 0; i < this.body.length; i++) {
            if (this.body[i][3] === null) {
                this.body[i][3] = document.createElement('div')
                this.body[i][3].style.width = this.width + 'px'
                this.body[i][3].style.height = this.height + 'px'
                this.body[i][3].style.position = this.position
                this.body[i][3].style.backgroundColor = this.body[i][2]
                map._map.append(this.body[i][3])
            }
            this.body[i][3].style.left = this.width * this.body[i][0] + 'px'
            this.body[i][3].style.top = this.height * this.body[i][1] + 'px'
        }
        this.body[0][3].style.boxShadow = 'white 0px 0px 20px 5px'
    }

    this.move = function () {
        for (let i = this.body.length - 1; i > 0; i--) {
            this.body[i][0] = this.body[i - 1][0]
            this.body[i][1] = this.body[i - 1][1]
        }

        switch (this.direct) {
            case 'right':
                this.body[0][0] = this.body[0][0] + 1
                break
            case 'left':
                this.body[0][0] = this.body[0][0] - 1
                break
            case 'up':
                this.body[0][1] = this.body[0][1] - 1
                break
            case 'down':
                this.body[0][1] = this.body[0][1] + 1
                break
        }
        this.show()
        this.condition()
        playSound("A2", -20)
    }

    this.speed = function () {
        timer = setInterval('snake.move()', initSpeed)
    }

    this.condition = function () {
        // eat
        if (this.body[0][0] === food.x && this.body[0][1] === food.y) {
            score++
            const opacity = 1 - (this.body.length - 2.5) / this.body.length
            this.body.push([0, 0, `rgba(255, 255, 255, ${opacity})`, null])
            
            document.querySelectorAll('.food_shadow').forEach(shadow => {
                shadow.parentNode.removeChild(shadow)
            })
            map._map.removeChild(food._food)
            food.show()
            playSound('E5', -20)
            playSound('A5', -20, 50)
        }
        // wall
        if (this.body[0][0] < 0 || this.body[0][0] >= map.width / this.width
            || this.body[0][1] < 0 || this.body[0][1] >= map.height / this.height) {
            endGame()
            return
        }
        // crash
        for (let i = 1; i < this.body.length; i++) {
            if (this.body[0][0] === this.body[i][0] && this.body[0][1] === this.body[i][1]) {
                endGame()
                return
            }
        }
        // accelerate
        if (score / 2 === flag) {
            clearInterval(timer)
            flag++
            nowSpeed = initSpeed / 1.5
            timer = setInterval('snake.move()', nowSpeed)
        }

        document.querySelectorAll('.score').forEach(item => item.textContent = score)
    }
}

function initGame () {
    map = new Map()
    food = new Food()
    snake = new Snake()
    score = 0
    flag = 1
    document.querySelectorAll('.score').forEach(item => item.textContent = score)
}

function playGame () {
    initGame()
    map.show()
    food.show()
    snake.show()
    snake.speed()
    best = parseInt(window.localStorage.getItem('best')) || 0
    document.querySelectorAll('.best').forEach(item => item.textContent = best)
    playSound('C#5', -20)
    playSound('E5', -20, 200)
}

function endGame () {
    state = 'end'
    best = best < score ? score : best
    window.localStorage.setItem('best', best)
    document.querySelectorAll('.best').forEach(item => item.textContent = best)
    playing.children[0].removeChild(map._map)
    clearInterval(timer)
    playing.classList.add('invisible')
    end.classList.remove('invisible')
    playSound("A3")
    playSound("E2", -10, 200)
    playSound("A3", -10, 400)
}

function playSound (note, volumn = -12, when = 0) {
    setTimeout(() => {
        let synth = new Tone.Synth().toMaster()
        synth.volumn = volumn
        synth.triggerAttackRelease(note, '8n')
    }, when)
}

window.addEventListener('keydown', function(e) {
    switch (e.keyCode) {
        case 37:
            snake.direct = snake.body[0][1] === snake.body[1][1] ? snake.direct : 'left'
            break
        case 38:
            snake.direct = snake.body[0][0] === snake.body[1][0] ? snake.direct : 'up'
            break
        case 39:
            snake.direct = snake.body[0][1] === snake.body[1][1] ? snake.direct : 'right'
            break
        case 40:
            snake.direct = snake.body[0][0] === snake.body[1][0] ? snake.direct : 'down'
            break
        case 32:
            if (state === 'ready') {
                state = 'playing'
                ready.classList.add('invisible')
                playing.classList.remove('invisible')
                playGame()
            }
            break
        case 78:
           if (state === 'end') {
                ready.classList.remove('invisible')
                end.classList.add('invisible')
                state = 'ready'
           }
           break
        case 89:
            if (state === 'end') {
                playing.classList.remove('invisible')
                end.classList.add('invisible')
                state = 'playing'
                playGame()
            }
            break
    }
})
