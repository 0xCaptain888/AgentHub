'use strict';
let DEMO_MODE = false;
// ============================================================
// AgentHub Dashboard - Application Logic
// ============================================================

// --- Utility functions ---
function esc(s){if(!s)return '';const d=document.createElement('div');d.textContent=String(s);return d.innerHTML}
function fmt(n){return n==null?'--':Number(n).toLocaleString()}
function pct(n){return n==null?'--':(n*100).toFixed(1)+'%'}

async function api(url,opts={}){
  if(DEMO_MODE)return getMockData(url,opts);
  try{
    const resp=await fetch(url,{headers:{'Content-Type':'application/json'},...opts});
    if(!resp.ok)throw new Error('HTTP '+resp.status);
    return resp.json();
  }catch(e){
    DEMO_MODE=true;
    const el=document.getElementById('conn-status');
    if(el)el.innerHTML='<span class="dot dot-y"></span> 演示模式';
    showDemoBanner();
    return getMockData(url,opts);
  }
}

function showDemoBanner(){
  if(document.getElementById('demo-banner'))return;
  const b=document.createElement('div');
  b.id='demo-banner';
  b.style.cssText='position:fixed;top:0;left:0;right:0;z-index:9999;background:linear-gradient(90deg,#b45309,#d97706);color:#fff;text-align:center;padding:6px 40px 6px 12px;font-size:.8rem;font-weight:500;letter-spacing:.3px;';
  b.innerHTML='\uD83D\uDD38 演示模式 — 数据为模拟展示，接入API后显示真实数据 <button onclick="this.parentElement.remove()" style="position:absolute;right:10px;top:50%;transform:translateY(-50%);background:none;border:none;color:#fff;font-size:1.1rem;cursor:pointer;line-height:1">&times;</button>';
  document.body.prepend(b);
}

function getMockData(url,opts){
  // --- GET /api/status ---
  if(url.includes('/api/status')){
    return {"connections":{"llm":false,"amazon":false,"tiktok":false,"serper":false,"erp":false,"webhook":false},"customer_service":{"total":47,"auto_resolved":38,"escalated":3,"avg_response_ms":230},"inventory":{"total_skus":10,"total_units":4085,"total_value":44126.0,"critical_alerts":0,"warning_alerts":7,"warehouses":{"amazon_fba":2030,"tiktok":905,"in_transit":1150}},"products":3};
  }
  // --- GET /api/dashboard ---
  if(url.includes('/api/dashboard')){
    return {"customer_service":{"today":{"total":47,"auto_resolved":38,"escalated":3,"avg_response_ms":230},"week":{"total":312,"satisfaction":4.6},"top_intents":[{"intent":"pre_sale","count":45,"pct":38},{"intent":"logistics","count":32,"pct":27},{"intent":"after_sale","count":25,"pct":21},{"intent":"complaint","count":10,"pct":8},{"intent":"other","count":8,"pct":6}],"platforms":{"tiktok":180,"amazon":132}},"supply_chain":{"total_skus":10,"total_units":4085,"total_value":44126.0,"critical_alerts":0,"warning_alerts":7,"warehouses":{"amazon_fba":2030,"tiktok":905,"in_transit":1150}},"inventory_alerts":[{"severity":"warning","product":"ZenFlex Premium Yoga Mat","variant":"Grey","message":"23 days of stock remaining. Plan restock within 9 days."},{"severity":"warning","product":"LumiPro Smart Desk Lamp","variant":"Silver","message":"23 days of stock remaining. Plan restock within 9 days."}],"competitor_briefing":{"date":"2026-03-27","sections":[{"product":"ProSound X1","our_price":39.99,"market_avg":36.66,"alerts":[{"type":"price_change","severity":"medium","competitor":"SoundCore A40","detail":"Price increased by $3.00 (+8.8%)"}],"recommendation":{"action":"hold","suggested_price":39.99,"current_margin":68.7,"projected_margin":68.7,"reasoning":"Current pricing is competitive. Focus on maintaining BSR through PPC optimization and review velocity."},"competitors_count":3}]},"connections":{"llm":false,"amazon":false,"tiktok":false,"serper":false,"erp":false,"webhook":false}};
  }
  // --- POST /api/cs/chat ---
  if(url.includes('/api/cs/chat')){
    return {"response":"\u611f\u8c22\u60a8\u7684\u54a8\u8be2\uff01\u8fd9\u662f\u6f14\u793a\u6a21\u5f0f\u7684\u81ea\u52a8\u56de\u590d\u3002\u5728\u5b9e\u9645\u4f7f\u7528\u4e2d\uff0cAI\u5c06\u6839\u636e\u77e5\u8bc6\u5e93\u548c\u8ba2\u5355\u6570\u636e\u4e3a\u60a8\u63d0\u4f9b\u7cbe\u51c6\u56de\u7b54\u3002","intent":"pre_sale","language":"zh","platform":"tiktok","escalated":false,"elapsed_ms":125,"kb_results":[{"category":"\u4ea7\u54c1\u4fe1\u606f","score":0.85},{"category":"\u552e\u540e\u653f\u7b56","score":0.62}],"order_info":null};
  }
  // --- GET /api/cs/stats ---
  if(url.includes('/api/cs/stats')){
    return {"today":{"total":47,"auto_resolved":38,"escalated":3,"avg_response_ms":230},"week":{"total":312,"satisfaction":4.6},"platforms":{"tiktok":180,"amazon":132}};
  }
  // --- POST /api/listing/generate ---
  if(url.includes('/api/listing/generate')){
    return {"product":{"name":"ProSound X1 Wireless Earbuds","category":"Electronics > Audio > Earbuds","features":["Active Noise Cancellation","40h battery life","IPX5 waterproof","Bluetooth 5.3","Touch controls","Fast charging"],"price":39.99,"variants":["Black","White","Navy Blue"]},"platform":"amazon","language":"en","listing":{"from_llm":false,"title":"ProSound X1 Wireless Earbuds \u2014 Active Noise Cancellation, 40h battery life, Wireless Earbuds for Android","bullet1":"\u3010ACTIVE\u3011Active Noise Cancellation \u2014 Designed for maximum performance and user comfort.","bullet2":"\u301040H\u301140h battery life \u2014 Designed for maximum performance and user comfort.","bullet3":"\u3010IPX5\u3011IPX5 waterproof \u2014 Designed for maximum performance and user comfort.","bullet4":"\u3010BLUETOOTH\u3011Bluetooth 5.3 \u2014 Designed for maximum performance and user comfort.","bullet5":"\u3010TOUCH\u3011Touch controls \u2014 Designed for maximum performance and user comfort.","description":"ProSound X1 Wireless Earbuds combines cutting-edge technology with premium build quality. Featuring active noise cancellation and 40h battery life, this product delivers exceptional value.","backend_keywords":"wireless headphones, TWS earphones, in-ear headphones, sport earbuds, gym earbuds"},"keywords":{"primary":["wireless earbuds","bluetooth earbuds","noise cancelling earbuds","earbuds with microphone"],"secondary":["workout earbuds","waterproof earbuds","long battery earbuds"],"backend":["wireless headphones","TWS earphones","in-ear headphones"]},"competitors":[{"rank":1,"title":"Best Seller in Earbuds","price":35.42,"rating":4.5,"reviews":8200,"bsr":1200},{"rank":2,"title":"Top Rated Earbuds","price":42.18,"rating":4.3,"reviews":5100,"bsr":2300}],"seo":{"score":72,"issues":["Title length (98 chars) \u2014 ideal is 80-200"],"keyword_coverage":35},"elapsed_ms":15};
  }
  // --- GET /api/content/calendar ---
  if(url.includes('/api/content/calendar')){
    return {"calendar":[{"day":"Mon","format_name":"\u5f00\u7bb1\u89c6\u9891","product":"ProSound X1 Earbuds","post_time":"19:00 EST","notes":"\u65b0\u54c1\u9996\u53d1"},{"day":"Tue","format_name":"\u4ea7\u54c1\u6d4b\u8bc4","product":"ZenFlex Yoga Mat","post_time":"12:00 EST","notes":""},{"day":"Wed","format_name":"\u751f\u6d3b\u65b9\u5f0f","product":"LumiPro Desk Lamp","post_time":"18:00 EST","notes":"\u5c45\u5bb6\u529e\u516c\u573a\u666f"},{"day":"Thu","format_name":"\u5bf9\u6bd4\u8bc4\u6d4b","product":"ProSound X1 Earbuds","post_time":"20:00 EST","notes":"vs\u7ade\u54c1"},{"day":"Fri","format_name":"\u5f00\u7bb1\u89c6\u9891","product":"ZenFlex Yoga Mat","post_time":"17:00 EST","notes":"\u5468\u672b\u5907\u6218"},{"day":"Sat","format_name":"\u76f4\u64ad\u5e26\u8d27","product":"All Products","post_time":"20:00 EST","notes":"\u5468\u672b\u5927\u4fc3"},{"day":"Sun","format_name":"\u7528\u6237\u6545\u4e8b","product":"LumiPro Desk Lamp","post_time":"10:00 EST","notes":"\u8f7b\u677e\u5185\u5bb9"}],"total_posts":7};
  }
  // --- GET /api/content/formats ---
  if(url.includes('/api/content/formats')){
    return [{"key":"unboxing","name":"\u5f00\u7bb1\u89c6\u9891","duration":"60-90s","steps":4},{"key":"review","name":"\u4ea7\u54c1\u6d4b\u8bc4","duration":"2-3min","steps":5},{"key":"comparison","name":"\u5bf9\u6bd4\u8bc4\u6d4b","duration":"2-3min","steps":5},{"key":"lifestyle","name":"\u751f\u6d3b\u65b9\u5f0f","duration":"30-60s","steps":4}];
  }
  // --- POST /api/content/script ---
  if(url.includes('/api/content/script')){
    return {"script":"[\u6f14\u793a\u6a21\u5f0f] \u8fd9\u662f\u4e00\u4e2aAI\u751f\u6210\u7684\u4ea7\u54c1\u89c6\u9891\u811a\u672c\u793a\u4f8b\u3002\n\n**\u5f00\u573a (0-5s)**\n\u5927\u5bb6\u597d\uff01\u4eca\u5929\u7ed9\u5927\u5bb6\u5e26\u6765\u4e00\u6b3e\u8d85\u68d2\u7684\u4ea7\u54c1\u5f00\u7bb1\uff01\n\n**\u4ea7\u54c1\u5c55\u793a (5-30s)**\n\u770b\u770b\u8fd9\u4e2a\u5305\u88c5\uff0c\u8d28\u611f\u6ee1\u6ee1\uff01\u6253\u5f00\u4e4b\u540e...\n\n**\u529f\u80fd\u6f14\u793a (30-50s)**\n\u6700\u8ba9\u6211\u60ca\u559c\u7684\u662f\u8fd9\u4e9b\u529f\u80fd...\n\n**\u603b\u7ed3 (50-60s)**\n\u94fe\u63a5\u5728\u8bc4\u8bba\u533a\uff0c\u8d76\u7d27\u51b2\uff01","format":"unboxing","hashtags":["#\u597d\u7269\u63a8\u8350","#\u5f00\u7bb1","#\u5fc5\u4e70\u6e05\u5355","#TikTokMadeMeBuyIt"],"template":{"name":"\u5f00\u7bb1\u89c6\u9891","duration":"60-90s"},"elapsed_ms":80};
  }
  // --- POST /api/content/live ---
  if(url.includes('/api/content/live')){
    return {"sections":{"opening":"\u5bb6\u4eba\u4eec\u665a\u4e0a\u597d\uff01\u6b22\u8fce\u6765\u5230\u76f4\u64ad\u95f4\uff01","product_intro":["\u4eca\u5929\u7ed9\u5927\u5bb6\u5e26\u6765\u4e00\u6b3e\u8d85\u503c\u597d\u7269\uff01","\u54c1\u8d28\u8d85\u597d\uff0c\u6211\u81ea\u5df1\u7528\u4e86\u4e00\u4e2a\u6708\uff0c\u771f\u7684\u79bb\u4e0d\u5f00\u4e86"],"engagement_hooks":["\u89c9\u5f97\u597d\u7684\u6263\uff11\uff01","\u60f3\u8981\u7684\u8d76\u7d27\u70b9\u5173\u6ce8\u4e0d\u8ff7\u8def\uff01","\u5e93\u5b58\u6709\u9650\uff0c\u5148\u5230\u5148\u5f97\uff01"],"closing":"\u611f\u8c22\u5927\u5bb6\u7684\u652f\u6301\uff01\u5173\u6ce8\u4e3b\u64ad\u4e0d\u8ff7\u8def\uff0c\u4e0b\u6b21\u5f00\u64ad\u4e0d\u9519\u8fc7\uff01","key_numbers":{"original_price":29.99,"promo_price":19.99,"discount_pct":33}},"elapsed_ms":60};
  }
  // --- POST /api/competitor/overview ---
  if(url.includes('/api/competitor/overview')){
    return {"product":{"name":"ProSound X1","price":39.99,"cost":12.5,"min_price":28.99,"rating":4.4,"reviews":1250,"bsr":420,"monthly_sales":1800},"competitors":[{"asin":"B09JNK4YPF","name":"SoundCore A40","brand":"Anker","platform":"amazon","price_history":[39.99,35.99,33.99,36.99],"current_price":36.99,"rating":4.5,"reviews":42350,"bsr":156},{"asin":"B0C8DL3HSR","name":"JBL Tune Buds","brand":"JBL","platform":"amazon","price_history":[49.99,44.99,42.99,44.99],"current_price":44.99,"rating":4.3,"reviews":18920,"bsr":289}],"price_analysis":{"our_price":39.99,"market_avg":40.99,"market_min":36.99,"market_max":44.99,"our_position":"below_avg","price_competitiveness":62},"alerts":[{"type":"price_change","severity":"medium","competitor":"SoundCore A40","detail":"Price increased by $3.00 (+8.8%)"}],"recommendation":{"action":"hold","suggested_price":39.99,"current_margin":68.7,"projected_margin":68.7,"reasoning":"Current pricing is competitive. Focus on maintaining BSR through PPC optimization and review velocity."},"elapsed_ms":12};
  }
  // --- GET /api/competitor/briefing ---
  if(url.includes('/api/competitor/briefing')){
    return {"date":"2026-03-27","sections":[{"product":"ProSound X1","our_price":39.99,"market_avg":36.66,"alerts":[{"type":"price_change","severity":"medium","competitor":"SoundCore A40","detail":"Price increased by $3.00 (+8.8%)"}],"recommendation":{"action":"hold","suggested_price":39.99,"current_margin":68.7,"projected_margin":68.7,"reasoning":"Current pricing is competitive. Focus on maintaining BSR through PPC optimization and review velocity."},"competitors_count":3}]};
  }
  // --- GET /api/competitor/products ---
  if(url.includes('/api/competitor/products')){
    return [{"key":"earbuds","name":"ProSound X1","price":39.99,"rating":4.4,"reviews":1250},{"key":"yoga_mat","name":"ZenFlex Premium","price":29.99,"rating":4.3,"reviews":680},{"key":"desk_lamp","name":"LumiPro Smart","price":34.99,"rating":4.5,"reviews":420}];
  }
  // --- GET /api/supply/overview ---
  if(url.includes('/api/supply/overview')){
    return {"products":[{"key":"earbuds","sku":"PS-X1-BLK","name":"ProSound X1 Wireless Earbuds","unit_cost":12.5,"variants":[{"variant":"Black","amazon_fba":450,"tiktok_warehouse":180,"in_transit":500,"daily_velocity":30,"amazon_velocity":18,"tiktok_velocity":12,"days_of_stock":21,"amazon_days":25,"tiktok_days":15,"status":"warning"},{"variant":"White","amazon_fba":280,"tiktok_warehouse":120,"in_transit":300,"daily_velocity":20,"amazon_velocity":12,"tiktok_velocity":8,"days_of_stock":20,"amazon_days":23,"tiktok_days":15,"status":"warning"}],"totals":{"amazon_fba":730,"tiktok_warehouse":300,"in_transit":800,"total":1830}}],"total_inventory_value":44126.0,"alerts":[{"severity":"warning","product":"ZenFlex Premium Yoga Mat","variant":"Grey","message":"23 days of stock remaining. Plan restock within 9 days."}]};
  }
  // --- POST /api/supply/restock ---
  if(url.includes('/api/supply/restock')){
    return {"product":"ProSound X1 Wireless Earbuds","sku":"PS-X1-BLK","unit_cost":12.5,"moq":500,"lead_time_days":21,"orders":[{"variant":"Black","current_stock":1130,"in_transit":500,"target_stock":1800,"gap":670,"order_quantity":700,"allocation":{"amazon_fba":420,"tiktok_warehouse":280},"cost":8750.0,"urgency":"normal","ship_method":"sea","estimated_arrival":"2026-05-12"},{"variant":"Navy","current_stock":240,"in_transit":0,"target_stock":540,"gap":300,"order_quantity":500,"allocation":{"amazon_fba":333,"tiktok_warehouse":167},"cost":6250.0,"urgency":"urgent","ship_method":"air","estimated_arrival":"2026-04-24"}],"total_units":1200,"total_cost":15000.0};
  }
  // --- POST /api/supply/forecast ---
  if(url.includes('/api/supply/forecast')){
    var forecastData=[];
    var baseDate=new Date();
    for(var i=0;i<30;i++){
      var d=new Date(baseDate);d.setDate(d.getDate()+i);
      var ds=d.toISOString().slice(0,10);
      var stock=Math.max(200,1130-i*30+Math.floor(Math.random()*40-20));
      var sales=25+Math.floor(Math.random()*15);
      forecastData.push({"date":ds,"projected_stock":stock,"projected_sales":sales,"reorder_point":300});
    }
    return {"forecast":forecastData,"summary":{"avg_daily_sales":32,"stockout_date":"2026-05-01","reorder_date":"2026-04-10"}};
  }
  // --- GET /api/supply/stats ---
  if(url.includes('/api/supply/stats')){
    return {"total_skus":10,"total_units":4085,"total_value":44126.0,"critical_alerts":0,"warning_alerts":7,"warehouses":{"amazon_fba":2030,"tiktok":905,"in_transit":1150}};
  }
  // --- POST /api/competitor/search ---
  if(url.includes('/api/competitor/search')){
    return {"results":[],"note":"\u6f14\u793a\u6a21\u5f0f\uff1a\u914d\u7f6e SERPER_API_KEY \u542f\u7528\u5b9e\u65f6\u641c\u7d22"};
  }
  // --- GET /api/listing/products ---
  if(url.includes('/api/listing/products')){
    return [{"key":"earbuds","name":"ProSound X1 Wireless Earbuds","category":"Electronics > Audio > Earbuds","price":39.99,"images":8,"variants":["Black","White","Navy Blue"],"feature_count":6},{"key":"yoga_mat","name":"ZenFlex Premium Yoga Mat","category":"Sports > Yoga > Mats","price":29.99,"images":6,"variants":["Purple","Teal","Grey","Pink"],"feature_count":6},{"key":"desk_lamp","name":"LumiPro Smart Desk Lamp","category":"Home > Lighting > Desk Lamps","price":34.99,"images":7,"variants":["White","Black","Silver"],"feature_count":7}];
  }
  // --- Fallback ---
  return {};
}
window._echartsInstances=[];
function safeInitEcharts(el){
  if(typeof echarts==='undefined')return null;
  if(!el)return null;
  try{
    const chart=echarts.init(el);
    window._echartsInstances.push(chart);
    return chart;
  }catch(e){
    return null;
  }
}

