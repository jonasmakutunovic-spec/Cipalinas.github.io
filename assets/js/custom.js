document.addEventListener('DOMContentLoaded', function () {

['rating1', 'rating2', 'rating3'].forEach((id, index) => {
        const slider = document.getElementById(id);
        const valueSpan = document.getElementById('value' + (index + 1));
        valueSpan.textContent = slider.value;
        slider.addEventListener('input', function () {
            valueSpan.textContent = this.value;
        });
    });

    const form = document.getElementById('contactForm');
    const resultDiv = document.getElementById('formResult');

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const formData = {
            name: document.getElementById('name').value.trim(),
            surname: document.getElementById('surname').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            address: document.getElementById('address').value.trim(),
            rating1: parseFloat(document.getElementById('rating1').value),
            rating2: parseFloat(document.getElementById('rating2').value),
            rating3: parseFloat(document.getElementById('rating3').value)
        };

        console.log('Form Data Object:', formData);

        const average = ((formData.rating1 + formData.rating2 + formData.rating3) / 3).toFixed(1);
        const avgNum = parseFloat(average);

        let colorClass = 'text-danger';
        if (avgNum > 7) colorClass = 'text-success';
        else if (avgNum > 4) colorClass = 'text-warning';

        resultDiv.innerHTML = `
            <div class="alert alert-info">
                <strong>Submitted Data:</strong><br>
                Name: ${formData.name}<br>
                Surname: ${formData.surname}<br>
                Email: ${formData.email}<br>
                Phone number: ${formData.phone}<br>
                Address: ${formData.address}<br><br>
                <strong>${formData.name} ${formData.surname}: <span class="${colorClass} fw-bold">${average}</span></strong>
            </div>`;

        const popup = document.createElement('div');
        popup.innerHTML = `<div style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);
            background:#28a745;color:white;padding:25px 50px;border-radius:12px;
            box-shadow:0 10px 30px rgba(0,0,0,0.4);z-index:9999;font-size:1.3rem;font-weight:bold;">
            Form submitted successfully!
        </div>`;
        document.body.appendChild(popup);
        setTimeout(() => popup.remove(), 3000);
    });

    // LAB 6: MEMORY GAME
    const cardData = [
        { icon: 'bi-heart-fill' },
        { icon: 'bi-star-fill' },
        { icon: 'bi-lightning-charge-fill' },
        { icon: 'bi-emoji-smile-fill' },
        { icon: 'bi-flower1' },
        { icon: 'bi-sun-fill' }
    ];

    let firstCard = null;
    let secondCard = null;
    let lockBoard = false;
    let moves = 0;
    let matches = 0;
    let totalPairs = 0;
    let difficulty = 'easy';

    const gameBoard = document.getElementById('game-board');
    const movesSpan = document.getElementById('moves');
    const matchesSpan = document.getElementById('matches');
    const winMessage = document.getElementById('win-message');
    const startBtn = document.getElementById('start-btn');
    const restartBtn = document.getElementById('restart-btn');
    const difficultySelect = document.getElementById('difficulty');

    function shuffle(array) {
        return array.sort(() => Math.random() - 0.5);
    }

    function generateBoard() {
        gameBoard.innerHTML = '';
        resetStats();

        const isEasy = difficulty === 'easy';
        const cols = isEasy ? 3 : 4;
        totalPairs = isEasy ? 6 : 12;

        let cards = isEasy 
            ? [...cardData, ...cardData] 
            : [...cardData, ...cardData, ...cardData, ...cardData];

        cards = shuffle(cards);

        gameBoard.style.display = 'grid';
        gameBoard.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
        gameBoard.style.gap = '12px';
        gameBoard.style.maxWidth = `${cols * 110}px`;
        gameBoard.style.margin = '0 auto';

        cards.forEach(item => {
            const card = document.createElement('div');
            card.classList.add('memory-card');
            card.dataset.icon = item.icon;

            const inner = document.createElement('div');
            inner.classList.add('card-inner');

            const front = document.createElement('div');
            front.classList.add('card-front');
            front.innerHTML = '<i class="bi bi-question-lg" style="font-size:2.5rem;"></i>';  // ← now hidden

            const back = document.createElement('div');
            back.classList.add('card-back');
            back.innerHTML = `<i class="${item.icon}" style="font-size:2.5rem;"></i>`;        // ← now revealed when flipped

            inner.appendChild(front);
            inner.appendChild(back);
            card.appendChild(inner);
            card.addEventListener('click', flipCard);
            gameBoard.appendChild(card);
        });
    }

    function flipCard() {
        if (lockBoard || this.classList.contains('flipped') || this.classList.contains('matched')) return;
        if (this === firstCard) return;

        this.classList.add('flipped');
        moves++;
        movesSpan.textContent = moves;

        if (!firstCard) {
            firstCard = this;
            return;
        }
        secondCard = this;
        lockBoard = true;
        checkForMatch();
    }

    function checkForMatch() {
        const isMatch = firstCard.dataset.icon === secondCard.dataset.icon;

        if (isMatch) {
            firstCard.classList.add('matched');
            secondCard.classList.add('matched');
            matches++;
            matchesSpan.textContent = matches;
            resetBoard();
            if (matches === totalPairs) {
                setTimeout(() => {
                    winMessage.textContent = `Congratulations! You won in ${moves} moves!`;
                    winMessage.classList.remove('d-none');
                }, 600);
            }
        } else {
            setTimeout(() => {
                firstCard.classList.remove('flipped');
                secondCard.classList.remove('flipped');
                resetBoard();
            }, 1000);
        }
    }

    function resetBoard() {
        [firstCard, secondCard] = [null, null];
        lockBoard = false;
    }

    function resetStats() {
        moves = 0;
        matches = 0;
        movesSpan.textContent = 0;
        matchesSpan.textContent = 0;
        winMessage.classList.add('d-none');
    }

    startBtn.addEventListener('click', () => {
        generateBoard();
        startBtn.disabled = true;
        restartBtn.disabled = false;
    });

    restartBtn.addEventListener('click', generateBoard);

    difficultySelect.addEventListener('change', (e) => {
        difficulty = e.target.value;
        startBtn.disabled = false;
        restartBtn.disabled = true;
        gameBoard.innerHTML = '';
        winMessage.classList.add('d-none');
    });
});