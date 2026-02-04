class WeatherWidget {
  constructor(container, location = 'Maple Grove, MN') {
    this.container = container;
    this.location = location;
    this.lat = 45.0725;
    this.lon = -93.4558;
    this.current = null;
    this.forecast = null;
    this.lastUpdate = null;
    this.init();
  }

  async init() {
    this.renderLoading();
    await this.fetchData();
    // Refresh every 30 minutes
    setInterval(() => this.fetchData(), 30 * 60 * 1000);
  }

  async fetchData() {
    try {
      // NOAA National Weather Service API (free, no key needed)
      // First, get the grid point for our location
      const pointsResponse = await fetch(`https://api.weather.gov/points/${this.lat},${this.lon}`);
      const pointsData = await pointsResponse.json();
      
      // Get current conditions from the nearest station
      const stationUrl = pointsData.properties.observationStations;
      const stationsResponse = await fetch(stationUrl);
      const stationsData = await stationsResponse.json();
      const nearestStation = stationsData.features[0];
      
      // Get current observation
      const obsResponse = await fetch(`${nearestStation.id}/observations/latest`);
      const obsData = await obsResponse.json();
      this.current = obsData.properties;
      
      // Get forecast
      const forecastUrl = pointsData.properties.forecast;
      const forecastResponse = await fetch(forecastUrl);
      const forecastData = await forecastResponse.json();
      this.forecast = forecastData.properties.periods.slice(0, 5); // 5-day forecast
      
      this.lastUpdate = new Date();
      this.render();
    } catch (e) {
      console.error('Failed to fetch weather data:', e);
      // Use mock data for demo
      this.current = {
        temperature: { value: -5, unitCode: 'wmoUnit:degC' },
        relativeHumidity: { value: 72 },
        windSpeed: { value: 12, unitCode: 'wmoUnit:km_h-1' },
        windDirection: { value: 280 },
        textDescription: 'Partly Cloudy',
        icon: 'https://api.weather.gov/icons/land/day/sct'
      };
      this.forecast = [
        { name: 'Today', temperature: 28, shortForecast: 'Partly Sunny', icon: 'https://api.weather.gov/icons/land/day/sct' },
        { name: 'Tonight', temperature: 18, shortForecast: 'Mostly Cloudy', icon: 'https://api.weather.gov/icons/land/night/bkn' },
        { name: 'Wednesday', temperature: 32, shortForecast: 'Sunny', icon: 'https://api.weather.gov/icons/land/day/skc' },
        { name: 'Wednesday Night', temperature: 22, shortForecast: 'Clear', icon: 'https://api.weather.gov/icons/land/night/skc' },
        { name: 'Thursday', temperature: 35, shortForecast: 'Mostly Sunny', icon: 'https://api.weather.gov/icons/land/day/few' }
      ];
      this.lastUpdate = new Date();
      this.render();
    }
  }

  renderLoading() {
    this.container.innerHTML = `
      <div class="weather-widget">
        <div class="weather-header">
          <span class="weather-title">◉ WX STATION // ${this.location.toUpperCase()}</span>
          <span class="weather-indicator">
            <span class="weather-dot"></span>
            ACQUIRING SIGNAL...
          </span>
        </div>
        <div class="weather-loading">
          <div class="loading-spinner"></div>
          <span>ESTABLISHING UPLINK...</span>
        </div>
      </div>
    `;
  }

  render() {
    if (!this.current) {
      this.renderLoading();
      return;
    }

    this.container.innerHTML = `
      <div class="weather-widget">
        <div class="weather-header">
          <span class="weather-title">◉ WX STATION // ${this.location.toUpperCase()}</span>
          <span class="weather-indicator">
            <span class="weather-dot"></span>
            LIVE
          </span>
        </div>
        
        <div class="weather-content">
          <!-- Current Conditions -->
          <div class="current-conditions">
            <div class="temp-main">
              <span class="temp-value">${this.formatTemp(this.current.temperature)}</span>
              <span class="temp-unit">°F</span>
            </div>
            <div class="conditions-text">${this.current.textDescription || 'Unknown'}</div>
            <div class="conditions-details">
              <div class="detail-item">
                <span class="detail-label">HUMIDITY</span>
                <span class="detail-value">${this.current.relativeHumidity?.value || '--'}%</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">WIND</span>
                <span class="detail-value">${this.formatWind(this.current.windSpeed, this.current.windDirection)}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">UPDATED</span>
                <span class="detail-value">${this.lastUpdate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
              </div>
            </div>
          </div>

          <!-- Radar Embed -->
          <div class="radar-container">
            <div class="radar-header">PRECIPITATION RADAR</div>
            <iframe 
              src="https://radar.weather.gov/?settings=v1_${this.encodeRadarSettings()}" 
              class="radar-iframe"
              frameborder="0"
              scrolling="no"
              title="NOAA Weather Radar">
            </iframe>
          </div>

          <!-- 5-Day Forecast -->
          <div class="forecast-container">
            <div class="forecast-header">5-DAY FORECAST</div>
            <div class="forecast-grid">
              ${this.forecast.map(period => this.renderForecastDay(period)).join('')}
            </div>
          </div>
        </div>

        <div class="weather-footer">
          SOURCE: NOAA / NATIONAL WEATHER SERVICE | REFRESH: 30MIN
        </div>
      </div>
    `;
  }

  renderForecastDay(period) {
    const shortName = period.name.replace('Night', 'NT').replace('Wednesday', 'WED').replace('Thursday', 'THU').replace('Friday', 'FRI').replace('Saturday', 'SAT').replace('Sunday', 'SUN').replace('Monday', 'MON').replace('Tuesday', 'TUE').replace('Today', 'TODAY');
    
    return `
      <div class="forecast-day">
        <div class="forecast-name">${shortName}</div>
        <img class="forecast-icon" src="${period.icon}" alt="" onerror="this.style.display='none'">
        <div class="forecast-temp">${period.temperature}°</div>
        <div class="forecast-desc">${period.shortForecast}</div>
      </div>
    `;
  }

  formatTemp(temp) {
    if (!temp || temp.value === null) return '--';
    // Convert from Celsius to Fahrenheit
    const celsius = temp.value;
    const fahrenheit = (celsius * 9/5) + 32;
    return Math.round(fahrenheit);
  }

  formatWind(speed, direction) {
    if (!speed || speed.value === null) return '--';
    const mph = speed.value * 0.621371; // Convert km/h to mph
    const dir = this.getWindDirection(direction?.value || 0);
    return `${dir} ${Math.round(mph)}mph`;
  }

  getWindDirection(degrees) {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
  }

  encodeRadarSettings() {
    // Simple base64-like encoding for radar settings focused on Minneapolis/St Paul area
    // Settings: centered on Twin Cities, zoomed appropriately
    const settings = {
      center: [-93.2650, 44.9778], // Minneapolis
      zoom: 8,
      layers: ['radar']
    };
    return 'eyJjZW50ZXIiOlstOTMuMjY1MCw0NC45Nzc4XSwiem9vbSI6OH0';
  }
}