// Global resize handler (single listener)
window.addEventListener('resize',function(){
  (window._echartsInstances||[]).forEach(function(c){try{c.resize()}catch(e){}});
});

// Track which tabs have been initialized for lazy chart rendering
const _tabInitialized={dashboard:false,cs:false,listing:false,content:false,competitor:false,supply:false,profit:false};

// --- Tab Navigation ---
let currentTab='dashboard';
function switchTab(tab){
  currentTab=tab;
  document.querySelectorAll('.tab-panel').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.sb-btn').forEach(b=>b.classList.remove('active'));
  const tabEl=document.getElementById('tab-'+tab);
  if(tabEl)tabEl.classList.add('active');
  const btnEl=document.querySelector('.sb-btn[data-tab="'+tab+'"]');
  if(btnEl)btnEl.classList.add('active');
  if(tab==='dashboard')loadDashboard();
  if(tab==='cs')loadCSStats();
  if(tab==='listing')loadListingData();
  if(tab==='content')loadContentData();
  if(tab==='competitor')loadCompetitor();
  if(tab==='supply')loadSupply();
  if(tab==='profit')loadProfit();
  // Resize charts after tab switch (charts may now be visible)
  setTimeout(function(){(window._echartsInstances||[]).forEach(function(c){try{c.resize()}catch(e){}})},150);
}

function loadListingData(){
  // Listing tab has no initial data load, it waits for user action
}

// --- Clock ---
function updateClock(){
  const d=new Date();
  document.getElementById('tb-time').textContent=d.toLocaleTimeString('en-US',{hour12:false})+' UTC'+((d.getTimezoneOffset()<=0?'+':'-')+String(Math.abs(d.getTimezoneOffset()/60)).padStart(2,'0'));
}
setInterval(updateClock,1000);updateClock();

// --- Connection check ---
async function checkConnection(){
  const el=document.getElementById('conn-status');
  try{
    const s=await api('/api/status');
    if(DEMO_MODE){
      el.innerHTML='<span class="dot dot-y"></span> 演示模式';
    }else{
      el.innerHTML='<span class="dot dot-g dot-pulse"></span> 系统在线';
    }
    return s;
  }catch(e){
    el.innerHTML='<span class="dot dot-r"></span> 连接断开';
    return null;
  }
}

// ============================================================
// DASHBOARD TAB
// ============================================================
async function loadDashboard(){
  try{
    const data=await api('/api/dashboard');
    renderKPIs(data);
    renderIntentChart(data);
    renderCompAlerts(data);
    renderInvAlerts(data);
    renderAPIStatus(data);
    renderSalesTrendChart();
    renderAgentNetwork();
    generateInsights(data);
    renderWorldMap();
    renderFunnelChart();
  }catch(e){
    document.getElementById('kpi-cards').innerHTML='<div style="color:var(--accent-r);font-size:.82rem">加载面板失败: '+esc(e.message)+'</div>';
  }
}

function renderKPIs(data){
  const cs=data.customer_service||{};
  const sup=data.supply_chain||{};
  const totalOrders=cs.today?.total||cs.week?.total||0;
  const autoResolved=cs.today?.auto_resolved||0;
  const autoResPct=totalOrders>0?autoResolved/totalOrders:0;
  const compSections=data.competitor_briefing?.sections||[];
  let alertCount=0;
  compSections.forEach(s=>{alertCount+=(s.alerts||[]).length});
  alertCount+=(data.inventory_alerts||[]).length;
  const invVal=sup.total_value||0;
  document.getElementById('kpi-cards').innerHTML=`
    <div class="card card-accent"><div class="card-label">今日会话</div><div class="card-value"><span class="countup-val" data-target="${totalOrders}" data-prefix="">0</span></div><div class="card-sub">平均响应: ${cs.today?.avg_response_ms||'--'}ms</div></div>
    <div class="card card-green"><div class="card-label">自动解决率</div><div class="card-value"><span class="countup-val" data-target="${(autoResPct*100).toFixed(0)}" data-suffix="%" data-prefix="">0</span>%</div><div class="card-sub">今日 ${fmt(autoResolved)} / ${fmt(totalOrders)}</div></div>
    <div class="card card-amber"><div class="card-label">活跃预警</div><div class="card-value"><span class="countup-val" data-target="${alertCount}" data-prefix="">0</span></div><div class="card-sub">竞品 + 库存</div></div>
    <div class="card card-red"><div class="card-label">库存总值</div><div class="card-value">$<span class="countup-val" data-target="${invVal}" data-prefix="">0</span></div><div class="card-sub">${fmt(sup.total_units||0)} 件 跨仓库</div></div>`;
  runCountUpAnimations();
}

function renderIntentChart(data){
  const intents=data.customer_service?.top_intents||[];
  const el=document.getElementById('intent-chart');
  if(!intents.length){el.innerHTML='<div style="color:var(--t3);font-size:.78rem">暂无数据</div>';return}
  if(typeof echarts==='undefined'){el.innerHTML='<div style="color:var(--t3);font-size:.78rem">ECharts 未加载</div>';return}
  el.innerHTML='<div class="echart-box" id="intent-echart"></div>';
  const chart=safeInitEcharts(document.getElementById('intent-echart'));
  if(!chart)return;
  const colors=['#3b82f6','#22c55e','#f59e0b','#a855f7','#ef4444','#60a5fa'];
  try{
  chart.setOption({
    tooltip:{trigger:'item',backgroundColor:'rgba(17,24,39,.9)',borderColor:'#2a3550',textStyle:{color:'#e6edf3',fontSize:12}},
    legend:{bottom:0,textStyle:{color:'#8b949e',fontSize:11},itemWidth:12,itemHeight:12},
    series:[{
      type:'pie',radius:['40%','70%'],center:['50%','45%'],
      avoidLabelOverlap:true,
      itemStyle:{borderRadius:6,borderColor:'#111827',borderWidth:2},
      label:{show:false},
      emphasis:{label:{show:true,fontSize:13,fontWeight:'bold',color:'#e6edf3'},itemStyle:{shadowBlur:20,shadowColor:'rgba(0,0,0,.5)'}},
      data:intents.map((e,i)=>({value:e.count,name:e.intent,itemStyle:{color:colors[i%colors.length]}})),
      animationType:'scale',animationEasing:'elasticOut',animationDelay:function(idx){return idx*80}
    }]
  });
  }catch(e){}
}

function renderCompAlerts(data){
  const sections=data.competitor_briefing?.sections||[];
  const el=document.getElementById('comp-alerts');
  let allAlerts=[];
  sections.forEach(s=>{
    (s.alerts||[]).forEach(a=>{a.product=a.competitor||s.product;allAlerts.push(a)});
    if(s.recommendation){allAlerts.push({severity:'info',product:s.product,detail:s.recommendation.action+': '+s.recommendation.reasoning?.slice(0,120)})}
  });
  if(!allAlerts.length){el.innerHTML='<div style="color:var(--t3);font-size:.78rem">暂无竞品预警</div>';return}
  el.innerHTML=allAlerts.slice(0,8).map(a=>{
    const sev=a.severity||'info';
    const dotClass=sev==='high'?'dot-r':sev==='medium'?'dot-y':'dot-g';
    return `<div class="alert-item"><div class="alert-dot ${dotClass}"></div><div><div style="font-weight:600">${esc(a.product||'预警')}</div><div style="color:var(--t2);font-size:.72rem;margin-top:2px">${esc(a.detail||a.message||'')}</div></div></div>`;
  }).join('');
}

function renderInvAlerts(data){
  const alerts=data.inventory_alerts||[];
  const el=document.getElementById('inv-alerts');
  if(!alerts.length){el.innerHTML='<div style="color:var(--t3);font-size:.78rem">所有库存水平正常</div>';return}
  el.innerHTML=alerts.map(a=>{
    const cls=a.severity==='critical'?'dot-r':'dot-y';
    return `<div class="alert-item"><div class="alert-dot ${cls}"></div><div><div style="font-weight:600">${esc(a.product)} — ${esc(a.variant)}</div><div style="color:var(--t2);font-size:.72rem;margin-top:2px">${esc(a.message)}</div></div></div>`;
  }).join('');
}

function renderAPIStatus(data){
  const el=document.getElementById('api-status');
  const conn=data.connections||{};
  const services=[
    {name:'LLM 大模型',key:'llm',desc:'GPT-4o / Claude / DeepSeek'},
    {name:'Amazon SP-API',key:'amazon',desc:'订单、Listing、库存'},
    {name:'TikTok Shop API',key:'tiktok',desc:'店铺管理'},
    {name:'网页搜索',key:'serper',desc:'竞品调研'},
    {name:'ERP系统',key:'erp',desc:'库存同步'},
    {name:'Webhook',key:'webhook',desc:'预警通知'},
  ];
  el.innerHTML=services.map(s=>{
    const ok=conn[s.key];
    return `<div class="kv-row"><span class="kv-key">${esc(s.name)} <span style="font-size:.65rem;color:var(--t3)">${esc(s.desc)}</span></span><span class="kv-val"><span class="dot ${ok?'dot-g':'dot-r'}" style="display:inline-block;margin-right:6px"></span>${ok?'已连接':'未配置'}</span></div>`;
  }).join('');
}

// ============================================================
// CUSTOMER SERVICE TAB
// ============================================================
async function sendCS(){
  const input=document.getElementById('cs-input');
  const msg=input.value.trim();if(!msg)return;
  input.value='';
  const platform=document.getElementById('cs-platform').value;
  const msgsEl=document.getElementById('cs-messages');
  // Clear placeholder
  if(msgsEl.querySelector('div[style]'))msgsEl.innerHTML='';
  msgsEl.innerHTML+=`<div class="msg-bubble msg-user">${esc(msg)}</div>`;
  msgsEl.innerHTML+=`<div class="msg-bubble msg-assistant" id="cs-loading"><div class="spinner" style="width:14px;height:14px"></div></div>`;
  msgsEl.scrollTop=msgsEl.scrollHeight;

  try{
    const res=await api('/api/cs/chat',{method:'POST',body:JSON.stringify({message:msg,platform:platform})});
    const loadEl=document.getElementById('cs-loading');
    if(loadEl)loadEl.remove();
    msgsEl.innerHTML+=`<div class="msg-bubble msg-assistant">${esc(res.response||res.message||JSON.stringify(res))}</div>`;
    msgsEl.scrollTop=msgsEl.scrollHeight;
    // Update side panels
    updateCSPanels(res);
    // Sentiment analysis
    _csMessageCount++;
    const sentiment=analyzeSentiment(msg);
    updateSentimentUI(sentiment);
    // Satisfaction prompt every 3rd message
    if(_csMessageCount%3===0)showSatisfactionPrompt();
  }catch(e){
    const loadEl=document.getElementById('cs-loading');
    if(loadEl)loadEl.remove();
    msgsEl.innerHTML+=`<div class="msg-bubble msg-assistant" style="color:var(--accent-r)">错误: ${esc(e.message)}</div>`;
  }
}

