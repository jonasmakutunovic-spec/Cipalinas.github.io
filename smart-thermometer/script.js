document.addEventListener('DOMContentLoaded', () => {
  const elements = {
    temp: document.getElementById('temperature'),
    unit: document.getElementById('unit'),
    mercury: document.getElementById('mercury'),
    status: document.getElementById('status'),
    cityName: document.getElementById('city-name'),
    feelsLike: document.getElementById('feels-like'),
    humidity: document.getElementById('humidity'),
    rainPercent: document.getElementById('rain-percent'),
    rainBadge: document.getElementById('rain-badge'),
    measureBtn: document.getElementById('measure-btn'),
    geoBtn: document.getElementById('geo-btn'),
    themeBtn: document.getElementById('theme-toggle'),
    unitSelect: document.getElementById('unit-select'),
    cityInput: document.getElementById('city-input'),
    historyList: document.getElementById('history-list'),
    clearBtn: document.getElementById('clear-btn')
  };

  let currentUnit = 'C';
  let history = JSON.parse(localStorage.getItem('weatherHistory') || '[]');

  // Theme
  if (localStorage.getItem('theme') === 'dark') document.body.classList.add('dark');
  elements.themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
  });

  const renderHistory = () => {
    elements.historyList.innerHTML = history.length === 0 
      ? '<li style="color:#999;text-align:center;">No recent locations</li>' 
      : '';
    history.slice().reverse().slice(0, 10).forEach(entry => {
      const li = document.createElement('li');
      li.textContent = `${entry.time} — ${entry.city}: ${entry.temp}°${entry.unit} ${entry.rain}% rain`;
      elements.historyList.appendChild(li);
    });
  };

  const updateBackground = (tempC) => {
    document.body.classList.remove('temp-cold', 'temp-mild', 'temp-warm', 'temp-hot');
    if (tempC < 5) document.body.classList.add('temp-cold');
    else if (tempC < 18) document.body.classList.add('temp-mild');
    else if (tempC < 28) document.body.classList.add('temp-warm');
    else document.body.classList.add('temp-hot');
  };

  const updateDisplay = (data, city) => {
    const tempC = parseFloat(data.current_condition[0].temp_C);
    const feelsC = parseFloat(data.current_condition[0].FeelsLikeC);
    const humidityVal = data.current_condition[0].humidity;
    const rainChance = parseInt(data.weather[0].hourly[0].chanceofrain);
    const desc = data.current_condition[0].weatherDesc[0].value;

    // Convert if needed
    const displayTemp = currentUnit === 'C' ? tempC : (tempC * 9/5) + 32;
    const displayFeels = currentUnit === 'C' ? feelsC : (feelsC * 9/5) + 32;

    elements.temp.textContent = displayTemp.toFixed(1);
    elements.unit.textContent = `°${currentUnit}`;
    elements.feelsLike.textContent = `${displayFeels.toFixed(1)}°${currentUnit}`;
    elements.humidity.textContent = `${humidityVal}%`;
    elements.rainPercent.textContent = `${rainChance}%`;
    elements.cityName.textContent = city;

    // Rain badge style
    elements.rainBadge.className = 'rain-badge';
    if (rainChance > 70) elements.rainBadge.classList.add('rain-veryhigh');
    else if (rainChance > 40) elements.rainBadge.classList.add('rain-high');

    // Mercury + background
    const percent = Math.max(0, Math.min(((tempC + 20) / 60) * 100, 100));
    elements.mercury.style.height = `${percent}%`;
    updateBackground(tempC);

    // Status
    const statusText = `${desc} — ${tempC < 0 ? 'Freezing' : tempC < 15 ? 'Cold' : tempC < 25 ? 'Pleasant' : 'Warm/Hot'}`;
    elements.status.textContent = statusText;
    elements.status.className = `status ${tempC < 5 ? 'freezing' : tempC > 28 ? 'hot' : 'normal'}`;

    // Save to history
    const entry = { time: new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}), city, temp: displayTemp.toFixed(1), unit: currentUnit, rain: rainChance };
    history.push(entry);
    if (history.length > 20) history.shift();
    localStorage.setItem('weatherHistory', JSON.stringify(history));
    renderHistory();
  };

  const fetchWeather = async (location) => {
    try {
      elements.status.textContent = 'Fetching weather...';
      const response = await fetch(`https://wttr.in/${encodeURIComponent(location)}?format=j1`);
      if (!response.ok) throw new Error('Not found');
      const data = await response.json();
      updateDisplay(data, location);
    } catch (err) {
      elements.status.textContent = 'City not found';
      elements.status.className = 'status hot';
    }
  };

  // Buttons
  elements.measureBtn.onclick = () => fetchWeather(elements.cityInput.value || 'Vilnius');
  elements.geoBtn.onclick = () => {
    if (!navigator.geolocation) return alert('Geolocation not supported');
    navigator.geolocation.getCurrentPosition(async pos => {
      const { latitude, longitude } = pos.coords;
      await fetchWeather(`${latitude},${longitude}`);
    }, () => alert('Location access denied'));
  };

  elements.unitSelect.onchange = (e) => {
    currentUnit = e.target.value;
    if (elements.temp.textContent !== '--.-') {
      elements.measureBtn.click(); // refresh with new unit
    }
  };

  elements.clearBtn.onclick = () => {
    if (confirm('Clear history?')) {
      history = [];
      localStorage.removeItem('weatherHistory');
      renderHistory();
    }
  };

  // Start
  renderHistory();
  fetchWeather('Vilnius');
});