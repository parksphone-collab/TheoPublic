const YAHOO_API = 'https://query1.finance.yahoo.com/v8/finance/chart';

class FinancialTicker {
  constructor(container) {
    this.container = container;
    this.assets = [
      { symbol: 'BTC', name: 'Bitcoin', type: 'crypto', price: null, change24h: null },
      { symbol: 'DOGE', name: 'Dogecoin', type: 'crypto', price: null, change24h: null },
      { symbol: 'SPX', name: 'S&P 500', type: 'stock', price: null, change24h: null, yahooSymbol: '^GSPC' },
      { symbol: 'DJI', name: 'Dow Jones', type: 'stock', price: null, change24h: null, yahooSymbol: '^DJI' },
      { symbol: 'GOLD', name: 'Gold', type: 'commodity', price: null, change24h: null, yahooSymbol: 'GC=F' },
      { symbol: 'SILVER', name: 'Silver', type: 'commodity', price: null, change24h: null, yahooSymbol: 'SI=F' }
    ];
    this.lastUpdate = null;
    this.init();
  }

  async init() {
    this.render();
    await this.fetchData();
    // Refresh every 15 minutes
    setInterval(() => this.fetchData(), 15 * 60 * 1000);
  }

  async fetchData() {
    try {
      // Crypto from CoinGecko (free, no key)
      const cryptoResponse = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,dogecoin&vs_currencies=usd&include_24hr_change=true');
      const cryptoData = await cryptoResponse.json();
      
      this.assets.find(a => a.symbol === 'BTC').price = cryptoData.bitcoin.usd;
      this.assets.find(a => a.symbol === 'BTC').change24h = cryptoData.bitcoin.usd_24h_change;
      this.assets.find(a => a.symbol === 'DOGE').price = cryptoData.dogecoin.usd;
      this.assets.find(a => a.symbol === 'DOGE').change24h = cryptoData.dogecoin.usd_24h_change;

      // Stocks & Commodities from Yahoo Finance
      await this.fetchYahooData('SPX', '^GSPC');
      await this.fetchYahooData('DJI', '^DJI');
      await this.fetchYahooData('GOLD', 'GC=F');
      await this.fetchYahooData('SILVER', 'SI=F');

      this.lastUpdate = new Date();
      this.render();
    } catch (e) {
      console.error('Failed to fetch market data:', e);
      // Use mock data for demo
      this.assets[0].price = 97250; this.assets[0].change24h = 2.5;
      this.assets[1].price = 0.32; this.assets[1].change24h = -1.2;
      this.assets[2].price = 5950; this.assets[2].change24h = 0.8;
      this.assets[3].price = 42500; this.assets[3].change24h = 0.5;
      this.assets[4].price = 2850; this.assets[4].change24h = -0.3;
      this.assets[5].price = 32.50; this.assets[5].change24h = 1.1;
      this.lastUpdate = new Date();
      this.render();
    }
  }

  async fetchYahooData(symbol, yahooSymbol) {
    try {
      const response = await fetch(`${YAHOO_API}/${yahooSymbol}?interval=1d&range=2d`);
      const data = await response.json();
      
      if (data.chart && data.chart.result && data.chart.result[0]) {
        const result = data.chart.result[0];
        const meta = result.meta;
        const prices = result.indicators.quote[0].close;
        
        const currentPrice = meta.regularMarketPrice || prices[prices.length - 1];
        const previousPrice = meta.previousClose || prices[0];
        const change24h = ((currentPrice - previousPrice) / previousPrice) * 100;
        
        const asset = this.assets.find(a => a.symbol === symbol);
        if (asset) {
          asset.price = currentPrice;
          asset.change24h = change24h;
        }
      }
    } catch (e) {
      console.error(`Failed to fetch ${symbol}:`, e);
    }
  }

  render() {
    this.container.innerHTML = `
      <div class="ticker-widget">
        <div class="ticker-header">
          <span class="ticker-title">◉ MARKET DATA</span>
          <span class="live-indicator">
            <span class="live-dot"></span>
            LIVE
          </span>
        </div>
        <div class="ticker-grid">
          ${this.assets.map(a => this.renderAsset(a)).join('')}
        </div>
        ${this.lastUpdate ? `<div class="ticker-footer">LAST UPDATE: ${this.lastUpdate.toLocaleTimeString()}</div>` : ''}
      </div>
    `;
  }

  renderAsset(asset) {
    const changeColor = asset.change24h >= 0 ? '#00ff88' : '#ff4444';
    const changeArrow = asset.change24h >= 0 ? '▲' : '▼';
    const formattedPrice = asset.price ? 
      (asset.price >= 1000 ? 
        '$' + asset.price.toLocaleString('en-US', {maximumFractionDigits: 0}) : 
        '$' + asset.price.toFixed(asset.price < 1 ? 4 : 2)) : 
      '---';
    
    return `
      <div class="asset-card" data-symbol="${asset.symbol}">
        <div class="asset-header">
          <span class="asset-symbol">${asset.symbol}</span>
          <span class="asset-name">${asset.name}</span>
        </div>
        <div class="asset-price">${formattedPrice}</div>
        <div class="asset-change" style="color:${changeColor}">
          <span class="change-arrow">${changeArrow}</span>
          <span class="change-value">${asset.change24h ? Math.abs(asset.change24h).toFixed(2) : '--'}%</span>
        </div>
      </div>
    `;
  }
}