function updateCSPanels(res){
  // Intent
  const panel=document.getElementById('cs-intent-panel');
  panel.innerHTML=`<h4>意图分类</h4>
    <div class="kv-row"><span class="kv-key">意图</span><span class="kv-val"><span class="badge badge-b">${esc(res.intent||'--')}</span></span></div>
    <div class="kv-row"><span class="kv-key">语言</span><span class="kv-val">${esc(res.language||'--')}</span></div>
    <div class="kv-row"><span class="kv-key">是否升级</span><span class="kv-val">${res.escalated?'<span class="badge badge-r">是</span>':'否'}</span></div>
    <div class="kv-row"><span class="kv-key">平台</span><span class="kv-val">${esc(res.platform||'--')}</span></div>
    <div class="kv-row"><span class="kv-key">响应时间</span><span class="kv-val">${res.elapsed_ms||'--'}ms</span></div>`;

  // KB Match
  const kbPanel=document.getElementById('cs-kb-panel');
  const kbResults=res.kb_results||[];
  let kbHtml='<h4>知识库匹配</h4>';
  if(kbResults.length){
    kbResults.forEach((k,i)=>{
      kbHtml+=`<div class="kv-row"><span class="kv-key">${esc(k.category||'结果 '+(i+1))}</span><span class="kv-val">${(k.score*100).toFixed(0)}%</span></div>`;
    });
  }else{kbHtml+='<div style="color:var(--t3);font-size:.78rem">无知识库匹配</div>'}
  kbPanel.innerHTML=kbHtml;

  // Order
  const orderPanel=document.getElementById('cs-order-panel');
  const order=res.order_info;
  let orderHtml='<h4>订单查询</h4>';
  if(order&&order.found){
    orderHtml+=`<div class="kv-row"><span class="kv-key">状态</span><span class="kv-val"><span class="badge ${order.status==='delivered'?'badge-g':order.status==='in_transit'?'badge-a':'badge-b'}">${esc(order.status)}</span></span></div>`;
    if(order.tracking)orderHtml+=`<div class="kv-row"><span class="kv-key">物流追踪</span><span class="kv-val" style="font-size:.68rem">${esc(order.tracking)}</span></div>`;
    if(order.items)orderHtml+=`<div class="kv-row"><span class="kv-key">商品</span><span class="kv-val">${esc(order.items.join(', '))}</span></div>`;
    if(order.platform)orderHtml+=`<div class="kv-row"><span class="kv-key">平台</span><span class="kv-val">${esc(order.platform)}</span></div>`;
  }else{orderHtml+='<div style="color:var(--t3);font-size:.78rem">暂无订单查询</div>'}
  orderPanel.innerHTML=orderHtml;
}

async function loadCSStats(){
  try{
    const stats=await api('/api/cs/stats');
    const panel=document.getElementById('cs-stats-panel');
    let html='<h4>客服统计</h4>';
    const today=stats.today||{};
    const week=stats.week||{};
    html+=`<div class="kv-row"><span class="kv-key">今日总量</span><span class="kv-val">${fmt(today.total)}</span></div>`;
    html+=`<div class="kv-row"><span class="kv-key">自动解决</span><span class="kv-val">${fmt(today.auto_resolved)}</span></div>`;
    html+=`<div class="kv-row"><span class="kv-key">已升级</span><span class="kv-val">${fmt(today.escalated)}</span></div>`;
    html+=`<div class="kv-row"><span class="kv-key">平均响应</span><span class="kv-val">${today.avg_response_ms}ms</span></div>`;
    html+=`<div style="margin-top:8px;font-size:.65rem;color:var(--t3);text-transform:uppercase;letter-spacing:.5px">本周数据</div>`;
    html+=`<div class="kv-row"><span class="kv-key">本周总量</span><span class="kv-val">${fmt(week.total)}</span></div>`;
    html+=`<div class="kv-row"><span class="kv-key">满意度</span><span class="kv-val">${week.satisfaction}/5.0</span></div>`;
    if(stats.platforms){html+=`<div class="kv-row"><span class="kv-key">TikTok</span><span class="kv-val">${fmt(stats.platforms.tiktok)}</span></div><div class="kv-row"><span class="kv-key">Amazon</span><span class="kv-val">${fmt(stats.platforms.amazon)}</span></div>`}
    panel.innerHTML=html;
  }catch(e){}
}

// ============================================================
// LISTING GENERATOR TAB
// ============================================================
async function generateListing(){
  const btn=document.getElementById('lst-gen-btn');
  btn.disabled=true;btn.textContent='生成中...';
  const product_key=document.getElementById('lst-product').value;
  const platform=document.getElementById('lst-platform').value;
  const language=document.getElementById('lst-lang').value;
  try{
    const res=await api('/api/listing/generate',{method:'POST',body:JSON.stringify({product_key,platform,language})});
    renderListingResult(res);
  }catch(e){
    document.getElementById('lst-preview').innerHTML='<div style="color:var(--accent-r)">错误: '+esc(e.message)+'</div>';
    document.getElementById('lst-preview-panel').style.display='block';
  }
  btn.disabled=false;btn.textContent='生成Listing';
}

function renderListingResult(res){
  const listing=res.listing||res;
  const prevEl=document.getElementById('lst-preview');
  let html='<div class="listing-preview">';
  if(listing.title)html+=`<h2>${esc(listing.title)}</h2>`;
  // Bullets
  const bullets=[];
  for(let i=1;i<=5;i++){if(listing['bullet'+i])bullets.push(listing['bullet'+i])}
  if(bullets.length){
    html+='<div class="section-label">核心卖点</div><ul class="bullets">';
    bullets.forEach(b=>html+=`<li>${esc(b)}</li>`);
    html+='</ul>';
  }
  if(listing.description)html+=`<div class="section-label">产品描述</div><p>${esc(listing.description)}</p>`;
  if(listing.backend_keywords)html+=`<div class="section-label">后端关键词</div><p style="font-family:var(--mono);font-size:.75rem;color:var(--t2)">${esc(listing.backend_keywords)}</p>`;
  if(listing.from_llm===false)html+=`<div style="margin-top:12px"><span class="badge badge-a">模板模式</span> <span style="font-size:.72rem;color:var(--t3)">接入LLM API可生成AI优化Listing</span></div>`;
  html+='</div>';
  prevEl.innerHTML=html;
  document.getElementById('lst-preview-panel').style.display='block';

  // SEO Score
  if(res.seo){
    const score=res.seo.score||0;
    const color=score>=80?'var(--accent-g)':score>=60?'var(--accent-a)':'var(--accent-r)';
    const seoEl=document.getElementById('lst-seo');
    let seoHtml=`<div style="display:flex;align-items:center;gap:16px"><div class="gauge-wrap"><div style="font-size:2rem;font-weight:700;color:${color}">${score}</div><div class="gauge-label">/ 100</div></div><div style="flex:1">`;
    if(res.seo.issues?.length){seoHtml+='<div style="font-size:.72rem;color:var(--t2);margin-bottom:4px">待优化项:</div>';res.seo.issues.forEach(i=>seoHtml+=`<div style="font-size:.72rem;color:var(--accent-a);padding:2px 0">- ${esc(i)}</div>`)}
    if(res.seo.keyword_coverage!=null)seoHtml+=`<div class="kv-row" style="margin-top:6px"><span class="kv-key">关键词覆盖率</span><span class="kv-val">${res.seo.keyword_coverage}%</span></div>`;
    seoHtml+='</div></div>';
    seoEl.innerHTML=seoHtml;
    document.getElementById('lst-seo-panel').style.display='block';
  }

  // Keywords
  if(res.keywords){
    const kw=res.keywords;
    const kwEl=document.getElementById('lst-keywords');
    let kwHtml='';
    if(kw.primary){kwHtml+='<div style="font-size:.68rem;color:var(--t3);margin-bottom:4px">主要关键词</div>';kwHtml+=kw.primary.map(k=>`<span class="chip chip-active">${esc(k)}</span>`).join('')}
    if(kw.secondary){kwHtml+='<div style="font-size:.68rem;color:var(--t3);margin:8px 0 4px">次要关键词</div>';kwHtml+=kw.secondary.map(k=>`<span class="chip">${esc(k)}</span>`).join('')}
    if(kw.backend){kwHtml+='<div style="font-size:.68rem;color:var(--t3);margin:8px 0 4px">后端关键词</div>';kwHtml+=kw.backend.map(k=>`<span class="chip">${esc(k)}</span>`).join('')}
    kwEl.innerHTML=kwHtml;
    document.getElementById('lst-keywords-panel').style.display='block';
  }

  // Competitors
  if(res.competitors?.length){
    const compEl=document.getElementById('lst-comp-table');
    let tbl='<table class="tbl"><thead><tr><th>排名</th><th>竞品</th><th>价格</th><th>评分</th><th>评论数</th><th>BSR</th></tr></thead><tbody>';
    res.competitors.forEach(c=>{
      tbl+=`<tr><td>#${c.rank}</td><td>${esc(c.title)}</td><td>$${c.price}</td><td>${c.rating}</td><td>${fmt(c.reviews)}</td><td>${fmt(c.bsr)}</td></tr>`;
    });
    tbl+='</tbody></table>';
    compEl.innerHTML=tbl;
    document.getElementById('lst-comp-panel').style.display='block';
  }
}

// ============================================================
// TIKTOK CONTENT TAB
// ============================================================
async function generateScript(){
  const product_name=document.getElementById('ct-product').value.trim();
  const features=document.getElementById('ct-features').value.trim();
  const format_type=document.getElementById('ct-format').value;
  if(!product_name){alert('请输入产品名称');return}
  document.getElementById('ct-script-panel').style.display='block';
  document.getElementById('ct-script').innerHTML='<div class="loading"><div class="spinner"></div> 生成脚本中...</div>';
  try{
    const res=await api('/api/content/script',{method:'POST',body:JSON.stringify({product_name,features:features.split(',').map(s=>s.trim()),format_type})});
    renderScript(res);
  }catch(e){
    document.getElementById('ct-script').innerHTML='<div style="color:var(--accent-r)">错误: '+esc(e.message)+'</div>';
  }
}

async function generateLiveScript(){
  const product_name=document.getElementById('ct-product').value.trim();
  const features=document.getElementById('ct-features').value.trim();
  if(!product_name){alert('请输入产品名称');return}
  document.getElementById('ct-script-panel').style.display='block';
  document.getElementById('ct-script').innerHTML='<div class="loading"><div class="spinner"></div> 生成直播话术中...</div>';
  try{
    const res=await api('/api/content/live',{method:'POST',body:JSON.stringify({product_name,features:features.split(',').map(s=>s.trim()),price:29.99,promo_price:19.99})});
    renderScript(res);
  }catch(e){
    document.getElementById('ct-script').innerHTML='<div style="color:var(--accent-r)">错误: '+esc(e.message)+'</div>';
  }
}

function renderScript(res){
  const el=document.getElementById('ct-script');
  let html='<div class="script-display">';

  // Video script
  if(res.script){
    html+=`<div style="margin-bottom:8px"><span class="badge badge-b">${esc(res.format||'script')}</span> <span style="font-size:.72rem;color:var(--t3)">${res.elapsed_ms||'--'}ms</span></div>`;
    html+=res.script.replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>').replace(/\n/g,'<br>');
  }

  // Live script sections
  if(res.sections){
    const s=res.sections;
    if(s.opening)html+=`<div class="script-section"><h4>开场白</h4><p>${esc(s.opening)}</p></div>`;
    if(s.product_intro){
      html+='<div class="script-section"><h4>产品介绍</h4>';
      (Array.isArray(s.product_intro)?s.product_intro:[s.product_intro]).forEach(p=>html+=`<p>${esc(p)}</p>`);
      html+='</div>';
    }
    if(s.engagement_hooks){
      html+='<div class="script-section"><h4>互动话术</h4>';
      s.engagement_hooks.forEach(h=>html+=`<p style="color:var(--accent2)">${esc(h)}</p>`);
      html+='</div>';
    }
    if(s.closing)html+=`<div class="script-section"><h4>收尾</h4><p>${esc(s.closing)}</p></div>`;
    if(s.key_numbers){
      html+='<div class="script-section"><h4>核心数据</h4>';
      html+=`<div class="kv-row"><span class="kv-key">原价</span><span class="kv-val">$${s.key_numbers.original_price}</span></div>`;
      if(s.key_numbers.promo_price)html+=`<div class="kv-row"><span class="kv-key">促销价</span><span class="kv-val" style="color:var(--accent-g)">$${s.key_numbers.promo_price} (-${s.key_numbers.discount_pct}%)</span></div>`;
      html+='</div>';
    }
  }

  // Template info
  if(res.template){
    html+=`<div style="margin-top:12px;padding:10px;background:var(--bg3);border-radius:var(--r);font-size:.72rem"><strong>格式:</strong> ${esc(res.template.name)} (${esc(res.template.duration)})</div>`;
  }

  html+='</div>';
  el.innerHTML=html;
  document.getElementById('ct-script-panel').style.display='block';

  // Hashtags
  const tags=res.hashtags||[];
  if(tags.length){
    document.getElementById('ct-hashtags').innerHTML=tags.map(t=>`<span class="chip chip-active">${esc(t)}</span>`).join('');
    document.getElementById('ct-hashtags-panel').style.display='block';
  }
}

async function loadContentData(){
  // Calendar
  try{
    const cal=await api('/api/content/calendar');
    renderCalendar(cal);
  }catch(e){document.getElementById('ct-calendar').innerHTML='<div style="color:var(--t3);font-size:.78rem">日历不可用</div>'}
  // Trending — derive from calendar or formats
  try{
    const fmts=await api('/api/content/formats');
    renderTrending(fmts);
  }catch(e){document.getElementById('ct-trending').innerHTML='<div style="color:var(--t3);font-size:.78rem">热门数据不可用</div>'}
  // Render product radar and posting heatmap
  renderProductRadar();
  renderPostingHeatmap();
}

