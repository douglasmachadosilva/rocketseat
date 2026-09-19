'use strict';
(() => {
 const $=id=>document.getElementById(id);
 const services={corte:{name:'Corte',price:'R$ 50',duration:'40 min'},barba:{name:'Barba',price:'R$ 35',duration:'30 min'},corte_barba:{name:'Corte + barba',price:'R$ 75',duration:'60 min'}};
 const professionals={rafael:'Rafael',bruno:'Bruno'};
 const query=new URLSearchParams(location.search), debug=query.get('debug')==='1';
 const id=(window.LAB_CONFIG?.measurementId||'').trim();
 const valid=/^G-[A-Z0-9]+$/.test(id) && !/XXXX/.test(id);
 let allowed=false,loaded=false,active=null,complete=false,draft=null;
 $('professor').hidden=query.get('professor')!=='1';
 function state(){ $('tracking-state').textContent=!valid?'Preencha measurementId no arquivo config.js. Nenhum evento será enviado.':!allowed?'Análise desativada. Use “Preferências de análise” para permitir.':`Tag configurada para ${id}. ${debug?'Modo de depuração solicitado.':'Modo normal.'} O recebimento deve ser conferido no GA4.`; }
 function enable(){
  allowed=true;$('consent').hidden=true;
  if(valid&&!loaded){loaded=true;window.dataLayer=window.dataLayer||[];window.gtag=function(){window.dataLayer.push(arguments);};window.gtag('js',new Date());const cfg={send_page_view:true};if(debug)cfg.debug_mode=true;window.gtag('config',id,cfg);const script=document.createElement('script');script.async=true;script.src='https://www.googletagmanager.com/gtag/js?id='+encodeURIComponent(id);script.onerror=()=>{$('tracking-state').textContent='A tag não carregou. Verifique a conexão e eventuais bloqueadores neste ambiente de teste.';};document.head.append(script);}
  state();
 }
 function track(name,params){
  if(!allowed||!valid||typeof window.gtag!=='function')return;
  window.gtag('event',name,{...params,send_to:id,...(debug?{debug_mode:true}:{})});
  const li=document.createElement('li');li.textContent=name+' · '+JSON.stringify(params);$('event-log').prepend(li);
 }
 $('allow').addEventListener('click',enable);
 $('decline').addEventListener('click',()=>{allowed=false;$('consent').hidden=true;state();});
 $('privacy').addEventListener('click',()=>{
  // A reload removes the loaded tag and requires a fresh choice for this visit.
  if(loaded){location.reload();return;}$('consent').hidden=false;$('allow').focus();
 });

 const days=[];
 for(let i=1;i<=3;i++){const date=new Date();date.setDate(date.getDate()+i);const value=[date.getFullYear(),String(date.getMonth()+1).padStart(2,'0'),String(date.getDate()).padStart(2,'0')].join('-');const label=date.toLocaleDateString('pt-BR',{weekday:'long',day:'2-digit',month:'2-digit'});days.push(value);const option=document.createElement('option');option.value=value;option.textContent=label;$('day').append(option);}
 function start(key){active=key;complete=false;draft=null;$('catalog').hidden=true;$('booking').hidden=false;$('booking-form').reset();$('booking-form').hidden=false;$('summary').hidden=true;$('success').hidden=true;$('feedback').textContent='';$('confirm').disabled=false;$('booking-title').textContent=services[key].name+' · '+services[key].price+' · '+services[key].duration;$('booking-title').focus();}
 document.querySelectorAll('[data-service]').forEach(button=>button.addEventListener('click',()=>{const key=button.dataset.service;start(key);track('select_content',{content_type:'servico',content_id:key});}));
 $('booking-form').addEventListener('submit',event=>{
  event.preventDefault();if(!active||complete)return;
  const professional=$('professional').value,day=$('day').value,time=$('time').value;
  if(!professionals[professional]||!days.includes(day)||!['09:00','11:00','14:00','16:00'].includes(time)){$('feedback').className='error';$('feedback').textContent='Escolha o profissional, o dia e o horário para continuar.';return;}
  draft={service:active,professional,day,time};$('feedback').textContent='';$('details').replaceChildren();
  [['Serviço',services[active].name],['Profissional',professionals[professional]],['Dia',$('day').selectedOptions[0].textContent],['Horário',time],['Valor ilustrativo',services[active].price]].forEach(([k,v])=>{const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=k;dd.textContent=v;$('details').append(dt,dd);});
  $('booking-form').hidden=true;$('summary').hidden=false;$('summary-title').focus();
 });
 $('confirm').addEventListener('click',()=>{
  if(complete||!draft||draft.service!==active)return;
  // Confirma apenas a simulação em memória: não reserva uma agenda real.
  complete=true;$('confirm').disabled=true;$('summary').hidden=true;$('success').hidden=false;$('success-title').focus();
  track('booking_complete',{service_id:draft.service,professional_id:draft.professional,booking_channel:'web'});
 });
 $('edit').addEventListener('click',()=>{if(complete)return;draft=null;$('summary').hidden=true;$('booking-form').hidden=false;$('professional').focus();});
 function catalog(){const previous=active;$('booking').hidden=true;$('catalog').hidden=false;active=null;draft=null;complete=false;if(previous)document.querySelector(`[data-service="${previous}"]`).focus();}
 $('back').addEventListener('click',catalog);$('new-booking').addEventListener('click',catalog);
 state();
})();