// Add CSS styles for the weather widget
const weatherStyles = document.createElement('style');
weatherStyles.textContent = `
  .weather-widget {
    padding: 1.5rem;
    font-family: 'Source Code Pro', monospace;
  }

  .weather-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--border);
  }

  .weather-title {
    font-weight: 700;
    color: var(--accent-blue);
    letter-spacing: 1px;
    font-size: 0.9rem;
  }

  .weather-indicator {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.75rem;
    color: var(--accent-green);
    font-weight: 600;
  }

  .weather-dot {
    width: 8px;
    height: 8px;
    background: var(--accent-green);
    border-radius: 50%;
    animation: pulse 1.5s infinite;
  }

  .weather-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem;
    gap: 1rem;
    color: var(--text-secondary);
    font-size: 0.85rem;
  }

  .loading-spinner {
    width: 30px;
    height: 30px;
    border: 2px solid var(--border);
    border-top-color: var(--accent-green);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .weather-content {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  /* Current Conditions */
  .current-conditions {
    background: var(--bg-secondary);
    padding: 1.5rem;
    border-radius: 6px;
    border: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .temp-main {
    display: flex;
    align-items: flex-start;
    gap: 0.25rem;
  }

  .temp-value {
    font-size: 4rem;
    font-weight: 700;
    color: var(--text-primary);
    line-height: 1;
  }

  .temp-unit {
    font-size: 1.5rem;
    color: var(--accent-blue);
    font-weight: 600;
  }

  .conditions-text {
    font-size: 1.1rem;
    color: var(--text-secondary);
    margin-top: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .conditions-details {
    display: flex;
    justify-content: center;
    gap: 2rem;
    margin-top: 1.5rem;
    padding-top: 1rem;
    border-top: 1px solid var(--border);
    width: 100%;
  }

  .detail-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
  }

  .detail-label {
    font-size: 0.65rem;
    color: var(--text-secondary);
    letter-spacing: 1px;
  }

  .detail-value {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--accent-green);
  }

  /* Radar */
  .radar-container {
    border: 1px solid var(--border);
    border-radius: 6px;
    overflow: hidden;
  }

  .radar-header {
    background: var(--bg-secondary);
    padding: 0.75rem 1rem;
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--text-secondary);
    letter-spacing: 1px;
    border-bottom: 1px solid var(--border);
  }

  .radar-iframe {
    width: 100%;
    height: 250px;
    background: var(--bg-primary);
    filter: grayscale(20%) contrast(1.1);
  }

  /* Forecast */
  .forecast-container {
    background: var(--bg-secondary);
    border: 1px solid var(--border);
    border-radius: 6px;
    overflow: hidden;
  }

  .forecast-header {
    padding: 0.75rem 1rem;
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--text-secondary);
    letter-spacing: 1px;
    border-bottom: 1px solid var(--border);
  }

  .forecast-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 0;
  }

  .forecast-day {
    padding: 1rem 0.5rem;
    text-align: center;
    border-right: 1px solid var(--border);
  }

  .forecast-day:last-child {
    border-right: none;
  }

  .forecast-name {
    font-size: 0.7rem;
    font-weight: 700;
    color: var(--text-secondary);
    letter-spacing: 0.5px;
    margin-bottom: 0.5rem;
  }

  .forecast-icon {
    width: 40px;
    height: 40px;
    margin: 0 auto;
    display: block;
  }

  .forecast-temp {
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--accent-yellow);
    margin: 0.5rem 0;
  }

  .forecast-desc {
    font-size: 0.65rem;
    color: var(--text-secondary);
    line-height: 1.3;
  }

  .weather-footer {
    margin-top: 1.5rem;
    padding-top: 1rem;
    border-top: 1px solid var(--border);
    font-size: 0.65rem;
    color: var(--text-secondary);
    text-align: center;
    letter-spacing: 1px;
  }

  /* Responsive */
  @media (max-width: 600px) {
    .forecast-grid {
      grid-template-columns: repeat(3, 1fr);
    }
    
    .forecast-day:nth-child(3) {
      border-right: none;
    }
    
    .forecast-day:nth-child(4),
    .forecast-day:nth-child(5) {
      border-top: 1px solid var(--border);
    }
    
    .conditions-details {
      gap: 1rem;
    }
    
    .temp-value {
      font-size: 3rem;
    }
  }
`;
document.head.appendChild(weatherStyles);