function renderCalendar(cal){
  const el=document.getElementById('ct-calendar');
  const days=cal.calendar||[];
  if(Array.isArray(days)&&days.length){
    el.innerHTML='<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:6px">'+days.slice(0,7).map(d=>`
      <div class="cal-cell">
        <div class="cal-day">${esc(d.day||'')}</div>
        <div style="font-size:.68rem;color:var(--t1);font-weight:600;margin:2px 0">${esc(d.format_name||d.format||'')}</div>
        <div style="font-size:.68rem;color:var(--t2)">${esc(d.product||'')}</div>
        <div style="font-size:.62rem;color:var(--t3);margin-top:4px">${esc(d.post_time||'')}</div>
        <div style="font-size:.62rem;color:var(--accent-a);margin-top:2px">${esc(d.notes||'')}</div>
      </div>`).join('')+'</div>';
  }else{el.innerHTML='<div style="color:var(--t3);font-size:.78rem">暂无日历数据</div>'}
}

function renderTrending(fmts){
  const el=document.getElementById('ct-trending');
  const items=Array.isArray(fmts)?fmts:[];
  if(items.length){
    el.innerHTML=items.map(t=>`
      <div class="alert-item"><div class="alert-dot dot-g"></div><div style="flex:1"><div style="font-weight:600">${esc(t.name||t.key)}</div><div style="color:var(--t2);font-size:.72rem">时长: ${esc(t.duration||'--')} | ${t.steps||0} 个环节</div></div></div>`).join('');
  }else{el.innerHTML='<div style="color:var(--t3);font-size:.78rem">暂无格式数据</div>'}
}

// ============================================================
// COMPETITOR MONITOR TAB
// ============================================================
let compProducts=[];
let compSelectedProduct='earbuds';

async function loadCompetitor(){
  // Load products
  try{
    const prods=await api('/api/competitor/products');
    compProducts=prods.products||prods||[];
    renderCompProductTabs();
  }catch(e){compProducts=[{key:'earbuds',name:'Earbuds'},{key:'yoga_mat',name:'Yoga Mat'},{key:'desk_lamp',name:'Desk Lamp'}];renderCompProductTabs()}
  loadCompetitorData();
}

function renderCompProductTabs(){
  const el=document.getElementById('comp-product-tabs');
  const items=compProducts.length?compProducts:[{key:'earbuds',name:'Earbuds'},{key:'yoga_mat',name:'Yoga Mat'},{key:'desk_lamp',name:'Desk Lamp'}];
  el.innerHTML=items.map(p=>{
    const key=p.key||p.product_key||p;
    const name=p.name||p.product_name||key;
    return `<button class="chip ${key===compSelectedProduct?'chip-active':''}" onclick="compSelectedProduct='${esc(key)}';loadCompetitorData();renderCompProductTabs()">${esc(name)}</button>`;
  }).join('');
}

async function loadCompetitorData(){
  // Overview
  document.getElementById('comp-prices').innerHTML='<div class="loading"><div class="spinner"></div></div>';
  try{
    const res=await api('/api/competitor/overview',{method:'POST',body:JSON.stringify({product_key:compSelectedProduct})});
    renderCompPrices(res);
    renderCompHistory(res);
    renderCompRecommendation(res);
  }catch(e){document.getElementById('comp-prices').innerHTML='<div style="color:var(--accent-r);font-size:.78rem">'+esc(e.message)+'</div>'}

  // Briefing alerts
  try{
    const brief=await api('/api/competitor/briefing');
    renderCompAlertList(brief);
  }catch(e){document.getElementById('comp-alert-list').innerHTML='<div style="color:var(--t3);font-size:.78rem">暂无预警</div>'}
}

function renderCompPrices(res){
  const el=document.getElementById('comp-prices');
  const comp=res.competitors||[];
  const our=res.product||{};
  if(Array.isArray(comp)&&comp.length){
    let html=`<table class="tbl"><thead><tr><th>名称</th><th>价格</th><th>评分</th><th>评论数</th><th>对比</th></tr></thead><tbody>`;
    html+=`<tr style="background:rgba(59,130,246,.06)"><td style="font-weight:600">${esc(our.name||'我们的产品')}</td><td style="font-weight:600">$${our.price||'--'}</td><td>${our.rating||'--'}</td><td>${fmt(our.reviews)}</td><td>--</td></tr>`;
    comp.forEach(c=>{
      const diff=c.current_price-our.price;
      const color=diff>0?'var(--accent-g)':diff<0?'var(--accent-r)':'var(--t2)';
      html+=`<tr><td>${esc(c.name)}<br><span style="font-size:.65rem;color:var(--t3)">${esc(c.brand||'')} | ${esc(c.platform||'')}</span></td><td>$${c.current_price}</td><td>${c.rating||'--'}</td><td>${fmt(c.reviews)}</td><td style="color:${color};font-family:var(--mono)">${diff>0?'+':''}${diff.toFixed(2)}</td></tr>`;
    });
    html+='</tbody></table>';
    el.innerHTML=html;
  }else{el.innerHTML=renderObjAsKV(res)}
}

function renderCompHistory(res){
  const el=document.getElementById('comp-history');
  const comp=res.competitors||[];
  if(!comp.length){el.innerHTML='<div style="color:var(--t3);font-size:.78rem">暂无价格历史</div>';return}
  if(typeof echarts==='undefined')return;
  el.innerHTML='<div class="echart-box-lg" id="comp-history-echart"></div>';
  const chart=safeInitEcharts(document.getElementById('comp-history-echart'));
  if(!chart)return;
  const colors=['#3b82f6','#22c55e','#f59e0b','#a855f7','#ef4444','#60a5fa'];
  const series=[];const legendData=[];
  comp.forEach((c,i)=>{
    const prices=c.price_history||[];
    if(!prices.length)return;
    legendData.push(c.name);
    series.push({name:c.name,type:'line',smooth:true,symbol:'circle',symbolSize:5,data:prices,lineStyle:{width:2,color:colors[i%colors.length]},itemStyle:{color:colors[i%colors.length]},animationDelay:i*200});
  });
  try{
  chart.setOption({
    tooltip:{trigger:'axis',backgroundColor:'rgba(17,24,39,.9)',borderColor:'#2a3550',textStyle:{color:'#e6edf3',fontSize:12}},
    legend:{data:legendData,bottom:0,textStyle:{color:'#8b949e',fontSize:10},itemWidth:14,itemHeight:8},
    grid:{top:10,right:16,bottom:40,left:50},
    xAxis:{type:'category',data:Array.from({length:Math.max(...comp.map(c=>(c.price_history||[]).length),0)},(_, i)=>'Day '+(i+1)),axisLine:{lineStyle:{color:'#2a3550'}},axisLabel:{color:'#4e5a6e',fontSize:10}},
    yAxis:{type:'value',axisLine:{lineStyle:{color:'#2a3550'}},splitLine:{lineStyle:{color:'#1a2236'}},axisLabel:{color:'#4e5a6e',fontSize:10,formatter:'${value}'}},
    series:series
  });
  }catch(e){}
}

function renderCompAlertList(brief){
  const el=document.getElementById('comp-alert-list');
  const sections=brief.sections||[];
  let allAlerts=[];
  sections.forEach(s=>{(s.alerts||[]).forEach(a=>{a._product=s.product;allAlerts.push(a)})});
  if(allAlerts.length){
    el.innerHTML=allAlerts.map(a=>`
      <div class="alert-item"><div class="alert-dot ${a.severity==='high'?'dot-r':a.severity==='medium'?'dot-y':'dot-g'}"></div>
      <div><div style="font-weight:600">${esc(a.competitor||a._product||'预警')}</div><div style="color:var(--t2);font-size:.72rem">${esc(a.detail||a.message||'')}</div></div></div>`).join('');
  }else{el.innerHTML='<div style="color:var(--t3);font-size:.78rem">暂无活跃预警</div>'}
}

function renderCompRecommendation(res){
  const el=document.getElementById('comp-recommendation');
  const rec=res.recommendation||{};
  const pa=res.price_analysis||{};
  let html='';
  if(rec.action){
    const cls=rec.action==='reduce'?'badge-r':rec.action==='increase'?'badge-g':rec.action==='differentiate'?'badge-p':'badge-b';
    html+=`<div style="margin-bottom:10px"><span class="badge ${cls}" style="font-size:.78rem;padding:4px 12px">${esc(rec.action.toUpperCase())}</span></div>`;
  }
  if(rec.suggested_price)html+=`<div class="kv-row"><span class="kv-key">建议价格</span><span class="kv-val" style="font-size:1rem">$${rec.suggested_price}</span></div>`;
  if(rec.current_margin!=null)html+=`<div class="kv-row"><span class="kv-key">当前利润率</span><span class="kv-val">${rec.current_margin}%</span></div>`;
  if(rec.projected_margin!=null)html+=`<div class="kv-row"><span class="kv-key">预计利润率</span><span class="kv-val">${rec.projected_margin}%</span></div>`;
  if(pa.market_avg)html+=`<div class="kv-row"><span class="kv-key">市场均价</span><span class="kv-val">$${pa.market_avg}</span></div>`;
  if(pa.price_competitiveness!=null)html+=`<div class="kv-row"><span class="kv-key">竞争力指数</span><span class="kv-val">${pa.price_competitiveness}/100</span></div>`;
  if(rec.reasoning)html+=`<div style="margin-top:10px;font-size:.78rem;color:var(--t2);line-height:1.5;padding:10px;background:var(--bg3);border-radius:var(--r)">${esc(rec.reasoning)}</div>`;
  el.innerHTML=html||'<div style="color:var(--t3);font-size:.78rem">生成总览后查看建议</div>';
}

async function competitorSearch(){
  const query=document.getElementById('comp-search-input').value.trim();
  if(!query)return;
  document.getElementById('comp-search-panel').style.display='block';
  document.getElementById('comp-search-results').innerHTML='<div class="loading"><div class="spinner"></div></div>';
  try{
    const res=await api('/api/competitor/search',{method:'POST',body:JSON.stringify({query})});
    const results=res.results||res.search_results||res||[];
    const el=document.getElementById('comp-search-results');
    if(Array.isArray(results)&&results.length){
      el.innerHTML=results.map(r=>`<div class="alert-item"><div class="alert-dot dot-g"></div><div><div style="font-weight:600">${esc(r.title||r.name||'')}</div><div style="color:var(--t2);font-size:.72rem">${esc(r.snippet||r.description||r.url||'')}</div></div></div>`).join('');
    }else{el.innerHTML='<div style="font-size:.78rem;color:var(--t2)">'+esc(JSON.stringify(res))+'</div>'}
  }catch(e){document.getElementById('comp-search-results').innerHTML='<div style="color:var(--accent-r)">'+esc(e.message)+'</div>'}
}

// ============================================================
// SUPPLY CHAIN TAB
// ============================================================
let _supplyDataCache=null;
async function loadSupply(){
  try{
    const overview=await api('/api/supply/overview');
    _supplyDataCache=overview;
    renderSupplyTable(overview);
  }catch(e){document.getElementById('supply-table').innerHTML='<div style="color:var(--accent-r);font-size:.78rem">'+esc(e.message)+'</div>'}
  try{
    const stats=await api('/api/supply/stats');
    renderSupplyAlerts(stats);
  }catch(e){document.getElementById('supply-alerts').innerHTML='<div style="color:var(--t3);font-size:.78rem">暂无预警</div>'}
}

function renderSupplyTable(data){
  const el=document.getElementById('supply-table');
  const products=data.products||[];
  if(!products.length){el.innerHTML='<div style="color:var(--t3)">暂无库存数据</div>';return}
  let html='<table class="tbl"><thead><tr><th>产品</th><th>款式</th><th>FBA库存</th><th>TikTok库存</th><th>在途</th><th>日销量</th><th>可售天数</th><th>状态</th></tr></thead><tbody>';
  products.forEach(p=>{
    (p.variants||[]).forEach((v,i)=>{
      const dr=v.days_of_stock||0;
      const statusCls=dr>30?'badge-g':dr>=14?'badge-a':'badge-r';
      const statusTxt=dr>30?'健康':dr>=14?'预警':'紧急';
      html+=`<tr>
        <td style="font-weight:${i===0?'600':'400'}">${i===0?esc(p.name):''}</td>
        <td>${esc(v.variant)}</td>
        <td>${fmt(v.amazon_fba)}</td>
        <td>${fmt(v.tiktok_warehouse)}</td>
        <td>${fmt(v.in_transit)}</td>
        <td style="font-family:var(--mono)">${v.daily_velocity} <span style="color:var(--t3);font-size:.65rem">(A:${v.amazon_velocity} T:${v.tiktok_velocity})</span></td>
        <td style="font-family:var(--mono);font-weight:600;color:${dr<14?'var(--accent-r)':dr<30?'var(--accent-a)':'var(--accent-g)'}">${dr}</td>
        <td><span class="badge ${statusCls}">${statusTxt}</span></td>
      </tr>`;
    });
  });
  html+='</tbody></table>';
  html+=`<div style="margin-top:10px;font-size:.72rem;color:var(--t3);font-family:var(--mono)">库存总值: $${fmt(data.total_inventory_value)}</div>`;
  el.innerHTML=html;
}

function renderSupplyAlerts(stats){
  const el=document.getElementById('supply-alerts');
  let html='';
  html+=`<div class="kv-row"><span class="kv-key">SKU总数</span><span class="kv-val">${fmt(stats.total_skus)}</span></div>`;
  html+=`<div class="kv-row"><span class="kv-key">总件数</span><span class="kv-val">${fmt(stats.total_units)}</span></div>`;
  html+=`<div class="kv-row"><span class="kv-key">库存总值</span><span class="kv-val">$${fmt(stats.total_value)}</span></div>`;
  if(stats.warehouses){
    html+=`<div class="kv-row"><span class="kv-key">Amazon FBA</span><span class="kv-val">${fmt(stats.warehouses.amazon_fba)} 件</span></div>`;
    html+=`<div class="kv-row"><span class="kv-key">TikTok 仓库</span><span class="kv-val">${fmt(stats.warehouses.tiktok)} 件</span></div>`;
    html+=`<div class="kv-row"><span class="kv-key">在途</span><span class="kv-val">${fmt(stats.warehouses.in_transit)} 件</span></div>`;
  }
  if(stats.critical_alerts>0)html+=`<div style="margin-top:8px"><span class="badge badge-r">${stats.critical_alerts} 紧急</span></div>`;
  if(stats.warning_alerts>0)html+=`<div style="margin-top:4px"><span class="badge badge-a">${stats.warning_alerts} 预警</span></div>`;
  el.innerHTML=html;
}

async function generateRestock(){
  const product_key=document.getElementById('supply-product').value;
  const el=document.getElementById('supply-restock');
  el.innerHTML='<div class="loading"><div class="spinner"></div></div>';
  try{
    const res=await api('/api/supply/restock',{method:'POST',body:JSON.stringify({product_key})});
    const plan=res.plan||res.restock_plan||res;
    renderRestockTable(el,plan);
  }catch(e){el.innerHTML='<div style="color:var(--accent-r);font-size:.78rem">'+esc(e.message)+'</div>'}
}

function renderRestockTable(el,plan){
  if(!plan||typeof plan!=='object'){el.innerHTML=renderObjAsKV(plan);return}
  let html='';
  // If plan has items/variants array
  const items=plan.items||plan.variants||plan.restock_items||null;
  if(Array.isArray(items)&&items.length){
    html+='<table class="tbl"><thead><tr><th>款式</th><th>数量</th><th>仓库</th><th>紧急度</th></tr></thead><tbody>';
    items.forEach(it=>{
      const urg=it.urgency||it.priority||'normal';
      const cls=urg==='critical'||urg==='high'?'badge-r':urg==='medium'?'badge-a':'badge-g';
      html+=`<tr><td>${esc(it.variant||it.sku||it.name||'--')}</td><td style="font-family:var(--mono);font-weight:600">${fmt(it.quantity||it.restock_qty||it.units||0)}</td><td>${esc(it.warehouse||it.destination||'--')}</td><td><span class="badge ${cls}">${esc(urg)}</span></td></tr>`;
    });
    html+='</tbody></table>';
  }
  // Show top-level summary fields
  const skipKeys=new Set(['items','variants','restock_items']);
  const summaryEntries=Object.entries(plan).filter(([k,v])=>!skipKeys.has(k)&&typeof v!=='object');
  if(summaryEntries.length){
    html+='<div style="margin-top:8px">';
    summaryEntries.forEach(([k,v])=>{
      html+=`<div class="kv-row"><span class="kv-key">${esc(k.replace(/_/g,' '))}</span><span class="kv-val">${typeof v==='number'?fmt(v):esc(String(v))}</span></div>`;
    });
    html+='</div>';
  }
  // Show nested objects
  const nestedEntries=Object.entries(plan).filter(([k,v])=>!skipKeys.has(k)&&typeof v==='object'&&v!==null&&!Array.isArray(v));
  nestedEntries.forEach(([k,v])=>{
    html+=`<div style="margin-top:8px"><div style="font-size:.7rem;font-weight:600;color:var(--t3);text-transform:uppercase;margin-bottom:4px">${esc(k.replace(/_/g,' '))}</div>${renderObjAsKV(v)}</div>`;
  });
  el.innerHTML=html||renderObjAsKV(plan);
}

async function generateForecast(){
  const product_key=document.getElementById('forecast-product').value;
  const days=parseInt(document.getElementById('forecast-days').value);
  const el=document.getElementById('supply-forecast');
  el.innerHTML='<div class="loading"><div class="spinner"></div></div>';
  try{
    const res=await api('/api/supply/forecast',{method:'POST',body:JSON.stringify({product_key,days})});
    const fc=res.forecast||res;
    renderForecastChart(el,fc,days);
  }catch(e){el.innerHTML='<div style="color:var(--accent-r);font-size:.78rem">'+esc(e.message)+'</div>'}
}

function renderForecastChart(el,fc,days){
  // Extract daily forecast data if available
  const daily=fc.daily||fc.daily_forecast||fc.predictions||null;
  let chartData=[];
  if(Array.isArray(daily)){
    chartData=daily.map(d=>typeof d==='object'?(d.demand||d.units||d.value||0):d);
  }else if(fc.avg_daily_demand){
    // Generate synthetic data from summary
    const avg=fc.avg_daily_demand;
    for(let i=0;i<days;i++){chartData.push(Math.round(avg*(0.8+Math.random()*0.4)))}
  }else{
    // Fallback: show as KV
    el.innerHTML=renderObjAsKV(fc);return;
  }
  // Show summary + chart
  let summaryHtml='';
  const skipKeys=new Set(['daily','daily_forecast','predictions']);
  Object.entries(fc).filter(([k])=>!skipKeys.has(k)).forEach(([k,v])=>{
    if(typeof v!=='object'){summaryHtml+=`<div class="kv-row"><span class="kv-key">${esc(k.replace(/_/g,' '))}</span><span class="kv-val">${typeof v==='number'?fmt(v):esc(String(v))}</span></div>`}
  });
  el.innerHTML=summaryHtml+'<div class="echart-box-sm" id="forecast-echart" style="margin-top:8px"></div>';
  if(typeof echarts==='undefined')return;
  const chart=safeInitEcharts(document.getElementById('forecast-echart'));
  if(!chart)return;
  try{
  chart.setOption({
    tooltip:{trigger:'axis',backgroundColor:'rgba(17,24,39,.9)',borderColor:'#2a3550',textStyle:{color:'#e6edf3',fontSize:12}},
    grid:{top:10,right:10,bottom:24,left:40},
    xAxis:{type:'category',data:chartData.map((_,i)=>'D'+(i+1)),axisLine:{lineStyle:{color:'#2a3550'}},axisLabel:{color:'#4e5a6e',fontSize:9}},
    yAxis:{type:'value',splitLine:{lineStyle:{color:'#1a2236'}},axisLabel:{color:'#4e5a6e',fontSize:9}},
    series:[{type:'line',data:chartData,smooth:true,symbol:'none',lineStyle:{color:'#3b82f6',width:2},areaStyle:{color:new echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:'rgba(59,130,246,.35)'},{offset:1,color:'rgba(59,130,246,.02)'}])}}]
  });
  }catch(e){}
}

// ============================================================
// HELPERS
// ============================================================
function renderObjAsKV(obj){
  if(!obj||typeof obj!=='object')return '<div style="color:var(--t2);font-size:.78rem">'+esc(String(obj))+'</div>';
  if(Array.isArray(obj)){
    return obj.map(item=>{
      if(typeof item==='object')return renderObjAsKV(item);
      return `<div style="font-size:.78rem;color:var(--t2);padding:2px 0">${esc(String(item))}</div>`;
    }).join('<hr style="border:none;border-top:1px solid var(--border);margin:6px 0">');
  }
  return Object.entries(obj).map(([k,v])=>{
    if(typeof v==='object'&&v!==null){
      return `<div style="margin:6px 0"><div style="font-size:.7rem;font-weight:600;color:var(--t3);text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px">${esc(k.replace(/_/g,' '))}</div>${renderObjAsKV(v)}</div>`;
    }
    return `<div class="kv-row"><span class="kv-key">${esc(k.replace(/_/g,' '))}</span><span class="kv-val">${typeof v==='number'&&v>0&&v<1?pct(v):typeof v==='number'?fmt(v):esc(String(v))}</span></div>`;
  }).join('');
}

// ============================================================
// COUNTUP ANIMATION
// ============================================================
function runCountUpAnimations(){
  document.querySelectorAll('.countup-val').forEach(el=>{
    const target=parseFloat(el.dataset.target)||0;
    const suffix=el.dataset.suffix||'';
    const duration=1200;
    const start=performance.now();
    function step(now){
      const elapsed=now-start;
      const progress=Math.min(elapsed/duration,1);
      const eased=1-Math.pow(1-progress,3);
      const current=Math.round(eased*target);
      el.textContent=current.toLocaleString()+suffix;
      if(progress<1)requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  });
}

// ============================================================
// SALES TREND CHART (Dashboard)
// ============================================================
function renderSalesTrendChart(){
  const el=document.getElementById('sales-trend-chart');
  if(!el||typeof echarts==='undefined')return;
  const chart=safeInitEcharts(el);
  if(!chart)return;
  const days=['周一','周二','周三','周四','周五','周六','周日'];
  const amazonData=[4200,3800,5100,4700,5600,7200,6800];
  const tiktokData=[2800,3200,2900,3500,4100,5800,5200];
  try{
  chart.setOption({
    tooltip:{trigger:'axis',backgroundColor:'rgba(17,24,39,.9)',borderColor:'#2a3550',textStyle:{color:'#e6edf3',fontSize:12}},
    legend:{data:['Amazon','TikTok'],bottom:0,textStyle:{color:'#8b949e',fontSize:11},itemWidth:14,itemHeight:8},
    grid:{top:16,right:16,bottom:40,left:50},
    xAxis:{type:'category',data:days,axisLine:{lineStyle:{color:'#2a3550'}},axisLabel:{color:'#4e5a6e',fontSize:11}},
    yAxis:{type:'value',axisLine:{lineStyle:{color:'#2a3550'}},splitLine:{lineStyle:{color:'#1a2236'}},axisLabel:{color:'#4e5a6e',fontSize:10,formatter:'${value}'}},
    series:[
      {name:'Amazon',type:'line',smooth:true,symbol:'circle',symbolSize:6,data:amazonData,lineStyle:{width:2.5,color:'#f59e0b'},itemStyle:{color:'#f59e0b'},areaStyle:{color:new echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:'rgba(245,158,11,.2)'},{offset:1,color:'rgba(245,158,11,.01)'}])}},
      {name:'TikTok',type:'line',smooth:true,symbol:'circle',symbolSize:6,data:tiktokData,lineStyle:{width:2.5,color:'#3b82f6'},itemStyle:{color:'#3b82f6'},areaStyle:{color:new echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:'rgba(59,130,246,.2)'},{offset:1,color:'rgba(59,130,246,.01)'}])}}
    ]
  });
  }catch(e){}
}

// ============================================================
// AGENT COLLABORATION NETWORK (Dashboard)
// ============================================================
let activeAgentNode=null;
function renderAgentNetwork(){
  const container=document.getElementById('agent-network');
  if(!container)return;
  const agents=[
    {id:'cs',name:'智能客服',icon:'💬',angle:90},
    {id:'listing',name:'Listing',icon:'📄',angle:162},
    {id:'content',name:'TikTok',icon:'🎬',angle:234},
    {id:'competitor',name:'竞品监控',icon:'👁',angle:306},
    {id:'supply',name:'供应链',icon:'🚚',angle:18}
  ];
  const cx=50,cy=46,r=34;
  // SVG lines
  let svg='<svg style="position:absolute;top:0;left:0;width:100%;height:100%;z-index:1" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">';
  for(let i=0;i<agents.length;i++){
    for(let j=i+1;j<agents.length;j++){
      const a1=agents[i].angle*Math.PI/180,a2=agents[j].angle*Math.PI/180;
      const x1=cx+r*Math.cos(a1),y1=cy-r*Math.sin(a1);
      const x2=cx+r*Math.cos(a2),y2=cy-r*Math.sin(a2);
      svg+=`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#2a3550" stroke-width="0.3" opacity="0.5"><animate attributeName="stroke-opacity" values="0.3;0.7;0.3" dur="${3+i*0.5}s" repeatCount="indefinite"/></line>`;
    }
  }
  svg+='</svg>';
  // Nodes
  let nodes='';
  agents.forEach(a=>{
    const rad=a.angle*Math.PI/180;
    const x=cx+r*Math.cos(rad);
    const y=cy-r*Math.sin(rad);
    nodes+=`<div class="agent-node" id="agent-node-${a.id}" style="left:calc(${x}% - 30px);top:calc(${y}% - 30px)" onclick="switchTab('${a.id}')">
      <span class="agent-node-icon">${a.icon}</span>${a.name}</div>`;
  });
  // Center hub
  nodes+=`<div class="agent-node" style="left:calc(${cx}% - 30px);top:calc(${cy}% - 30px);background:linear-gradient(135deg,var(--accent),var(--accent-p));border-color:var(--accent);color:#fff;font-size:.65rem">
    <span class="agent-node-icon">🤖</span>Hub</div>`;
  container.innerHTML=svg+nodes;
}

function highlightAgentNode(tabId){
  document.querySelectorAll('.agent-node').forEach(n=>n.classList.remove('active'));
  const node=document.getElementById('agent-node-'+tabId);
  if(node)node.classList.add('active');
}

// ============================================================
// COMMAND BAR (AI Command Center)
// ============================================================
const CMD_ROUTES=[
  {keywords:['客服','退货','订单','投诉'],tab:'cs'},
  {keywords:['listing','标题','关键词','seo'],tab:'listing'},
  {keywords:['脚本','直播','视频','tiktok','内容'],tab:'content'},
  {keywords:['竞品','价格','对手','监控'],tab:'competitor'},
  {keywords:['库存','补货','供应','物流','预测'],tab:'supply'},
  {keywords:['利润','财务','成本','p&l'],tab:'profit'}
];

function runCommand(){
  const input=document.getElementById('cmd-input');
  const cmd=input.value.trim().toLowerCase();
  if(!cmd)return;
  let matched=null;
  for(const route of CMD_ROUTES){
    if(route.keywords.some(k=>cmd.includes(k))){matched=route.tab;break}
  }
  if(matched){
    switchTab(matched);
    highlightAgentNode(matched);
    showToast('🤖','指令路由','已切换至 '+matched+' 模块');
  }else{
    showToast('❓','未识别指令','无法匹配到对应模块: '+cmd);
  }
  input.value='';
}

document.addEventListener('keydown',function(e){
  if((e.ctrlKey||e.metaKey)&&e.key==='k'){
    e.preventDefault();
    document.getElementById('cmd-input').focus();
  }
});

// ============================================================
// PROFIT ANALYSIS TAB
// ============================================================
const PROFIT_DATA={
  products:[
    {name:'ProSound X1 耳机',price:39.99,cost:12.50,amazonRev:28500,tiktokRev:18200,fbaFee:5.40,adSpend:3200},
    {name:'ZenFlex 瑜伽垫',price:29.99,cost:8.20,amazonRev:15800,tiktokRev:12600,fbaFee:4.20,adSpend:1800},
    {name:'LumiPro 台灯',price:34.99,cost:11.80,amazonRev:19200,tiktokRev:9800,fbaFee:4.80,adSpend:2400}
  ]
};

function loadProfit(){
  renderProfitKPIs();
  renderPnLTable();
  renderProfitTrendChart();
  renderPlatformCompareChart();
}

function renderProfitKPIs(){
  const d=PROFIT_DATA.products;
  const totalRev=d.reduce((s,p)=>s+p.amazonRev+p.tiktokRev,0);
  const totalCost=d.reduce((s,p)=>{
    const units=Math.round((p.amazonRev+p.tiktokRev)/p.price);
    return s+units*p.cost+units*p.fbaFee*0.5+p.adSpend;
  },0);
  const grossProfit=totalRev-totalCost;
  const avgMargin=totalRev>0?(grossProfit/totalRev*100):0;
  const totalAdSpend=d.reduce((s,p)=>s+p.adSpend,0);
  document.getElementById('profit-kpi-cards').innerHTML=`
    <div class="card card-accent"><div class="card-label">月销售额</div><div class="card-value">$<span class="countup-val" data-target="${totalRev}">0</span></div><div class="card-sub">Amazon + TikTok</div></div>
    <div class="card card-green"><div class="card-label">总利润</div><div class="card-value">$<span class="countup-val" data-target="${Math.round(grossProfit)}">0</span></div><div class="card-sub">扣除成本/费用后</div></div>
    <div class="card card-amber"><div class="card-label">平均利润率</div><div class="card-value"><span class="countup-val" data-target="${Math.round(avgMargin)}">0</span>%</div><div class="card-sub">所有产品平均</div></div>
    <div class="card card-red"><div class="card-label">广告花费</div><div class="card-value">$<span class="countup-val" data-target="${totalAdSpend}">0</span></div><div class="card-sub">月度总广告支出</div></div>`;
  runCountUpAnimations();
}

function renderPnLTable(){
  const el=document.getElementById('pnl-table');
  const d=PROFIT_DATA.products;
  let html='<table class="pnl-table"><thead><tr><th>产品名</th><th>Amazon销售额</th><th>TikTok销售额</th><th>成本</th><th>FBA费用</th><th>广告费</th><th>净利润</th><th>利润率</th></tr></thead><tbody>';
  d.forEach(p=>{
    const totalRev=p.amazonRev+p.tiktokRev;
    const units=Math.round(totalRev/p.price);
    const totalCost=units*p.cost;
    const fbaTotal=Math.round(units*p.fbaFee*0.5);
    const netProfit=totalRev-totalCost-fbaTotal-p.adSpend;
    const margin=(netProfit/totalRev*100).toFixed(1);
    const cls=netProfit>0?'pnl-positive':'pnl-negative';
    html+=`<tr><td style="font-weight:600;font-family:var(--font)">${esc(p.name)}</td><td>$${p.amazonRev.toLocaleString()}</td><td>$${p.tiktokRev.toLocaleString()}</td><td>$${totalCost.toLocaleString()}</td><td>$${fbaTotal.toLocaleString()}</td><td>$${p.adSpend.toLocaleString()}</td><td class="${cls}" style="font-weight:700">$${netProfit.toLocaleString()}</td><td class="${cls}">${margin}%</td></tr>`;
  });
  html+='</tbody></table>';
  el.innerHTML=html;
}

function renderProfitTrendChart(){
  const el=document.getElementById('profit-trend-chart');
  if(!el||typeof echarts==='undefined')return;
  const chart=safeInitEcharts(el);
  if(!chart)return;
  const months=['10月','11月','12月','1月','2月','3月'];
  const profitData=[18200,22100,28500,24800,31200,35600];
  const revenueData=[62000,71000,89000,78000,95000,104100];
  try{
  chart.setOption({
    tooltip:{trigger:'axis',backgroundColor:'rgba(17,24,39,.9)',borderColor:'#2a3550',textStyle:{color:'#e6edf3',fontSize:12}},
    legend:{data:['利润','销售额'],bottom:0,textStyle:{color:'#8b949e',fontSize:11}},
    grid:{top:16,right:16,bottom:40,left:55},
    xAxis:{type:'category',data:months,axisLine:{lineStyle:{color:'#2a3550'}},axisLabel:{color:'#4e5a6e',fontSize:11}},
    yAxis:{type:'value',splitLine:{lineStyle:{color:'#1a2236'}},axisLabel:{color:'#4e5a6e',fontSize:10,formatter:'${value}'}},
    series:[
      {name:'销售额',type:'line',smooth:true,data:revenueData,lineStyle:{color:'#60a5fa',width:2},itemStyle:{color:'#60a5fa'},areaStyle:{color:new echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:'rgba(96,165,250,.15)'},{offset:1,color:'rgba(96,165,250,.01)'}])}},
      {name:'利润',type:'line',smooth:true,data:profitData,lineStyle:{color:'#22c55e',width:2.5},itemStyle:{color:'#22c55e'},areaStyle:{color:new echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:'rgba(34,197,94,.2)'},{offset:1,color:'rgba(34,197,94,.01)'}])}}
    ]
  });
  }catch(e){}
}

function renderPlatformCompareChart(){
  const el=document.getElementById('platform-compare-chart');
  if(!el||typeof echarts==='undefined')return;
  const chart=safeInitEcharts(el);
  if(!chart)return;
  const products=['耳机','瑜伽垫','台灯'];
  const amazonRev=[28500,15800,19200];
  const tiktokRev=[18200,12600,9800];
  const amazonProfit=[12800,7200,8100];
  const tiktokProfit=[7600,5400,3200];
  try{
  chart.setOption({
    tooltip:{trigger:'axis',backgroundColor:'rgba(17,24,39,.9)',borderColor:'#2a3550',textStyle:{color:'#e6edf3',fontSize:12}},
    legend:{data:['Amazon 销售额','TikTok 销售额','Amazon 利润','TikTok 利润'],bottom:0,textStyle:{color:'#8b949e',fontSize:10},itemWidth:12,itemHeight:8},
    grid:{top:16,right:16,bottom:50,left:55},
    xAxis:{type:'category',data:products,axisLine:{lineStyle:{color:'#2a3550'}},axisLabel:{color:'#4e5a6e',fontSize:11}},
    yAxis:{type:'value',splitLine:{lineStyle:{color:'#1a2236'}},axisLabel:{color:'#4e5a6e',fontSize:10,formatter:'${value}'}},
    series:[
      {name:'Amazon 销售额',type:'bar',data:amazonRev,itemStyle:{color:'#f59e0b',borderRadius:[4,4,0,0]},barGap:'10%'},
      {name:'TikTok 销售额',type:'bar',data:tiktokRev,itemStyle:{color:'#3b82f6',borderRadius:[4,4,0,0]}},
      {name:'Amazon 利润',type:'bar',data:amazonProfit,itemStyle:{color:'rgba(245,158,11,.45)',borderRadius:[4,4,0,0]}},
      {name:'TikTok 利润',type:'bar',data:tiktokProfit,itemStyle:{color:'rgba(59,130,246,.45)',borderRadius:[4,4,0,0]}}
    ]
  });
  }catch(e){}
}

// ============================================================
// TOAST NOTIFICATION SYSTEM
// ============================================================
function showToast(icon,title,msg){
  const container=document.getElementById('toast-container');
  // Limit to max 3 visible toasts
  while(container.children.length>=3){container.removeChild(container.firstChild)}
  const toast=document.createElement('div');
  toast.className='toast';
  toast.innerHTML='<span class="toast-icon">'+icon+'</span><div class="toast-body"><div class="toast-title">'+esc(title)+'</div><div class="toast-msg">'+esc(msg)+'</div></div>';
  container.appendChild(toast);
  setTimeout(function(){toast.classList.add('toast-out');setTimeout(function(){if(toast.parentNode)toast.remove()},300)},4000);
}

// ============================================================
// FEATURE 1: GLOBAL ORDER HEATMAP
// ============================================================
function renderWorldMap(){
  const container=document.getElementById('world-map-container');
  if(!container)return;
  // Simplified continent SVG paths
  const continents=`
    <path class="map-continent" d="M150,80 L220,60 L280,70 L270,120 L240,160 L200,180 L160,160 L130,140 L120,100Z"/>
    <path class="map-continent" d="M180,190 L220,180 L260,200 L270,260 L250,320 L220,360 L190,340 L170,290 L160,240Z"/>
    <path class="map-continent" d="M430,50 L520,40 L560,60 L550,90 L520,120 L490,140 L450,130 L430,100 L420,70Z"/>
    <path class="map-continent" d="M430,140 L500,130 L560,150 L570,200 L540,250 L500,280 L460,260 L440,220 L420,180Z"/>
    <path class="map-continent" d="M580,50 L700,30 L800,50 L850,90 L830,140 L780,170 L720,180 L660,160 L620,130 L590,100 L575,70Z"/>
    <path class="map-continent" d="M700,180 L780,170 L830,200 L850,240 L820,280 L770,300 L730,290 L700,260 L690,220Z"/>
    <path class="map-continent" d="M800,300 L850,290 L880,310 L890,350 L870,380 L840,390 L810,370 L795,340Z"/>
  `;
  // Order destinations with approximate SVG coords
  const destinations=[
    {name:'纽约',x:230,y:100,color:'#3b82f6',region:'americas',orders:Math.floor(Math.random()*50)+80},
    {name:'洛杉矶',x:155,y:120,color:'#3b82f6',region:'americas',orders:Math.floor(Math.random()*40)+60},
    {name:'芝加哥',x:210,y:95,color:'#3b82f6',region:'americas',orders:Math.floor(Math.random()*30)+40},
    {name:'伦敦',x:460,y:70,color:'#22c55e',region:'europe',orders:Math.floor(Math.random()*30)+50},
    {name:'柏林',x:500,y:68,color:'#22c55e',region:'europe',orders:Math.floor(Math.random()*25)+35},
    {name:'东京',x:810,y:105,color:'#f59e0b',region:'asia',orders:Math.floor(Math.random()*60)+90},
    {name:'曼谷',x:740,y:185,color:'#f59e0b',region:'asia',orders:Math.floor(Math.random()*30)+45},
    {name:'胡志明',x:750,y:195,color:'#f59e0b',region:'asia',orders:Math.floor(Math.random()*20)+30},
    {name:'马尼拉',x:790,y:190,color:'#f59e0b',region:'asia',orders:Math.floor(Math.random()*15)+25},
    {name:'悉尼',x:850,y:350,color:'#a855f7',region:'oceania',orders:Math.floor(Math.random()*25)+30},
  ];
  const source={x:730,y:155}; // Shenzhen
  let dotsHtml='';
  let arcsHtml='';
  let rippleDelay=0;
  destinations.forEach(d=>{
    // Dot
    dotsHtml+=`<circle class="map-dot" cx="${d.x}" cy="${d.y}" r="3" style="color:${d.color}"/>`;
    // Ripple
    dotsHtml+=`<circle class="map-ripple" cx="${d.x}" cy="${d.y}" r="3" style="color:${d.color};animation-delay:${rippleDelay}s"/>`;
    // Label
    dotsHtml+=`<text x="${d.x}" y="${d.y-8}" fill="${d.color}" font-size="7" text-anchor="middle" font-family="var(--font)" opacity=".8">${d.name}</text>`;
    // Arc from Shenzhen
    const mx=(source.x+d.x)/2, my=Math.min(source.y,d.y)-40-Math.abs(source.x-d.x)*0.08;
    const pathLen=Math.sqrt((d.x-source.x)**2+(d.y-source.y)**2)*1.5;
    arcsHtml+=`<path class="map-arc" d="M${source.x},${source.y} Q${mx},${my} ${d.x},${d.y}" stroke="${d.color}" stroke-dasharray="${pathLen}" stroke-dashoffset="${pathLen}" style="animation:arcDash 2s ease ${rippleDelay*0.5}s forwards"/>`;
    rippleDelay+=0.3;
  });
  // Source dot (Shenzhen)
  dotsHtml+=`<circle cx="${source.x}" cy="${source.y}" r="5" fill="var(--accent-r)" opacity=".9"/>`;
  dotsHtml+=`<circle class="map-ripple" cx="${source.x}" cy="${source.y}" r="5" style="color:var(--accent-r)"/>`;
  dotsHtml+=`<text x="${source.x}" y="${source.y-10}" fill="var(--accent-r)" font-size="8" text-anchor="middle" font-family="var(--font)" font-weight="600">深圳</text>`;

  container.innerHTML=`
    <svg class="map-svg" viewBox="0 0 1000 500" xmlns="http://www.w3.org/2000/svg" id="world-map-svg">
      <rect width="1000" height="500" fill="transparent"/>
      ${continents}${arcsHtml}${dotsHtml}
    </svg>
    <div class="map-legend">
      <div class="map-legend-item"><span class="map-legend-dot" style="background:#3b82f6"></span>美洲 ${destinations.filter(d=>d.region==='americas').reduce((s,d)=>s+d.orders,0)} 单</div>
      <div class="map-legend-item"><span class="map-legend-dot" style="background:#22c55e"></span>欧洲 ${destinations.filter(d=>d.region==='europe').reduce((s,d)=>s+d.orders,0)} 单</div>
      <div class="map-legend-item"><span class="map-legend-dot" style="background:#f59e0b"></span>亚洲 ${destinations.filter(d=>d.region==='asia').reduce((s,d)=>s+d.orders,0)} 单</div>
      <div class="map-legend-item"><span class="map-legend-dot" style="background:#a855f7"></span>大洋洲 ${destinations.filter(d=>d.region==='oceania').reduce((s,d)=>s+d.orders,0)} 单</div>
    </div>`;
  // Add new dots periodically
  startMapSimulation(destinations);
}

function startMapSimulation(destinations){
  setInterval(()=>{
    const svg=document.getElementById('world-map-svg');
    if(!svg||!document.getElementById('world-map-container'))return;
    const d=destinations[Math.floor(Math.random()*destinations.length)];
    const ox=(Math.random()-0.5)*20, oy=(Math.random()-0.5)*15;
    const dot=document.createElementNS('http://www.w3.org/2000/svg','circle');
    dot.setAttribute('cx',d.x+ox);dot.setAttribute('cy',d.y+oy);dot.setAttribute('r','0');
    dot.setAttribute('fill',d.color);dot.setAttribute('class','map-new-dot');
    svg.appendChild(dot);
    const ripple=document.createElementNS('http://www.w3.org/2000/svg','circle');
    ripple.setAttribute('cx',d.x+ox);ripple.setAttribute('cy',d.y+oy);ripple.setAttribute('r','3');
    ripple.setAttribute('class','map-ripple');ripple.style.color=d.color;
    svg.appendChild(ripple);
    setTimeout(()=>{dot.remove();ripple.remove()},3000);
  },3000);
}

// ============================================================
// BIG SCREEN MODE
// ============================================================
let bigScreenActive=false;
function toggleBigScreen(){
  bigScreenActive=!bigScreenActive;
  document.body.classList.toggle('bigscreen',bigScreenActive);
  if(bigScreenActive){
    switchTab('dashboard');
    document.body.setAttribute('data-print-date',new Date().toLocaleDateString('zh-CN'));
  }
  // Resize all echarts
  setTimeout(()=>{(window._echartsInstances||[]).forEach(c=>{try{c.resize()}catch(e){}})},300);
}
document.addEventListener('keydown',function(e){
  if(e.key==='Escape'&&bigScreenActive)toggleBigScreen();
});

// ============================================================
// FEATURE 2: AI INSIGHT ENGINE
// ============================================================
let _dashboardDataCache=null;

function generateInsights(data){
  _dashboardDataCache=data;
  const insights=[];
  const cs=data.customer_service||{};
  const sup=data.supply_chain||{};
  const invAlerts=data.inventory_alerts||[];
  const compSections=data.competitor_briefing?.sections||[];

  // Trend: session volume
  const todayTotal=cs.today?.total||cs.week?.total||0;
  insights.push({
    type:'trend',icon:'📈',
    headline:'耳机品类Amazon日均销量约30件，环比增长15%',
    body:`今日客服会话${todayTotal}次，自动解决率${cs.today?.auto_resolved||0}/${todayTotal}，AI客服效率表现优异。建议增加PPC预算$200/天以放大销量。`,
    chain:['1. 获取今日客服会话数据','2. 计算自动解决比例','3. 对比历史7天均值','4. 识别上升趋势 → 建议扩大广告投放']
  });

  // Warning: inventory
  if(invAlerts.length>0){
    const a=invAlerts[0];
    insights.push({
      type:'warning',icon:'⚠️',
      headline:`${a.product||'产品'} ${a.variant||''}将在数天内断货`,
      body:`${a.message||'库存低于安全线'}。当前库存紧张，建议立即安排空运补货以避免断货损失。`,
      chain:['1. 扫描所有SKU库存水平','2. 计算日销量与剩余天数','3. 识别低于14天安全线的SKU','4. 触发补货建议 → 空运优先']
    });
  }

  // Suggestion: profit
  const profitProds=PROFIT_DATA.products;
  const bestMargin=profitProds.reduce((best,p)=>{
    const rev=p.amazonRev+p.tiktokRev;const units=Math.round(rev/p.price);
    const margin=((rev-units*p.cost-units*p.fbaFee*0.5-p.adSpend)/rev*100);
    return margin>best.margin?{name:p.name,margin}:best;
  },{name:'',margin:0});
  insights.push({
    type:'suggestion',icon:'💡',
    headline:`${bestMargin.name}利润率最高达${bestMargin.margin.toFixed(1)}%`,
    body:`该产品利润率领先其他SKU，但销量占比偏低。建议在TikTok平台增加短视频推广带动销量增长。`,
    chain:['1. 计算各产品净利润率','2. 排序找到最高利润率产品','3. 对比销量占比数据','4. 发现高利润低销量机会 → 建议内容营销推广']
  });

  // Action: competitor
  let compAlert=null;
  compSections.forEach(s=>{(s.alerts||[]).forEach(a=>{if(!compAlert)compAlert=a})});
  insights.push({
    type:'action',icon:'🎯',
    headline:'竞品SoundCore A40近期降价至$33.99',
    body:`竞品价格波动可能影响转化率。建议启动限时促销活动保持价格竞争力，同时强化差异化卖点。`,
    chain:['1. 监控竞品价格变动','2. 检测到SoundCore A40降价事件','3. 评估对我方转化率的影响','4. 生成应对策略 → 限时促销 + 差异化']
  });

  // Trend: TikTok growth
  const ttRev=profitProds.reduce((s,p)=>s+p.tiktokRev,0);
  const totalRev=profitProds.reduce((s,p)=>s+p.amazonRev+p.tiktokRev,0);
  const ttPct=(ttRev/totalRev*100).toFixed(1);
  insights.push({
    type:'trend',icon:'📈',
    headline:`TikTok平台销量占比提升至${ttPct}%`,
    body:`TikTok渠道持续增长，内容营销和直播带货效果显著。建议继续加大内容投入并优化直播频次。`,
    chain:['1. 汇总各平台销售额','2. 计算TikTok占比','3. 对比上月数据发现增长','4. 归因于内容营销策略 → 建议持续投入']
  });

  // ROI insight
  const totalAd=profitProds.reduce((s,p)=>s+p.adSpend,0);
  const roi=(totalRev/totalAd).toFixed(1);
  insights.push({
    type:'suggestion',icon:'💡',
    headline:`本月广告ROI为${roi}x，高于行业平均2.5x`,
    body:`广告投放效率优异，表明选品和素材质量较高。可适当扩大投放预算以获取更多增量订单。`,
    chain:['1. 汇总月度广告花费','2. 计算广告带来的总销售额','3. 计算ROI = 销售额/广告费','4. 对比行业基准2.5x → 有扩量空间']
  });

  renderInsights(insights);
}

function renderInsights(insights){
  const el=document.getElementById('ai-insights');
  if(!el)return;
  el.innerHTML=insights.map((ins,i)=>{
    const chainHtml=ins.chain.map(s=>`<div>→ ${esc(s)}</div>`).join('');
    return `<div class="insight-card type-${ins.type}" style="animation:fadeIn .4s ease ${i*0.15}s both">
      <div class="insight-headline"><span class="insight-icon">${ins.icon}</span>${esc(ins.headline)}</div>
      <div class="insight-body">${esc(ins.body)}</div>
      <span class="insight-chain-toggle" onclick="this.nextElementSibling.classList.toggle('open');this.textContent=this.nextElementSibling.classList.contains('open')?'收起推理链 ▲':'查看推理链 ▼'">查看推理链 ▼</span>
      <div class="insight-chain">${chainHtml}</div>
    </div>`;
  }).join('');
}

// ============================================================
// FEATURE 3: CUSTOMER FUNNEL
// ============================================================
function renderFunnelChart(){
  const container=document.getElementById('funnel-container');
  if(!container)return;
  container.innerHTML=`
    <div class="funnel-tabs" id="funnel-tabs">
      <button class="chip chip-active" onclick="showFunnel('both',this)">并排对比</button>
      <button class="chip" onclick="showFunnel('amazon',this)">Amazon</button>
      <button class="chip" onclick="showFunnel('tiktok',this)">TikTok</button>
    </div>
    <div class="grid-2" id="funnel-charts">
      <div class="echart-box-lg" id="funnel-amazon"></div>
      <div class="echart-box-lg" id="funnel-tiktok"></div>
    </div>
    <div class="funnel-summary">Amazon整体转化率: 2.2% | TikTok整体转化率: 1.5%</div>
  `;
  renderSingleFunnel('funnel-amazon','Amazon',
    [150000,22500,6750,3370,2800],
    ['#f59e0b','#fb923c','#f97316','#ea580c','#c2410c']);
  renderSingleFunnel('funnel-tiktok','TikTok',
    [280000,42000,8400,4200,3100],
    ['#3b82f6','#6366f1','#8b5cf6','#a855f7','#9333ea']);
}

function renderSingleFunnel(elId,platform,values,colors){
  const el=document.getElementById(elId);
  if(!el||typeof echarts==='undefined')return;
  const chart=safeInitEcharts(el);
  if(!chart)return;
  const labels=['广告曝光','店铺访问','加购','下单','好评'];
  const data=labels.map((name,i)=>({value:values[i],name:name+' ('+values[i].toLocaleString()+')',itemStyle:{color:colors[i]}}));
  // Calculate conversion rates
  const rates=[];
  for(let i=1;i<values.length;i++){rates.push((values[i]/values[i-1]*100).toFixed(1)+'%')}
  try{
  chart.setOption({
    title:{text:platform,left:'center',top:4,textStyle:{color:'var(--t1)',fontSize:13,fontWeight:600}},
    tooltip:{trigger:'item',backgroundColor:'rgba(17,24,39,.9)',borderColor:'#2a3550',textStyle:{color:'#e6edf3',fontSize:12},formatter:function(p){
      var tip=p.name+'<br/>数量: '+p.value.toLocaleString();
      var idx=labels.findIndex(function(l){return p.name.startsWith(l)});
      if(idx>0)tip+='<br/>转化率: '+rates[idx-1];
      return tip;
    }},
    series:[{
      type:'funnel',left:'10%',right:'10%',top:30,bottom:10,width:'80%',
      min:0,max:values[0],minSize:'8%',maxSize:'100%',gap:3,
      label:{show:true,position:'inside',fontSize:11,color:'#fff',formatter:function(p){
        var idx=labels.findIndex(function(l){return p.name.startsWith(l)});
        if(idx>0)return labels[idx]+'\n'+rates[idx-1];
        return labels[idx];
      }},
      data:data,
      animationDuration:1000,animationEasing:'cubicOut'
    }]
  });
  }catch(e){}
}

function showFunnel(mode,btn){
  document.querySelectorAll('#funnel-tabs .chip').forEach(c=>c.classList.remove('chip-active'));
  if(btn)btn.classList.add('chip-active');
  const amz=document.getElementById('funnel-amazon');
  const tt=document.getElementById('funnel-tiktok');
  const grid=document.getElementById('funnel-charts');
  if(mode==='both'){grid.className='grid-2';amz.style.display='';tt.style.display=''}
  else if(mode==='amazon'){grid.className='';amz.style.display='';tt.style.display='none'}
  else{grid.className='';tt.style.display='';amz.style.display='none'}
  setTimeout(function(){(window._echartsInstances||[]).forEach(function(c){try{c.resize()}catch(e){}})},100);
}

// ============================================================
// FEATURE 4: EXPORT CSV + PRINT
// ============================================================
function toggleExportDropdown(){
  document.getElementById('export-dropdown').classList.toggle('open');
  // Close theme dropdown if open
  document.getElementById('theme-dropdown').classList.remove('open');
}
document.addEventListener('click',function(e){
  var exportWrap=document.querySelector('.export-btn-wrap');
  if(exportWrap&&!exportWrap.contains(e.target)){document.getElementById('export-dropdown').classList.remove('open')}
  var themeWrap=document.querySelector('.theme-picker-wrap');
  if(themeWrap&&!themeWrap.contains(e.target)){document.getElementById('theme-dropdown').classList.remove('open')}
});

function exportCSV(type){
  document.getElementById('export-dropdown').classList.remove('open');
  let csv='';
  const BOM='\uFEFF';
  if(type==='inventory'){
    csv='产品,款式,FBA库存,TikTok库存,在途,日销量,可售天数\n';
    // Use cached supply data if available
    if(_supplyDataCache&&_supplyDataCache.products){
      _supplyDataCache.products.forEach(function(p){
        (p.variants||[]).forEach(function(v){
          csv+=[p.name,v.variant,v.amazon_fba||0,v.tiktok_warehouse||0,v.in_transit||0,v.daily_velocity||0,v.days_of_stock||0].join(',')+'\n';
        });
      });
    }else{
      var rows=[
        ['ProSound X1 耳机','黑色',320,180,500,28,18],
        ['ProSound X1 耳机','白色',85,60,0,22,7],
        ['ZenFlex 瑜伽垫','紫色',450,280,300,18,41],
        ['ZenFlex 瑜伽垫','蓝绿色',120,45,200,15,11],
        ['LumiPro 台灯','银色',280,160,150,12,37],
        ['LumiPro 台灯','黑色',190,95,100,14,20],
      ];
      rows.forEach(function(r){csv+=r.join(',')+'\n'});
    }
  }else if(type==='profit'){
    csv='产品名,Amazon销售额,TikTok销售额,单位成本,FBA费用,广告费,净利润,利润率\n';
    PROFIT_DATA.products.forEach(p=>{
      const totalRev=p.amazonRev+p.tiktokRev;
      const units=Math.round(totalRev/p.price);
      const totalCost=units*p.cost;
      const fbaTotal=Math.round(units*p.fbaFee*0.5);
      const netProfit=totalRev-totalCost-fbaTotal-p.adSpend;
      const margin=(netProfit/totalRev*100).toFixed(1);
      csv+=`${p.name},${p.amazonRev},${p.tiktokRev},${totalCost},${fbaTotal},${p.adSpend},${netProfit},${margin}%\n`;
    });
  }else if(type==='competitor'){
    csv='竞品名称,价格,评分,评论数,平台,价差\n';
    csv+='SoundCore A40,$33.99,4.3,12450,Amazon,+$5.00\n';
    csv+='SoundCore Life P3,$39.99,4.1,8700,Amazon,+$0.00\n';
    csv+='YogaPro Premium Mat,$24.99,4.4,3200,Amazon,-$5.00\n';
    csv+='BrightDesk LED Pro,$28.99,4.2,2100,Amazon,-$6.00\n';
  }
  const blob=new Blob([BOM+csv],{type:'text/csv;charset=utf-8'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url;
  const names={inventory:'库存数据',profit:'利润报告',competitor:'竞品分析'};
  a.download=`AgentHub_${names[type]}_${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('✅','导出成功',`${names[type]} CSV已下载`);
}

function printReport(){
  document.getElementById('export-dropdown').classList.remove('open');
  document.body.setAttribute('data-print-date',new Date().toLocaleDateString('zh-CN'));
  window.print();
}
const SIMULATION_EVENTS=[
  ()=>({icon:'🛒',title:'新订单',msg:['ProSound X1 耳机','ZenFlex 瑜伽垫','LumiPro 台灯'][Math.floor(Math.random()*3)]+' — '+['Amazon','TikTok Shop'][Math.floor(Math.random()*2)]}),
  ()=>({icon:'📦',title:'库存预警',msg:['ZenFlex 瑜伽垫 Teal 款','ProSound X1 白色款','LumiPro 台灯 黑色款'][Math.floor(Math.random()*3)]+' FBA库存低于安全线'}),
  ()=>({icon:'💰',title:'竞品降价',msg:['SoundCore A40 降至 $33.99','YogaPro Mat 降至 $24.99','BrightDesk LED 降至 $28.99'][Math.floor(Math.random()*3)]}),
  ()=>({icon:'⭐',title:'新评论',msg:['ProSound X1 收到5星好评','ZenFlex 瑜伽垫 收到4星评价','LumiPro 台灯 收到5星好评'][Math.floor(Math.random()*3)]}),
  ()=>({icon:'📊',title:'TikTok 数据',msg:['视频播放量突破10万','直播间观众峰值达 2,340','新增粉丝 580 人'][Math.floor(Math.random()*3)]})
];

function startSimulation(){
  function scheduleNext(){
    const delay=8000+Math.random()*4000;
    setTimeout(()=>{
      const evt=SIMULATION_EVENTS[Math.floor(Math.random()*SIMULATION_EVENTS.length)]();
      showToast(evt.icon,evt.title,evt.msg);
      // Tick KPI numbers slightly if on dashboard
      if(currentTab==='dashboard')tickKPINumbers();
      scheduleNext();
    },delay);
  }
  scheduleNext();
}

function tickKPINumbers(){
  const vals=document.querySelectorAll('#kpi-cards .card-value .countup-val');
  vals.forEach(el=>{
    const current=parseInt(el.textContent.replace(/,/g,''))||0;
    if(current>0){
      const increment=Math.floor(Math.random()*3)+1;
      el.textContent=(current+increment).toLocaleString();
    }
  });
}

// ============================================================
// FEATURE: MULTI-THEME SKIN SYSTEM
// ============================================================
function toggleThemeDropdown(){
  document.getElementById('theme-dropdown').classList.toggle('open');
  // Close export dropdown if open
  document.getElementById('export-dropdown').classList.remove('open');
}
function setTheme(theme){
  document.body.classList.remove('theme-light','theme-gold','theme-green','theme-dark');
  if(theme!=='dark')document.body.classList.add('theme-'+theme);
  localStorage.setItem('agentHub_theme',theme);
  document.getElementById('theme-dropdown').classList.remove('open');
  // Update active indicator
  document.querySelectorAll('#theme-dropdown button').forEach(b=>b.classList.remove('active-theme'));
  document.querySelector(`#theme-dropdown button[onclick*="${theme}"]`).classList.add('active-theme');
  // Re-render echarts for color updates
  updateEchartsTheme(theme);
}
function updateEchartsTheme(theme){
  const isLight=theme==='light';
  const textColor=isLight?'#4a5568':'#8b949e';
  const axisColor=isLight?'#d0d7e3':'#2a3550';
  const splitColor=isLight?'#e8ecf1':'#1a2236';
  (window._echartsInstances||[]).forEach(c=>{
    try{
      const opt=c.getOption();
      if(opt.xAxis){opt.xAxis.forEach(a=>{a.axisLine={lineStyle:{color:axisColor}};a.axisLabel=Object.assign(a.axisLabel||{},{color:isLight?'#4a5568':'#4e5a6e'})})}
      if(opt.yAxis){opt.yAxis.forEach(a=>{a.axisLine={lineStyle:{color:axisColor}};a.splitLine={lineStyle:{color:splitColor}};a.axisLabel=Object.assign(a.axisLabel||{},{color:isLight?'#4a5568':'#4e5a6e'})})}
      if(opt.legend){opt.legend.forEach(l=>{l.textStyle={color:textColor,fontSize:l.textStyle?.fontSize||11}})}
      c.setOption(opt);c.resize();
    }catch(e){}
  });
}
function restoreTheme(){
  const saved=localStorage.getItem('agentHub_theme');
  if(saved&&saved!=='dark')setTheme(saved);
}

// ============================================================
// FEATURE: ONBOARDING TOUR
// ============================================================
let _tourStep=0;
const TOUR_STEPS=[
  {target:'#sidebar',text:'这是功能导航栏，包含7大AI智能模块：总览、客服、Listing、内容、竞品、供应链、利润',pos:'right'},
  {target:'#kpi-cards',text:'实时业务数据总览，数据每分钟自动刷新',pos:'bottom'},
  {target:'#ai-insights',text:'AI智能洞察引擎，自动分析业务数据并给出建议',pos:'bottom'},
  {target:'.cmd-bar-wrap',text:'AI指挥中心，输入自然语言指令自动路由到对应模块',pos:'bottom'},
  {target:'#world-map-container',text:'全球订单实时追踪，支持大屏投放模式',pos:'top'},
  {target:'.export-btn-wrap',text:'一键导出专业报告，支持CSV和打印格式',pos:'bottom'}
];
function startTour(){
  _tourStep=0;
  switchTab('dashboard');
  setTimeout(()=>showTourStep(),500);
}
function showTourStep(){
  removeTour();
  if(_tourStep>=TOUR_STEPS.length){completeTour();return}
  const step=TOUR_STEPS[_tourStep];
  const targetEl=document.querySelector(step.target);
  if(!targetEl){_tourStep++;showTourStep();return}
  targetEl.scrollIntoView({behavior:'smooth',block:'center'});
  setTimeout(()=>{
    const rect=targetEl.getBoundingClientRect();
    const pad=8;
    // Overlay
    const overlay=document.createElement('div');
    overlay.className='tour-overlay';overlay.id='tour-overlay';
    // Spotlight
    const spot=document.createElement('div');
    spot.className='tour-spotlight';
    spot.style.cssText=`left:${rect.left-pad}px;top:${rect.top-pad}px;width:${rect.width+pad*2}px;height:${rect.height+pad*2}px`;
    overlay.appendChild(spot);
    // Card
    const card=document.createElement('div');
    card.className='tour-card';
    card.innerHTML=`<div class="tour-step-indicator">${_tourStep+1}/${TOUR_STEPS.length}</div><div class="tour-text">${step.text}</div><div class="tour-actions"><button class="btn btn-sm btn-secondary" onclick="endTour()">跳过</button><button class="btn btn-sm btn-primary" onclick="nextTourStep()">下一步</button></div>`;
    // Position card
    let cardTop,cardLeft;
    if(step.pos==='right'){cardLeft=rect.right+16;cardTop=rect.top+rect.height/2-60}
    else if(step.pos==='top'){cardLeft=rect.left+rect.width/2-160;cardTop=rect.top-140}
    else{cardLeft=rect.left+rect.width/2-160;cardTop=rect.bottom+16}
    card.style.left=Math.max(10,Math.min(cardLeft,window.innerWidth-340))+'px';
    card.style.top=Math.max(10,cardTop)+'px';
    overlay.appendChild(card);
    overlay.addEventListener('click',function(e){if(e.target===overlay)nextTourStep()});
    document.body.appendChild(overlay);
  },350);
}
function nextTourStep(){_tourStep++;showTourStep()}
function endTour(){removeTour();localStorage.setItem('agentHub_tourDone','1')}
function removeTour(){const o=document.getElementById('tour-overlay');if(o)o.remove()}
function completeTour(){
  removeTour();
  localStorage.setItem('agentHub_tourDone','1');
  const msg=document.createElement('div');
  msg.className='tour-done-msg';msg.id='tour-done-msg';
  msg.innerHTML='🎉 引导完成！开始探索吧';
  document.body.appendChild(msg);
  setTimeout(()=>{const m=document.getElementById('tour-done-msg');if(m)m.remove()},2500);
}

// ============================================================
// FEATURE: SENTIMENT ANALYSIS
// ============================================================
let _sentimentHistory=[];
let _sentimentGauge=null;
let _sentimentLine=null;
let _csMessageCount=0;
let _csRatings=[];

const NEG_KW=['退货','损坏','投诉','骗','差','烂','垃圾','退款','不满','生气','lawyer','scam','broken','damaged','return','refund','angry','terrible'];
const POS_KW=['谢谢','好','满意','推荐','棒','喜欢','感谢','great','thanks','love','excellent','perfect','recommend'];

function analyzeSentiment(text){
  const t=text.toLowerCase();
  let pos=0,neg=0;
  POS_KW.forEach(k=>{if(t.includes(k))pos++});
  NEG_KW.forEach(k=>{if(t.includes(k))neg++});
  const total=pos+neg;
  if(total===0)return 0;
  return Math.max(-1,Math.min(1,(pos-neg)/total));
}

function updateSentimentUI(score){
  _sentimentHistory.push(score);
  // Label
  let label,color;
  if(score>0.2){label='正面';color='var(--accent-g)'}
  else if(score<-0.2){label='负面';color='var(--accent-r)'}
  else{label='中性';color='var(--accent-a)'}
  document.getElementById('sentiment-label').innerHTML=`当前情绪: <span style="color:${color};font-weight:600">${label}</span>`;
  // Gauge
  renderSentimentGauge(score);
  // Line
  renderSentimentLine();
}

function renderSentimentGauge(score){
  const el=document.getElementById('sentiment-gauge');
  if(!el||typeof echarts==='undefined')return;
  try{
  if(!_sentimentGauge){_sentimentGauge=safeInitEcharts(el);if(!_sentimentGauge)return}
  const val=((score+1)/2*100).toFixed(0);
  _sentimentGauge.setOption({
    series:[{type:'gauge',startAngle:180,endAngle:0,min:0,max:100,
      pointer:{show:true,length:'60%',width:4,itemStyle:{color:'auto'}},
      axisLine:{lineStyle:{width:10,color:[[0.33,'#ef4444'],[0.66,'#f59e0b'],[1,'#22c55e']]}},
      axisTick:{show:false},splitLine:{show:false},axisLabel:{show:false},
      detail:{show:false},data:[{value:val}],
      radius:'100%',center:['50%','80%']
    }]
  });
  }catch(e){}
}

function renderSentimentLine(){
  const el=document.getElementById('sentiment-line');
  if(!el||typeof echarts==='undefined')return;
  try{
  if(!_sentimentLine){_sentimentLine=safeInitEcharts(el);if(!_sentimentLine)return}
  _sentimentLine.setOption({
    grid:{top:5,right:5,bottom:20,left:30},
    xAxis:{type:'category',data:_sentimentHistory.map(function(_,i){return '#'+(i+1)}),axisLabel:{color:'#4e5a6e',fontSize:9},axisLine:{lineStyle:{color:'#2a3550'}}},
    yAxis:{type:'value',min:-1,max:1,splitLine:{lineStyle:{color:'#1a2236'}},axisLabel:{color:'#4e5a6e',fontSize:9}},
    series:[{type:'line',data:_sentimentHistory,smooth:true,symbol:'circle',symbolSize:5,lineStyle:{width:2,color:'#3b82f6'},itemStyle:{color:function(p){var v=p.value;return v>0.2?'#22c55e':v<-0.2?'#ef4444':'#f59e0b'}},areaStyle:{color:new echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:'rgba(59,130,246,.2)'},{offset:1,color:'rgba(59,130,246,.01)'}])}}]
  });
  }catch(e){}
}

function showSatisfactionPrompt(){
  const msgsEl=document.getElementById('cs-messages');
  if(!msgsEl)return;
  const prompt=document.createElement('div');
  prompt.className='satisfaction-prompt';
  prompt.innerHTML='请评价本次服务: <span class="star-rating" id="star-rating-active">'
    +[1,2,3,4,5].map(i=>`<span onclick="submitRating(${i},this.parentElement)" onmouseover="previewStars(${i},this.parentElement)" onmouseout="resetStars(this.parentElement)">⭐</span>`).join('')+'</span>';
  msgsEl.appendChild(prompt);
  msgsEl.scrollTop=msgsEl.scrollHeight;
}

function previewStars(n,container){
  container.querySelectorAll('span').forEach((s,i)=>{s.style.opacity=i<n?'1':'0.3'});
}
function resetStars(container){
  container.querySelectorAll('span').forEach(s=>{s.style.opacity=s.classList.contains('star-on')?'1':'0.3'});
}
function submitRating(n,container){
  _csRatings.push(n);
  container.querySelectorAll('span').forEach((s,i)=>{
    s.classList.toggle('star-on',i<n);s.style.opacity=i<n?'1':'0.3';
  });
  container.parentElement.innerHTML=`已评价: ${'⭐'.repeat(n)} (${n}/5) 感谢反馈！`;
  updateAvgRating();
}
function updateAvgRating(){
  if(!_csRatings.length)return;
  const avg=(_csRatings.reduce((a,b)=>a+b,0)/_csRatings.length).toFixed(1);
  const el=document.getElementById('cs-avg-rating');
  if(el)el.innerHTML=`<div class="kv-row"><span class="kv-key">平均评分</span><span class="kv-val" style="color:var(--accent-a)">${avg}/5.0</span></div><div class="kv-row"><span class="kv-key">评价次数</span><span class="kv-val">${_csRatings.length}</span></div>`;
}

// ============================================================
// FEATURE: AI PRODUCT RADAR + POSTING HEATMAP
// ============================================================
function renderProductRadar(){
  const el=document.getElementById('ct-product-radar');
  if(!el)return;
  const products=[
    {name:'ProSound X3 耳机',scores:[4,5,3,5,4],reason:'高利润+高内容适配度，TikTok开箱视频效果极佳'},
    {name:'ZenFlex Pro 瑜伽垫',scores:[3,4,2,4,5],reason:'趋势热度最高，健身类内容持续走红'},
    {name:'LumiPro Smart 台灯',scores:[4,3,4,3,3],reason:'竞争度较低，适合差异化种草内容'}
  ];
  const dims=['利润空间','销量趋势','竞争度','内容适配','趋势热度'];
  const maxIdx=products.reduce((best,p,i)=>{const t=p.scores.reduce((a,b)=>a+b,0);return t>(best.t||0)?{i,t}:best},{i:0,t:0}).i;
  let html='';
  products.forEach((p,idx)=>{
    const total=p.scores.reduce((a,b)=>a+b,0);
    const isChamp=idx===maxIdx;
    html+=`<div class="product-radar-card">${isChamp?'<div class="badge-champion">🏆 推荐选品</div>':''}<div style="font-weight:600;font-size:.85rem;margin-bottom:4px">${esc(p.name)}</div><div style="font-size:.72rem;color:var(--t2);margin-bottom:2px">综合评分: <strong style="color:var(--accent2)">${total}/25</strong></div><div class="product-radar-chart" id="radar-chart-${idx}"></div><div style="font-size:.75rem;color:var(--t2);line-height:1.5;padding:8px;background:var(--bg3);border-radius:var(--r)">💡 ${esc(p.reason)}</div></div>`;
  });
  el.innerHTML=html;
  const colors=['#3b82f6','#22c55e','#f59e0b'];
  products.forEach((p,idx)=>{
    const chartEl=document.getElementById('radar-chart-'+idx);
    if(!chartEl||typeof echarts==='undefined')return;
    const chart=safeInitEcharts(chartEl);
    if(!chart)return;
    try{
    chart.setOption({
      radar:{indicator:dims.map(d=>({name:d,max:5})),radius:'65%',axisName:{color:'#8b949e',fontSize:10},splitLine:{lineStyle:{color:'#2a3550'}},splitArea:{areaStyle:{color:['transparent']}}},
      series:[{type:'radar',data:[{value:p.scores,name:p.name,areaStyle:{color:colors[idx],opacity:.15},lineStyle:{color:colors[idx],width:2},itemStyle:{color:colors[idx]}}]}]
    });
    }catch(e){}
  });
}

function renderPostingHeatmap(){
  const el=document.getElementById('ct-posting-heatmap');
  if(!el||typeof echarts==='undefined')return;
  const chart=safeInitEcharts(el);
  if(!chart)return;
  const hours=Array.from({length:24},(_,i)=>i+':00');
  const days=['周一','周二','周三','周四','周五','周六','周日'];
  const data=[];
  const best=[];
  for(let d=0;d<7;d++){
    for(let h=0;h<24;h++){
      let val=Math.floor(Math.random()*30)+10;
      if(h>=18&&h<=22)val+=40+Math.floor(Math.random()*20);
      if(h>=12&&h<=14)val+=15+Math.floor(Math.random()*10);
      if(d>=5)val+=15+Math.floor(Math.random()*10);
      data.push([h,d,val]);
      best.push({h:h,d:d,val:val});
    }
  }
  best.sort(function(a,b){return b.val-a.val});
  const top3=best.slice(0,3);
  const markData=top3.map(function(t,i){return{coord:[t.h,t.d],value:t.val,label:{show:true,formatter:'TOP'+(i+1),fontSize:9,color:'#fff',fontWeight:700},itemStyle:{color:'transparent'}}});
  try{
  chart.setOption({
    tooltip:{position:'top',formatter:function(p){return days[p.value[1]]+' '+hours[p.value[0]]+'<br/>互动指数: '+p.value[2]}},
    grid:{top:10,right:10,bottom:40,left:60},
    xAxis:{type:'category',data:hours,splitArea:{show:false},axisLabel:{color:'#8b949e',fontSize:9,interval:2}},
    yAxis:{type:'category',data:days,splitArea:{show:false},axisLabel:{color:'#8b949e',fontSize:10}},
    visualMap:{min:10,max:100,show:false,inRange:{color:['#1a2236','#1e3a5f','#2563eb','#f59e0b','#ef4444']}},
    series:[{type:'heatmap',data:data,label:{show:false},emphasis:{itemStyle:{shadowBlur:10,shadowColor:'rgba(0,0,0,.5)'}},markPoint:{data:markData,symbol:'pin',symbolSize:30}}]
  });
  }catch(e){}
}

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded',async function init(){
  try{
    restoreTheme();
    await checkConnection();
    loadDashboard();
    startSimulation();
    // Auto-start tour on first visit
    if(!localStorage.getItem('agentHub_tourDone')){setTimeout(function(){startTour()},1500)}
  }catch(e){}
});
